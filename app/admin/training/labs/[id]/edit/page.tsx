import { getTrainingLabById } from "@/lib/admin/actions/training-labs";
import { TrainingLabForm } from "@/components/admin/training/TrainingLabForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Edit Training Lab",
};

export default async function EditTrainingLabPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lab = await getTrainingLabById(resolvedParams.id);
  
  if (!lab) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4">
        <div>
          <Link
            href={`/admin/training/labs/${lab.id}`}
            className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 mb-2 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Lab Details
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Edit Training Lab</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update this lab's information and training resources.</p>
        </div>
      </div>

      <TrainingLabForm mode="edit" labId={lab.id} initialData={lab} />
    </div>
  );
}
