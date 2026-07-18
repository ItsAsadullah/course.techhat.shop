"use server";

import { createClient } from "@/lib/admin/supabase/server";
import { revalidatePath } from "next/cache";

function generateOrderNumber() {
  const prefix = "ORD";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}

export async function createOrder(params: {
  courseId: string;
  batchId?: string;
  studentData?: any;
  isFree?: boolean;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch Course details
    const { data: course } = await supabase
      .from("courses")
      .select("*, course_pricing(*)")
      .eq("id", params.courseId)
      .single();

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // 2. Fetch or create student
    let studentId = null;
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .or(`email.eq.${user.email},mobile.eq.${user.user_metadata?.phone || user.phone}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingStudent) {
      studentId = existingStudent.id;
    } else if (params.studentData) {
      // Create basic student profile
      const { data: newStudent, error: createStudentError } = await supabaseAdmin
        .from("students")
        .insert({
          user_id: user.id, // if needed
          full_name_en: params.studentData.fullNameEn,
          full_name_bn: params.studentData.fullNameBn,
          mobile: params.studentData.mobile,
          email: user.email,
          guardian_mobile: params.studentData.guardianMobile,
        })
        .select()
        .single();

      if (createStudentError) {
        console.error("Failed to create student", createStudentError, JSON.stringify(createStudentError));
        return { success: false, error: "Failed to create student profile" };
      }
      studentId = newStudent.id;

      // Create address
      if (params.studentData.village || params.studentData.union) {
        await supabaseAdmin.from("student_addresses").insert({
          student_id: studentId,
          address_type: "present",
          village: params.studentData.village,
          union_municipality: params.studentData.union,
          upazila: params.studentData.upazila,
          district: params.studentData.district,
        });
      }
    } else {
       // Silently create a basic student profile
       const { data: newStudent, error: createStudentError } = await supabaseAdmin
         .from("students")
         .insert({
           user_id: user.id,
           full_name_en: user.user_metadata?.full_name || user.email?.split("@")[0] || "New Student",
           mobile: user.user_metadata?.phone || user.phone || "",
           email: user.email,
         })
         .select()
         .single();
         
       if (createStudentError) {
         console.error("Failed to create student silently", createStudentError, JSON.stringify(createStudentError));
         return { success: false, error: "Failed to create student profile automatically" };
       }
       studentId = newStudent.id;
    }

    // 3. Prevent duplicate enrollment
    const { data: existingEnrollment } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", params.courseId)
      .maybeSingle();

    if (existingEnrollment) {
      return { success: false, error: "You are already enrolled in this course." };
    }

    // 4. Calculate prices
    const pricingObj = Array.isArray(course.course_pricing) ? course.course_pricing[0] : course.course_pricing;
    const courseFee = parseFloat(pricingObj?.course_fee?.toString() || "0");
    const discountPercent = parseFloat(pricingObj?.discount_percent?.toString() || "0");
    const discountAmt = courseFee * (discountPercent / 100);
    const finalPrice = courseFee - discountAmt;

    const subtotalMinor = Math.round(courseFee * 100);
    const discountMinor = Math.round(discountAmt * 100);
    const totalMinor = Math.round(finalPrice * 100);

    const isActuallyFree = totalMinor <= 0 || params.isFree;

    // 5. Create Order using Admin Client to bypass RLS missing INSERT policy
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: generateOrderNumber(),
        user_id: user.id,
        student_id: studentId,
        course_id: params.courseId,
        batch_id: params.batchId,
        subtotal_minor: subtotalMinor,
        discount_minor: discountMinor,
        total_minor: totalMinor,
        currency: "BDT",
        order_status: "PENDING_PAYMENT", // finalize_course_payment will set it to PAID
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order error", orderError);
      return { success: false, error: "Failed to create order" };
    }

    // 6. Handle Free Enrollment
    if (isActuallyFree) {
      const { data: finalizationResult, error: finError } = await supabase.rpc("finalize_course_payment", {
        p_order_id: order.id
      });
      
      if (finError || !finalizationResult?.success) {
        console.error("Free enrollment finalization failed", finError || finalizationResult);
        return { success: false, error: "Failed to finalize free enrollment" };
      }
      
      revalidatePath("/dashboard/courses");
      return { success: true, status: "PAID", orderId: order.id };
    }

    // 7. Create Payment Session for Paid Course
    // We add a random unique offset 1-99 for easier SMS verification if needed
    const uniqueOffsetMinor = Math.floor(Math.random() * 99) + 1;
    const payableAmountMinor = totalMinor + uniqueOffsetMinor;

    const { data: paymentSession, error: sessionError } = await supabaseAdmin
      .from("payment_sessions")
      .insert({
        order_id: order.id,
        base_amount_minor: totalMinor,
        unique_offset_minor: uniqueOffsetMinor,
        payable_amount_minor: payableAmountMinor,
        currency: "BDT",
        status: "AWAITING_PAYMENT",
        expires_at: new Date(Date.now() + 30 * 60000).toISOString(), // 30 mins
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Session error", sessionError);
      return { success: false, error: "Failed to create payment session" };
    }

    return { success: true, status: "PENDING_PAYMENT", orderId: order.id };

  } catch (err: any) {
    console.error("Create order exception:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
