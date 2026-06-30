import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="font-bold text-xl tracking-tight text-slate-900">
            TechHat <span className="text-indigo-600">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium text-sm">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/students" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
            <Users className="w-5 h-5" /> Students
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
            <BookOpen className="w-5 h-5" /> Courses & Batches
          </Link>
          <Link href="/admin/finance" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
            <CreditCard className="w-5 h-5" /> Finance
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            A
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
