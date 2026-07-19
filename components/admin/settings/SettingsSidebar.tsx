"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/admin/utils";
import {
  Settings, Building2, Globe, GraduationCap, BookOpen, Users,
  Clock, FileText, Award, CreditCard, Receipt, MessageSquare,
  Bell, ShieldCheck, Languages, Palette, LineChart, Link2,
  HardDrive, DatabaseBackup, Activity, Code, Settings2
} from "lucide-react";

const SETTINGS_CATEGORIES = [
  { group: "Core Settings", items: [
    { name: "General", href: "/admin/settings/general", icon: Settings },
    { name: "Organization", href: "/admin/settings/organization", icon: Building2 },
    { name: "Website", href: "/admin/settings/website", icon: Globe },
  ]},
  { group: "Academic & LMS", items: [
    { name: "Admissions", href: "/admin/settings/admissions", icon: GraduationCap },
    { name: "Courses", href: "/admin/settings/courses", icon: BookOpen },
    { name: "Students", href: "/admin/settings/students", icon: Users },
    { name: "Attendance", href: "/admin/settings/attendance", icon: Clock },
    { name: "Examinations", href: "/admin/settings/examinations", icon: FileText },
    { name: "Certificates", href: "/admin/settings/certificates", icon: Award },
  ]},
  { group: "Finance & Comms", items: [
    { name: "Payments", href: "/admin/settings/payments", icon: CreditCard },
    { name: "Invoices", href: "/admin/settings/invoices", icon: Receipt },
    { name: "SMS & Email", href: "/admin/settings/communications", icon: MessageSquare },
    { name: "Notifications", href: "/admin/settings/notifications", icon: Bell },
  ]},
  { group: "System & Data", items: [
    { name: "Users & Roles", href: "/admin/settings/roles", icon: ShieldCheck },
    { name: "Localization", href: "/admin/settings/localization", icon: Languages },
    { name: "Appearance", href: "/admin/settings/appearance", icon: Palette },
    { name: "Analytics", href: "/admin/settings/analytics", icon: LineChart },
    { name: "Integrations", href: "/admin/settings/integrations", icon: Link2 },
    { name: "Storage", href: "/admin/settings/storage", icon: HardDrive },
  ]},
  { group: "Maintenance", items: [
    { name: "Backup & Restore", href: "/admin/settings/backup", icon: DatabaseBackup },
    { name: "Audit Logs", href: "/admin/settings/audit-logs", icon: Activity },
    { name: "Developer", href: "/admin/settings/developer", icon: Code },
    { name: "Advanced", href: "/admin/settings/advanced", icon: Settings2 },
  ]},
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 lg:block hidden sticky top-0 h-screen overflow-y-auto custom-scrollbar border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pb-20">
      <div className="p-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enterprise Configuration</p>
      </div>

      <div className="px-3 space-y-6">
        {SETTINGS_CATEGORIES.map((category, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {category.group}
            </h3>
            <nav className="space-y-0.5">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (pathname === "/admin/settings" && item.href === "/admin/settings/general");
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-100" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
