import { getCourses } from "@/lib/admin/actions/courses";
import Link from "next/link";
import { Users, Star, ArrowRight, GraduationCap, Search, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "সকল কোর্স — TechHat IT Institute",
  description: "TechHat IT Institute-এর সকল অনলাইন ও অফলাইন কোর্স দেখুন।",
};

export const revalidate = 60;

interface CoursesPageProps {
  searchParams: Promise<{ type?: string; category?: string; search?: string }>;
}

const TYPE_LABELS: Record<string, string> = {
  offline: "অফলাইন",
  online: "অনলাইন",
  hybrid: "হাইব্রিড",
  workshop: "ওয়ার্কশপ",
  bootcamp: "বুটক্যাম্প",
};

const TYPE_COLORS: Record<string, string> = {
  offline: "bg-amber-100 text-amber-700",
  online: "bg-emerald-100 text-emerald-700",
  hybrid: "bg-violet-100 text-violet-700",
  workshop: "bg-blue-100 text-blue-700",
  bootcamp: "bg-red-100 text-red-700",
};

export default async function DashboardAllCoursesPage({ searchParams }: CoursesPageProps) {
  const filters = await searchParams;
  const courses = await getCourses({ status: "published", ...filters }).catch(() => []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">কোর্স সমূহ (All Courses)</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            TechHat IT Institute-এর সকল প্রিমিয়াম কোর্স এক্সপ্লোর করুন এবং আপনার পছন্দের কোর্সে এনরোল করুন।
          </p>
        </div>

        {/* Search Bar */}
        <form className="relative z-10 w-full md:w-auto md:min-w-[320px]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="search"
              defaultValue={filters.search}
              placeholder="কোর্স খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
            {/* Preserve existing filters when searching */}
            {filters.type && <input type="hidden" name="type" value={filters.type} />}
          </div>
        </form>
      </div>

      {/* Course Catalog */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Type Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {[{ value: "", label: "সব কোর্স" }, ...Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))].map(({ value, label }) => (
              <Link
                key={value}
                href={value ? `/dashboard/all-courses?type=${value}${filters.search ? `&search=${filters.search}` : ''}` : `/dashboard/all-courses${filters.search ? `?search=${filters.search}` : ''}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  (filters.type || "") === value
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            {courses.length} টি কোর্স
          </p>
        </div>

        {/* Results */}
        {courses.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <GraduationCap className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400 mb-2">কোনো কোর্স পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-400 mb-6">আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
            <Link href="/dashboard/all-courses" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              সব কোর্স দেখুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug_en || course.slug_bn}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gradient-to-br from-blue-600 to-violet-600 overflow-hidden shrink-0">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.name_bn || course.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${TYPE_COLORS[course.course_type] || "bg-slate-100 text-slate-700"}`}>
                      {TYPE_LABELS[course.course_type] || course.course_type}
                    </span>
                    {course.is_featured && <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-400 text-amber-900">⭐ Featured</span>}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  {/* Category */}
                  {course.category_name_bn && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1.5">{course.category_name_bn}</p>
                  )}

                  {/* Name */}
                  <h3 className="font-bold text-slate-900 dark:text-white leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.name_bn || course.name_en}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-1 flex-1">{course.name_en}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      <Users className="w-3.5 h-3.5" /> {course.total_enrolled}
                    </span>
                    {course.average_rating > 0 && (
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        <Star className="w-3.5 h-3.5 text-yellow-500" /> {course.average_rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
                    <div>
                      {course.course_fee === 0 ? (
                        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">বিনামূল্যে</span>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-base">৳ {Number(course.course_fee).toLocaleString()}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 px-2 py-1 rounded-md">
                      বিস্তারিত <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
