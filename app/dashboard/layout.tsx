import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const studentName = user.user_metadata?.full_name || "Student";
  const email = user.email || user.phone || "";
  let avatarUrl = user.user_metadata?.avatar_url || null;

  if (user.user_metadata?.student_id && !avatarUrl) {
    const { data: photoDoc } = await supabase
      .from('student_documents')
      .select('file_url')
      .eq('student_id', user.user_metadata.student_id)
      .eq('document_type', 'photo')
      .single();
    
    if (photoDoc) {
      avatarUrl = photoDoc.file_url;
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#080818] overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar studentName={studentName} email={email} avatarUrl={avatarUrl} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-0">
        <DashboardNavbar avatarUrl={avatarUrl} studentName={studentName} />
        
        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
