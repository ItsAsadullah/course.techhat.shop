import AdmissionForm from "@/components/admission/AdmissionForm";
import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardAdmissionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let studentId = user.user_metadata?.student_id;
  let initialData = null;

  // Force-fetch fresh metadata to bypass stale JWT cookies
  try {
    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: adminUser } = await supabaseAdmin.auth.admin.getUserById(user.id);
    if (adminUser?.user?.user_metadata?.student_id) {
      studentId = adminUser.user.user_metadata.student_id;
    }
  } catch (err) {
    console.error("Error fetching fresh user metadata", err);
  }

  // Fallback: Check if there's a student record with matching email or phone
  if (!studentId) {
    const { data: matchedStudent } = await supabase
      .from("students")
      .select("id")
      .or(`email.eq.${user.email},mobile.eq.${user.phone?.replace('+88', '')},mobile.eq.${user.phone}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (matchedStudent) {
      studentId = matchedStudent.id;
    }
  }

  if (studentId) {
    const { data: rawStudent } = await supabase
      .from("students")
      .select("*, admissions(*), student_addresses(*), guardians(*), student_documents(*), student_education(*)")
      .eq("id", studentId)
      .single();
    
    if (rawStudent) {
      const presentAddr = rawStudent.student_addresses?.find((a: Record<string, unknown>) => a.address_type === "present") || {};
      const permanentAddr = rawStudent.student_addresses?.find((a: Record<string, unknown>) => a.address_type === "permanent") || {};
      
      initialData = {
        ...rawStudent,
        present_division: presentAddr.division,
        present_district: presentAddr.district,
        present_upazila: presentAddr.upazila,
        present_union: presentAddr.union_municipality,
        present_village: presentAddr.village,
        present_post_office: presentAddr.post_office,
        present_post_code: presentAddr.post_code,
        permanent_division: permanentAddr.division,
        permanent_district: permanentAddr.district,
        permanent_upazila: permanentAddr.upazila,
        permanent_village: permanentAddr.village,
        permanent_post_code: permanentAddr.post_code,
      };
    }
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto py-6 sm:py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {initialData ? "Edit Your Profile" : "Complete Your Admission"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {initialData ? "Update your personal and academic information below." : "Fill out the form below to complete your admission and access your courses."}
        </p>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 md:p-8">
        <AdmissionForm initialData={initialData} />
      </div>
    </div>
  );
}
