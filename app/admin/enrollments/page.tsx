import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnrollmentActions } from "@/components/admin/enrollments/EnrollmentActions";
import { getAdminEnrollments } from "@/lib/admin/actions/enrollments";
import { GraduationCap, CheckCircle2, Banknote, Clock, Search, X, Plus, Layers } from "lucide-react";

function money(value: number) { 
  return value.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); 
}

function moneyShort(value: number) { 
  return value.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); 
}

export default async function AdminEnrollmentsPage({ searchParams }: { searchParams: Promise<{ search?: string; status?: string }> }) {
  const { search, status } = await searchParams;
  const allEnrollments = await getAdminEnrollments();

  const totalEnrollments = allEnrollments.length;
  const activeEnrollments = allEnrollments.filter(e => e.status === "active").length;
  const totalRevenue = allEnrollments.reduce((sum, e) => sum + Number(e.total_paid || 0), 0);
  const totalDue = allEnrollments.reduce((sum, e) => sum + Number(e.current_due || 0), 0);

  let filtered = allEnrollments;
  if (status) {
    filtered = filtered.filter(e => e.status === status);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(e => 
      e.student_name?.toLowerCase().includes(s) || 
      e.student_mobile?.includes(s) || 
      e.course_name?.toLowerCase().includes(s) ||
      (e as any).enrollment_code?.toLowerCase().includes(s)
    );
  }

  const hasFilters = !!(search || status);

  const stats = [
    {
      label: "মোট ভর্তি",
      value: totalEnrollments,
      icon: GraduationCap,
      gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/30",
    },
    {
      label: "অ্যাক্টিভ স্টুডেন্ট",
      value: activeEnrollments,
      icon: CheckCircle2,
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/30",
    },
    {
      label: "মোট আদায়",
      value: `৳${moneyShort(totalRevenue)}`,
      icon: Banknote,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/30",
    },
    {
      label: "মোট বকেয়া",
      value: `৳${moneyShort(totalDue)}`,
      icon: Clock,
      gradient: "bg-gradient-to-br from-rose-500 to-red-600",
      shadow: "shadow-rose-500/30",
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-1 sm:px-2 pb-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, gradient, shadow }) => (
          <div
            key={label}
            className={`group relative overflow-hidden rounded-2xl ${gradient} p-4 shadow-lg ${shadow} transition-all hover:-translate-y-1 hover:shadow-xl sm:p-5 text-white`}
          >
            <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm ring-1 ring-white/30">
                <Icon className="h-6 w-6 drop-shadow-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-3xl font-bold leading-none tracking-tight drop-shadow-sm">
                  {value}
                </p>
                <p className="mt-1.5 truncate text-sm font-medium text-white/90">
                  {label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Toolbar */}
      <form className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="search"
            defaultValue={search || ""}
            placeholder="স্টুডেন্ট, কোর্স বা ফোন নম্বর খুঁজুন…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
          />
        </div>
        <select
          name="status"
          defaultValue={status || ""}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">সব স্ট্যাটাস</option>
          <option value="active">অ্যাক্টিভ</option>
          <option value="completed">কমপ্লিটেড</option>
          <option value="pending">পেন্ডিং</option>
          <option value="cancelled">ক্যান্সেলড</option>
          <option value="dropped">ড্রপআউট</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Search className="h-4 w-4" /> ফিল্টার
          </button>
          {hasFilters && (
            <Link
              href="/admin/enrollments"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" /> ক্লিয়ার
            </Link>
          )}
          <Link
            href="/admin/enrollments/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> নতুন ইনরোলমেন্ট
          </Link>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Course Fee</th>
                <th className="px-5 py-3 text-right">Fee Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                filtered.map((enrollment: any) => {
                  const feeProgress = enrollment.final_fee > 0 ? (enrollment.total_paid / enrollment.final_fee) * 100 : 0;
                  
                  return (
                  <tr key={enrollment.id} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                          {enrollment.student_photo && (
                            <AvatarImage src={enrollment.student_photo} alt={enrollment.student_name} className="object-cover" />
                          )}
                          <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-sm">
                            {(enrollment.student_name || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {enrollment.student_name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                            <span>{enrollment.student_mobile || "No mobile"}</span>
                            {enrollment.student_reg_no && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="font-mono text-[10px]">{enrollment.student_reg_no}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200">
                          {enrollment.course_thumbnail ? (
                            <img src={enrollment.course_thumbnail} alt={enrollment.course_name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                              <Layers className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{enrollment.course_name}</p>
                          <p className="mt-0.5 text-xs text-slate-500 truncate">{enrollment.batch_name || "No batch"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <Badge variant="outline" className="capitalize text-[10px] font-semibold tracking-wide">
                          {enrollment.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-medium">৳{Number(enrollment.final_fee || 0).toLocaleString('en-BD')}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-end w-32 ml-auto">
                        <div className="flex justify-between w-full text-xs font-bold mb-1.5">
                          <span className="text-slate-500">৳{Number(enrollment.total_paid || 0).toLocaleString('en-BD')}</span>
                          <span className="text-slate-900">৳{Number(enrollment.final_fee || 0).toLocaleString('en-BD')}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${feeProgress >= 100 ? 'bg-emerald-500' : feeProgress > 0 ? 'bg-indigo-500' : 'bg-slate-300'}`} 
                            style={{ width: `${Math.min(feeProgress, 100)}%` }}
                          />
                        </div>
                        {(enrollment.current_due || 0) > 0 && (
                          <span className="text-[10px] text-rose-500 font-bold mt-1.5 uppercase tracking-wide">
                            Due: ৳{Number(enrollment.current_due).toLocaleString('en-BD')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <EnrollmentActions enrollmentId={enrollment.id} studentId={enrollment.student_id} />
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
