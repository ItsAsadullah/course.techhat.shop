"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { approveManualPayment, rejectManualPayment } from "@/lib/admin/actions/orders";

interface OrderApproveActionsProps {
  reviewId: string;
  studentName: string;
  trxId?: string;
  amountStr: string;
}

export function OrderApproveActions({
  reviewId,
  studentName,
  trxId,
  amountStr,
}: OrderApproveActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveManualPayment(reviewId);
      if (result.success) {
        toast.success(`✅ পেমেন্ট অ্যাপ্রুভ করা হয়েছে — ${studentName}`);
        setApproveOpen(false);
      } else {
        toast.error(result.error || "Approval failed.");
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectManualPayment(reviewId, rejectReason.trim() || undefined);
      if (result.success) {
        toast.success(`❌ পেমেন্ট রিজেক্ট করা হয়েছে — ${studentName}`);
        setRejectOpen(false);
        setRejectReason("");
      } else {
        toast.error(result.error || "Rejection failed.");
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-500 hover:bg-emerald-100 dark:bg-emerald-900/40 hover:text-emerald-800 dark:text-emerald-400 h-8 text-xs font-bold"
          onClick={() => setApproveOpen(true)}
          disabled={isPending}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 hover:bg-red-100 dark:bg-red-900/40 hover:text-red-700 dark:text-red-500 h-8 text-xs font-bold"
          onClick={() => setRejectOpen(true)}
          disabled={isPending}
        >
          <XCircle className="h-3.5 w-3.5" />
          Reject
        </Button>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>পেমেন্ট অ্যাপ্রুভ করুন</DialogTitle>
            <DialogDescription>
              এই পেমেন্ট অ্যাপ্রুভ করলে স্টুডেন্ট কোর্সে ভর্তি হয়ে যাবে।
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">স্টুডেন্ট</span>
              <span className="font-semibold text-slate-900 dark:text-slate-50">{studentName}</span>
            </div>
            {trxId && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">TrxID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-50">{trxId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">পরিমাণ</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-500">৳{amountStr}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)} disabled={isPending}>
              বাতিল
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              onClick={handleApprove}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              হ্যাঁ, অ্যাপ্রুভ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>পেমেন্ট রিজেক্ট করুন</DialogTitle>
            <DialogDescription>
              রিজেক্ট করলে স্টুডেন্ট আবার পেমেন্ট করতে পারবে।
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 text-sm">
              <p className="text-slate-500 dark:text-slate-400">স্টুডেন্ট: <span className="font-semibold text-slate-900 dark:text-slate-50">{studentName}</span></p>
              {trxId && <p className="text-slate-500 dark:text-slate-400 mt-1">TrxID: <span className="font-mono font-bold">{trxId}</span></p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                কারণ (ঐচ্ছিক)
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: ভুল পরিমাণ পাঠানো হয়েছে, ভুল TrxID..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={isPending}>
              বাতিল
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              রিজেক্ট করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
