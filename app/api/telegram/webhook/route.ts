import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const ALLOWED_ADMINS = process.env.TELEGRAM_ALLOWED_ADMIN_IDS?.split(',') || [];

export async function POST(req: Request) {
  try {
    // 1. Verify Telegram Webhook Secret Token
    const secretToken = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (TELEGRAM_WEBHOOK_SECRET && secretToken !== TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // We only care about callback queries
    if (!body.callback_query) {
      return NextResponse.json({ status: 'ignored' });
    }

    const callbackQuery = body.callback_query;
    const fromUser = callbackQuery.from;
    const data = callbackQuery.data;
    const messageId = callbackQuery.message?.message_id;
    const chatId = callbackQuery.message?.chat?.id;

    // 2. Verify admin
    if (!ALLOWED_ADMINS.includes(fromUser.id.toString())) {
      await answerCallbackQuery(callbackQuery.id, 'You are not authorized to perform this action.', true);
      return NextResponse.json({ error: 'Unauthorized admin' }, { status: 403 });
    }

    if (!data.startsWith('payment_review:')) {
      return NextResponse.json({ status: 'ignored' });
    }

    const [, action, reviewId] = data.split(':'); // action is 'approve' or 'reject'

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 4. Load review
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('manual_payment_reviews')
      .select('*, payment_sessions(id, order_id, payable_amount_minor)')
      .eq('id', reviewId)
      .single();

    if (reviewError || !review) {
      await answerCallbackQuery(callbackQuery.id, 'Review not found.', true);
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 5. Check if still PENDING
    if (review.status !== 'PENDING') {
      await answerCallbackQuery(callbackQuery.id, `Already resolved as ${review.status}.`, true);
      return NextResponse.json({ message: 'Already resolved' });
    }

    const adminName = fromUser.username || fromUser.first_name || 'Admin';

    if (action === 'approve') {
      // 6. Atomically approve via RPC
      const { data: finalizeData, error: finalizeError } = await supabaseAdmin.rpc("finalize_course_payment", {
        p_order_id: review.payment_sessions.order_id,
        p_manual_review_id: review.id
      });

      if (finalizeError || !finalizeData?.success) {
        console.error("Failed to finalize payment via RPC:", finalizeError || finalizeData);
        await answerCallbackQuery(callbackQuery.id, 'Error approving payment.', true);
        return NextResponse.json({ error: 'Finalization failed' }, { status: 500 });
      }

      // Update manual review reviewer info (RPC handles status, but not who reviewed it, so we update the rest here)
      await supabaseAdmin.from('manual_payment_reviews').update({
        reviewed_by: adminName,
      }).eq('id', review.id);

      await supabaseAdmin.from('payment_audit_logs').insert({
        session_id: review.session_id,
        event_type: 'MANUAL_PAYMENT_APPROVED',
        source: 'ADMIN',
        actor_id: adminName,
        metadata: { review_id: review.id }
      });

      // Update Telegram message
      await editMessageText(chatId, messageId, `✅ PAYMENT APPROVED\n\nAmount: ৳${(review.payment_sessions.payable_amount_minor / 100).toFixed(2)}\nApproved by: ${adminName}\nCourse access has been activated.`);
      await answerCallbackQuery(callbackQuery.id, 'Payment Approved!');

    } else if (action === 'reject') {
      await supabaseAdmin.from('manual_payment_reviews').update({
        status: 'REJECTED',
        reviewed_by: adminName,
        reviewed_at: new Date().toISOString()
      }).eq('id', review.id);

      await supabaseAdmin.from('payment_audit_logs').insert({
        session_id: review.session_id,
        event_type: 'MANUAL_PAYMENT_REJECTED',
        source: 'ADMIN',
        actor_id: adminName,
        metadata: { review_id: review.id }
      });

      await editMessageText(chatId, messageId, `❌ PAYMENT REJECTED\n\nAmount: ৳${(review.payment_sessions.payable_amount_minor / 100).toFixed(2)}\nRejected by: ${adminName}`);
      await answerCallbackQuery(callbackQuery.id, 'Payment Rejected.');
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function answerCallbackQuery(callbackQueryId: string, text: string, showAlert = false) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert
    })
  }).catch(console.error);
}

async function editMessageText(chatId: string | number, messageId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN || !chatId || !messageId) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: { inline_keyboard: [] } // Remove buttons
    })
  }).catch(console.error);
}
