import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminEnrollmentForm } from "@/components/admin/enrollments/AdminEnrollmentForm";
import { getEnrollmentPageData } from "@/lib/admin/actions/enrollments";

export default async function NewAdminEnrollmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getEnrollmentPageData(id);
  if (!data) notFound();
  return <div className="mx-auto w-full max-w-[1500px] space-y-6 pb-10"><div className="space-y-3"><Button variant="ghost" size="sm" asChild className="-ml-2 gap-2 text-slate-600"><Link href={`/admin/students/${id}`}><ArrowLeft className="h-4 w-4" />Student Profile</Link></Button><div className="flex flex-wrap items-center gap-3"><div><h1 className="text-2xl font-bold tracking-tight text-slate-950">Assign Course</h1><p className="mt-1 text-sm text-slate-500">Enroll student into a course and configure enrollment and financial details.</p></div><span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"><BadgeCheck className="h-3.5 w-3.5" />Admin Direct Enrollment</span></div></div><AdminEnrollmentForm {...data} /></div>;
}
