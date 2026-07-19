import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const deviceId = req.headers.get('x-device-id');
    const syncQueueCountStr = req.headers.get('x-sync-queue-count');
    const syncQueueCount = syncQueueCountStr ? parseInt(syncQueueCountStr, 10) : 0;

    if (!deviceId) {
      return NextResponse.json({ error: 'Missing device ID' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from('payment_bridge_devices')
      .update({
        last_seen_at: new Date().toISOString(),
        sync_queue_count: syncQueueCount
      })
      .eq('id', deviceId)
      .eq('is_active', true);

    if (error) {
      return NextResponse.json({ error: 'Failed to update heartbeat' }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
