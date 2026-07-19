import { TrainingLabForm } from "@/components/admin/training/TrainingLabForm";

export const metadata = {
  title: "Add Training Lab",
};

export default function NewTrainingLabPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Add Training Lab</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a new physical computer lab and define its capacity.</p>
      </div>

      <TrainingLabForm />
    </div>
  );
}
