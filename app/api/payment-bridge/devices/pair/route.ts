import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import crypto from 'crypto';

const pairSchema = z.object({
  pairingToken: z.string().min(4).max(50),
  deviceName: z.string().min(2).max(100),
  appVersion: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = pairSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { pairingToken, deviceName, appVersion } = result.data;

    // Use admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find the device by pairing token
    const { data: device, error: fetchError } = await supabaseAdmin
      .from('payment_bridge_devices')
      .select('*')
      .eq('pairing_token', pairingToken)
      .eq('is_active', true)
      .single();

    if (fetchError || !device) {
      return NextResponse.json({ error: 'Invalid or expired pairing token' }, { status: 401 });
    }

    // Generate a new secure device secret
    const rawSecret = crypto.randomBytes(32).toString('hex');
    const secretHash = crypto.createHash('sha256').update(rawSecret).digest('hex');

    // Update the device record
    const { error: updateError } = await supabaseAdmin
      .from('payment_bridge_devices')
      .update({
        device_name: deviceName,
        pairing_token: null, // Clear the token so it can't be used again
        device_secret_hash: secretHash,
        app_version: appVersion,
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', device.id);

    if (updateError) {
      console.error('Failed to update device:', updateError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    // Log the pairing event
    await supabaseAdmin.from('payment_audit_logs').insert({
      event_type: 'DEVICE_PAIRED',
      source: 'ANDROID_APP',
      actor_id: device.id,
      metadata: { device_name: deviceName }
    });

    // Return the id and the RAW secret (only time this is ever sent)
    return NextResponse.json({
      deviceId: device.id,
      deviceSecret: rawSecret,
    });

  } catch (error: any) {
    console.error('Pairing error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
