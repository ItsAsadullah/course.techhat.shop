"use client";

import { Users, DollarSign, AlertCircle } from "lucide-react";
import type { DashboardStats } from "@/types/admin";
import { cn } from "@/lib/admin/utils";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: "Active Students",
      value: stats.totalStudents,
      icon: Users,
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      iconBg: "bg-white/20",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bg: "bg-gradient-to-br from-sky-400 to-blue-500",
      iconBg: "bg-white/20",
    },
    {
      title: "Total Dues",
      value: `৳${stats.totalDues.toLocaleString()}`,
      icon: AlertCircle,
      bg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      iconBg: "bg-white/20",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={cn(
              "relative overflow-hidden rounded-[24px] p-6 text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
              card.bg
            )}
          >
            {/* Background Decorative Elements */}
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className={cn("rounded-2xl p-3.5 backdrop-blur-md shadow-inner", card.iconBg)}>
                    <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-[13px] font-semibold text-white/80 uppercase tracking-widest mt-1">
                    {card.title}
                  </span>
                </div>
                <div>
                  <h3 className="text-4xl font-bold tracking-tight drop-shadow-sm">
                    {card.value}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
