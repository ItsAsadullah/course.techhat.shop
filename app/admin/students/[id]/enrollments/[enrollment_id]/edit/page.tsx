import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditEnrollmentForm } from "@/components/admin/enrollments/EditEnrollmentForm";
import { getAdminEnrollmentById, getEnrollmentPageData } from "@/lib/admin/actions/enrollments";

export default async function EditAdminEnrollmentPage({ params }: { params: Promise<{ id: string; enrollment_id: string }> }) {
  const { id, enrollment_id } = await params;
  
  // Fetch both the enrollment details and the course options
  const enrollment = await getAdminEnrollmentById(enrollment_id);
  if (!enrollment) notFound();
  
  const data = await getEnrollmentPageData(id, enrollment.course_id); 

  if (!data) notFound();

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 pb-10">
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-2 text-slate-600">
          <Link href={`/admin/enrollments/${enrollment_id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Enrollment
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Edit Enrollment</h1>
            <p className="mt-1 text-sm text-slate-500">Modify status, batch, or financial details for this enrollment.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <Pencil className="h-3.5 w-3.5" />
            Edit Mode
          </span>
        </div>
      </div>
      
      <EditEnrollmentForm enrollment={enrollment} courses={data.courses} />
    </div>
  );
}
