import { getTrainingLabs } from "@/lib/admin/actions/training-labs";
import { Plus, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TrainingLab } from "@/types/admin/training";

export const metadata = {
  title: "Training Labs",
};

export default async function TrainingLabsPage() {
  const labs = await getTrainingLabs();

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Training Labs</h1>
          <p className="mt-1 text-sm text-slate-500">Manage computer labs, capacity, and status.</p>
        </div>
        <Button asChild className="shrink-0 bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/training/labs/new">
            <Plus className="mr-2 h-4 w-4" /> Add Lab
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {labs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <MonitorPlay className="h-12 w-12 text-slate-300 mb-3" />
            <p>No training labs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Name / Code</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4 text-center">Computers (Usable/Total)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {labs?.map((lab: TrainingLab) => (
                  <tr key={lab.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">{lab.name}</p>
                      <p className="text-xs text-slate-500 uppercase">{lab.code}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lab.room || "—"}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-semibold text-blue-700">
                        {lab.usable_computers} / {lab.total_computers}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        lab.status === "active" ? "bg-emerald-100 text-emerald-800" :
                        lab.status === "maintenance" ? "bg-amber-100 text-amber-800" :
                        "bg-slate-100 text-slate-800"
                      }`}>
                        {lab.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-800">
                        <Link href={`/admin/training/labs/${lab.id}`}>Manage</Link>
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
