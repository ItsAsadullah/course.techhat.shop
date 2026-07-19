"use client";

import Link from "next/link";
import { MoreHorizontal, Eye, Pencil, Receipt, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function EnrollmentActions({ enrollmentId, studentId }: { enrollmentId: string, studentId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:bg-slate-800 rounded-lg">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-200 dark:border-slate-700">
        <DropdownMenuItem asChild className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 cursor-pointer">
          <Link href={`/admin/enrollments/${enrollmentId}`} className="flex items-center gap-2 w-full">
            <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>বিস্তারিত (View)</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 cursor-pointer">
          <Link href={`/admin/students/${studentId}/enrollments/${enrollmentId}/edit`} className="flex items-center gap-2 w-full">
            <Pencil className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>এডিট করুন (Edit)</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
        <DropdownMenuItem asChild className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 cursor-pointer">
          <Link href={`/admin/payments/new?student_id=${studentId}&enrollment_id=${enrollmentId}`} className="flex items-center gap-2 w-full text-emerald-600 dark:text-emerald-500 focus:text-emerald-700 dark:text-emerald-500">
            <Receipt className="h-4 w-4 text-emerald-500" />
            <span>পেমেন্ট গ্রহণ করুন</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 cursor-pointer">
          <Link href={`/admin/students/${studentId}`} className="flex items-center gap-2 w-full text-blue-600 dark:text-blue-400 focus:text-blue-700 dark:text-blue-500">
            <CreditCard className="h-4 w-4 text-blue-500" />
            <span>পেমেন্ট ইতিহাস</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
