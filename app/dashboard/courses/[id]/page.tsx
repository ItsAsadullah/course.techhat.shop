import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  PlayCircle, Clock, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, 
  MessageSquare, FileText, Download, Menu, MonitorPlay, FastForward
} from "lucide-react";
import { getCoursePlayerDetails } from "@/lib/actions/studentData";

type Lesson = {
  id: string;
  title: string;
  type: string;
  duration: string;
  completed: boolean;
  current?: boolean;
  locked?: boolean;
  videoUrl?: string;
  content?: string;
};

type Module = {
  module: string;
  lessons: Lesson[];
};

export default async function CoursePlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

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

  const { course, modules, completedLessonIds } = await getCoursePlayerDetails(studentId, id);

  // Map database modules to playlist format
  let totalLessons = 0;
  const playlist: Module[] = modules.map((mod: Record<string, unknown>) => {
    return {
      module: mod.title_en as string,
      lessons: (mod.course_lessons as Record<string, unknown>[])?.sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.sort_order as number) - (b.sort_order as number)).map((lesson: Record<string, unknown>) => {
        totalLessons++;
        return {
          id: lesson.id as string,
          title: lesson.title_en as string,
          type: lesson.lesson_type as string,
          duration: `${lesson.duration_minutes} mins`,
          completed: completedLessonIds.includes(lesson.id as string),
          current: false, // We'll set the first incomplete as current later if needed
          videoUrl: lesson.video_url as string | undefined,
          content: lesson.content as string | undefined
        };
      }) || []
    };
  });

  // Calculate Progress
  course.progress = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

  // Find current lesson (first incomplete)
  let currentLesson = playlist.flatMap(m => m.lessons).find(l => !l.completed);
  if (!currentLesson && playlist.length > 0 && playlist[0].lessons.length > 0) {
    currentLesson = playlist[0].lessons[0]; // fallback to first
  }
  
  if (currentLesson) {
    currentLesson.current = true;
  } else {
    // If no lessons exist at all
    currentLesson = {
      id: "placeholder",
      title: "No lessons available yet",
      type: "video",
      duration: "0 mins",
      completed: false
    };
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8rem)]">
      
      {/* Main Content Area (Player + Tabs) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Video Player Header (Breadcrumb) */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/courses" className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white line-clamp-1">{course.name}</h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Module 2 • Lesson 1</p>
            </div>
          </div>
        </div>

        {/* The Player Area */}
        <div className="aspect-video bg-black shrink-0 relative group">
          {/* Mock Video Element */}
          <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
            <img src="/images/placeholder-course.jpg" alt="Video cover" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-blue-600/90 hover:bg-blue-600 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110 shadow-2xl">
                <PlayCircle className="w-10 h-10 ml-1" />
              </button>
            </div>
            
            {/* Custom Fake Controls */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer">
                <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between text-white text-xs font-medium">
                <div className="flex items-center gap-4">
                  <PlayCircle className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                  <span>06:15 / {currentLesson.duration}</span>
                </div>
                <div className="flex items-center gap-4">
                  <FastForward className="w-4 h-4 cursor-pointer hover:text-blue-400" />
                  <MonitorPlay className="w-4 h-4 cursor-pointer hover:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info & Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 shrink-0 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{currentLesson.title}</h1>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {currentLesson.duration}</span>
                  <span>•</span>
                  <span>Instructor: {course.instructor}</span>
                </div>
              </div>
              
              <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                <CheckCircle2 className="w-5 h-5" /> Mark Complete
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 px-4 py-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar shrink-0">
            <button className="px-5 py-2.5 text-sm font-bold border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 whitespace-nowrap">Overview</button>
            <button className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors whitespace-nowrap">Notes</button>
            <button className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors whitespace-nowrap">Resources (2)</button>
            <button className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent transition-colors whitespace-nowrap">Q&A</button>
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>In this lesson, we will dive deep into Server Actions in Next.js 15. Server Actions allow you to mutate data on the server without creating a separate API route. They are built on top of React Actions and deeply integrated with the Next.js App Router.</p>
              <h3>What you will learn:</h3>
              <ul>
                <li>How to define Server Actions</li>
                <li>Invoking actions from Client Components</li>
                <li>Handling loading states with <code>useFormStatus</code></li>
                <li>Error handling and revalidating paths</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="lg:w-96 shrink-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px] lg:h-auto">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Course Content</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
            <span className="text-xs font-bold text-slate-500">{course.progress}%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {playlist.map((mod, idx) => (
            <div key={idx} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800/50">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{mod.module}</h4>
                <p className="text-xs font-medium text-slate-500 mt-1">{mod.lessons.length} lessons</p>
              </div>
              <div className="flex flex-col">
                {mod.lessons.map((lesson) => (
                  <button 
                    key={lesson.id} 
                    className={`flex items-start gap-3 p-4 transition-colors text-left ${lesson.current ? 'bg-blue-50/50 dark:bg-blue-500/5 relative' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    {lesson.current && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                    )}
                    
                    <div className="mt-0.5 shrink-0">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : lesson.current ? (
                        <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className={`text-sm font-semibold mb-1 line-clamp-2 ${lesson.current ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {lesson.title}
                      </h5>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        {lesson.type === 'video' && <PlayCircle className="w-3.5 h-3.5" />}
                        {lesson.type === 'document' && <FileText className="w-3.5 h-3.5" />}
                        {lesson.type === 'quiz' && <BookOpen className="w-3.5 h-3.5" />}
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
