import { getTrainingLabById, getTrainingLabCapacity } from "@/lib/admin/actions/training-labs";
import { ArchiveLabButton } from "@/components/admin/training/ArchiveLabButton";
import { notFound } from "next/navigation";
import { MonitorPlay, Activity, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Lab Details",
};

export default async function LabDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lab = await getTrainingLabById(resolvedParams.id);

  if (!lab) {
    notFound();
  }

  const capacity = await getTrainingLabCapacity(lab.id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">{lab.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage lab details and capacity.</p>
        </div>
        <div className="flex items-center gap-2">
          {lab.status !== "archived" && (
            <ArchiveLabButton labId={lab.id} labName={lab.name} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Lab Information</h3>
              <Link href={`/admin/training/labs/${lab.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Lab
                </Button>
              </Link>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Name</p>
                <p className="mt-1 text-slate-900 dark:text-slate-50">{lab.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Code</p>
                <p className="mt-1 text-slate-900 dark:text-slate-50">{lab.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Room</p>
                <p className="mt-1 text-slate-900 dark:text-slate-50">{lab.room || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Location</p>
                <p className="mt-1 text-slate-900 dark:text-slate-50">{lab.location || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</p>
                <p className="mt-1 text-slate-900 dark:text-slate-50 whitespace-pre-wrap">{lab.description || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Computers</p>
                <p className="mt-1 text-slate-900 dark:text-slate-50">{lab.total_computers}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Usable Computers</p>
                <p className="mt-1 text-slate-900 dark:text-slate-50">{lab.usable_computers}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Students Per Computer</p>
                <p className="mt-1 text-slate-900 dark:text-slate-50">{lab.students_per_computer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</p>
                <p className="mt-1 capitalize text-slate-900 dark:text-slate-50">{lab.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Overview */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500 dark:text-slate-400" /> Capacity Analysis
              </h3>
            </div>

            {capacity && capacity.success ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Computer Capacity</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{capacity.computer_capacity} seats</p>
                  <p className="text-xs text-slate-400">Based on usable computers × students per computer</p>
                </div>

                {capacity.manual_capacity_limit !== null && (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      Manual Limit
                    </p>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-500">{capacity.manual_capacity_limit} seats</p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Effective Capacity</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{capacity.effective_capacity}</p>
                  <p className="text-xs text-slate-400 mt-1">Maximum allowed students per shift in this lab</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-500">Could not calculate capacity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
