import { TrainingShiftForm } from "@/components/admin/training/TrainingShiftForm";

export const metadata = {
  title: "Add Training Shift",
};

export default function NewTrainingShiftPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Add Training Shift</h1>
        <p className="mt-1 text-sm text-slate-500">Create a new time slot assigned to a lab.</p>
      </div>

      <TrainingShiftForm mode="create" />
    </div>
  );
}
