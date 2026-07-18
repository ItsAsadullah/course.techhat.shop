"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/admin/supabase/server";
import { getTrainingBatchCapacity } from "@/lib/admin/actions/training-batches";
import {
  adminEnrollmentSchema,
  type AdminEnrollmentFormValues,
} from "@/lib/schema/enrollment.schema";
import type {
  AdminEnrollment,
  AdminEnrollmentListItem,
  EnrollmentPaymentOption,
  Student,
} from "@/types/admin";

type ActionErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "STUDENT_NOT_FOUND"
  | "COURSE_NOT_FOUND"
  | "INVALID_BATCH"
  | "BATCH_FULL"
  | "BATCH_CAPACITY_NOT_CONFIGURED"
  | "COURSE_PRICING_NOT_FOUND"
  | "BOARD_CERTIFICATE_NOT_SUPPORTED"
  | "INVALID_FEE"
  | "INVALID_FEE_OVERRIDE"
  | "INVALID_DISCOUNT"
  | "INVALID_INITIAL_PAYMENT"
  | "INVALID_PAYMENT_METHOD"
  | "DISCOUNT_TOO_LARGE"
  | "PAYMENT_EXCEEDS_DUE"
  | "PAYMENT_DETAILS_REQUIRED"
  | "DUPLICATE_ENROLLMENT"
  | "DATABASE_ERROR";

export type EnrollmentActionResult =
  | {
      success: true;
      data: {
        enrollmentId: string;
        finalFee: number;
        totalPaid: number;
        currentDue: number;
      };
    }
  | { success: false; error: { code: ActionErrorCode; message: string } };

export interface EnrollmentCourseOption {
  id: string;
  courseCode: string;
  type: string;
  name: string;
  nameBn: string | null;
  defaultFee: number;
  instituteCertificateFee: number;
  boardRegistrationFee: number;
  boardCertificateFee: number;
  supportsBoardCertificate: boolean;
  boardRegistrationRequired: boolean;
  batches: Array<{
    id: string;
    name: string;
    nameBn: string | null;
    session: string | null;
    startDate: string | null;
    status: string | null;
    shifts: Array<{
      id: string;
      name: string;
      startTime: string;
      endTime: string;
    }>;
    capacity: {
      total: number;
      occupied: number;
      available: number;
      utilizationPercent: number;
      isFull: boolean;
    } | null;
    capacityError?: string;
  }>;
}

export interface EnrollmentPageData {
  student: Student & { photo_url?: string | null; active_enrollment_count: number };
  courses: EnrollmentCourseOption[];
}

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.app_metadata?.app_role ?? user?.user_metadata?.role;

  if (!user || String(role).toLowerCase() !== "admin") {
    return { user: null, error: "UNAUTHORIZED" as const };
  }

  return { user, error: null };
}

