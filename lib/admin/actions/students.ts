"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/admin/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Student } from "@/types/admin";

type TranslationRow = { lang: string; name?: string };
type PaymentRow = { amount?: number | string; payment_date?: string };
type MediaRow = { thumbnail_url?: string };
type EnrollmentRow = { 
  status?: string; 
  final_fee?: number | string; 
  total_paid?: number | string;
  payments?: PaymentRow[]; 
  course?: { course_translations?: TranslationRow[]; course_media?: MediaRow | MediaRow[]; course_type?: string }; 
  batch?: { name_en?: string; name_bn?: string; session?: string };
  shift?: { name_en?: string };
  course_name?: string;
};
type DocRow = { document_type?: string; file_url?: string };
type StudentRow = {
  id: string;
  student_code?: string;
  full_name_en?: string;
  full_name_bn?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  created_at?: string;
  admission_date?: string;
  guardians?: { name?: string; occupation?: string }[];
  student_documents?: DocRow[];
  course_enrollments?: EnrollmentRow[];
  payments?: PaymentRow[];
  student_addresses?: { address_type?: string; division?: string; district?: string; upazila?: string; union_municipality?: string; village?: string; post_office?: string; post_code?: string }[];
};

// ── Helper: get admin client (bypasses RLS) ───────────────────
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Get all students (unified) ────────────────────────────────
export async function getStudents(filters?: { search?: string, gender?: string, status?: string }) {
  const supabaseAdmin = getAdminClient();
  const search = filters?.search;

  let query = supabaseAdmin
    .from("students")
    .select("*, guardians(name), student_documents(document_type, file_url), course_enrollments(status, final_fee, payments(amount), course:courses(course_translations(lang, name), course_media(thumbnail_url)), batch:course_batches(name_en, name_bn))")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `full_name_en.ilike.%${search}%,full_name_bn.ilike.%${search}%,mobile.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  if (filters?.gender && filters.gender !== "all") {
    query = query.ilike("gender", filters.gender);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch students:", error);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }

  let students = (data || []).map((student: StudentRow) => {
    const enrollments = student.course_enrollments || [];
    const totalFee = enrollments.reduce((sum: number, enrollment: EnrollmentRow) => sum + Number(enrollment.final_fee || 0), 0);
    const totalPaid = enrollments.reduce((sum: number, enrollment: EnrollmentRow) => sum + (enrollment.payments || []).reduce((paymentSum: number, payment: PaymentRow) => paymentSum + Number(payment.amount || 0), 0), 0);
    const activeEnrollment = enrollments.find((enrollment: EnrollmentRow) => enrollment.status === "active") || enrollments[0];
    const translations = activeEnrollment?.course?.course_translations || [];
    const courseName = translations.find((translation: TranslationRow) => translation.lang === "en")?.name || translations.find((translation: TranslationRow) => translation.lang === "bn")?.name || null;
    const batchName = activeEnrollment?.batch?.name_en || activeEnrollment?.batch?.name_bn || null;
    const guardianName = student.guardians?.[0]?.name || null;
    const photoDoc = (student.student_documents || []).find((doc: DocRow) => doc.document_type === "photo");

    const courseMedia = Array.isArray(activeEnrollment?.course?.course_media) 
      ? activeEnrollment.course.course_media[0] 
      : activeEnrollment?.course?.course_media;
    const thumbnail = courseMedia?.thumbnail_url || null;

    return {
      id: student.id,
      student_id: student.student_code,
      name: student.full_name_en || student.full_name_bn || "Unknown",
      phone: student.mobile,
      full_name_en: student.full_name_en,
      full_name_bn: student.full_name_bn,
      mobile: student.mobile,
      email: student.email,
      gender: student.gender,
      guardian_name: guardianName,
      admission_date: student.admission_date || student.created_at,
      total_course_fee: totalFee,
      total_paid: totalPaid,
      current_due: Math.max(totalFee - totalPaid, 0),
      course: courseName ? { name: courseName, thumbnail } : null,
      batch_name: batchName,
      status: activeEnrollment?.status || 'inactive',
      created_at: student.created_at,
      photo_url: photoDoc?.file_url || null,
    };
  });

  if (filters?.status && filters.status !== "all") {
    students = students.filter(s => s.status === filters.status);
  }

  return students as Student[];
}

// ── Get student by ID (with all deep relations) ──────────────
export async function getStudentById(id: string) {
  const supabaseAdmin = getAdminClient();

  const { data: student, error } = await supabaseAdmin
    .from("students")
    .select(`
      *,
      student_addresses(*),
      guardians(*),
      student_education(*),
      student_documents(*),
      payments(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch student:", error);
    return null;
  }

  if (!student) {
    return null;
  }

  const { data: enrollmentRows, error: enrollmentError } = await supabaseAdmin
    .from("course_enrollments")
    .select("*, course:courses(course_translations(lang, name), course_type), batch:course_batches(name_en, name_bn, session), shift:training_shifts(name_en), payments(*)")
    .eq("student_id", id)
    .order("enrolled_at", { ascending: false });

  if (enrollmentError) console.error("Failed to fetch student enrollments:", enrollmentError);

  const enrollments = (enrollmentRows || []).map((enrollment: EnrollmentRow) => {
    const enrolledPayments = enrollment.payments || [];
    const enrollmentPaid = enrolledPayments.reduce((sum: number, payment: PaymentRow) => sum + Number(payment.amount || 0), 0);
    const finalFee = Number(enrollment.final_fee || 0);
    const translations = enrollment.course?.course_translations || [];
    const name = translations.find((translation: TranslationRow) => translation.lang === "en")?.name || translations.find((translation: TranslationRow) => translation.lang === "bn")?.name || "Unnamed course";
    return {
      ...enrollment,
      course_name: name,
      batch_name: enrollment.batch?.name_en || enrollment.batch?.name_bn || null,
      total_paid: enrollmentPaid,
      current_due: Math.max(finalFee - enrollmentPaid, 0),
      payment_progress: finalFee > 0 ? Math.min((enrollmentPaid / finalFee) * 100, 100) : 100,
    };
  });

  const totalCourseFee = enrollments.reduce((sum: number, enrollment: EnrollmentRow) => sum + Number(enrollment.final_fee || 0), 0);
  const totalPaid = enrollments.reduce((sum: number, enrollment: EnrollmentRow) => sum + Number(enrollment.total_paid || 0), 0);
  const allPayments = (student.payments || []).sort(
    (a: PaymentRow, b: PaymentRow) => new Date(b.payment_date || 0).getTime() - new Date(a.payment_date || 0).getTime(),
  );
  const firstEnrollment = enrollments.find((enrollment: EnrollmentRow) => enrollment.status === "active") || enrollments[0];

  return {
    id: student.id,
    student_id: student.student_code,
    student_code: student.student_code,
    name: student.full_name_en || student.full_name_bn || "Unknown",
    phone: student.mobile,
    address: student.email || "",
    admission_date: student.admission_date || student.created_at,
    total_course_fee: totalCourseFee,
    total_paid: totalPaid,
    current_due: Math.max(totalCourseFee - totalPaid, 0),
    course: firstEnrollment ? { name: firstEnrollment.course_name } : null,
    payments: allPayments,
    enrollments,
    financial_summary: {
      total_enrollment_fees: totalCourseFee,
      total_paid: totalPaid,
      current_due: Math.max(totalCourseFee - totalPaid, 0),
      payment_progress: totalCourseFee > 0 ? Math.min((totalPaid / totalCourseFee) * 100, 100) : 100,
      active_enrollment_count: enrollments.filter((enrollment: EnrollmentRow) => enrollment.status === "active").length,
    },
    // Pass the full student record for deep details view
    raw_data: student,
  } as unknown as Student;
}

