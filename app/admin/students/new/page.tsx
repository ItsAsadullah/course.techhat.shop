import AdmissionForm from "@/components/admission/AdmissionForm";

export const metadata = {
  title: "Add New Student | Admin Dashboard",
};

export default function NewStudentPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Add New Student
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Register a new student to the institute via the Enterprise Admission Form.
        </p>
      </div>

      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <AdmissionForm />
      </div>
    </div>
  );
}
