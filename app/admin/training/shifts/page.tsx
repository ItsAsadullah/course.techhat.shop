import { getTrainingShifts } from "@/lib/admin/actions/training-shifts";
import { parseTrainingDays } from "@/lib/schema/training.schema";
import { Plus, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrainingShift } from "@/types/admin/training";

export const metadata = {
  title: "Training Shifts",
};

export default async function TrainingShiftsPage() {
  const { data: shifts, error } = await getTrainingShifts();

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Training Shifts</h1>
          <p className="mt-1 text-sm text-slate-500">Manage daily time slots and lab allocations.</p>
        </div>
        <Button asChild className="shrink-0 bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/training/shifts/new">
            <Plus className="mr-2 h-4 w-4" /> Add Shift
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500 flex flex-col items-center">
            <p className="font-semibold text-lg">Failed to load shifts</p>
            <p className="text-sm mt-1 opacity-80">There was a problem retrieving the training shifts.</p>
          </div>
        ) : !shifts || shifts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <Clock className="h-12 w-12 text-slate-300 mb-3" />
            <p>No training shifts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Name / Code</th>
                  <th className="px-6 py-4">Days & Time</th>
                  <th className="px-6 py-4">Lab / Room</th>
                  <th className="px-6 py-4 text-center">Effective Capacity</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shifts.map((shift: TrainingShift) => {
                  const days = parseTrainingDays(shift.class_days);
                  
                  return (
                  <tr key={shift.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">{shift.name_en}</p>
                      {shift.code && <p className="text-xs text-slate-500 uppercase">{shift.code}</p>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="font-mono">{shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {!days ? (
                           <span className="text-amber-600">Schedule unavailable</span>
                        ) : days.length === 0 ? (
                           <span>No days</span>
                        ) : (
                           days.join(', ')
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {shift.lab ? (
                        <>
                          <p className="font-medium text-slate-800">{shift.lab.name}</p>
                          <p className="text-xs text-slate-500">{shift.lab.code}</p>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {shift.capacity_override !== null ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-sm font-semibold text-indigo-700">
                          {shift.capacity_override} (Override)
                        </span>
                      ) : shift.lab ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-semibold text-blue-700">
                          {shift.lab.manual_capacity_limit ?? (shift.lab.usable_computers * shift.lab.students_per_computer)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        shift.status === "active" ? "bg-emerald-100 text-emerald-800" :
                        shift.status === "inactive" ? "bg-slate-100 text-slate-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-800">
                        <Link href={`/admin/training/shifts/${shift.id}`}>Manage</Link>
                      </Button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