// ── Get raw student for edit (deep relations) ─────────────────
export async function getRawStudentForEdit(id: string) {
  const supabaseAdmin = getAdminClient();

  const { data: student } = await supabaseAdmin
    .from("students")
    .select(`
      *,
      admissions(*),
      student_addresses(*),
      student_education(*),
      guardians(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (!student) return null;

  const presentAddr = (student as StudentRow).student_addresses?.find((a) => a.address_type === "present") || {};
  const firstGuardian = (student as StudentRow).guardians?.[0] || {};

  return {
    ...student,
    present_division: presentAddr.division,
    present_district: presentAddr.district,
    present_upazila: presentAddr.upazila,
    present_union: presentAddr.union_municipality,
    present_village: presentAddr.village,
    present_post_office: presentAddr.post_office,
    present_post_code: presentAddr.post_code,
    guardian_name: firstGuardian.name,
    guardian_occupation: firstGuardian.occupation,
  };
}

// ── Create student (from admin panel) ─────────────────────────
export async function createStudent(formData: FormData) {
  const supabaseAdmin = getAdminClient();

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = (formData.get("address") as string) || null;
  const courseId = (formData.get("course_id") as string) || null;
  const admissionDate = (formData.get("admission_date") as string) || new Date().toISOString().split("T")[0];
  const totalCourseFee = Number(formData.get("total_course_fee") || 0);

  if (!name || !phone) {
    return { error: "Name and phone are required." };
  }

  // Check for duplicate mobile
  const { data: existing } = await supabaseAdmin
    .from("students")
    .select("id")
    .eq("mobile", phone)
    .maybeSingle();

  if (existing) {
    return { error: `A student with mobile ${phone} already exists.` };
  }

  // 1. Insert into students table
  const { data: student, error } = await supabaseAdmin
    .from("students")
    .insert({
      full_name_en: name,
      mobile: phone,
      total_course_fee: totalCourseFee,
      admission_date: admissionDate,
    })
    .select()
    .single();

  if (error) {
    return { error: `Failed to create student: ${error.message}` };
  }

  // 2. Create Supabase Auth user with default password
  const userEmail = `${phone}@student.techhat.local`;
  let formattedPhone = phone.trim();
  if (formattedPhone.startsWith("01") && formattedPhone.length === 11) {
    formattedPhone = "+88" + formattedPhone;
  } else if (formattedPhone.startsWith("8801")) {
    formattedPhone = "+" + formattedPhone;
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: userEmail,
    phone: formattedPhone,
    password: "Abc@1234",
    email_confirm: true,
    phone_confirm: true,
    user_metadata: {
      full_name: name,
      student_id: student.id,
      student_code: student.student_code,
      role: "student",
    },
  });

  if (authError) {
    console.error("Auth user creation failed (non-fatal):", authError);
  } else if (authData?.user) {
    // Link user_id to student record
    await supabaseAdmin
      .from("students")
      .update({ user_id: authData.user.id })
      .eq("id", student.id);
  }

  // 3. If course selected, create an order
  if (courseId) {
    // We'll just store the fee for now. Course enrollment can be handled separately.
    // The admin can assign courses through the order system later.
  }

  revalidatePath("/admin/students");
  redirect("/admin/students");
}

// ── Update student ────────────────────────────────────────────
export async function updateStudent(id: string, formData: FormData) {
  const supabaseAdmin = getAdminClient();

  const rawData: Record<string, string | number> = {
    full_name_en: formData.get("name") as string,
    mobile: formData.get("phone") as string,
    total_course_fee: Number(formData.get("total_course_fee") || 0),
  };

  const admissionDate = formData.get("admission_date") as string;
  if (admissionDate) {
    rawData.admission_date = admissionDate;
  }

  if (!rawData.full_name_en || !rawData.mobile) {
    return { error: "Name and phone are required." };
  }

  // Check for duplicate mobile (excluding self)
  const { data: existing } = await supabaseAdmin
    .from("students")
    .select("id")
    .eq("mobile", rawData.mobile)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return { error: `Another student with mobile ${rawData.mobile} already exists.` };
  }

  const { error } = await supabaseAdmin
    .from("students")
    .update(rawData)
    .eq("id", id);

  if (error) {
    return { error: `Failed to update student: ${error.message}` };
  }

  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${id}`);
  revalidatePath("/dashboard/profile");
  redirect("/admin/students");
}

// ── Delete student ────────────────────────────────────────────
export async function deleteStudent(id: string) {
  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin
    .from("students")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: `Failed to delete student: ${error.message}` };
  }

  revalidatePath("/admin/students");
  return { success: true };
}
