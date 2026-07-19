"use client";

import { Users, DollarSign, AlertCircle, BookOpen } from "lucide-react";
import type { DashboardStats } from "@/types/admin";
import { cn } from "@/lib/admin/utils";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      bg: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
      iconBg: "bg-white/20 dark:bg-slate-900/20",
    },
    {
      title: "Active Students",
      value: stats.totalStudents,
      icon: Users,
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      iconBg: "bg-white/20 dark:bg-slate-900/20",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      iconBg: "bg-white/20 dark:bg-slate-900/20",
    },
    {
      title: "Total Dues",
      value: `৳${stats.totalDues.toLocaleString()}`,
      icon: AlertCircle,
      bg: "bg-gradient-to-br from-rose-500 to-rose-700",
      iconBg: "bg-white/20 dark:bg-slate-900/20",
    },
  ];

  return (
    <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={cn(
              "relative overflow-hidden rounded-[24px] md:rounded-[32px] p-4 md:p-6 text-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
              card.bg
            )}
          >
            {/* Background Decorative Elements */}
            <div className="absolute -right-6 -top-6 h-20 w-20 md:h-28 md:w-28 rounded-full bg-white/20 dark:bg-slate-900/20 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 md:h-32 md:w-32 rounded-full bg-black/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-3 md:gap-6">
              <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-1 sm:gap-0">
                  <div className={cn("rounded-lg md:rounded-2xl p-2 md:p-3.5 backdrop-blur-md shadow-inner w-fit", card.iconBg)}>
                    <Icon className="h-4 w-4 md:h-6 md:w-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-[9px] md:text-[13px] font-semibold text-white/90 uppercase tracking-widest mt-1 sm:mt-1 sm:text-right leading-tight">
                    {card.title}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight drop-shadow-sm mt-1 md:mt-0 truncate">
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
