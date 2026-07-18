import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  PlayCircle, BookOpen, Clock, Award, CheckCircle, 
  Search, Filter, MonitorPlay, FastForward
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStudentEnrolledCourses } from "@/lib/actions/studentData";

export default async function MyCoursesPage() {
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
          Please complete your admission form to access your courses.
        </p>
        <Link 
          href="/dashboard/admission"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
        >
          Fill Admission Form
        </Link>
      </div>
    );
  }

  const enrolledCourses = await getStudentEnrolledCourses(studentId, user.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            My Learning Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Continue where you left off and track your progress.</p>
        </div>
        
        {/* Filters / Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button className="px-6 py-3 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold text-sm">
          In Progress ({enrolledCourses.filter(c => c.progress < 100).length})
        </button>
        <button className="px-6 py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-sm transition-colors">
          Completed ({enrolledCourses.filter(c => c.progress === 100).length})
        </button>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        {enrolledCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Courses Found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">You are not enrolled in any courses yet. Once you enroll, your courses will appear here.</p>
            <Link href="/courses" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">Browse Courses</Link>
          </div>
        ) : (
          enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col md:flex-row">
              
              {/* Thumbnail Area */}
              <div className="md:w-72 lg:w-80 bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10 min-h-[200px]">
                    <MonitorPlay className="w-12 h-12 text-blue-300 dark:text-blue-700/50 mb-2" />
                    <span className="text-blue-400 dark:text-blue-600 font-bold uppercase tracking-widest text-xs">Video Course</span>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-white/90 text-slate-900 backdrop-blur-sm border-none font-bold shadow-sm">
                    {course.code}
                  </Badge>
                  {course.progress === 100 && (
                    <Badge className="bg-emerald-500 text-white border-none font-bold shadow-sm">
                      <CheckCircle className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                  )}
                  {course.status !== 'approved' && (
                    <Badge className="bg-amber-500 text-white border-none font-bold shadow-sm">
                      Pending Payment
                    </Badge>
                  )}
                </div>
                
                {course.progress < 100 && course.status === 'approved' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <Link href={`/dashboard/courses/${course.id}`} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-blue-600 ml-1" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center relative">
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.name}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 max-w-2xl">
                      {course.description || "Course description will be available soon."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-2 mb-8">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <MonitorPlay className="w-4 h-4 text-indigo-500" />
                    <span>{course.type === 'offline' ? 'Offline Class' : 'Online Course'}</span>
                  </div>
                </div>

                {/* Progress Bar & Actions */}
                <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="flex-1 w-full">
                    {course.status === 'approved' ? (
                      <>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Course Progress</span>
                          <span className="text-lg font-black text-blue-600 dark:text-blue-400">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} 
                            style={{ width: `${course.progress}%` }} 
                          />
                        </div>
                      </>
                    ) : (
                      <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-3 rounded-xl text-sm font-medium border border-amber-200 dark:border-amber-800/50">
                        Please complete your payment to access this course.
                      </div>
                    )}
                  </div>
                  
                  {course.status !== 'approved' ? (
                    <Link 
                      href="/dashboard/payments"
                      className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
                    >
                      Pay Now
                    </Link>
                  ) : (
                    <Link 
                      href={`/dashboard/courses/${course.id}`}
                      className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                        course.progress === 100 
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 shadow-none'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                      }`}
                    >
                      {course.progress === 100 ? (
                        <>Review Course</>
                      ) : course.progress === 0 ? (
                        <>Start Course <PlayCircle className="w-4 h-4" /></>
                      ) : (
                        <>Resume Learning <FastForward className="w-4 h-4" /></>
                      )}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
