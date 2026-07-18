"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  ShoppingCart,
  MonitorCog,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";
import { motion } from "framer-motion";
import { createClient } from "@/lib/admin/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Academic",
    items: [
      { href: "/admin/admissions", label: "Admissions", icon: ClipboardCheck },
      { href: "/admin/students", label: "Students", icon: Users },
      { href: "/admin/courses", label: "Courses", icon: BookOpen },
      { href: "/admin/enrollments", label: "Enrollments", icon: GraduationCap },
      { href: "/admin/training", label: "Training", icon: MonitorCog },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email || null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-[280px] h-full flex flex-col relative rounded-none shrink-0 bg-transparent text-white/90">

      {/* Background Decorators */}
      <div className="absolute top-[-50px] left-[-50px] w-[150px] h-[150px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-50px] w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="p-6 relative z-10 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-4 group">
          <div className="bg-white/10 p-2.5 rounded-xl shadow-inner border border-white/10 backdrop-blur-md group-hover:bg-white/20 transition-colors">
            <GraduationCap className="h-6 w-6 text-[var(--admin-sidebar-text)]" />
          </div>
          <div>
            <h1 className="font-bold text-[var(--admin-sidebar-text)] leading-tight tracking-wide text-[15px]">
              TechHat Institute
            </h1>
            <p className="text-[11px] text-[var(--admin-sidebar-text)] opacity-60 tracking-wider uppercase mt-0.5">
              LMS Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation section */}
      <div className="flex-1 overflow-y-auto pl-4 pr-0 pb-6 space-y-8 relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navGroups.map((group) => (
          <div key={group.label} className="relative">
            <h3 className="px-4 text-[10px] font-bold text-[var(--admin-sidebar-text)] opacity-40 uppercase tracking-widest mb-3">
              {group.label}
            </h3>
            <nav className="relative space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative block group"
                  >
                    {isActive ? (
                      <motion.div
                        layoutId="sidebar-active-cutout"
                        className="sidebar-cutout is-active-cutout"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    ) : (
                      <div
                        className="sidebar-cutout opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                        style={{ "--cutout-bg": "var(--admin-sidebar-active-bg, rgba(255, 255, 255, 0.08))" } as React.CSSProperties}
                      />
                    )}
                    <div
                      className={cn(
                        "relative flex items-center gap-3 pl-8 pr-6 h-[52px] rounded-l-full transition-colors duration-300 ease-in-out z-10",
                        isActive
                          ? "text-slate-900 font-bold"
                          : "text-[var(--admin-sidebar-text)] opacity-70 group-hover:opacity-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[20px] w-[20px] transition-transform duration-300 ease-in-out",
                          !isActive && "group-hover:scale-110",
                          isActive && "text-admin-primary"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="text-sm tracking-wide">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Profile section */}
      <div className="p-4 relative z-10 flex-shrink-0 mt-auto">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-indigo-500/50 border border-white/20 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-white/90" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">
              {userEmail ? userEmail.split('@')[0] : "Admin User"}
            </p>
            <p className="text-[11px] text-white/50 truncate">
              Administrator
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
