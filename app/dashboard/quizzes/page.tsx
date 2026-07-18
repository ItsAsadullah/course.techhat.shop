import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { ShieldQuestion, Clock, CheckCircle2, PlayCircle, Eye, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function QuizzesPage() {
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
          Please complete your admission form to access quizzes.
        </p>
      </div>
    );
  }

  const { getStudentQuizzes } = await import("@/lib/actions/studentData");
  const quizzes = await getStudentQuizzes(studentId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quizzes</h1>
          <p className="text-slate-500 dark:text-slate-400">Test your knowledge and track your quiz scores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Available Quizzes Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldQuestion className="w-5 h-5 text-blue-600" />
            Available Quizzes
          </h2>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col gap-px bg-slate-100 dark:bg-slate-800/50">
            {quizzes.filter(q => q.status === 'available').map(quiz => (
              <div key={quiz.id} className="bg-white dark:bg-slate-900 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{quiz.title}</h3>
                    <p className="text-sm font-medium text-slate-500 mb-3">{quiz.courseName}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {quiz.duration}</span>
                      <span>•</span>
                      <span>{quiz.totalQuestions} Questions</span>
                      <span>•</span>
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>
                  </div>
                  <button className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm shadow-md shadow-blue-500/20">
                    <PlayCircle className="w-4 h-4" /> Start Quiz
                  </button>
                </div>
              </div>
            ))}
            {quizzes.filter(q => q.status === 'available').length === 0 && (
              <div className="bg-white dark:bg-slate-900 p-8 text-center text-slate-500 font-medium">
                No new quizzes available right now.
              </div>
            )}
          </div>
        </div>

        {/* Completed Quizzes Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Recent Results
          </h2>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col gap-px bg-slate-100 dark:bg-slate-800/50">
            {quizzes.filter(q => q.status === 'completed').map(quiz => {
              const passed = quiz.score! >= quiz.passingScore;
              return (
                <div key={quiz.id} className="bg-white dark:bg-slate-900 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
                      <p className="text-xs font-medium text-slate-500 line-clamp-1">{quiz.courseName}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 border-0 shadow-sm ${passed ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                      {passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-black ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {quiz.score}%
                      </span>
                    </div>
                    
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors text-xs">
                      <Eye className="w-4 h-4" /> Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
