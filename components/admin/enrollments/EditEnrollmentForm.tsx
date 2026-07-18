"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  Landmark,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAdminEnrollment, type EnrollmentCourseOption } from "@/lib/admin/actions/enrollments";
import type { AdminEnrollmentListItem } from "@/types/admin";

type FormState = {
  batchId: string;
  status: "pending" | "active" | "completed" | "suspended" | "cancelled";
  courseFee: string;
  discountType: "fixed" | "percentage";
  discountValue: string;
  shiftId: string;
  certificateType: "none" | "institute" | "board";
  overrideCourseFee: boolean;
};

interface EditEnrollmentFormProps {
  enrollment: AdminEnrollmentListItem;
  courses: EnrollmentCourseOption[];
}

function numberValue(value: string) {
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function EditEnrollmentForm({ enrollment, courses }: EditEnrollmentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Find the course the user is enrolled in from the options to get its batches and shifts
  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === enrollment.course_id);
  }, [courses, enrollment.course_id]);

  const isPercentage = enrollment.discount_amount > 0 && enrollment.course_fee > 0 && 
    (enrollment.discount_amount / enrollment.course_fee * 100) % 1 === 0;

  const [state, setState] = useState<FormState>({
    batchId: enrollment.batch_id || "none",
    status: (enrollment.status as FormState["status"]) || "active",
    courseFee: enrollment.course_fee.toString(),
    discountType: isPercentage ? "percentage" : "fixed",
    discountValue: isPercentage ? ((enrollment.discount_amount / enrollment.course_fee) * 100).toString() : enrollment.discount_amount.toString(),
    shiftId: enrollment.shift_id || "none",
    certificateType: (enrollment.certificate_type as FormState["certificateType"]) || "none",
    overrideCourseFee: false, // Default false, admin must explicitly check to override
  });

  // Calculate isPercentage dynamically inside setState is fine, but we moved it inside for cleaner code.
  // Wait, I should keep the initial state logic above useState. Let's fix that.
  // Actually, I can just compute selectedBatch below state.
  
  const selectedBatch = useMemo(() => {
    return selectedCourse?.batches?.find((b: any) => b.id === state.batchId);
  }, [selectedCourse, state.batchId]);

  const update = (key: keyof FormState, value: any) => setState((s) => ({ ...s, [key]: value }));

  const calculations = useMemo(() => {
    const fee = numberValue(state.courseFee);
    let discount = 0;
    if (state.discountType === "fixed") {
      discount = numberValue(state.discountValue);
    } else {
      discount = (fee * numberValue(state.discountValue)) / 100;
    }
    const finalFee = Math.max(0, fee - discount);
    return { fee, discount, finalFee };
  }, [state.courseFee, state.discountType, state.discountValue]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    startTransition(async () => {
      const payload: any = {
        status: state.status,
        batch_id: state.batchId === "none" ? null : state.batchId,
        shift_id: state.shiftId === "none" ? null : state.shiftId,
        certificate_type: state.certificateType,
      };

      if (state.overrideCourseFee) {
        payload.final_fee = calculations.finalFee;
        payload.discount_amount = calculations.discount;
      }

      const res = await updateAdminEnrollment(enrollment.id, payload);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      
      toast.success("এনরোলমেন্ট আপডেট সম্পন্ন হয়েছে");
      router.push(`/admin/enrollments/${enrollment.id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Info (Read Only) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Course Information (Locked)</h2>
        </div>
        <div className="p-5 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Course Name</Label>
            <Input disabled value={enrollment.course_name} className="bg-slate-50" />
          </div>
          <div className="space-y-2">
            <Label>Student</Label>
            <Input disabled value={`${enrollment.student_name} (${enrollment.student_mobile})`} className="bg-slate-50" />
          </div>
        </div>
      </div>

      {/* Enrollment Status & Academic */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Status & Academic</h2>
        </div>
        <div className="p-5 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={state.status}
              onChange={(e) => update("status", e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          {selectedCourse?.batches && selectedCourse.batches.length > 0 && (
            <div className="space-y-2">
              <Label>Assign Batch</Label>
              <select
                value={state.batchId}
                onChange={(e) => update("batchId", e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">No batch assigned</option>
                {selectedCourse.batches.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedBatch?.shifts && selectedBatch.shifts.length > 0 && (
            <div className="space-y-2">
              <Label>Assign Shift</Label>
              <select
                value={state.shiftId}
                onChange={(e) => update("shiftId", e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">No shift assigned</option>
                {selectedBatch.shifts.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.name_en || s.name_bn}
                    {s.startTime ? ` (${s.startTime.slice(0, 5)} - ${s.endTime.slice(0, 5)})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Certificate Status</Label>
            <select
              value={state.certificateType}
              onChange={(e) => update("certificateType", e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">No Certificate / Pending</option>
              <option value="institute">Institute Certified</option>
              <option value="board">Board Certified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financial Adjustment */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900">Financial Adjustments</h2>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="override" 
              checked={state.overrideCourseFee}
              onChange={(e) => update("overrideCourseFee", e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
            />
            <Label htmlFor="override" className="cursor-pointer text-xs font-semibold text-blue-600">Override Course Fee</Label>
          </div>
        </div>
        
        {state.overrideCourseFee ? (
          <div className="p-5 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Base Course Fee</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-slate-500">৳</span>
                <Input type="number" value={state.courseFee} onChange={(e) => update("courseFee", e.target.value)} className="pl-7" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <select
                  value={state.discountType}
                  onChange={(e) => update("discountType", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fixed">Fixed (৳)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Discount Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-slate-500">
                    {state.discountType === "fixed" ? "৳" : "%"}
                  </span>
                  <Input
                    type="number"
                    value={state.discountValue}
                    onChange={(e) => update("discountValue", e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 rounded-lg bg-emerald-50 p-4 border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-800">New Final Course Fee</p>
                <p className="text-xs text-emerald-600 mt-0.5">Calculated after discount</p>
              </div>
              <p className="text-2xl font-bold font-mono text-emerald-700">
                ৳{calculations.finalFee.toLocaleString("en-BD")}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 text-sm text-slate-500 bg-slate-50/50">
            Check "Override Course Fee" if you need to adjust the discount or final fee for this enrollment.
            Currently Final Fee is: <span className="font-bold text-slate-700">৳{enrollment.final_fee.toLocaleString("en-BD")}</span>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Landmark className="mr-2 h-4 w-4" /> Save Changes</>
          )}
        </Button>
      </div>
    </form>
  );
}
