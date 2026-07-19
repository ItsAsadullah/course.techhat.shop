import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AttendancePage() {
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
          Please complete your admission form to access attendance records.
        </p>
      </div>
    );
  }

  const { getStudentAttendance } = await import("@/lib/actions/studentData");
  const { overallAttendance, presentDays, absentDays, lateDays, records } = await getStudentAttendance(studentId);

  // Generate a calendar grid for the current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonthTotal = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthTotal }, (_, i) => i + 1);
  
  // Find offset for first day
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const offsetArray = Array.from({ length: firstDay }, (_, i) => i);

  const getStatus = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = records.find((r: Record<string, unknown>) => r.date === dateStr);
    
    if (record) return record.status;
    
    // Check if it's in the future
    const dayDate = new Date(currentYear, currentMonth, day);
    if (dayDate > currentDate) return 'upcoming';
    
    // Check if it's weekend
    if (dayDate.getDay() === 5 || dayDate.getDay() === 6) return 'weekend'; // Assuming Friday/Saturday weekend in BD
    
    return 'none';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Attendance Record</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your offline and live class attendance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <p className="text-blue-100 font-medium mb-2">Overall Rate</p>
          <h2 className="text-4xl font-black">{overallAttendance}%</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{presentDays}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Present</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{absentDays}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Absent</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{lateDays}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Late</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-slate-400" /> {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Absent</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 md:gap-4 text-center mb-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {/* Empty slots for offset */}
            {offsetArray.map((_, i) => (
              <div key={`offset-${i}`} className="aspect-square"></div>
            ))}
            
            {daysInMonth.map(day => {
              const status = getStatus(day);
              return (
                <div 
                  key={day} 
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 md:p-2 border-2 transition-transform hover:scale-105 cursor-default ${
                    status === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
                    status === 'absent' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400' :
                    status === 'weekend' ? 'bg-slate-50 border-transparent text-slate-400 dark:bg-slate-800/50' :
                    'bg-white border-slate-100 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  <span className="text-lg md:text-xl font-bold">{day}</span>
                  {status === 'present' && <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 mt-1" />}
                  {status === 'absent' && <XCircle className="w-3 h-3 md:w-4 md:h-4 mt-1" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
