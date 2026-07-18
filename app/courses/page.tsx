import { getCourses } from "@/lib/admin/actions/courses";
import Link from "next/link";
import { Clock, Users, Star, ArrowRight, GraduationCap, Search } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";

export const metadata: Metadata = {
  title: "সকল কোর্স — TechHat IT Institute",
  description: "TechHat IT Institute-এর সকল অনলাইন ও অফলাইন কোর্স দেখুন। গ্রাফিক ডিজাইন, ওয়েব ডেভেলপমেন্ট, প্রোগ্রামিং এবং আরও অনেক কোর্স পাওয়া যাচ্ছে।",
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

export default async function PublicCoursesPage({ searchParams }: CoursesPageProps) {
  const filters = await searchParams;
  const courses = await getCourses({ status: "published", ...filters }).catch(() => []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 md:pt-40 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">আমাদের কোর্সসমূহ</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            আপনার স্বপ্নের ক্যারিয়ার শুরু করুন
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            বিশেষজ্ঞ প্রশিক্ষকদের সাথে হাতে-কলমে প্রশিক্ষণ নিন এবং ক্যারিয়ারে এগিয়ে যান
          </p>

          {/* Search */}
          <form className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                name="search"
                defaultValue={filters.search}
                placeholder="কোর্স খুঁজুন..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 outline-none focus:bg-white/15 transition-all"
              />
            </div>
            <button type="submit" className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">
              খুঁজুন
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[{ value: "", label: "সব কোর্স" }, ...Object.entries(TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))].map(({ value, label }) => (
            <Link
              key={value}
              href={value ? `/courses?type=${value}` : "/courses"}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                (filters.type || "") === value
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-slate-500 mb-6">{courses.length} টি কোর্স পাওয়া গেছে</p>

        {courses.length === 0 ? (
          <div className="text-center py-24">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">কোনো কোর্স পাওয়া যায়নি</h3>
            <p className="text-slate-400 mb-6">আপনার ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
            <Link href="/courses" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
              সব কোর্স দেখুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug_en || course.slug_bn}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-gradient-to-br from-blue-600 to-violet-600 overflow-hidden">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.name_bn || course.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-white/60" />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${TYPE_COLORS[course.course_type] || "bg-slate-100 text-slate-700"}`}>
                      {TYPE_LABELS[course.course_type] || course.course_type}
                    </span>
                    {course.is_featured && <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700">⭐ Featured</span>}
                  </div>
                </div>

                <div className="p-4">
                  {/* Category */}
                  {course.category_name_bn && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">{course.category_name_bn}</p>
                  )}

                  {/* Name */}
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.name_bn || course.name_en}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-1">{course.name_en}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.total_enrolled}</span>
                    {course.average_rating > 0 && (
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" /> {course.average_rating.toFixed(1)}</span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div>
                      {course.course_fee === 0 ? (
                        <span className="text-emerald-600 font-bold text-sm">বিনামূল্যে</span>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-base">৳{Number(course.course_fee).toLocaleString()}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                      বিস্তারিত <ArrowRight className="w-3.5 h-3.5" />
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