function errorMessage(code: ActionErrorCode) {
  const messages: Record<ActionErrorCode, string> = {
    UNAUTHORIZED: "এই কাজটি করার জন্য অ্যাডমিন অনুমতি প্রয়োজন।",
    VALIDATION_ERROR: "দয়া করে দেওয়া তথ্যগুলো আবার যাচাই করুন।",
    STUDENT_NOT_FOUND: "শিক্ষার্থীর তথ্য পাওয়া যায়নি।",
    COURSE_NOT_FOUND: "কোর্সটি পাওয়া যায়নি।",
    INVALID_BATCH: "নির্বাচিত ব্যাচটি এই কোর্সের জন্য বৈধ নয়।",
    BATCH_FULL: "নির্বাচিত ব্যাচে কোনো আসন খালি নেই।",
    BATCH_CAPACITY_NOT_CONFIGURED: "এই ব্যাচের ধারণক্ষমতা কনফিগার করা হয়নি। ব্যাচটিকে একটি বৈধ ট্রেনিং শিফটে যুক্ত করুন অথবা Seat Limit নির্ধারণ করুন।",
    COURSE_PRICING_NOT_FOUND: "এই কোর্সের মূল্য নির্ধারণ করা নেই।",
    BOARD_CERTIFICATE_NOT_SUPPORTED: "এই কোর্সটি বোর্ড সার্টিফিকেশন সমর্থন করে না।",
    INVALID_FEE: "কোর্স ফি সঠিক নয়।",
    INVALID_FEE_OVERRIDE: "ওভাররাইড ফি সঠিক নয়।",
    INVALID_DISCOUNT: "ছাড়ের পরিমাণ সঠিক নয়।",
    INVALID_INITIAL_PAYMENT: "প্রাথমিক পেমেন্ট সঠিক নয়।",
    INVALID_PAYMENT_METHOD: "সঠিক পেমেন্ট পদ্ধতি নির্বাচন করুন।",
    DISCOUNT_TOO_LARGE: "ছাড়ের পরিমাণ কোর্স ফি-এর বেশি হতে পারে না।",
    PAYMENT_EXCEEDS_DUE: "পেমেন্টের পরিমাণ বকেয়ার চেয়ে বেশি হতে পারে না।",
    PAYMENT_DETAILS_REQUIRED: "পেমেন্ট পদ্ধতি এবং তারিখ দিন।",
    DUPLICATE_ENROLLMENT: "শিক্ষার্থী ইতিমধ্যে এই কোর্সে সক্রিয়ভাবে ভর্তি আছে।",
    DATABASE_ERROR: "এনরোলমেন্ট সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
  };
  return messages[code];
}

