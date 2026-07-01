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

  const [completed, position] = await Promise.all([
    prisma.drillProgress.findMany({
      where: { userId: user.id },
      select: { drillId: true, lessonId: true, modId: true, completedAt: true },
    }),
    prisma.userLastPosition.findUnique({
      where: { userId: user.id },
    }),
  ]);

  return NextResponse.json({
    completedDrills: completed.map((c: any) => c.drillId),
    lastPosition: position
      ? { drillId: position.drillId, lessonId: position.lessonId, modId: position.modId }
      : null,
  });
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

  const body = await req.json() as {
    type: "complete" | "position";
    drillId: string;
    lessonId: string;
    modId: string;
  };

  const { type, drillId, lessonId, modId } = body;

  if (type === "complete") {
    await prisma.drillProgress.upsert({
      where: { userId_drillId: { userId: user.id, drillId } },
      create: { userId: user.id, drillId, lessonId, modId },
      update: { completedAt: new Date() },
    });
  }

  await prisma.userLastPosition.upsert({
    where: { userId: user.id },
    create: { userId: user.id, drillId, lessonId, modId },
    update: { drillId, lessonId, modId },
  });

  return NextResponse.json({ ok: true });
}
