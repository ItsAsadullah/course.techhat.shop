import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const records = await prisma.drillRecord.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { drillId, lessonId, modId, wpm, accuracy, errors = 0, timeSpent } = body;

  if (!drillId || !lessonId || !modId || wpm == null || accuracy == null || timeSpent == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const record = await prisma.drillRecord.create({
    data: {
      userId: user.id,
      drillId,
      lessonId,
      modId,
      wpm: Number(wpm),
      accuracy: Number(accuracy),
      errors: Number(errors),
      timeSpent: Number(timeSpent),
    },
  });

  return NextResponse.json(record, { status: 201 });
}
