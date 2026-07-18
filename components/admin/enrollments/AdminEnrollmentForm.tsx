"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Landmark,
  Loader2,
  Mail,
  Phone,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdminEnrollment, type EnrollmentCourseOption } from "@/lib/admin/actions/enrollments";
import type { Student } from "@/types/admin";

type FormState = {
  courseId: string;
  batchId: string;
  enrollmentDate: string;
  startDate: string;
  status: "pending" | "active" | "completed" | "suspended" | "cancelled";
  courseFee: string;
  discountType: "fixed" | "percentage";
  discountValue: string;
  initialPaidAmount: string;
  paymentMethod: string;
  paymentDate: string;
  transactionId: string;
  reference: string;
  remarks: string;
  shiftId: string;
  certificateType: "none" | "institute" | "board";
  overrideCourseFee: boolean;
  feeOverrideReason: string;
};

interface AdminEnrollmentFormProps {
  student: Student & { photo_url?: string | null; active_enrollment_count: number };
  courses: EnrollmentCourseOption[];
}

const today = new Date().toISOString().slice(0, 10);

function money(value: number) {
  return value.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function numberValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
}

export function AdminEnrollmentForm({ student, courses }: AdminEnrollmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>({
    courseId: "",
    batchId: "",
    shiftId: "",
    enrollmentDate: today,
    startDate: "",
    status: "active",
    courseFee: "",
    overrideCourseFee: false,
    feeOverrideReason: "",
    certificateType: "none",
    discountType: "fixed",
    discountValue: "0",
    initialPaidAmount: "0",
    paymentMethod: "Cash",
    paymentDate: today,
    transactionId: "",
    reference: "",
    remarks: "",
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === form.courseId),
    [courses, form.courseId],
  );
  const selectedBatch = selectedCourse?.batches.find((batch) => batch.id === form.batchId);
  const courseFee = form.overrideCourseFee ? numberValue(form.courseFee) : (selectedCourse?.defaultFee || 0);
  let certFee = 0;
  if (form.certificateType === "institute") {
    certFee = selectedCourse?.instituteCertificateFee || 0;
  } else if (form.certificateType === "board") {
    certFee = (selectedCourse?.boardRegistrationFee || 0) + (selectedCourse?.boardCertificateFee || 0);
  }
  const baseFee = courseFee + certFee;
  
  const discountValue = numberValue(form.discountValue);
  const discountAmount = form.discountType === "percentage"
    ? Math.min(baseFee, (baseFee * Math.min(discountValue, 100)) / 100)
    : Math.min(baseFee, discountValue);
  const finalFee = Math.max(baseFee - discountAmount, 0);
  const paid = numberValue(form.initialPaidAmount);
  const due = Math.max(finalFee - paid, 0);
  const paymentProgress = finalFee > 0 ? Math.min((paid / finalFee) * 100, 100) : 100;
  const recordPayment = paid > 0;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function selectCourse(courseId: string) {
    const course = courses.find((entry) => entry.id === courseId);
    setForm((current) => ({
      ...current,
      courseId,
      batchId: "",
      shiftId: "",
      courseFee: course ? String(course.defaultFee) : "",
      overrideCourseFee: false,
      feeOverrideReason: "",
      certificateType: "none",
      startDate: "",
    }));
  }

  function selectBatch(batchId: string) {
    const batch = selectedCourse?.batches.find((entry) => entry.id === batchId);
    let defaultShiftId = "";
    
    if (batch?.shifts && batch.shifts.length === 1) {
      // Auto-select if there's only one shift
      defaultShiftId = batch.shifts[0].id;
    }

    setForm((current) => ({
      ...current,
      batchId,
      startDate: batch?.startDate ?? current.startDate,
      shiftId: defaultShiftId
    }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createAdminEnrollment({
        studentId: student.id,
        courseId: form.courseId,
        batchId: form.batchId || null,
        shiftId: form.shiftId || null,
        enrollmentDate: form.enrollmentDate,
        startDate: form.startDate || null,
        status: form.status,
        courseFee: form.overrideCourseFee ? courseFee : (selectedCourse?.defaultFee || 0),
        overrideCourseFee: form.overrideCourseFee,
        feeOverrideReason: form.feeOverrideReason || null,
        certificateType: form.certificateType,
        discountType: form.discountType,
        discountValue,
        initialPaidAmount: paid,
        paymentMethod: recordPayment ? form.paymentMethod : null,
        paymentDate: recordPayment ? form.paymentDate : null,
        transactionId: form.transactionId || null,
        reference: form.reference || null,
        remarks: form.remarks || null,
      });

      if (!result.success) {
        toast.error(result.error.message);
        return;
      }

      toast.success("কোর্স সফলভাবে এনরোল করা হয়েছে।");
      router.push(`/admin/students/${student.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <section className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
              {student.photo_url ? <img /* eslint-disable-line @next/next/no-img-element */ src={student.photo_url} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-6 w-6" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-base font-bold text-slate-950">{student.full_name_en || student.full_name_bn || "Unnamed student"}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" /> {student.active_enrollment_count} active</span>
              </div>
              {student.full_name_bn ? <p className="mt-0.5 text-sm text-slate-500">{student.full_name_bn}</p> : null}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{student.mobile || "No mobile"}</span>
                {student.email ? <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{student.email}</span> : null}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 p-5 sm:p-6">
          <SectionTitle icon={<BookOpen className="h-4 w-4" />} title="Course Selection" description="Select the course and applicable class batch." />
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Course" required>
              <select value={form.courseId} onChange={(event) => selectCourse(event.target.value)} required className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="">Select a course</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.name} · {course.courseCode}</option>)}
              </select>
            </Field>
            <Field label="Batch" hint={selectedCourse?.type === "offline" ? "Required when this course uses a batch" : "Optional for online courses"}>
              <select value={form.batchId} onChange={(event) => selectBatch(event.target.value)} disabled={!selectedCourse || selectedCourse.batches.length === 0} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="">{selectedCourse?.batches.length ? "No batch selected" : "No available batches"}</option>
                {selectedCourse?.batches.map((batch) => {
                  const isUnselectable = !!batch.capacityError || !!batch.capacity?.isFull;
                  let capText = "";
                  if (batch.capacityError) {
                    capText = "Capacity not configured";
                  } else if (batch.capacity) {
                    if (batch.capacity.isFull) {
                      capText = `${batch.capacity.total} / ${batch.capacity.total} students (Full)`;
                    } else {
                      capText = `${batch.capacity.occupied} / ${batch.capacity.total} students (${batch.capacity.available} seats left)`;
                    }
                  }
                  return (
                    <option key={batch.id} value={batch.id} disabled={isUnselectable}>
                      {batch.name}
                      {batch.session ? ` · ${batch.session}` : ""}
                      {capText ? ` · ${capText}` : ""}
                    </option>
                  );
                })}
              </select>
              {selectedBatch?.capacity?.isFull ? <p className="mt-1.5 text-xs font-medium text-rose-600">This batch is full.</p> : null}
              {selectedBatch?.capacityError ? <p className="mt-1.5 text-xs font-medium text-rose-600">Capacity not configured.</p> : null}
            </Field>

            {selectedBatch?.shifts && selectedBatch.shifts.length > 0 && (
               <Field label="Shift" required>
                  <select value={form.shiftId} onChange={(event) => update("shiftId", event.target.value)} required className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="">Select a shift</option>
                    {selectedBatch.shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.name} ({shift.startTime.slice(0,5)} - {shift.endTime.slice(0,5)})
                      </option>
                    ))}
                  </select>
               </Field>
            )}
          </div>
        </section>

        <section className="border-b border-slate-100 p-5 sm:p-6">
          <SectionTitle icon={<CalendarDays className="h-4 w-4" />} title="Enrollment" description="Set access status and relevant dates." />
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field label="Enrollment status" required>
              <select value={form.status} onChange={(event) => update("status", event.target.value as FormState["status"])} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select>
            </Field>
            <Field label="Enrollment date" required><Input type="date" value={form.enrollmentDate} onChange={(event) => update("enrollmentDate", event.target.value)} required /></Field>
            <Field label="Start date"><Input type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} /></Field>
          </div>
        </section>

        <section className="border-b border-slate-100 p-5 sm:p-6">
          <SectionTitle icon={<CircleDollarSign className="h-4 w-4" />} title="Financial Information" description="All totals are recalculated and verified on the server." />
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-4">
              <Field label="Course fee (৳)" required>
                {form.overrideCourseFee ? (
                  <Input type="number" min="0" step="0.01" value={form.courseFee} onChange={(event) => update("courseFee", event.target.value)} required />
                ) : (
                  <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">৳{money(selectedCourse?.defaultFee || 0)}</div>
                )}
              </Field>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input type="checkbox" checked={form.overrideCourseFee} onChange={(e) => update("overrideCourseFee", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Override default fee
              </label>
              {form.overrideCourseFee ? (
                <Field label="Reason for override" required>
                  <Input value={form.feeOverrideReason} onChange={(event) => update("feeOverrideReason", event.target.value)} placeholder="Required when overriding fee" required />
                </Field>
              ) : null}
            </div>

            <Field label="Certificate Type">
              <select value={form.certificateType} onChange={(event) => update("certificateType", event.target.value as FormState["certificateType"])} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="none">None</option>
                <option value="institute">Institute Certificate (+৳{money(selectedCourse?.instituteCertificateFee || 0)})</option>
                {selectedCourse?.supportsBoardCertificate ? (
                  <option value="board">Board Certificate (+৳{money((selectedCourse?.boardRegistrationFee || 0) + (selectedCourse?.boardCertificateFee || 0))})</option>
                ) : null}
              </select>
              {selectedCourse?.boardRegistrationRequired && form.certificateType !== "board" ? (
                <p className="mt-1.5 text-[11px] font-medium text-amber-600">Board certificate is strongly recommended for this course.</p>
              ) : null}
            </Field>

            <Field label="Discount type">
              <select value={form.discountType} onChange={(event) => update("discountType", event.target.value as FormState["discountType"])} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="fixed">Fixed amount</option>
                <option value="percentage">Percentage</option>
              </select>
            </Field>
            <Field label={form.discountType === "percentage" ? "Discount (%)" : "Discount (৳)"}>
              <Input type="number" min="0" max={form.discountType === "percentage" ? 100 : undefined} step="0.01" value={form.discountValue} onChange={(event) => update("discountValue", event.target.value)} />
            </Field>
          </div>
          <div className="mt-5 max-w-xs">
            <Field label="Final fee"><div className="flex h-10 items-center rounded-lg border border-blue-100 bg-blue-50 px-3 text-sm font-bold text-blue-700">৳{money(finalFee)}</div></Field>
          </div>
        </section>

        <section className="p-5 sm:p-6">
          <SectionTitle icon={<CreditCard className="h-4 w-4" />} title="Initial Payment" description="Leave paid amount at zero when no payment is collected today." />
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field label="Initial paid amount (৳)"><Input type="number" min="0" max={finalFee} step="0.01" value={form.initialPaidAmount} onChange={(event) => update("initialPaidAmount", event.target.value)} /></Field>
            {recordPayment ? <><Field label="Payment method" required><select value={form.paymentMethod} onChange={(event) => update("paymentMethod", event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="Cash">Cash</option><option value="Mobile Banking">Mobile Banking</option><option value="Bank Transfer">Bank Transfer</option><option value="Card">Card</option></select></Field><Field label="Payment date" required><Input type="date" value={form.paymentDate} onChange={(event) => update("paymentDate", event.target.value)} required /></Field></> : null}
          </div>
          {recordPayment ? <div className="mt-5 grid gap-5 md:grid-cols-3"><Field label="Transaction ID"><Input value={form.transactionId} onChange={(event) => update("transactionId", event.target.value)} placeholder="Optional" /></Field><Field label="Reference"><Input value={form.reference} onChange={(event) => update("reference", event.target.value)} placeholder="Optional" /></Field><Field label="Remarks"><Input value={form.remarks} onChange={(event) => update("remarks", event.target.value)} placeholder="Optional" /></Field></div> : null}
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-6">
        <div className="border-b border-slate-100 p-5"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><ReceiptText className="h-4 w-4 text-blue-600" />Live summary</h2><p className="mt-1 text-xs text-slate-500">Review the enrollment before confirming.</p></div>
        <div className="space-y-5 p-5">
          <SummaryIdentity icon={<UserRound className="h-4 w-4" />} label="Student" primary={student.full_name_en || student.full_name_bn || "Unnamed student"} secondary={student.mobile || "No mobile"} />
          <SummaryIdentity icon={<BookOpen className="h-4 w-4" />} label="Course" primary={selectedCourse?.name || "Not selected"} secondary={selectedBatch ? `${selectedBatch.name}${form.shiftId ? ` · ${selectedBatch.shifts?.find(s => s.id === form.shiftId)?.name || 'Shift'}` : ''}` : "No batch selected"} />
          <div className="space-y-3 border-y border-slate-100 py-4 text-sm"><SummaryRow label="Course fee" value={`৳${money(courseFee)}`} />{certFee > 0 ? <SummaryRow label="Certificate fee" value={`৳${money(certFee)}`} /> : null}<SummaryRow label="Discount" value={`−৳${money(discountAmount)}`} valueClass="text-amber-700" /><SummaryRow label="Final fee" value={`৳${money(finalFee)}`} valueClass="font-bold text-blue-700" /><SummaryRow label="Total paid" value={`৳${money(paid)}`} valueClass="text-emerald-700" /><SummaryRow label="Current due" value={`৳${money(due)}`} valueClass={due > 0 ? "text-rose-700" : "text-emerald-700"} /></div>
          <div><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium text-slate-600">Payment progress</span><span className="font-bold text-slate-900">{paymentProgress.toFixed(1)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${paymentProgress}%` }} /></div></div>
          {due > 0 ? <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"><Landmark className="mt-0.5 h-4 w-4 shrink-0" />Remaining due will stay attached to this enrollment.</div> : <div className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />This enrollment will be fully paid.</div>}
          <Button type="submit" disabled={isPending || !form.courseId || Boolean(selectedBatch && (selectedBatch.capacity?.isFull || selectedBatch.capacityError)) || Boolean(selectedBatch?.shifts && selectedBatch.shifts.length > 0 && !form.shiftId)} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">{isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Confirming...</> : <><ShieldCheck className="h-4 w-4" />Confirm Enrollment</>}</Button>
        </div>
      </aside>
    </form>
  );
}

function SectionTitle({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) { return <div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><span className="text-blue-600">{icon}</span>{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>; }
function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) { return <div className="space-y-2"><Label className="text-xs font-semibold text-slate-700">{label}{required ? <span className="ml-0.5 text-rose-600">*</span> : null}</Label>{children}{hint ? <p className="text-[11px] leading-4 text-slate-500">{hint}</p> : null}</div>; }
function SummaryIdentity({ icon, label, primary, secondary }: { icon: React.ReactNode; label: string; primary: string; secondary: string }) { return <div className="flex gap-3"><div className="mt-0.5 text-slate-400">{icon}</div><div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{primary}</p><p className="mt-0.5 truncate text-xs text-slate-500">{secondary}</p></div></div>; }
function SummaryRow({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) { return <div className="flex items-center justify-between gap-4"><span className="text-slate-500">{label}</span><span className={`font-mono font-semibold ${valueClass}`}>{value}</span></div>; }
