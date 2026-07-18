"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, Users, CreditCard, BookOpen, GraduationCap, Settings, ClipboardCheck, ShoppingCart, MonitorPlay, Clock, Layers, MonitorCog } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/admin/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/admissions", label: "Admissions", icon: ClipboardCheck },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/orders", label: "Orders & Enrollments", icon: ShoppingCart },
  { href: "/admin/enrollments", label: "Enrollments", icon: GraduationCap },
  { href: "/admin/training", label: "Training Ops", icon: MonitorCog },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
      <Link href="/admin" className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-slate-900">TechHat Center</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-900">Menu</span>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  onClick={() => setOpen(false)}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    isActive
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
