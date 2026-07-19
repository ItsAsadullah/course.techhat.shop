import { getTrainingBatchById, getTrainingBatchCapacity } from "@/lib/admin/actions/training-batches";
import { TrainingBatchForm } from "@/components/admin/training/TrainingBatchForm";
import { notFound } from "next/navigation";
import { Activity, Users, CalendarDays, Layers } from "lucide-react";
import { createClient } from "@/lib/admin/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Batch Details",
};

export default async function BatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const batch = await getTrainingBatchById(resolvedParams.id);
  
  if (!batch) {
    notFound();
  }

  const capacity = await getTrainingBatchCapacity(batch.id);

  // Fetch student roster directly linked to this batch
  const supabase = await createClient();
  const { data: roster } = await supabase
    .from("course_enrollments")
    .select(`
      id,
      status,
      student:student_id (
        id,
        full_name_en,
        phone,
        student_id
      )
    `)
    .eq("batch_id", batch.id)
    .in("status", ["pending", "active", "suspended", "completed"])
    .order("enrolled_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">{batch.name_en}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage batch configuration, capacity, and enrolled students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details Form */}
        <div className="lg:col-span-2">
          <TrainingBatchForm initialData={batch} />
        </div>

        {/* Capacity Overview */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500 dark:text-slate-400" /> Batch Capacity
              </h3>
            </div>
            
            {capacity && capacity.success ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Shift Limit</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{capacity.effective_shift_capacity} seats</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-right">Seat Limit</p>
                    <p className="text-xl font-bold text-indigo-600 text-right">{capacity.seat_limit ?? 'N/A'}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Effective Capacity</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{capacity.effective_batch_capacity}</p>
                  </div>
                  
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full ${capacity.is_full ? 'bg-red-50 dark:bg-red-900/100' : 'bg-blue-600'}`} 
                      style={{ width: `${Math.min(capacity.utilization_percent, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{capacity.occupied} Occupied</span>
                    <span>{capacity.available} Available</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-500">Could not calculate capacity.</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
             <h3 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2 mb-4">
                <Layers className="h-4 w-4 text-slate-500 dark:text-slate-400" /> Assignment
              </h3>
              {batch.shifts && batch.shifts.length > 0 ? (
                 <div className="space-y-3">
                   {batch.shifts.map((shift, idx) => (
                     <div key={shift.id} className={idx > 0 ? "pt-3 border-t border-slate-100 dark:border-slate-800" : ""}>
                       <p className="font-medium text-slate-800 dark:text-slate-100">{shift.name_en}</p>
                       <p className="text-sm text-slate-600 dark:text-slate-300">{shift.start_time.slice(0,5)} - {shift.end_time.slice(0,5)}</p>
                       <div className="flex gap-4 mt-1">
                         <p className="text-xs text-slate-500 dark:text-slate-400">
                           Shift Capacity: <span className="font-semibold text-slate-700 dark:text-slate-200">{shift.capacity_override ?? shift.lab?.manual_capacity_limit ?? shift.lab?.usable_computers ?? 'N/A'}</span>
                         </p>
                         {shift.lab && (
                           <p className="text-xs text-slate-500 dark:text-slate-400">
                             Lab: {shift.lab.name} <span className="text-slate-400">({shift.lab.usable_computers} PCs)</span>
                           </p>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No shifts assigned</p>
              )}
          </div>
        </div>
      </div>

      {/* Roster */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" /> Enrolled Students
          </h3>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 px-2 py-1 rounded-full">{roster?.length || 0}</span>
        </div>
        
        {(!roster || roster.length === 0) ? (
           <div className="p-8 text-center text-slate-500 dark:text-slate-400">
             <p>No students enrolled in this batch.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {roster?.map((row: { id: string; status: string; student: { full_name_en: string; student_id: string; phone: string } | { full_name_en: string; student_id: string; phone: string }[] }) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-50">{Array.isArray(row.student) ? row.student[0]?.full_name_en : row.student?.full_name_en}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{Array.isArray(row.student) ? row.student[0]?.student_id : row.student?.student_id}</p>
                    </td>
                    <td className="px-6 py-4">{Array.isArray(row.student) ? row.student[0]?.phone : row.student?.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        row.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400" :
                        row.status === "pending" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400" :
                        row.status === "completed" ? "bg-purple-100 text-purple-800" :
                        "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm" asChild className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:text-blue-400">
                        <Link href={`/admin/enrollments/${row.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
