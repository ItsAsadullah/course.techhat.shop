"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/admin/supabase/server";
import { revalidatePath } from "next/cache";

function formatMoney(minor: number) {
  return (minor / 100).toFixed(2);
}

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getOrderStats() {
  const supabase = getAdminClient();

  const [
    { count: totalOrders },
    { count: pendingReview },
    { data: todayRevenue },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("manual_payment_reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "PENDING"),
    supabase
      .from("payment_sessions")
      .select("payable_amount_minor")
      .eq("status", "PAID")
      .gte(
        "updated_at",
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      ),
  ]);

  const todayRevenueTotal =
    todayRevenue?.reduce(
      (sum, s) => sum + (s.payable_amount_minor ?? 0),
      0
    ) ?? 0;

  return {
    totalOrders: totalOrders ?? 0,
    pendingReview: pendingReview ?? 0,
    todayRevenue: formatMoney(todayRevenueTotal),
  };
}

export type OrderStatus =
  | "all"
  | "PENDING_PAYMENT"
  | "PENDING_MANUAL_REVIEW"
  | "PAID"
  | "REJECTED";

export async function getAdminOrders(filter: OrderStatus = "all") {
  const supabase = getAdminClient();

  // Fetch all orders with joins — filter by order_status where possible
  // Note: courses table has no 'title' column; name lives in course_translations
  let query = supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      order_status,
      total_minor,
      discount_minor,
      created_at,
      student_id,
      course_id,
      students (
        id,
        full_name_en,
        full_name_bn,
        mobile,
        email
      ),
      payment_sessions (
        id,
        status,
        payable_amount_minor,
        created_at,
        updated_at
      )
    `
    )
    .order("created_at", { ascending: false });

  // Filter by order_status for simple statuses
  if (filter === "PAID" || filter === "PENDING_PAYMENT" || filter === "REJECTED") {
    query = query.eq("order_status", filter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getAdminOrders error:", JSON.stringify(error));
    return [];
  }

  const orders = data ?? [];

  // Fetch course names from course_translations (EN)
  const courseIds = [...new Set(orders.map((o: any) => o.course_id).filter(Boolean))];
  let courseNameMap: Record<string, string> = {};
  if (courseIds.length > 0) {
    const { data: translations } = await supabase
      .from("course_translations")
      .select("course_id, name")
      .in("course_id", courseIds)
      .eq("lang", "en");
    for (const t of translations ?? []) {
      courseNameMap[t.course_id] = t.name;
    }
  }

  // For each order that has a payment_session, fetch the latest manual review
  const sessionIds = orders
    .flatMap((o: any) =>
      Array.isArray(o.payment_sessions)
        ? o.payment_sessions.map((s: any) => s.id)
        : o.payment_sessions
        ? [o.payment_sessions.id]
        : []
    )
    .filter(Boolean);

  let reviewsMap: Record<string, any> = {};

  if (sessionIds.length > 0) {
    const { data: reviews } = await supabase
      .from("manual_payment_reviews")
      .select("id, session_id, status, submitted_trx_id, rejection_reason, created_at, reviewed_at")
      .in("session_id", sessionIds)
      .order("created_at", { ascending: false });

    // Keep only the latest review per session
    for (const r of reviews ?? []) {
      if (!reviewsMap[r.session_id]) {
        reviewsMap[r.session_id] = r;
      }
    }
  }

  // Flatten to usable shape
  let result = orders.map((order: any) => {
    const session = Array.isArray(order.payment_sessions)
      ? order.payment_sessions[0]
      : (order.payment_sessions ?? null);

    const review = session ? reviewsMap[session.id] ?? null : null;

    return {
      id: order.id,
      orderNumber: order.order_number,
      orderStatus: order.order_status,
      totalMinor: order.total_minor,
      discountMinor: order.discount_minor,
      createdAt: order.created_at,
      student: order.students,
      course: { id: order.course_id, title: courseNameMap[order.course_id] || "—" },
      session: session
        ? {
            id: session.id,
            status: session.status,
            payableAmountMinor: session.payable_amount_minor,
            createdAt: session.created_at,
            updatedAt: session.updated_at,
          }
        : null,
      review: review
        ? {
            id: review.id,
            status: review.status,
            trxId: review.submitted_trx_id,
            rejectionReason: review.rejection_reason,
            createdAt: review.created_at,
            reviewedAt: review.reviewed_at,
          }
        : null,
    };
  });

  // For PENDING_MANUAL_REVIEW filter, keep only orders that have a PENDING review
  if (filter === "PENDING_MANUAL_REVIEW") {
    result = result.filter((o) => o.review?.status === "PENDING");
  }

  return result;
}

export async function getOrderById(orderId: string) {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      order_status,
      total_minor,
      discount_minor,
      subtotal_minor,
      currency,
      course_id,
      created_at,
      students (
        id,
        full_name_en,
        full_name_bn,
        mobile,
        email,
        guardian_mobile
      ),
      payment_sessions (
        id,
        status,
        payable_amount_minor,
        base_amount_minor,
        unique_offset_minor,
        created_at,
        updated_at,
        expires_at
      )
    `
    )
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  const order = data as any;

  // Fetch course name from course_translations
  let courseName = "—";
  if (order.course_id) {
    const { data: tr } = await supabase
      .from("course_translations")
      .select("name")
      .eq("course_id", order.course_id)
      .eq("lang", "en")
      .maybeSingle();
    if (tr?.name) courseName = tr.name;
  }

  // Add course info to order object
  order.courses = { id: order.course_id, title: courseName };

  // Fetch latest review for session
  const session = Array.isArray(order.payment_sessions)
    ? order.payment_sessions[0]
    : (order.payment_sessions ?? null);

  let review = null;
  if (session?.id) {
    const { data: reviewData } = await supabase
      .from("manual_payment_reviews")
      .select("id, session_id, status, submitted_trx_id, rejection_reason, created_at, reviewed_at")
      .eq("session_id", session.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    review = reviewData ?? null;
  }

  return { order, session, review };
}

