import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { ClipboardList, Clock, CheckCircle2, AlertCircle, FileText, UploadCloud, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  courseName: string;
  status: 'pending' | 'submitted' | 'graded';
  marks?: number;
  totalMarks: number;
}

export default async function AssignmentsPage() {
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
          Please complete your admission form to access assignments.
        </p>
      </div>
    );
  }

  const { getStudentAssignments } = await import("@/lib/actions/studentData");
  const assignments = await getStudentAssignments(studentId);

  const pendingCount = assignments.filter((a: Assignment) => a.status === 'pending').length;
  const submittedCount = assignments.filter((a: Assignment) => a.status === 'submitted').length;
  const gradedCount = assignments.filter((a: Assignment) => a.status === 'graded').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Assignments</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and submit your coursework assignments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{pendingCount}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pending</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{submittedCount}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Submitted</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{gradedCount}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Graded</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl w-max border border-slate-200/50 dark:border-slate-800/50">
        <button className="px-5 py-2 text-sm font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-sm">Pending</button>
        <button className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Submitted</button>
        <button className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Graded</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-3xl">Assignment details</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Marks</th>
                <th className="px-6 py-4 text-right rounded-tr-3xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Assignments Found</h3>
                    <p className="text-slate-500">You don't have any assignments yet.</p>
                  </td>
                </tr>
              ) : (
                assignments.map((assignment: Assignment) => (
                  <tr key={assignment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900 dark:text-white text-base mb-1">{assignment.title}</p>
                      <p className="text-xs flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> Due: {assignment.dueDate}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="line-clamp-2 max-w-[200px]">{assignment.courseName}</span>
                    </td>
                    <td className="px-6 py-5">
                      {assignment.status === 'pending' && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">Pending</Badge>}
                      {assignment.status === 'submitted' && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">Submitted</Badge>}
                      {assignment.status === 'graded' && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Graded</Badge>}
                    </td>
                    <td className="px-6 py-5">
                      {assignment.marks ? (
                        <span className="font-bold text-slate-900 dark:text-white">{assignment.marks} <span className="text-slate-400 text-xs font-normal">/ {assignment.totalMarks}</span></span>
                      ) : (
                        <span className="text-slate-400">- / {assignment.totalMarks}</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {assignment.status === 'pending' && (
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs">
                          <UploadCloud className="w-4 h-4" /> Submit
                        </button>
                      )}
                      {(assignment.status === 'submitted' || assignment.status === 'graded') && (
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors text-xs">
                          <Eye className="w-4 h-4" /> View
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
