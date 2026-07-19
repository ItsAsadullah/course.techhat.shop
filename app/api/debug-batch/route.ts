import { NextResponse } from 'next/server';
import { getTrainingBatchById } from '@/lib/admin/actions/training-batches';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "No ID provided" });
  
  try {
    const data = await getTrainingBatchById(id);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message, stack: (err as Error).stack });
  }
}
