"use server";

import { createClient } from "@/lib/admin/supabase/server";
import { revalidatePath } from "next/cache";

export async function applyCouponToOrder(orderId: string, couponCode: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Validate the coupon code
    const code = couponCode.trim().toUpperCase();
    
    // Check if the coupons table exists (graceful degradation if not)
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .maybeSingle();

    if (couponError || !coupon) {
      return { success: false, error: "Invalid or inactive coupon code." };
    }

    // 2. Fetch the order
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, subtotal_minor, discount_minor, total_minor, course_id")
      .eq("id", orderId)
      .single();

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    // 3. Verify course constraint (if coupon is course-specific)
    if (coupon.course_id && coupon.course_id !== order.course_id) {
      return { success: false, error: "Coupon is not applicable to this course." };
    }

    // 4. Calculate new total
    let discountAmountMinor = 0;
    if (coupon.discount_type === "PERCENT") {
      discountAmountMinor = Math.round((order.subtotal_minor * parseFloat(coupon.discount_value)) / 100);
    } else if (coupon.discount_type === "FLAT") {
      // Assuming discount_value is in major units (e.g. 500 BDT)
      discountAmountMinor = Math.round(parseFloat(coupon.discount_value) * 100);
    } else {
      return { success: false, error: "Invalid coupon configuration." };
    }

    // Ensure we don't discount more than the subtotal
    discountAmountMinor = Math.min(discountAmountMinor, order.subtotal_minor);
    const newTotalMinor = order.subtotal_minor - discountAmountMinor;

    // 5. Update the order
    const { error: updateOrderError } = await supabaseAdmin
      .from("orders")
      .update({
        discount_minor: discountAmountMinor,
        total_minor: newTotalMinor
      })
      .eq("id", orderId);

    if (updateOrderError) {
      return { success: false, error: "Failed to apply discount to order." };
    }

    // 6. Update payment session
    const { data: paymentSession } = await supabaseAdmin
      .from("payment_sessions")
      .select("id, unique_offset_minor")
      .eq("order_id", orderId)
      .single();

    if (paymentSession) {
      const payableAmountMinor = newTotalMinor + (paymentSession.unique_offset_minor || 0);
      await supabaseAdmin
        .from("payment_sessions")
        .update({
          base_amount_minor: newTotalMinor,
          payable_amount_minor: payableAmountMinor
        })
        .eq("id", paymentSession.id);
    }

    revalidatePath(`/checkout/${orderId}`);
    return { success: true, message: "Coupon applied successfully!" };

  } catch (err: any) {
    console.error("Apply coupon exception:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
