"use client";

import { Download, Printer, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface StudentData {
  student_id: string;
  name: string;
  phone: string;
  course: string;
  batch_name: string;
  total_course_fee: number;
  total_paid: number;
  current_due: number;
  status: string;
}

export function StudentsActions({ studentsData }: { studentsData: any }) {
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    try {
      const headers = ["ID", "Name", "Phone", "Course", "Batch", "Total Fee", "Paid", "Due", "Status"];
      const rows = studentsData.map((s: any) => [
        s.student_id || "",
        `"${s.name}"`,
        s.phone,
        `"${s.course?.name || "N/A"}"`,
        `"${s.batch_name || "N/A"}"`,
        s.total_course_fee,
        s.total_paid,
        s.current_due,
        s.status
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row: any) => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `students_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Students exported successfully!");
    } catch (e) {
      toast.error("Failed to export students.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={handlePrint} variant="outline" className="h-9 text-xs rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 dark:hover:bg-slate-800 font-semibold shadow-sm">
        <Printer className="w-3.5 h-3.5 mr-2" />
        Print
      </Button>
      <Button onClick={handleExport} variant="outline" className="h-9 text-xs rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 dark:hover:bg-slate-800 font-semibold shadow-sm">
        <Download className="w-3.5 h-3.5 mr-2" />
        Export
      </Button>
      <Button asChild className="h-9 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm shadow-indigo-200 dark:shadow-none px-4">
        <Link href="/admin/students/new">
          <Plus className="w-3.5 h-3.5 mr-2" />
          Add Student
        </Link>
      </Button>
    </div>
  );
}
