import { getTrainingOperationsOverview } from "@/lib/admin/actions/training-overview";
import { MonitorPlay, Clock, Layers, Users, Activity, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Training Operations Dashboard",
};

export default async function TrainingOperationsPage() {
  const data = await getTrainingOperationsOverview();

  if (!data) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-6 text-red-800 dark:text-red-400 flex items-center gap-3">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <div>
          <h3 className="font-semibold text-red-900 dark:text-red-300">Failed to load overview</h3>
          <p className="text-sm">There was a database error retrieving the training metrics.</p>
        </div>
      </div>
    );
  }

  const { metrics, todaysShifts, nearlyFullBatches, fullBatches, recentMigrations } = data;

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <MonitorPlay className="h-4 w-4" />
            <h3 className="text-sm font-medium uppercase tracking-wider">Active Labs</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{metrics.activeLabs}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{metrics.usableComputers} total computers</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Clock className="h-4 w-4" />
            <h3 className="text-sm font-medium uppercase tracking-wider">Active Shifts</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{metrics.activeShifts}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Scheduled across labs</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Layers className="h-4 w-4" />
            <h3 className="text-sm font-medium uppercase tracking-wider">Active Batches</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{metrics.activeBatches}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Currently open or ongoing</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <Users className="h-4 w-4" />
            <h3 className="text-sm font-medium uppercase tracking-wider">Capacity Utilization</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{metrics.utilizationPercent}%</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{metrics.occupiedSeats} occupied / {metrics.availableSeats} available</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Shifts */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">Today's Shifts</h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 px-2 py-1 rounded-full">{todaysShifts.length}</span>
          </div>
          <div className="p-0 flex-1">
            {todaysShifts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p>No shifts scheduled for today.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {todaysShifts.map((shift) => (
                  <li key={shift.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50">{shift.name_en}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{shift.lab?.name || "No Lab"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-slate-700 dark:text-slate-200">{shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}</p>
                      <Button variant="link" size="sm" asChild className="h-auto p-0 text-blue-600 dark:text-blue-400">
                        <Link href={`/admin/training/shifts/${shift.id}`}>View Roster</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Capacity Alerts */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">Capacity Alerts</h3>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>
          <div className="p-0 flex-1">
            {fullBatches.length === 0 && nearlyFullBatches.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p>No urgent capacity alerts.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {fullBatches.map((batch) => (
                  <li key={batch.id} className="p-4 hover:bg-red-50 dark:bg-red-900/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Full</span>
                        <p className="font-medium text-slate-900 dark:text-slate-50">{batch.name_en}</p>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{batch.course?.name || "Unknown Course"}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/training/batches/${batch.id}`}>Manage</Link>
                    </Button>
                  </li>
                ))}
                {nearlyFullBatches.map((batch) => (
                  <li key={batch.id} className="p-4 hover:bg-amber-50 dark:bg-amber-900/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Nearly Full</span>
                        <p className="font-medium text-slate-900 dark:text-slate-50">{batch.name_en}</p>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{batch.capacity.available} seats left</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/training/batches/${batch.id}`}>View</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
