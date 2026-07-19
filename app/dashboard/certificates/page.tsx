import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { Award, Download, Share2, CheckCircle2, ShieldCheck, Lock } from "lucide-react";

interface Certificate {
  courseName: string;
  status: 'issued' | 'locked';
  issueDate?: string;
  grade?: string;
  progress?: number;
}

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const studentId = user.user_metadata?.student_id;
  
  if (!studentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Profile Incomplete</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          Please complete your admission form to access certificates.
        </p>
      </div>
    );
  }

  const { getStudentCertificates } = await import("@/lib/actions/studentData");
  const certificates = await getStudentCertificates(studentId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Certificates</h1>
          <p className="text-slate-500 dark:text-slate-400">View, download, and share your verified certificates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Certificates Found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't earned any certificates yet. Complete your courses to unlock them.</p>
          </div>
        ) : (
          (certificates as Certificate[]).map((cert: Certificate, idx: number) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group">
            
            {/* Certificate Preview */}
            <div className={`aspect-[1.414/1] relative overflow-hidden shrink-0 flex items-center justify-center p-6 ${cert.status === 'locked' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10'}`}>
              
              {cert.status === 'issued' ? (
                <>
                  <div className="absolute inset-4 border-2 border-amber-200/50 dark:border-amber-500/20 rounded-xl pointer-events-none" />
                  <div className="absolute inset-6 border border-amber-200/30 dark:border-amber-500/10 rounded-lg pointer-events-none" />
                  
                  <div className="text-center relative z-10 w-full">
                    <Award className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-1">Certificate of Completion</h3>
                    <p className="text-xs text-slate-500 mb-4">{user.user_metadata?.full_name}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2">{cert.courseName}</p>
                  </div>
                </>
              ) : (
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-500">Certificate Locked</p>
                  <p className="text-xs text-slate-400 mt-1">Complete {100 - (cert.progress || 0)}% more to unlock</p>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2">{cert.courseName}</h4>
              
              {cert.status === 'issued' ? (
                <div className="space-y-4 mt-auto">
                  <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <div>
                      <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Issued On</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{cert.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Grade</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{cert.grade}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm">
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button className="flex items-center justify-center gap-2 p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-xl transition-colors tooltip-trigger" title="Share via Link">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-slate-500">Course Progress</span>
                    <span className="font-black text-slate-700 dark:text-slate-300">{cert.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-400 dark:bg-slate-500 h-full rounded-full" style={{ width: `${cert.progress}%` }} />
                  </div>
                </div>
              )}
            </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
