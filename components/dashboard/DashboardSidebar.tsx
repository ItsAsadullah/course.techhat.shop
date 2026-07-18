"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, BookCheck, ClipboardList, ShieldQuestion, 
  Award, Download, Keyboard, MonitorPlay, Presentation, FolderGit2, 
  CalendarClock, TrendingUp, Trophy, Star, Bookmark, Heart, 
  MessageSquareText, Users, HelpCircle, Ticket, CreditCard, Receipt, 
  User, Settings, LogOut, PanelLeftClose, PanelLeftOpen 
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const menuGroups = [
  {
    title: "Learning",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "কোর্স সমূহ", href: "/dashboard/all-courses", icon: BookOpen },
      { name: "My Courses", href: "/dashboard/courses", icon: BookCheck },
    ]
  },
  {
    title: "Evaluation",
    items: [
      { name: "Assignments", href: "/dashboard/assignments", icon: ClipboardList },
      { name: "Quizzes", href: "/dashboard/quizzes", icon: ShieldQuestion },
      { name: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
      { name: "Typing Practice", href: "/dashboard/typing", icon: Keyboard },
    ]
  },
  {
    title: "Progress & Rewards",
    items: [
      { name: "Certificates", href: "/dashboard/certificates", icon: Award },
      { name: "Attendance", href: "/dashboard/attendance", icon: CalendarClock },
      { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
      { name: "Leaderboard", href: "/dashboard/leaderboard", icon: TrendingUp },
    ]
  },
  {
    title: "Resources",
    items: [
      { name: "Downloads", href: "/dashboard/downloads", icon: Download },
      { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
      { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    ]
  },
  {
    title: "Communication",
    items: [
      { name: "Messages", href: "/dashboard/messages", icon: MessageSquareText },
      { name: "Community", href: "/dashboard/community", icon: Users },
      { name: "Support Ticket", href: "/dashboard/support", icon: Ticket },
    ]
  },
  {
    title: "Billing",
    items: [
      { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
      { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
    ]
  }
];

export default function DashboardSidebar({ studentName, email, avatarUrl }: { studentName: string, email: string, avatarUrl?: string | null }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 80 : 280
        }}
        className={cn(
          "fixed md:relative top-0 left-0 h-screen z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                TechHat
              </motion.span>
            )}
          </Link>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  {group.title}
                </h3>
              )}
              {collapsed && <div className="h-4" />} {/* Spacer */}
              
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl transition-all duration-200 group relative",
                      collapsed ? "justify-center p-3" : "px-3 py-2.5",
                      isActive 
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "group-hover:text-blue-500")} />
                    {!collapsed && <span>{item.name}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer / Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className={cn("flex items-center gap-3 mb-4", collapsed ? "justify-center" : "")}>
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                studentName.charAt(0).toUpperCase()
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{studentName}</p>
                <p className="text-xs text-slate-500 truncate">{email}</p>
              </div>
            )}
          </div>
          
          <div className={cn("flex gap-2", collapsed ? "flex-col" : "")}>
            <Link 
              href="/dashboard/settings"
              title={collapsed ? "Settings" : undefined}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4.5 h-4.5" />
            </Link>
            <form action="/auth/signout" method="post" className="flex-1">
              <button 
                title={collapsed ? "Logout" : undefined}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Trigger Button (hidden inside sidebar component, but placed in navbar normally) */}
      <button 
        id="mobile-sidebar-toggle"
        className="hidden" 
        onClick={() => setIsMobileOpen(true)}
      />
    </>
  );
}
