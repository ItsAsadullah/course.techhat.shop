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
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-200">
        <DropdownMenuItem asChild className="hover:bg-slate-50 cursor-pointer">
          <Link href={`/admin/enrollments/${enrollmentId}`} className="flex items-center gap-2 w-full">
            <Eye className="h-4 w-4 text-slate-500" />
            <span>বিস্তারিত (View)</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-slate-50 cursor-pointer">
          <Link href={`/admin/students/${studentId}/enrollments/${enrollmentId}/edit`} className="flex items-center gap-2 w-full">
            <Pencil className="h-4 w-4 text-slate-500" />
            <span>এডিট করুন (Edit)</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-100" />
        <DropdownMenuItem asChild className="hover:bg-slate-50 cursor-pointer">
          <Link href={`/admin/payments/new?student_id=${studentId}&enrollment_id=${enrollmentId}`} className="flex items-center gap-2 w-full text-emerald-600 focus:text-emerald-700">
            <Receipt className="h-4 w-4 text-emerald-500" />
            <span>পেমেন্ট গ্রহণ করুন</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-slate-50 cursor-pointer">
          <Link href={`/admin/students/${studentId}`} className="flex items-center gap-2 w-full text-blue-600 focus:text-blue-700">
            <CreditCard className="h-4 w-4 text-blue-500" />
            <span>পেমেন্ট ইতিহাস</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
