import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { Presentation, MapPin, Users, Calendar, Megaphone, Monitor } from "lucide-react";

export default async function OfflineCoursePage() {
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
          Please complete your admission form to access offline courses.
        </p>
      </div>
    );
  }

  const { getStudentOfflineCourses } = await import("@/lib/actions/studentData");
  const { courses, notices } = await getStudentOfflineCourses(studentId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Offline Course Hub</h1>
          <p className="text-slate-500 dark:text-slate-400">Information, notice board, and class schedules for offline batches.</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <Presentation className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Offline Courses</h3>
          <p className="text-slate-500">You are not enrolled in any offline courses at the moment.</p>
        </div>
      ) : (
        courses.map((course: any) => (
          <div key={course.id} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 font-bold text-xs rounded-full uppercase tracking-wider mb-4 border border-blue-500/30">
                  <Presentation className="w-4 h-4" /> Offline Batch ({course.code})
                </div>
                <h2 className="text-3xl font-bold mb-2">{course.name}</h2>
                <p className="text-slate-300 mb-6">Master skills in our physical lab environment with hands-on practice.</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <span>{course.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span>Trainer: {course.instructor}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-blue-400" /> Lab Practice Schedule</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  The lab is open for extra practice on non-class days from 10:00 AM to 1:00 PM. Please bring your ID card for entry.
                </p>
                <div className="mt-auto">
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right font-medium">Batch Progress: {course.progress}%</p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-amber-500" /> Notice Board
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.length === 0 ? (
            <div className="col-span-full text-slate-500 text-center py-8">
              No notices right now.
            </div>
          ) : (
            notices.map((notice: any, i: number) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${notice.color === 'red' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : notice.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                    {notice.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{notice.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{notice.title}</h3>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
