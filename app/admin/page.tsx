import Link from "next/link";
import { Plus, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentPayments } from "@/components/admin/recent-payments";
import { DashboardChart } from "@/components/admin/dashboard-chart";
import { ProfileCard } from "@/components/admin/profile-card";
import { getDashboardStats, getChartData } from "@/lib/admin/actions/dashboard";
import { getPayments } from "@/lib/admin/actions/payments";

export default async function DashboardPage() {
  const [stats, recentPayments, chartData] = await Promise.all([
    getDashboardStats(),
    getPayments(6), // Fetch 6 payments for better visual height
    getChartData(),
  ]);

  return (
    <div className="max-w-[1500px] mx-auto w-full pb-10">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-2">
        
        {/* Left Column (Approx 66%) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <DashboardStats stats={stats} />
          <DashboardChart data={chartData} />
          <RecentPayments payments={recentPayments} />
        </div>

        {/* Right Column (Approx 33%) */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <ProfileCard />
          
          {/* Quick Help Card to fill remaining space beautifully */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[24px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 tracking-tight">Need Assistance?</h3>
              <p className="text-sm text-slate-300 mb-8 leading-relaxed font-medium">
                Our support team is available 24/7 to help you with any issues regarding the LMS management.
              </p>
              <Button variant="secondary" className="rounded-xl font-bold bg-white text-slate-900 hover:bg-indigo-50 shadow-sm transition-all hover:scale-105 w-full h-12">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
