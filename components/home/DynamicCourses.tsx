"use client"

import Courses from "@/components/home/Courses"
import { useLang } from "@/context/GlobalLangContext"

interface NormalizedCourse {
  id: string;
  course_type: string;
  name_en: string;
  name_bn: string;
  slug_en: string;
  slug_bn: string;
  short_desc_en: string;
  short_desc_bn: string;
  thumbnail_url: string | null;
  course_fee: number;
  monthly_fee: number;
  discount_percent: number;
  duration_en: string;
  duration_bn: string;
  has_certificate: boolean;
  total_enrolled: number;
  is_featured: boolean;
  is_popular: boolean;
}

interface CourseDataProps {
  courseData: {
    online: NormalizedCourse[];
    offline: NormalizedCourse[];
    featured: NormalizedCourse[];
    popular: NormalizedCourse[];
    all: NormalizedCourse[];
  };
}

// Convert DB course to existing Courses component shape
function toStaticShape(c: NormalizedCourse) {
  return {
    name: c.name_bn || c.name_en,
    nameEn: c.name_en,
    slug: c.slug_en || c.slug_bn,
    mode: (c.course_type === "online" || c.course_type === "live_class" || c.course_type === "recorded" ? "online" : "offline") as "online" | "offline",
    monthlyFee: c.monthly_fee || c.course_fee,
    duration: c.duration_bn || c.duration_en || "৩ মাস",
    students: c.total_enrolled,
    image: c.thumbnail_url || undefined,
    features: [c.short_desc_en].filter(Boolean),
    badge: c.is_featured ? "⭐ Featured" : c.is_popular ? "🔥 Popular" : undefined,
    badgeColor: c.is_featured ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-red-100 text-red-700 border-red-200",
    // Required by Courses component type
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    color: "text-blue-600",
    icon: (() => () => null)(),
  };
}

export default function DynamicCourses({ courseData }: CourseDataProps) {
  const { isBn } = useLang();
  const onlineDB = courseData.online.map(toStaticShape);
  const offlineDB = courseData.offline.map(toStaticShape);

  return (
    <>
      {onlineDB.length > 0 && (
        <Courses
          id="online-courses"
          title="courses_online_title"
          subtitle="courses_online_sub"
          description="courses_online_desc"
          courses={onlineDB as any}
        />
      )}
      {offlineDB.length > 0 && (
        <Courses
          id="offline-courses"
          title="courses_offline_title"
          subtitle="courses_offline_sub"
          description="courses_offline_desc"
          courses={offlineDB as any}
          backgroundColor="bg-white dark:bg-slate-900"
        />
      )}
      {onlineDB.length === 0 && offlineDB.length === 0 && (
        <div className="py-24 text-center bg-slate-50 dark:bg-slate-950">
          <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-4xl mb-4 block">🎓</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{isBn ? "কোনো কোর্স পাওয়া যায়নি" : "No courses found"}</h3>
            <p className="text-slate-500 text-sm">{isBn ? "অ্যাডমিন প্যানেল থেকে নতুন কোর্স যোগ করলে তা এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।" : "Courses added from the admin panel will automatically appear here."}</p>
          </div>
        </div>
      )}
    </>
  );
}
