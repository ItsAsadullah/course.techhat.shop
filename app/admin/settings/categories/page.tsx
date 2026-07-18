import { getCourseCategories } from "@/lib/admin/actions/courses";
import { CourseCategoriesManager } from "@/components/settings/categories/CourseCategoriesManager";

export const metadata = { title: "Course Categories - TechHat Admin" };

export default async function CategoriesSettingsPage() {
  const categories = await getCourseCategories();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Course Categories</h3>
        <p className="text-sm text-slate-500">
          Manage dynamic course categories and subcategories.
        </p>
      </div>

      <CourseCategoriesManager initialCategories={categories} />
    </div>
  );
}
