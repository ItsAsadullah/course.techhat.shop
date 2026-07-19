import Link from "next/link";
import { ArrowLeft, Search, GraduationCap, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudents } from "@/lib/admin/actions/students";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function SelectStudentForEnrollmentPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  // Fetch students based on the search query.
  // We limit the UI to top 50 if no search is provided to prevent huge lists.
  let students = await getStudents({ search });
  
  if (!search) {
    students = students.slice(0, 50);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      {/* Header */}
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-2 text-slate-600 dark:text-slate-300">
          <Link href="/admin/enrollments">
            <ArrowLeft className="h-4 w-4" />
            Back to Enrollments
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Select Student</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search and select a student to assign them to a new course.
          </p>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
        <form className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="search"
            defaultValue={search || ""}
            placeholder="Search by name, phone or reg no..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-400/30"
            autoFocus
          />
          <button type="submit" className="hidden" />
        </form>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/admin/students/new">
              <Plus className="mr-2 h-4 w-4" /> New Student
            </Link>
          </Button>
        </div>
      </div>

      {/* Student List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {students.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900/50">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-50">No students found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try searching with different keywords or create a new student.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/admin/students/${student.id}/enrollments/new`}
                className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/70"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-700 shadow-sm">
                    {student.photo_url && (
                      <AvatarImage src={student.photo_url} alt={student.name} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 font-bold text-sm">
                      {(student.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">{student.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{student.mobile || "No mobile"}</span>
                      {student.registration_no && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="font-mono">{student.registration_no}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Assign Course
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
