import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, Phone, Lock, CheckCircle2, ShieldCheck } from "lucide-react";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch student info to prefill
  const studentId = user.user_metadata?.student_id;
  let studentData = null;

  if (studentId) {
    const { data } = await supabase
      .from("students")
      .select("full_name_en, mobile, email")
      .eq("id", studentId)
      .single();
    
    studentData = data;
  }

  const initialData = {
    name: studentData?.full_name_en || user.user_metadata?.full_name || "",
    email: studentData?.email || user.email || "",
    mobile: studentData?.mobile || user.phone || "",
    userId: user.id,
    studentId: studentId || "",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account details and security</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Verification Status Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border-b border-emerald-100 dark:border-emerald-500/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Account Verified</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Your profile and contact information are fully verified.</p>
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500 opacity-50" />
        </div>

        <div className="p-6 md:p-8">
          <SettingsForm initialData={initialData} />
        </div>
      </div>
    </div>
  );
}
