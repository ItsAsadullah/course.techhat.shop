import { TrainingBatchForm } from "@/components/admin/training/TrainingBatchForm";

export const metadata = {
  title: "Create Course Batch",
};

export default function NewTrainingBatchPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Create Course Batch</h1>
        <p className="mt-1 text-sm text-slate-500">Create a new batch, associate it with a course, and optionally assign a physical shift.</p>
      </div>

      <TrainingBatchForm />
    </div>
  );
}
