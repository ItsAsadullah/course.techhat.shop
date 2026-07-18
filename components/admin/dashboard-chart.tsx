"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

interface ChartData {
  name: string;
  revenue: number;
  students: number;
}

interface DashboardChartProps {
  data: ChartData[];
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[24px] overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-8 pt-6 px-8">
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">Growth Statistics</CardTitle>
          <CardDescription className="text-sm font-medium text-slate-500 mt-1">
            Revenue and Enrollment overview for the last 8 weeks
          </CardDescription>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Students</span>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors ml-2">
            <MoreHorizontal className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-8 pb-8">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `৳${value / 1000}k`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                  padding: "16px",
                  backdropFilter: "blur(8px)"
                }}
                itemStyle={{ fontSize: "14px", fontWeight: 700 }}
                labelStyle={{ color: "#64748b", marginBottom: "8px", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 6, strokeWidth: 3, stroke: "#fff", fill: "#4f46e5" }}
              />
              <Area
                type="monotone"
                dataKey="students"
                stroke="#34d399"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorStudents)"
                activeDot={{ r: 6, strokeWidth: 3, stroke: "#fff", fill: "#34d399" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
