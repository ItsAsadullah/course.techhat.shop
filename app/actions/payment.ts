"use server";

import { createClient } from "@/lib/admin/supabase/server";
import { revalidatePath } from "next/cache";

export async function initializeCheckout(admissionId: string) {
  const supabase = await createClient();
  
  // 1. Fetch admission details
  const { data: admission, error: admissionError } = await supabase
    .from("admissions")
    .select("id, status, course_id, discount, courses(fee)")
    .eq("id", admissionId)
    .single();

  if (admissionError || !admission) {
    return { success: false, error: "Admission not found." };
  }

  if (admission.status === "approved") {
    return { success: false, error: "Already approved." };
  }

  // 2. Calculate base amount (fee - discount)
  const coursesObj: Record<string, unknown> | Record<string, unknown>[] = admission.courses as unknown as Record<string, unknown> | Record<string, unknown>[];
  const baseFeeStr = Array.isArray(coursesObj) ? coursesObj[0]?.fee : coursesObj?.fee;
  const baseFee = parseFloat((baseFeeStr as string) || "0");
  const discount = parseFloat(admission.discount || "0");
  const finalFee = baseFee - discount;
  const baseAmountMinor = Math.round(finalFee * 100);

  // 3. Check if there's already an active session
  const { data: existingSession } = await supabase
    .from("payment_sessions")
    .select("*")
    .eq("admission_id", admissionId)
    .in("status", ["AWAITING_PAYMENT", "AUTO_VERIFYING", "PENDING_MANUAL_REVIEW"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSession && new Date(existingSession.expires_at).getTime() > Date.now()) {
    // Reuse existing valid session
    return { success: true, sessionId: existingSession.id };
  }

  // 4. Allocate unique amount via RPC
  const { data: rpcData, error: rpcError } = await supabase.rpc("allocate_unique_payment_amount", {
    p_admission_id: admissionId,
    p_base_amount_minor: baseAmountMinor,
    p_expires_in_minutes: 15 // 15 minutes window
  });

  if (rpcError) {
    console.error("RPC Error:", rpcError);
    return { success: false, error: "Failed to generate unique amount." };
  }

  if (!rpcData || !rpcData[0].success) {
    return { success: false, error: rpcData?.[0]?.message || "Allocation failed." };
  }

  revalidatePath(`/checkout/${admissionId}`);
  return { success: true, sessionId: rpcData[0].session_id };
}

export async function submitManualReview(sessionId: string, trxId: string) {
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("payment_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { success: false, error: "Session not found." };
  }

  if (session.status === "PAID") {
    return { success: false, error: "Already paid." };
  }

  // Check existing pending review
  const { data: existingReview } = await supabase
    .from("manual_payment_reviews")
    .select("id")
    .eq("session_id", sessionId)
    .eq("status", "PENDING")
    .maybeSingle();

  if (existingReview) {
    return { success: false, error: "A manual review is already pending." };
  }

  // Insert review
  const { data: review, error: reviewError } = await supabase
    .from("manual_payment_reviews")
    .insert({
      session_id: sessionId,
      submitted_trx_id: trxId.trim(),
      expected_amount_minor: session.payable_amount_minor,
      status: "PENDING"
    })
    .select("id")
    .single();

  if (reviewError) {
    return { success: false, error: "Failed to submit review." };
  }

  // Update session status
  await supabase
    .from("payment_sessions")
    .update({ status: "PENDING_MANUAL_REVIEW" })
    .eq("id", sessionId);

  // Send to Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_PAYMENT_CHAT_ID;
  
  if (botToken && chatId) {
    const amountStr = (session.payable_amount_minor / 100).toFixed(2);
    const text = `💳 *Manual Payment Request*\n\nOrder: ${session.order_id}\nExpected Payment: ৳${amountStr}\nTrxID: \`${trxId.trim()}\`\nStatus: Pending`;
    
    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "✅ APPROVE", callback_data: `payment_review:approve:${review.id}` },
          { text: "❌ REJECT", callback_data: `payment_review:reject:${review.id}` }
        ]
      ]
    };

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
          reply_markup: inlineKeyboard
        })
      });
    } catch (e) {
      console.error("Failed to notify Telegram", e);
    }
  }

  return { success: true };
}
