import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  PlayCircle, Clock, Calendar, CheckCircle, AlertCircle, BookOpen, 
  TrendingUp, Award, ClipboardList, Target, Zap, MonitorPlay
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStudentDashboardStats, getStudentEnrolledCourses } from "@/lib/actions/studentData";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let studentId = user.user_metadata?.student_id;
  const studentName = user.user_metadata?.full_name || "Student";

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

  if (!studentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Complete Your Registration</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          Welcome to TechHat! To access your dashboard and courses, you need to complete your admission form first.
        </p>
        <Link 
          href="/dashboard/admission"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25"
        >
          <CheckCircle className="w-5 h-5" />
          Fill Admission Form
        </Link>
      </div>
    );
  }

  const stats = await getStudentDashboardStats(studentId);
  const enrolledCourses = await getStudentEnrolledCourses(studentId, user.id);
  const latestCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 blur-3xl rounded-full translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl font-bold border border-white/30 shadow-inner">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1 tracking-tight">Welcome back, {studentName.split(' ')[0]}! 👋</h1>
              <p className="text-blue-100 font-medium">Let's continue your learning journey.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 self-start md:self-auto shrink-0">
            <div className="text-center px-4 border-r border-white/20">
              <div className="flex items-center justify-center gap-1 text-amber-300 mb-1">
                <Zap className="w-4 h-4 fill-amber-300" />
                <span className="font-bold text-xl">{stats.streak}</span>
              </div>
              <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Day Streak</p>
            </div>
            <div className="text-center px-4">
              <div className="flex items-center justify-center gap-1 text-emerald-300 mb-1">
                <Target className="w-4 h-4" />
                <span className="font-bold text-xl">{stats.xp}</span>
              </div>
              <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">XP Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Enrolled Courses", value: stats.enrolledCourses.toString(), icon: BookOpen, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { title: "Completed Courses", value: stats.completedCourses.toString(), icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { title: "Pending Assignments", value: stats.pendingAssignments.toString(), icon: ClipboardList, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { title: "Certificates Earned", value: stats.certificatesEarned.toString(), icon: Award, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Continue Learning */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-blue-600" />
              Continue Learning
            </h2>
            <Link href="/dashboard/courses" className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">View All Courses</Link>
          </div>
          
          {latestCourse ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-56 h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 overflow-hidden relative shadow-inner">
                {latestCourse.thumbnail ? (
                  <img src={latestCourse.thumbnail} alt={latestCourse.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                    <MonitorPlay className="w-8 h-8 text-blue-400 mb-2" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-4">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">{latestCourse.code}</span>
                </div>
                <Link href={`/dashboard/courses/${latestCourse.id}`} className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
                    <PlayCircle className="w-7 h-7 text-white" />
                  </div>
                </Link>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{latestCourse.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                  <MonitorPlay className="w-4 h-4" /> {latestCourse.description || "Pick up where you left off"}
                </p>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Overall Progress</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{latestCourse.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${latestCourse.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Enrolled Courses</h3>
              <p className="text-slate-500">You are not enrolled in any courses yet.</p>
            </div>
          )}
        </div>

        {/* 4. Upcoming Schedule */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Upcoming Schedule
            </h2>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            
            <div className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer">
              <div className="w-14 h-14 shrink-0 bg-red-50 dark:bg-red-500/10 rounded-2xl flex flex-col items-center justify-center border border-red-100 dark:border-red-500/20">
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Oct</span>
                <span className="text-xl font-black text-red-700 dark:text-red-300 leading-none">12</span>
              </div>
              <div className="flex-1 justify-center flex flex-col">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">React Assignment Due</h4>
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> 11:59 PM</p>
              </div>
            </div>

            <div className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer">
              <div className="w-14 h-14 shrink-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex flex-col items-center justify-center border border-blue-100 dark:border-blue-500/20">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Oct</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300 leading-none">15</span>
              </div>
              <div className="flex-1 justify-center flex flex-col">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">Live Class: Next.js API Routes</h4>
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> 8:00 PM (Zoom)</p>
              </div>
            </div>

            <Link href="/dashboard/schedule" className="flex items-center justify-center w-full py-3 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-800">
              View Full Calendar
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

// Ensure the MonitorPlay icon is available by rendering it conditionally or wrapping it if necessary.
// I'll import it from lucide-react above (Wait, I forgot to add MonitorPlay to the top imports, I will just add it).
