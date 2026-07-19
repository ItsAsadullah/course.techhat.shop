"use client";

import { useState } from "react";
import { Copy, Trash2, Star } from "lucide-react";
import { duplicateCourse, deleteCourse, toggleCourseFeatured, toggleCoursePopular } from "@/lib/admin/actions/courses";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { CourseListItem } from "@/types/course";

interface Props {
  course: CourseListItem;
}

export default function CourseListActions({ course }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handle = async (fn: () => Promise<{ error?: string } | void | Record<string, unknown>>, successMsg: string) => {
    setLoading(true);
    const result = await fn();
    setLoading(false);
    const typedResult = result as { error?: string } | undefined;
    if (typedResult?.error) {
      toast.error(typedResult.error);
    } else {
      toast.success(successMsg);
      router.refresh();
    }
  };

  return (
    <>
      <button
        onClick={() => handle(() => toggleCourseFeatured(course.id, course.is_featured), course.is_featured ? "ফিচার্ড সরানো হয়েছে" : "ফিচার্ড করা হয়েছে")}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${course.is_featured ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"}`}
        title="ফিচার্ড টগল"
        aria-label="ফিচার্ড টগল"
        disabled={loading}
      >
        <Star className={`h-4 w-4 ${course.is_featured ? "fill-yellow-500" : ""}`} />
      </button>
      <button
        onClick={() => handle(() => duplicateCourse(course.id), "কোর্স কপি হয়েছে")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
        title="কপি করুন"
        aria-label="কপি করুন"
        disabled={loading}
      >
        <Copy className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          if (!confirm("এই কোর্সটি মুছে ফেলবেন?")) return;
          handle(() => deleteCourse(course.id), "কোর্স মুছে ফেলা হয়েছে");
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
        title="মুছুন"
        aria-label="মুছুন"
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );
}

