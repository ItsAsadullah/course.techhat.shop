import { getStudents } from "@/lib/admin/actions/students";
import { PaymentForm } from "@/components/admin/payment-form";
import { getStudentEnrollmentOptions } from "@/lib/admin/actions/enrollments";

interface NewPaymentPageProps {
  searchParams: Promise<{ student_id?: string; enrollment_id?: string }>;
}

export default async function NewPaymentPage({ searchParams }: NewPaymentPageProps) {
  const { student_id, enrollment_id } = await searchParams;
  const [students, enrollments] = await Promise.all([getStudents(), getStudentEnrollmentOptions()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Receive Payment</h1>
        <p className="text-slate-500">Record a new payment from a student</p>
      </div>

      <PaymentForm students={students} enrollments={enrollments} defaultStudentId={student_id} defaultEnrollmentId={enrollment_id} />
    </div>
  );
}
