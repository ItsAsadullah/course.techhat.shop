import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ── GET /api/sessions ─────────────────────────────────────────────────────────
// Returns all DrillRecord rows for the signed-in user, newest first.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.drillRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
  });

  return NextResponse.json(records);
}

// ── POST /api/sessions ────────────────────────────────────────────────────────
// Body: { drillId, lessonId, modId, wpm, accuracy, errors, timeSpent }
// Creates a new DrillRecord row.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { drillId, lessonId, modId, wpm, accuracy, errors = 0, timeSpent } = body;

  if (!drillId || !lessonId || !modId || wpm == null || accuracy == null || timeSpent == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const record = await prisma.drillRecord.create({
    data: {
      userId: session.user.id,
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
