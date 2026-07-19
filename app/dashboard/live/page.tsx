import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { MonitorPlay, Video, Clock, Users, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface LiveClass {
  platform: string;
  topic: string;
  courseName: string;
  time: string;
  trainer: string;
  joinLink?: string;
}

interface Recording {
  id: string;
  title: string;
  date: string;
}

export default async function LiveClassesPage() {
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
          Please complete your admission form to access live classes.
        </p>
      </div>
    );
  }

  const { getStudentLiveClasses } = await import("@/lib/actions/studentData");
  const { upcomingClasses, recordings } = await getStudentLiveClasses(studentId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Live Classes</h1>
          <p className="text-slate-500 dark:text-slate-400">Join your upcoming live online sessions via Zoom/Meet.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MonitorPlay className="w-6 h-6 text-blue-600" /> Upcoming Sessions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingClasses.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <MonitorPlay className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Live Classes</h3>
              <p className="text-slate-500">You don't have any upcoming live classes scheduled at this time.</p>
            </div>
          ) : (
            upcomingClasses.map((cls: LiveClass, i: number) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                {i === 0 && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-bl-2xl">
                    Starting Soon
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-6 mt-2">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <Video className="w-7 h-7" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Platform</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{cls.platform}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cls.topic}</h3>
                <p className="text-sm font-semibold text-slate-500 mb-6">{cls.courseName}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Time</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{cls.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Trainer</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{cls.trainer}</p>
                    </div>
                  </div>
                </div>
                
                <a 
                  href={cls.joinLink}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${
                    i === 0 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Join Class <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Previous Recordings
        </h2>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col gap-px bg-slate-100 dark:bg-slate-800/50">
          {recordings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 text-center text-slate-500 font-medium">
              No previous recordings available.
            </div>
          ) : (
            recordings.map((rec: Recording) => (
              <div key={rec.id} className="bg-white dark:bg-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">{rec.title}</h4>
                  <p className="text-sm text-slate-500">{rec.date}</p>
                </div>
                <button className="shrink-0 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
                  <MonitorPlay className="w-4 h-4" /> Watch Recording
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
