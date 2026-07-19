import { getTrainingShiftById, getTrainingShiftCapacity } from "@/lib/admin/actions/training-shifts";
import { parseTrainingDays } from "@/lib/schema/training.schema";
import { notFound } from "next/navigation";
import { Clock, Activity, Users, MapPin, Hash, CheckCircle2, XCircle, Settings2 } from "lucide-react";
import { createClient } from "@/lib/admin/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArchiveShiftButton } from "@/components/admin/training/ArchiveShiftButton";

export const metadata = {
  title: "Shift Details",
};

export default async function ShiftDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const shift = await getTrainingShiftById(resolvedParams.id);

  if (!shift) {
    notFound();
  }

  const capacity = await getTrainingShiftCapacity(shift.id);

  // Fetch student roster directly linked to this shift
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
      ),
      course:course_id (
        name
      )
    `)
    .eq("shift_id", shift.id)
    .in("status", ["pending", "active", "suspended"])
    .order("enrolled_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">{shift.name_en}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage shift details, schedule, and student roster.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/admin/training/shifts/${shift.id}/edit`}>Edit Shift</Link>
          </Button>
          {shift.status !== "archived" && (
            <ArchiveShiftButton shiftId={shift.id} shiftName={shift.name_en} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details (Read-only) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-slate-500 dark:text-slate-400" /> Shift Information
            </h3>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Name (EN)</dt>
                <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-50">{shift.name_en}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Name (BN)</dt>
                <dd className="mt-1 text-base text-slate-900 dark:text-slate-50">{shift.name_bn || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2"><Hash className="h-4 w-4" /> Code</dt>
                <dd className="mt-1 text-base text-slate-900 dark:text-slate-50 font-mono">{shift.code || "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2"><MapPin className="h-4 w-4" /> Assigned Lab</dt>
                <dd className="mt-1 text-base font-medium text-indigo-700">
                  <Link href={`/admin/training/labs/${shift.lab_id}`} className="hover:underline">
                    {shift.lab?.name || "Unknown"}
                  </Link>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</dt>
                <dd className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${shift.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400' :
                      shift.status === 'inactive' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' :
                        shift.status === 'archived' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}>
                    {shift.status === 'active' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <span className="capitalize">{shift.status}</span>
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Capacity Overview & Schedule */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-slate-500 dark:text-slate-400" /> Schedule
            </h3>
            <p className="text-2xl font-mono text-slate-700 dark:text-slate-200">{shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(() => {
                const parsedDays = parseTrainingDays(shift.class_days);

                if (!parsedDays) {
                  return <span className="text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/50">Schedule data unavailable or invalid</span>;
                }

                if (parsedDays.length === 0) {
                  return <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">No training days configured</span>;
                }

                return parsedDays.map((day: string) => (
                  <span key={day} className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-sm font-medium text-blue-700 dark:text-blue-500 ring-1 ring-inset ring-blue-700/10">
                    {day}
                  </span>
                ));
              })()}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Activity className="h-5 w-5 text-slate-500 dark:text-slate-400" /> Capacity
              </h3>
            </div>

            {capacity && capacity.success ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Base Lab Capacity</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{capacity.effective_lab_capacity} seats</p>
                  <p className="text-xs text-slate-400">Derived from assigned lab</p>
                </div>

                {capacity.capacity_override !== null && (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Shift Override</p>
                    <p className="text-xl font-bold text-indigo-600">{capacity.capacity_override} seats</p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Effective Capacity</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{capacity.effective_shift_capacity}</p>
                  <p className="text-xs text-slate-400 mt-1">Maximum students allowed in this time slot</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-500">Could not calculate capacity.</p>
            )}
          </div>
        </div>
      </div>

      {/* Roster */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500 dark:text-slate-400" /> Active Student Roster
          </h3>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 px-2.5 py-1 rounded-full">{roster?.length || 0}</span>
        </div>

        {(!roster || roster.length === 0) ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <p>No active students in this shift.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {roster.map((row: Record<string, unknown>) => {
                  const student = row.student as Record<string, string> | null;
                  const course = row.course as Record<string, string> | null;
                  return (
                    <tr key={row.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-slate-50">{student?.full_name_en}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{student?.student_id}</p>
                      </td>
                      <td className="px-6 py-4">{student?.phone}</td>
                      <td className="px-6 py-4">{course?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${row.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400" :
                            row.status === "pending" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400" :
                              "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                          }`}>
                          {row.status as string}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:text-blue-400">
                          <Link href={`/admin/enrollments/${row.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
