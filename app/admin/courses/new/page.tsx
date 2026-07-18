import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCourseCategories } from "@/lib/admin/actions/courses";
import { getAiModelsConfig } from "@/lib/admin/actions/ai";
import { CourseWizard } from "@/components/admin/courses/wizard/CourseWizard";

export const metadata = { title: "নতুন কোর্স তৈরি করুন — TechHat Admin" };

export default async function NewCoursePage() {
  const categories = await getCourseCategories();
  const { models } = await getAiModelsConfig();

  return (
    <div className="space-y-2">
      <div className="px-4 sm:px-6 pt-4">
        <Link
          href="/admin/courses"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> কোর্স তালিকায় ফিরুন
        </Link>
      </div>
      <CourseWizard mode="new" categories={categories} aiModels={models} />
    </div>
  );
}
