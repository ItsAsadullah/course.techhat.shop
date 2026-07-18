import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramNotification } from "@/lib/telegram";

const SECRET_API_KEY = process.env.SMS_API_SECRET;

if (!SECRET_API_KEY) {
  console.warn("[SMS Webhook] SMS_API_SECRET is not set. SMS webhook is disabled.");
}

export async function POST(req: Request) {
  try {
    // Reject if no secret configured — webhook is disabled
    if (!SECRET_API_KEY) {
      return NextResponse.json({ message: "SMS webhook is not configured" }, { status: 503 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${SECRET_API_KEY}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, trxid, sender, time } = body;

    if (!amount || !trxid || !sender) {
      return NextResponse.json({ message: "Invalid payload: Missing required fields" }, { status: 400 });
    }

    const amountMinor = Math.round(Number(amount) * 100);

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Try to find a pending session matching this exact amount
    const { data: sessions, error: sessionError } = await supabaseAdmin
      .from("payment_sessions")
      .select("id, order_id, status")
      .eq("payable_amount_minor", amountMinor)
      .eq("status", "AWAITING_PAYMENT")
      .order("created_at", { ascending: false })
      .limit(1);

    if (sessionError || !sessions || sessions.length === 0) {
      console.log(`[SMS Webhook] Received ${amount} but no pending session found. Saved for manual review.`);
      // Insert into payment_events_inbox for later manual resolution
      await supabaseAdmin.from("payment_events_inbox").insert({
        provider: "bkash", // or from sender heuristics
        trx_id: trxid,
        sender: sender,
        amount_minor: amountMinor,
        status: "UNMATCHED",
        raw_payload: body
      });
      return NextResponse.json({ message: "Payment saved for manual review" }, { status: 200 });
    }

    const session = sessions[0];

    // 2. We have a match! Finalize it.
    const { data: finalizeData, error: finalizeError } = await supabaseAdmin.rpc("finalize_course_payment", {
      p_order_id: session.order_id
    });

    if (finalizeError || !finalizeData?.success) {
      console.error("Failed to finalize payment via RPC:", finalizeError || finalizeData);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

    // Insert into payment_events_inbox as PROCESSED
    await supabaseAdmin.from("payment_events_inbox").insert({
      provider: "bkash",
      trx_id: trxid,
      sender: sender,
      amount_minor: amountMinor,
      status: "PROCESSED",
      matched_order_id: session.order_id,
      raw_payload: body
    });

    // Notify Admin via Telegram
    const message = `✅ *Payment Auto-Verified (Amount Match)!*\n\n*Order ID:* ${session.order_id}\n*Amount Received:* ৳${amount}\n*TrxID:* ${trxid}\n*Sender:* ${sender}\n*Status:* Auto-Approved.`;
    await sendTelegramNotification(message);

    return NextResponse.json({ message: "SMS Webhook processed successfully." }, { status: 200 });
  } catch (error: unknown) {
    console.error("SMS Webhook Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

