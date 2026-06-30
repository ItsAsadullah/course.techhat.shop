import { Users, BookOpen, CreditCard, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: "245", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Active Batches", value: "12", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-100" },
          { label: "Revenue (This Month)", value: "৳ 45,000", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Growth", value: "+14%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Enrollments</h2>
        <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
          <Users className="w-12 h-12 mb-3 text-slate-300" />
          <p>No recent enrollments to show.</p>
        </div>
      </div>
    </div>
  );
}
