"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/admin/supabase/server";
import type { Payment } from "@/types/admin";

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.app_metadata?.app_role ?? user?.user_metadata?.role;
  return String(role).toLowerCase() === "admin" ? user : null;
}

export async function getPayments(limit?: number) {
  const supabaseAdmin = getAdminClient();

  let query = supabaseAdmin
    .from("payments")
    .select("*, student:students(id, full_name_en, mobile, admissions(course:courses(course_translations(lang, name))))")
    .order("payment_date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch payments:", error);
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }

  // Map student fields for backward compatibility
  const enrichedData = (data || []).map((payment: any) => {
    if (payment.student) {
      payment.student = {
        ...payment.student,
        name: payment.student.full_name_en,
        phone: payment.student.mobile,
      };
      
      // Extract course name from admissions if available
      const admissions = Array.isArray(payment.student.admissions) 
        ? payment.student.admissions 
        : (payment.student.admissions ? [payment.student.admissions] : []);
        
      const firstAdmission = admissions[0];
      if (firstAdmission?.course?.course_translations) {
        const translations = Array.isArray(firstAdmission.course.course_translations) 
          ? firstAdmission.course.course_translations 
          : [firstAdmission.course.course_translations];
        const enTranslation = translations.find((t: any) => t.lang === 'en') || translations[0];
        payment.student.course = { name: enTranslation?.name || "Course" };
      }
    }
    return payment;
  });

  return enrichedData as Payment[];
}

export async function getPaymentMetrics() {
  const supabaseAdmin = getAdminClient();
  const { data, error } = await supabaseAdmin
    .from("course_enrollments")
    .select("final_fee, payments(amount)")
    .in("status", ["pending", "active", "suspended"]);

  if (error) {
    console.error("Failed to fetch metrics data:", error);
    return {
      totalEnrollments: 0,
      totalPaidStudents: 0,
      totalDueStudents: 0,
    };
  }

  let totalEnrollments = 0;
  let totalPaidStudents = 0;
  let totalDueStudents = 0;

  for (const enrollment of data || []) {
    totalEnrollments++;
    const finalFee = Number(enrollment.final_fee || 0);
    const paid = (enrollment.payments || []).reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
    const due = finalFee - paid;
    if (due <= 0) {
      totalPaidStudents++;
    } else {
      totalDueStudents++;
    }
  }

  return {
    totalEnrollments,
    totalPaidStudents,
    totalDueStudents,
  };
}

export async function getPaymentById(id: string) {
  const supabaseAdmin = getAdminClient();

  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("*, student:students(id, full_name_en, mobile, admissions(course:courses(course_translations(lang, name))))")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch payment: ${error.message}`);
  }

  if (data?.student) {
    data.student = {
      ...data.student,
      name: data.student.full_name_en,
      phone: data.student.mobile,
    };
    
    const admissions = Array.isArray(data.student.admissions) 
      ? data.student.admissions 
      : (data.student.admissions ? [data.student.admissions] : []);
      
    const firstAdmission = admissions[0];
    if (firstAdmission?.course?.course_translations) {
      const translations = Array.isArray(firstAdmission.course.course_translations) 
        ? firstAdmission.course.course_translations 
        : [firstAdmission.course.course_translations];
      const enTranslation = translations.find((t: any) => t.lang === 'en') || translations[0];
      data.student.course = { name: enTranslation?.name || "Course" };
    }
  }

  return data as Payment;
}

export async function createPayment(formData: FormData) {
  const user = await requireAdmin();
  if (!user) return { success: false, error: "এই কাজটি করার জন্য অ্যাডমিন অনুমতি প্রয়োজন।" };

  const supabaseAdmin = getAdminClient();

  const rawData = {
    student_id: formData.get("student_id") as string,
    enrollment_id: formData.get("enrollment_id") as string,
    payment_date: (formData.get("payment_date") as string) || new Date().toISOString().split("T")[0],
    amount: Number(formData.get("amount") || 0),
    payment_method: formData.get("payment_method") as string,
    transaction_id: (formData.get("transaction_id") as string) || null,
    reference: (formData.get("reference") as string) || null,
    remarks: (formData.get("remarks") as string) || null,
  };

  if (!rawData.student_id || !rawData.enrollment_id || !rawData.amount || !rawData.payment_method) {
    return { success: false, error: "Student, course enrollment, amount, and payment method are required." };
  }

  const { data, error } = await supabaseAdmin.rpc("record_enrollment_payment", {
    p_enrollment_id: rawData.enrollment_id,
    p_amount: rawData.amount,
    p_payment_date: rawData.payment_date,
    p_payment_method: rawData.payment_method,
    p_transaction_id: rawData.transaction_id,
    p_reference: rawData.reference,
    p_remarks: rawData.remarks,
    p_received_by: user.id,
  });

  if (error) {
    console.error("record_enrollment_payment RPC failed", error);
    return { success: false, error: "Payment could not be recorded. Please try again." };
  }
  if (!data?.success) {
    const message = data?.code === "PAYMENT_EXCEEDS_DUE"
      ? "পেমেন্টের পরিমাণ এই এনরোলমেন্টের বকেয়ার চেয়ে বেশি হতে পারে না।"
      : "এই এনরোলমেন্টে পেমেন্ট নেওয়া যাচ্ছে না।";
    return { success: false, error: message };
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  revalidatePath(`/admin/students/${rawData.student_id}`);
  revalidatePath("/admin/enrollments");
  revalidatePath(`/admin/enrollments/${rawData.enrollment_id}`);
  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/courses");

  return { success: true, paymentId: String(data.payment_id) };
}

export async function deletePayment(id: string) {
  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("payments")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: `Failed to delete payment: ${error.message}` };
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  return { success: true };
}
