"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPayment } from "@/lib/admin/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  BookOpen, 
  CalendarDays, 
  Banknote, 
  Wallet, 
  Hash, 
  FileText,
  MessageSquare,
  ArrowRight,
  Receipt,
  CreditCard
} from "lucide-react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import type { EnrollmentPaymentOption, Student } from "@/types/admin";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  students: Student[];
  enrollments: EnrollmentPaymentOption[];
  defaultStudentId?: string;
  defaultEnrollmentId?: string;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  colorTone,
  iconBg
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  colorTone: string;
  iconBg: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
      <div className={cn("absolute inset-x-0 top-0 h-1.5 opacity-90", accent)} />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          <p className="text-[14px] font-medium text-slate-500 tracking-tight">{title}</p>
          <div className={cn("text-4xl font-bold tracking-tight", colorTone)}>
            {value}
          </div>
          <p className="text-xs text-slate-500 font-medium line-clamp-1">{subtitle}</p>
        </div>
        <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", iconBg)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export function PaymentForm({ students, enrollments, defaultStudentId = "", defaultEnrollmentId = "" }: PaymentFormProps) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(defaultStudentId);
  const [enrollmentId, setEnrollmentId] = useState(defaultEnrollmentId);
  const [pending, startTransition] = useTransition();
  const options = useMemo(() => enrollments.filter((enrollment) => !studentId || enrollment.student_id === studentId), [enrollments, studentId]);
  const selected = options.find((enrollment) => enrollment.id === enrollmentId);

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await createPayment(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Payment recorded successfully.");
      router.push(`/admin/payments/receipt/${result.paymentId}`);
      router.refresh();
    });
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-8 max-w-5xl">
        
        {/* Metric Cards Top Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard 
            title="Course Fee" 
            value={selected ? `৳${selected.final_fee.toLocaleString()}` : "৳0"} 
            subtitle={selected ? selected.course_name : "Select a student first"}
            icon={Receipt}
            accent="bg-blue-500"
            colorTone="text-slate-900"
            iconBg="bg-blue-50 text-blue-600"
          />
          <MetricCard 
            title="Total Paid" 
            value={selected ? `৳${selected.total_paid.toLocaleString()}` : "৳0"} 
            subtitle="Already collected"
            icon={Wallet}
            accent="bg-emerald-500"
            colorTone="text-emerald-700"
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <MetricCard 
            title="Current Due" 
            value={selected ? `৳${selected.current_due.toLocaleString()}` : "৳0"} 
            subtitle="Pending collection"
            icon={Banknote}
            accent="bg-rose-500"
            colorTone="text-rose-700"
            iconBg="bg-rose-50 text-rose-600"
          />
        </div>

        <m.form 
          action={submit} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Banknote className="h-5 w-5 text-slate-400" />
              Payment Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill out the form below to record a new payment transaction.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="student_id" className="flex items-center gap-1.5 text-slate-700">
                  <User className="h-4 w-4 text-slate-400" />
                  Student <span className="text-rose-500">*</span>
                </Label>
                <select 
                  id="student_id" 
                  name="student_id" 
                  value={studentId} 
                  onChange={(event) => { setStudentId(event.target.value); setEnrollmentId(""); }} 
                  required 
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-blue-500 transition-colors shadow-sm"
                >
                  <option value="">Select a student...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name || student.full_name_en || student.full_name_bn || "Unnamed"} • {student.mobile}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment_id" className="flex items-center gap-1.5 text-slate-700">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  Course Enrollment <span className="text-rose-500">*</span>
                </Label>
                <select 
                  id="enrollment_id" 
                  name="enrollment_id" 
                  value={enrollmentId} 
                  onChange={(event) => setEnrollmentId(event.target.value)} 
                  disabled={!studentId} 
                  required 
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-blue-500 transition-colors shadow-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="">Select an active course...</option>
                  {options.map((enrollment) => (
                    <option key={enrollment.id} value={enrollment.id}>
                      {enrollment.course_name} • Due ৳{enrollment.current_due.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <AnimatePresence>
              {studentId && options.length === 0 && (
                <m.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <p>No payable course enrollment is available for this student. Please assign a course first.</p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            <div className="grid gap-6 md:grid-cols-3 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <Label htmlFor="payment_date" className="flex items-center gap-1.5 text-slate-700">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  Payment Date <span className="text-rose-500">*</span>
                </Label>
                <Input 
                  id="payment_date" 
                  name="payment_date" 
                  type="date" 
                  defaultValue={new Date().toISOString().slice(0, 10)} 
                  required 
                  className="h-11 rounded-xl shadow-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-1.5 text-slate-700">
                  <Banknote className="h-4 w-4 text-slate-400" />
                  Amount Paid (৳) <span className="text-rose-500">*</span>
                </Label>
                <Input 
                  id="amount" 
                  name="amount" 
                  type="number" 
                  min="0.01" 
                  max={selected?.current_due} 
                  step="0.01" 
                  placeholder="e.g. 5000"
                  required 
                  className="h-11 rounded-xl shadow-sm font-medium text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method" className="flex items-center gap-1.5 text-slate-700">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  Payment Method <span className="text-rose-500">*</span>
                </Label>
                <select 
                  id="payment_method" 
                  name="payment_method" 
                  defaultValue="Cash" 
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-blue-500 transition-colors shadow-sm"
                >
                  <option>Cash</option>
                  <option>Mobile Banking</option>
                  <option>Bank Transfer</option>
                  <option>Card</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <Label htmlFor="transaction_id" className="flex items-center gap-1.5 text-slate-700">
                  <Hash className="h-4 w-4 text-slate-400" />
                  Transaction ID
                </Label>
                <Input 
                  id="transaction_id" 
                  name="transaction_id" 
                  placeholder="e.g. TRXD82379K" 
                  className="h-11 rounded-xl shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference" className="flex items-center gap-1.5 text-slate-700">
                  <FileText className="h-4 w-4 text-slate-400" />
                  Reference
                </Label>
                <Input 
                  id="reference" 
                  name="reference" 
                  placeholder="e.g. Receipt No #203" 
                  className="h-11 rounded-xl shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks" className="flex items-center gap-1.5 text-slate-700">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                Remarks
              </Label>
              <Input 
                id="remarks" 
                name="remarks" 
                placeholder="Any optional notes about this payment..." 
                className="h-11 rounded-xl shadow-sm"
              />
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-5 sm:px-8 flex items-center justify-between border-t border-slate-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="rounded-xl h-11 px-6 font-medium text-slate-600 shadow-sm hover:bg-white hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={pending || !enrollmentId}
              className="rounded-xl h-11 px-8 font-semibold shadow-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300"
            >
              {pending ? "Recording..." : "Record Payment"}
              {!pending && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </m.form>
      </div>
    </LazyMotion>
  );
}
