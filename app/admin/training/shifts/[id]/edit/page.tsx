import { getTrainingShiftById } from "@/lib/admin/actions/training-shifts";
import { TrainingShiftForm } from "@/components/admin/training/TrainingShiftForm";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Training Shift",
};

export default async function EditTrainingShiftPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const shift = await getTrainingShiftById(resolvedParams.id);

  if (!shift || shift.status === 'archived') {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Edit Training Shift</h1>
        <p className="mt-1 text-sm text-slate-500">Update shift time schedule and details.</p>
      </div>

      <TrainingShiftForm mode="edit" initialData={shift} />
    </div>
  );
}
