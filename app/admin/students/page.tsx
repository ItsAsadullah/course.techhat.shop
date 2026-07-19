import Link from "next/link";
import { Plus, Search, Users, UserCheck, Download, Printer, UserCircle2, Filter, GraduationCap, Banknote, ShieldAlert, BadgeCheck } from "lucide-react";
import { StudentsActions } from "@/components/admin/students-actions";
import { StudentsFilter } from "@/components/admin/students-filter";
import { StudentsSearch } from "@/components/admin/students-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudents } from "@/lib/admin/actions/students";

interface StudentsPageProps {
  searchParams: Promise<{ search?: string; gender?: string; status?: string }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const { search, gender, status } = await searchParams;
  const students = await getStudents({ search, gender, status });

  // Compute stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const maleCount = students.filter(s => s.gender?.toLowerCase() === 'male').length;
  const femaleCount = students.filter(s => s.gender?.toLowerCase() === 'female').length;
  const dueStudents = students.filter(s => (s.current_due || 0) > 0).length;
  const fullyPaid = students.filter(s => s.total_course_fee > 0 && (s.current_due || 0) <= 0).length;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Total</p>
            <div className="bg-white/20 dark:bg-slate-900/20 p-1.5 rounded-lg text-white"><Users className="w-3.5 h-3.5" /></div>
          </div>
          <h2 className="text-xl font-black mt-2">{totalStudents}</h2>
        </div>

        <div className="p-3 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Active</p>
            <div className="bg-white/20 dark:bg-slate-900/20 p-1.5 rounded-lg text-white"><UserCheck className="w-3.5 h-3.5" /></div>
          </div>
          <h2 className="text-xl font-black mt-2">{activeStudents}</h2>
        </div>

        <div className="p-3 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Male/Female</p>
            <div className="bg-white/20 dark:bg-slate-900/20 p-1.5 rounded-lg text-white"><UserCircle2 className="w-3.5 h-3.5" /></div>
          </div>
          <div className="mt-2 flex items-end gap-1.5">
            <h2 className="text-xl font-black">{maleCount}</h2>
            <span className="text-white/70 font-bold pb-0.5 text-xs">/ {femaleCount}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-rose-500 to-rose-700 text-white">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Due</p>
            <div className="bg-white/20 dark:bg-slate-900/20 p-1.5 rounded-lg text-white"><ShieldAlert className="w-3.5 h-3.5" /></div>
          </div>
          <h2 className="text-xl font-black mt-2">{dueStudents}</h2>
        </div>

        <div className="p-3 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Fully Paid</p>
            <div className="bg-white/20 dark:bg-slate-900/20 p-1.5 rounded-lg text-white"><BadgeCheck className="w-3.5 h-3.5" /></div>
          </div>
          <h2 className="text-xl font-black mt-2">{fullyPaid}</h2>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[28px] overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
          
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <StudentsSearch defaultValue={search} />
            
            <div className="flex gap-2">
              <StudentsFilter />
            </div>
          </div>

          <StudentsActions studentsData={students} />
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[1200px]">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-300 sticky top-0 z-10">
              <tr>
                <th className="px-5 py-4 font-semibold text-[11px] uppercase tracking-widest w-16 text-center">SL</th>
                <th className="px-5 py-4 font-semibold text-[11px] uppercase tracking-widest">Student</th>
                <th className="px-5 py-4 font-semibold text-[11px] uppercase tracking-widest">Contact Info</th>
                <th className="px-5 py-4 font-semibold text-[11px] uppercase tracking-widest">Course & Batch</th>
                <th className="px-5 py-4 font-semibold text-[11px] uppercase tracking-widest text-right">Fee Status</th>
                <th className="px-5 py-4 font-semibold text-[11px] uppercase tracking-widest text-center">Status</th>
                <th className="px-5 py-4 font-semibold text-[11px] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Search className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-600 dark:text-slate-300">No students found.</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => {
                  const feeProgress = student.total_course_fee > 0 ? ((student.total_paid || 0) / student.total_course_fee) * 100 : 0;
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/50 transition-colors group">
                      {/* SL No */}
                      <td className="px-5 py-4 text-center text-slate-400 font-mono text-xs">{idx + 1}</td>
                      
                      {/* Student Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 shadow-sm">
                            {student.photo_url && (
                              <AvatarImage src={student.photo_url} alt={student.name} className="object-cover" />
                            )}
                            <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-sm">
                              {(student.name || "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 transition-colors">
                              {student.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              ID: {student.student_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-700 dark:text-slate-200 font-medium">{student.phone}</span>
                          {student.guardian_name && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              {student.guardian_name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Course & Batch */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {student.course ? (
                            <>
                              {student.course.thumbnail ? (
                                <img src={student.course.thumbnail} alt={student.course.name} className="w-14 h-9 rounded-md object-cover shadow-sm shrink-0" />
                              ) : (
                                <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
                                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                                </div>
                              )}
                              <div className="flex flex-col items-start gap-1">
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none font-semibold rounded-md">
                                  {student.course.name}
                                </Badge>
                                {student.batch_name && (
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium ml-1 flex items-center gap-1">
                                    {student.batch_name}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Not enrolled</span>
                          )}
                        </div>
                      </td>

                      {/* Fee Status */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-end w-32 ml-auto">
                          <div className="flex justify-between w-full text-xs font-bold mb-1.5">
                            <span className="text-slate-500 dark:text-slate-400">৳{Number(student.total_paid).toLocaleString()}</span>
                            <span className="text-slate-900 dark:text-slate-50">৳{Number(student.total_course_fee).toLocaleString()}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${feeProgress >= 100 ? 'bg-emerald-50 dark:bg-emerald-900/100' : feeProgress > 0 ? 'bg-indigo-500' : 'bg-slate-300'}`} 
                              style={{ width: `${Math.min(feeProgress, 100)}%` }}
                            />
                          </div>
                          {(student.current_due || 0) > 0 && (
                            <span className="text-[10px] text-rose-500 dark:text-rose-400 font-bold mt-1.5 uppercase tracking-wide">
                              Due: ৳{Number(student.current_due).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        {student.status === 'active' ? (
                          <Badge variant="outline" className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-500 capitalize font-bold tracking-wide rounded-lg">
                            Active
                          </Badge>
                        ) : student.status === 'completed' ? (
                          <Badge variant="outline" className="border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 capitalize font-bold tracking-wide rounded-lg">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 capitalize font-bold tracking-wide rounded-lg">
                            {student.status || 'Inactive'}
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold">
                          <Link href={`/admin/students/${student.id}`}>View Profile</Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
