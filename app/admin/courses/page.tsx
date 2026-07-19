import Link from "next/link";
import {
  Plus,
  Pencil,
  Star,
  TrendingUp,
  Eye,
  EyeOff,
  BarChart3,
  Flame,
  CheckCircle2,
  FileEdit,
  Archive,
  Search,
  X,
  Users,
  Layers,
  Code2,
  Palette,
  Network,
  Megaphone,
  Video,
  Calculator,
  GraduationCap,
} from "lucide-react";
import { getCourses } from "@/lib/admin/actions/courses";
import { Suspense } from "react";
import CourseListActions from "@/components/admin/courses/CourseListActions";
import type { CourseListItem } from "@/types/course";

interface CoursesPageProps {
  searchParams: Promise<{ search?: string; status?: string; type?: string }>;
}

const TYPE_LABELS: Record<string, string> = {
  offline: "অফলাইন",
  online: "অনলাইন",
  hybrid: "হাইব্রিড",
  workshop: "ওয়ার্কশপ",
  seminar: "সেমিনার",
  bootcamp: "বুটক্যাম্প",
  live_class: "লাইভ ক্লাস",
  recorded: "রেকর্ডেড",
};

const TYPE_COLORS: Record<string, string> = {
  offline: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  online: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  hybrid: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  workshop: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  seminar: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  bootcamp: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  live_class: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  recorded: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const STATUS_STYLES: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  published: {
    label: "প্রকাশিত",
    icon: CheckCircle2,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  draft: {
    label: "ড্রাফট",
    icon: FileEdit,
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  archived: {
    label: "আর্কাইভড",
    icon: Archive,
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
};

// A branded thumbnail fallback: pick an icon + gradient from the category/type.
const FALLBACK_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-sky-600",
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "web development": Code2,
  programming: Code2,
  "graphics & design": Palette,
  networking: Network,
  "digital marketing": Megaphone,
  "video editing": Video,
  accounting: Calculator,
  "microsoft office": GraduationCap,
};

function fallbackFor(course: CourseListItem) {
  const key = (course.category_name_en || "").toLowerCase();
  const Icon = CATEGORY_ICONS[key] || Layers;
  // Deterministic gradient from the course code so it's stable across renders.
  const seed = (course.course_code || course.id)
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const gradient = FALLBACK_GRADIENTS[seed % FALLBACK_GRADIENTS.length];
  return { Icon, gradient };
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const filters = await searchParams;
  const courses = await getCourses(filters).catch(() => []);

  const total = courses.length;
  const published = courses.filter((c) => c.status === "published").length;
  const draft = courses.filter((c) => c.status === "draft").length;
  const featured = courses.filter((c) => c.is_featured).length;

  const hasFilters = !!(filters.search || filters.status || filters.type);

  const stats = [
    {
      label: "মোট কোর্স",
      value: total,
      icon: BarChart3,
      gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/30",
    },
    {
      label: "প্রকাশিত",
      value: published,
      icon: Eye,
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/30",
    },
    {
      label: "ড্রাফট",
      value: draft,
      icon: EyeOff,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/30",
    },
    {
      label: "ফিচার্ড",
      value: featured,
      icon: Star,
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/30",
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-1 sm:px-2 pb-10">


      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, gradient, shadow }) => (
          <div
            key={label}
            className={`group relative overflow-hidden rounded-2xl ${gradient} p-4 shadow-lg ${shadow} transition-all hover:-translate-y-1 hover:shadow-xl sm:p-5 text-white`}
          >
            <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm ring-1 ring-white/30">
                <Icon className="h-6 w-6 drop-shadow-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-3xl font-bold leading-none tracking-tight drop-shadow-sm">
                  {value}
                </p>
                <p className="mt-1.5 truncate text-sm font-medium text-white/90">
                  {label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Toolbar */}
      <form className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="search"
            defaultValue={filters.search}
            placeholder="কোর্সের নাম বা কোড খুঁজুন…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
          />
        </div>
        <select
          name="status"
          defaultValue={filters.status || ""}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">সব স্ট্যাটাস</option>
          <option value="published">প্রকাশিত</option>
          <option value="draft">ড্রাফট</option>
          <option value="archived">আর্কাইভড</option>
        </select>
        <select
          name="type"
          defaultValue={filters.type || ""}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">সব ধরন</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Search className="h-4 w-4" /> ফিল্টার
          </button>
          {hasFilters && (
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" /> ক্লিয়ার
            </Link>
          )}
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> নতুন কোর্স
          </Link>
        </div>
      </form>

      {/* Course List */}
      {courses.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
            {hasFilters ? "কোনো কোর্স মেলেনি" : "কোনো কোর্স পাওয়া যায়নি"}
          </h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            {hasFilters
              ? "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।"
              : "নতুন একটি কোর্স তৈরি করে শুরু করুন।"}
          </p>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> {hasFilters ? "নতুন কোর্স" : "প্রথম কোর্স তৈরি করুন"}
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-left dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    কোর্স
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    ধরন
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    স্ট্যাটাস
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    ফি
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    ভর্তি
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    ব্যাজ
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map((course) => {
                  const status = STATUS_STYLES[course.status] || STATUS_STYLES.draft;
                  const StatusIcon = status.icon;
                  const { Icon: FallbackIcon, gradient } = fallbackFor(course);
                  return (
                    <tr
                      key={course.id}
                      className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                    >
                      {/* Course + thumbnail */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                            {course.thumbnail_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={course.thumbnail_url}
                                alt={course.name_en || course.course_code}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div
                                className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} text-white`}
                                aria-hidden="true"
                              >
                                <FallbackIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold leading-tight text-slate-900 dark:text-white">
                              {course.name_bn || course.name_en || "শিরোনামহীন"}
                            </p>
                            {course.name_en && (
                              <p className="mt-0.5 truncate text-xs text-slate-400">
                                {course.name_en}
                              </p>
                            )}
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                {course.course_code}
                              </span>
                              {course.category_name_bn && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                  <Layers className="h-3 w-3" />
                                  {course.category_name_bn}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            TYPE_COLORS[course.course_type] || TYPE_COLORS.offline
                          }`}
                        >
                          {TYPE_LABELS[course.course_type] || course.course_type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${status.cls}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="px-4 py-3">
                        {course.course_fee === 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                            বিনামূল্যে
                          </span>
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-white">
                            ৳{Number(course.course_fee).toLocaleString("en-US")}
                          </span>
                        )}
                      </td>

                      {/* Enrolled + rating */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            {course.total_enrolled} জন
                          </span>
                          {course.average_rating > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                              <Star className="h-3 w-3 fill-amber-500" />
                              {Number(course.average_rating).toFixed(1)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {course.is_featured && (
                            <span
                              title="ফিচার্ড"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20"
                            >
                              <Star className="h-3.5 w-3.5 fill-yellow-500" />
                            </span>
                          )}
                          {course.is_popular && (
                            <span
                              title="জনপ্রিয়"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-900/20"
                            >
                              <Flame className="h-3.5 w-3.5 fill-orange-500" />
                            </span>
                          )}
                          {course.is_trending && (
                            <span
                              title="ট্রেন্ডিং"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-900/20"
                            >
                              <TrendingUp className="h-3.5 w-3.5" />
                            </span>
                          )}
                          {!course.is_featured && !course.is_popular && !course.is_trending && (
                            <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="সম্পাদনা"
                            aria-label="সম্পাদনা"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <Suspense>
                            <CourseListActions course={course} />
                          </Suspense>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
