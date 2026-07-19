import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import crypto from 'crypto';

const eventSchema = z.object({
  eventId: z.string(),
  provider: z.string(),
  transactionId: z.string(),
  amountMinor: z.number().int().positive(),
  currency: z.string().default('BDT'),
  paymentTimestamp: z.string().optional(),
  smsReceivedAt: z.string(),
  sender: z.string(),
  parserVersion: z.string(),
  sourceFingerprint: z.string()
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const deviceId = req.headers.get('x-device-id');
    const timestamp = req.headers.get('x-device-timestamp');
    const nonce = req.headers.get('x-device-nonce');
    const signature = req.headers.get('x-device-signature');

    if (!deviceId || !timestamp || !nonce || !signature) {
      return NextResponse.json({ error: 'Missing authentication headers' }, { status: 401 });
    }

    // Check timestamp tolerance (e.g., 5 minutes)
    const reqTime = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - reqTime) > 300) {
      return NextResponse.json({ error: 'Request expired' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch device
    const { data: device } = await supabaseAdmin
      .from('payment_bridge_devices')
      .select('device_secret_hash, is_active')
      .eq('id', deviceId)
      .single();

    if (!device || !device.is_active) {
      return NextResponse.json({ error: 'Device not found or inactive' }, { status: 401 });
    }

    // Verify HMAC Signature: HMAC-SHA256(secret, timestamp + nonce + rawBody)
    const expectedSig = crypto
      .createHmac('sha256', device.device_secret_hash)
      .update(timestamp + nonce + rawBody)
      .digest('hex');

    if (expectedSig !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse payload
    const body = JSON.parse(rawBody);
    const result = eventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload schema', details: result.error }, { status: 400 });
    }

    const event = result.data;

    // Check if event already exists (Idempotency)
    const { data: existingEvent } = await supabaseAdmin
      .from('payment_events_inbox')
      .select('id, status')
      .eq('event_id', event.eventId)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json({ message: 'Event already processed', status: existingEvent.status });
    }

    // Check source fingerprint for duplicates
    const { data: dupFingerprint } = await supabaseAdmin
      .from('payment_events_inbox')
      .select('id')
      .eq('source_fingerprint', event.sourceFingerprint)
      .maybeSingle();

    if (dupFingerprint) {
      // Just log and ignore, but return success to app so it stops retrying
      await supabaseAdmin.from('payment_audit_logs').insert({
        event_type: 'PAYMENT_EVENT_DUPLICATE',
        source: 'SYSTEM',
        metadata: { event_id: event.eventId, source_fingerprint: event.sourceFingerprint }
      });
      return NextResponse.json({ message: 'Duplicate event discarded' });
    }

    // Try to match exact amount
    const { data: sessions, error: matchError } = await supabaseAdmin
      .from('payment_sessions')
      .select('id, admission_id, status')
      .eq('payable_amount_minor', event.amountMinor)
      .in('status', ['AWAITING_PAYMENT', 'AUTO_VERIFYING', 'PENDING_MANUAL_REVIEW']);

    let finalStatus = 'NO_MATCH';
    let matchedSessionId = null;

    if (sessions && sessions.length === 1) {
      // Exact single match found
      finalStatus = 'MATCHED';
      matchedSessionId = sessions[0].id;

      // Update session and admission atomically (ideally via RPC, but we'll do it sequentially for now since we are in a protected route)
      await supabaseAdmin
        .from('payment_sessions')
        .update({ status: 'PAID' })
        .eq('id', matchedSessionId);

      await supabaseAdmin
        .from('admissions')
        .update({ status: 'approved' })
        .eq('id', sessions[0].admission_id);

      // If there was a pending manual review, auto-resolve it
      if (sessions[0].status === 'PENDING_MANUAL_REVIEW') {
        await supabaseAdmin
          .from('manual_payment_reviews')
          .update({ status: 'AUTO_RESOLVED', resolution_note: 'Resolved by late SMS sync' })
          .eq('session_id', matchedSessionId)
          .eq('status', 'PENDING');
          
        await supabaseAdmin.from('payment_audit_logs').insert({
          session_id: matchedSessionId,
          event_type: 'MANUAL_REVIEW_AUTO_RESOLVED',
          source: 'SYSTEM',
          metadata: { transaction_id: event.transactionId }
        });
      }

      await supabaseAdmin.from('payment_audit_logs').insert({
        session_id: matchedSessionId,
        event_type: 'PAYMENT_AUTO_VERIFIED',
        source: 'SYSTEM',
        metadata: { transaction_id: event.transactionId, amount_minor: event.amountMinor }
      });

    } else if (sessions && sessions.length > 1) {
      finalStatus = 'AMBIGUOUS';
      await supabaseAdmin.from('payment_audit_logs').insert({
        event_type: 'PAYMENT_AMBIGUOUS',
        source: 'SYSTEM',
        metadata: { amount_minor: event.amountMinor, session_count: sessions.length }
      });
    }

    // Insert into inbox
    await supabaseAdmin.from('payment_events_inbox').insert({
      event_id: event.eventId,
      device_id: deviceId,
      provider: event.provider,
      transaction_id: event.transactionId,
      amount_minor: event.amountMinor,
      currency: event.currency,
      payment_timestamp: event.paymentTimestamp,
      sms_received_at: event.smsReceivedAt,
      sender: event.sender,
      parser_version: event.parserVersion,
      source_fingerprint: event.sourceFingerprint,
      status: finalStatus,
      matched_session_id: matchedSessionId
    });

    return NextResponse.json({ message: 'Event processed successfully', matchStatus: finalStatus });
  } catch (error) {
    console.error('Event processing error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