export async function approveManualPayment(reviewId: string) {
  const supabase = await createClient();
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get review and session details
  const { data: review, error: reviewError } = await supabase
    .from("manual_payment_reviews")
    .select("id, session_id, status")
    .eq("id", reviewId)
    .single();

  if (reviewError || !review) {
    return { success: false, error: "Review not found." };
  }

  if (review.status !== "PENDING") {
    return { success: false, error: "This review is already processed." };
  }

  const { data: session, error: sessionError } = await supabase
    .from("payment_sessions")
    .select("id, order_id")
    .eq("id", review.session_id)
    .single();

  if (sessionError || !session) {
    return { success: false, error: "Payment session not found." };
  }

  // Approve the review
  await supabaseAdmin
    .from("manual_payment_reviews")
    .update({ status: "APPROVED", reviewed_at: new Date().toISOString() })
    .eq("id", reviewId);

  // Mark session as PAID
  await supabaseAdmin
    .from("payment_sessions")
    .update({ status: "PAID" })
    .eq("id", session.id);

  // Finalize the order and create enrollment via RPC
  const { data: finalizeData, error: finalizeError } = await supabaseAdmin.rpc(
    "finalize_course_payment",
    { p_order_id: session.order_id }
  );

  if (finalizeError || !finalizeData?.success) {
    console.error("Finalize error:", finalizeError, finalizeData);
    return {
      success: false,
      error: "Failed to finalize enrollment. Please check the order manually.",
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${session.order_id}`);

  return { success: true };
}

export async function rejectManualPayment(reviewId: string, reason?: string) {
  const supabase = await createClient();
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: review, error } = await supabase
    .from("manual_payment_reviews")
    .select("id, session_id, status")
    .eq("id", reviewId)
    .single();

  if (error || !review) {
    return { success: false, error: "Review not found." };
  }

  if (review.status !== "PENDING") {
    return { success: false, error: "This review is already processed." };
  }

  await supabaseAdmin
    .from("manual_payment_reviews")
    .update({
      status: "REJECTED",
      rejection_reason: reason || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  // Revert session back to AWAITING_PAYMENT so student can retry
  const { data: session } = await supabaseAdmin
    .from("payment_sessions")
    .update({ status: "AWAITING_PAYMENT" })
    .eq("id", review.session_id)
    .select("order_id")
    .single();

  revalidatePath("/admin/orders");
  if (session?.order_id) {
    revalidatePath(`/admin/orders/${session.order_id}`);
  }

  return { success: true };
}

export async function cancelOrder(orderId: string) {
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Get the order to check its current status
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, order_status")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return { success: false, error: "Order not found." };
  }

  if (order.order_status === "PAID") {
    return { success: false, error: "Cannot cancel a paid order." };
  }
  
  if (order.order_status === "CANCELLED") {
    return { success: false, error: "Order is already cancelled." };
  }

  // 2. Mark the order as CANCELLED
  const { error: cancelError } = await supabaseAdmin
    .from("orders")
    .update({
      order_status: "CANCELLED",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (cancelError) {
    return { success: false, error: "Failed to cancel the order." };
  }

  // 3. Mark related payment sessions as EXPIRED or CANCELLED if they are pending
  await supabaseAdmin
    .from("payment_sessions")
    .update({ status: "EXPIRED" })
    .eq("order_id", orderId)
    .in("status", ["AWAITING_PAYMENT", "PENDING_MANUAL_REVIEW"]);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return { success: true };
}