function mapEnrollment(row: Record<string, unknown>): AdminEnrollment {
  const payments = Array.isArray(row.payments) ? row.payments : [];
  const totalPaid = payments.reduce((sum, payment) => {
    const value = payment && typeof payment === "object" ? (payment as { amount?: number | string }).amount : 0;
    return sum + Number(value ?? 0);
  }, 0);
  const finalFee = Number(row.final_fee ?? 0);
  const course = row.course as { course_translations?: unknown } | null;
  const translations = Array.isArray(course?.course_translations) ? course.course_translations : [];
  const english = translations.find((translation) => (translation as { lang?: string }).lang === "en") as { name?: string } | undefined;
  const bangla = translations.find((translation) => (translation as { lang?: string }).lang === "bn") as { name?: string } | undefined;
  const batch = row.batch as { name_en?: string | null; name_bn?: string | null } | null;

  return {
    id: String(row.id),
    student_id: String(row.student_id),
    user_id: (row.user_id as string | null) ?? null,
    course_id: String(row.course_id),
    batch_id: (row.batch_id as string | null) ?? null,
    enrollment_code: (row.enrollment_code as string | null) ?? null,
    status: String(row.status ?? "pending") as AdminEnrollment["status"],
    source: (row.source as string | null) ?? null,
    enrolled_at: String(row.enrolled_at),
    start_date: (row.start_date as string | null) ?? null,
    completed_at: (row.completed_at as string | null) ?? null,
    course_fee: Number(row.course_fee ?? 0),
    discount_amount: Number(row.discount_amount ?? 0),
    final_fee: finalFee,
    progress: Number(row.progress ?? 0),
    created_by: (row.created_by as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    total_paid: totalPaid,
    current_due: Math.max(finalFee - totalPaid, 0),
    payment_progress: finalFee > 0 ? Math.min((totalPaid / finalFee) * 100, 100) : 100,
    course_name: english?.name ?? bangla?.name ?? "Unnamed course",
    course_name_bn: bangla?.name ?? null,
    batch_name: batch?.name_en ?? batch?.name_bn ?? null,
  };
}

export async function getEnrollmentPageData(studentId: string, currentCourseId?: string): Promise<EnrollmentPageData | null> {
  const access = await requireAdmin();
  if (access.error) return null;

  const admin = getAdminClient();
  const [{ data: student, error: studentError }, { data: courses, error: coursesError }] = await Promise.all([
    admin
      .from("students")
      .select("*, student_documents(document_type, file_url), course_enrollments(id, status, course_id)")
      .eq("id", studentId)
      .maybeSingle(),
    admin
      .from("courses")
      .select("id, course_code, course_type, status, course_translations(lang, name), course_pricing(course_fee, institute_certificate_fee, board_registration_fee, board_certificate_fee, supports_board_certificate, board_registration_required), course_batches(id, name_en, name_bn, session, start_date, status, shifts:course_batch_shifts(shift:training_shifts(id, name_en, start_time, end_time)))")
      .neq("status", "archived")
      .order("created_at", { ascending: false }),
  ]);

  if (studentError || !student || coursesError) {
    console.error("Failed to load direct enrollment page", { studentError, coursesError });
    return null;
  }

  const photo = (student.student_documents ?? []).find(
    (document: { document_type?: string }) => document.document_type === "photo",
  ) as { file_url?: string | null } | undefined;

  return {
    student: {
      ...student,
      active_enrollment_count: (student.course_enrollments ?? []).filter(
        (enrollment: { status?: string }) => enrollment.status === "active",
      ).length,
      photo_url: photo?.file_url ?? null,
    } as EnrollmentPageData["student"],
    courses: await Promise.all((courses ?? [])
      .filter((course: any) => {
        const activeCourseIds = new Set(
          (student.course_enrollments ?? [])
            .filter((e: any) => e.status === "active")
            .map((e: any) => e.course_id)
        );
        if (currentCourseId && currentCourseId === course.id) return true;
        return !activeCourseIds.has(course.id);
      })
      .map(async (course: Record<string, unknown>) => {
      const translations = (course.course_translations ?? []) as Array<{ lang: string; name: string }>;
      const rawPricing = course.course_pricing;
      const p = (Array.isArray(rawPricing) ? rawPricing[0] : rawPricing) || {};
      const english = translations.find((translation) => translation.lang === "en");
      const bangla = translations.find((translation) => translation.lang === "bn");
      return {
        id: String(course.id),
        courseCode: String(course.course_code),
        type: String(course.course_type ?? "offline"),
        name: english?.name ?? bangla?.name ?? String(course.course_code),
        nameBn: bangla?.name ?? null,
        defaultFee: Number(p.course_fee ?? 0),
        instituteCertificateFee: Number(p.institute_certificate_fee ?? 0),
        boardRegistrationFee: Number(p.board_registration_fee ?? 0),
        boardCertificateFee: Number(p.board_certificate_fee ?? 0),
        supportsBoardCertificate: Boolean(p.supports_board_certificate),
        boardRegistrationRequired: Boolean(p.board_registration_required),
        batches: await Promise.all(((course.course_batches ?? []) as Array<Record<string, unknown>>)
          .filter((batch) => !["cancelled", "completed"].includes(String(batch.status)))
          .map(async (batch) => {
            const shiftRelations = (batch.shifts ?? []) as Array<{ shift: { id: string; name_en: string; start_time: string; end_time: string } }>;
            const shifts = shiftRelations.map((rel) => ({
              id: rel.shift.id,
              name: rel.shift.name_en,
              startTime: rel.shift.start_time,
              endTime: rel.shift.end_time,
            }));

            const capacityRes = await getTrainingBatchCapacity(String(batch.id));
            let capacity = null;
            let capacityError: string | undefined = undefined;
            if (capacityRes && capacityRes.success) {
              capacity = {
                total: capacityRes.effective_batch_capacity,
                occupied: capacityRes.occupied,
                available: capacityRes.available,
                utilizationPercent: capacityRes.utilization_percent,
                isFull: capacityRes.is_full,
              };
            } else {
              capacityError = capacityRes?.error || "BATCH_CAPACITY_NOT_CONFIGURED";
            }
            return {
              id: String(batch.id),
              name: (batch.name_en as string | null) ?? (batch.name_bn as string | null) ?? "Unnamed batch",
              nameBn: (batch.name_bn as string | null) ?? null,
              session: (batch.session as string | null) ?? null,
              startDate: (batch.start_date as string | null) ?? null,
              status: (batch.status as string | null) ?? null,
              shifts,
              capacity,
              capacityError,
            };
          })),
      };
    })),
  };
}

export async function createAdminEnrollment(
  input: AdminEnrollmentFormValues,
): Promise<EnrollmentActionResult> {
  const access = await requireAdmin();
  if (access.error || !access.user) {
    return { success: false, error: { code: "UNAUTHORIZED", message: errorMessage("UNAUTHORIZED") } };
  }

  const parsed = adminEnrollmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? errorMessage("VALIDATION_ERROR") } };
  }

  const values = parsed.data;
  const discountAmount = values.discountType === "percentage"
    ? (values.courseFee * values.discountValue) / 100
    : values.discountValue;

  if (values.batchId && values.status !== "cancelled" && values.status !== "suspended") {
    const capacityRes = await getTrainingBatchCapacity(values.batchId);
    if (!capacityRes || !capacityRes.success) {
      return { success: false, error: { code: "BATCH_CAPACITY_NOT_CONFIGURED", message: errorMessage("BATCH_CAPACITY_NOT_CONFIGURED") } };
    }
    if (capacityRes.is_full) {
      return { success: false, error: { code: "BATCH_FULL", message: errorMessage("BATCH_FULL") } };
    }
  }

  try {
    const admin = getAdminClient();
    const { data, error } = await admin.rpc("admin_direct_enroll", {
      p_student_id: values.studentId,
      p_course_id: values.courseId,
      p_batch_id: values.batchId || null,
      p_shift_id: values.shiftId || null,
      p_status: values.status,
      p_source: "admin",
      p_enrolled_at: values.enrollmentDate,
      p_start_date: values.startDate || null,
      p_fee_override_enabled: values.overrideCourseFee,
      p_override_course_fee: values.overrideCourseFee ? values.courseFee : null,
      p_fee_override_reason: values.feeOverrideReason || null,
      p_certificate_type: values.certificateType,
      p_discount_amount: discountAmount,
      p_discount_reason: null, // can add later if needed
      p_initial_paid: values.initialPaidAmount,
      p_payment_method: values.paymentMethod || null,
      p_payment_reference: values.transactionId || null, // mapping transaction_id to payment_reference for RPC
      p_payment_remarks: values.remarks || null,
      p_admin_id: access.user.id,
    });

    if (error) {
      console.error("admin_direct_enroll RPC failed", error);
      return { success: false, error: { code: "DATABASE_ERROR", message: errorMessage("DATABASE_ERROR") } };
    }

    if (!data?.success) {
      const code = (data?.code ?? "DATABASE_ERROR") as ActionErrorCode;
      return { success: false, error: { code, message: errorMessage(code) } };
    }

    const enrollmentId = String(data.enrollment_id);
    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${values.studentId}`);
    revalidatePath("/admin/enrollments");
    revalidatePath(`/admin/enrollments/${enrollmentId}`);
    revalidatePath("/admin");
    revalidatePath("/dashboard/courses");
    revalidatePath("/dashboard/payments");

    return {
      success: true,
      data: {
        enrollmentId,
        finalFee: Number(data.final_fee ?? 0),
        totalPaid: Number(data.total_paid ?? 0),
        currentDue: Number(data.current_due ?? 0),
      },
    };
  } catch (error) {
    console.error("Admin enrollment action exception", error);
    return { success: false, error: { code: "DATABASE_ERROR", message: errorMessage("DATABASE_ERROR") } };
  }
}

export async function getStudentEnrollmentOptions(studentId?: string): Promise<EnrollmentPaymentOption[]> {
  const access = await requireAdmin();
  if (access.error) return [];

  const admin = getAdminClient();
  let query = admin
    .from("course_enrollments")
    .select("*, course:courses(course_translations(lang, name)), batch:course_batches(name_en, name_bn), payments(amount)")
    .in("status", ["pending", "active", "suspended"])
    .order("enrolled_at", { ascending: false });
  if (studentId) query = query.eq("student_id", studentId);

  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch enrollment payment options", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const enrollment = mapEnrollment(row as Record<string, unknown>);
    return {
      id: enrollment.id,
      student_id: enrollment.student_id,
      course_name: enrollment.course_name ?? "Unnamed course",
      batch_name: enrollment.batch_name ?? null,
      status: enrollment.status,
      final_fee: enrollment.final_fee,
      total_paid: enrollment.total_paid,
      current_due: enrollment.current_due,
    };
  });
}

export async function getAdminEnrollments(): Promise<AdminEnrollmentListItem[]> {
  const access = await requireAdmin();
  if (access.error) return [];

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("course_enrollments")
    .select("*, course:courses(course_translations(lang, name), course_media(thumbnail_url)), batch:course_batches(name_en, name_bn), payments(amount), students(full_name_en, full_name_bn, mobile, student_documents(document_type, file_url))")
    .order("enrolled_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch enrollments:", error.message, error.details, error.hint);
    return [];
  }
  return (data ?? []).map((row) => {
    const enrollment = mapEnrollment(row as Record<string, unknown>);
    const student = row.students as any;
    const course = row.course as any;
    const photoDoc = (student?.student_documents || []).find((doc: any) => doc.document_type === "photo");
    const courseMedia = Array.isArray(course?.course_media) ? course.course_media[0] : course?.course_media;

    return {
      ...enrollment,
      student_name: student?.full_name_en ?? student?.full_name_bn ?? "Unknown student",
      student_mobile: student?.mobile ?? null,
      student_reg_no: enrollment.enrollment_code ?? null,
      student_photo: photoDoc?.file_url ?? null,
      course_thumbnail: courseMedia?.thumbnail_url ?? null,
    };
  });
}

export async function getAdminEnrollmentById(id: string): Promise<AdminEnrollmentListItem | null> {
  const access = await requireAdmin();
  if (access.error) return null;
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("course_enrollments")
    .select("*, course:courses(course_translations(lang, name)), batch:course_batches(name_en, name_bn), payments(*), students(full_name_en, full_name_bn, mobile)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const enrollment = mapEnrollment(data as Record<string, unknown>);
  const student = data.students as { full_name_en?: string | null; full_name_bn?: string | null; mobile?: string | null } | null;
  return {
    ...enrollment,
    student_name: student?.full_name_en ?? student?.full_name_bn ?? "Unknown student",
    student_mobile: student?.mobile ?? null,
  };
}

export async function updateAdminEnrollment(enrollmentId: string, data: any) {
  const admin = getAdminClient();
  await requireAdmin();

  try {
    const { data: enrollment, error: fetchError } = await admin
      .from("course_enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .single();

    if (fetchError || !enrollment) {
      return { error: "Enrollment not found." };
    }

    const payload: any = {};

    if (data.status) payload.status = data.status;
    if (data.batch_id !== undefined) payload.batch_id = data.batch_id || null;
    if (data.shift_id !== undefined) payload.shift_id = data.shift_id || null;
    if (data.certificate_type) payload.certificate_type = data.certificate_type;
    
    if (data.final_fee !== undefined) {
      const finalFee = Number(data.final_fee) || 0;
      payload.final_fee = finalFee;
      payload.discount_amount = Number(data.discount_amount) || 0;
      payload.current_due = finalFee - Number(enrollment.total_paid || 0);
      
      if (finalFee > 0) {
        payload.payment_progress = (Number(enrollment.total_paid || 0) / finalFee) * 100;
      } else {
        payload.payment_progress = 100;
      }
    }

    const { error: updateError } = await admin
      .from("course_enrollments")
      .update(payload)
      .eq("id", enrollmentId);

    if (updateError) {
      console.error("Failed to update enrollment:", updateError);
      return { error: updateError.message };
    }

    revalidatePath("/admin/enrollments");
    revalidatePath(`/admin/enrollments/${enrollmentId}`);
    revalidatePath(`/admin/students/${enrollment.student_id}`);
    
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
