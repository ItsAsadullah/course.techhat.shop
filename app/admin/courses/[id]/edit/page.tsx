import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getCourseCategories } from "@/lib/admin/actions/courses";
import { getCourseForEdit } from "@/lib/admin/actions/course-wizard";
import { getAiModelsConfig } from "@/lib/admin/actions/ai";
import { CourseWizard } from "@/components/admin/courses/wizard/CourseWizard";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "কোর্স সম্পাদনা — TechHat Admin" };

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  const [categories, course, { models }] = await Promise.all([
    getCourseCategories(),
    getCourseForEdit(id),
    getAiModelsConfig(),
  ]);

  if (!course) notFound();

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
      <CourseWizard
        mode="edit"
        courseId={id}
        categories={categories}
        initialValues={course.values}
        courseCode={course.courseCode}
        initialStatus={course.status}
        aiModels={models}
      />
    </div>
  );
}
