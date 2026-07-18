"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/admin/utils";
import { MonitorCog, Layers, Clock, MonitorPlay } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin/training", icon: MonitorCog },
  { name: "Batches", href: "/admin/training/batches", icon: Layers },
  { name: "Shifts", href: "/admin/training/shifts", icon: Clock },
  { name: "Labs", href: "/admin/training/labs", icon: MonitorPlay },
];

export default function TrainingOperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      <div className="py-2">
        {children}
      </div>
    </div>
  );
}
