import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRawStudentForEdit } from "@/lib/admin/actions/students";
import AdmissionForm from "@/components/admission/AdmissionForm";

interface EditStudentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;

  const student = await getRawStudentForEdit(id);

  if (!student) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 pb-10">
      <div>
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-3 h-8 gap-1.5 text-slate-500 hover:text-slate-950"
          >
            <Link href={`/admin/students/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Student Profile</h1>
        <p className="text-slate-500">Update the student's information using the admission form.</p>
      </div>

      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <AdmissionForm initialData={student} />
      </div>
    </div>
  );
}
