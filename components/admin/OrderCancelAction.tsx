"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cancelOrder } from "@/lib/admin/actions/orders";

export function OrderCancelAction({
  orderId,
  studentName,
}: {
  orderId: string;
  studentName: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await cancelOrder(orderId);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to cancel order");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <XCircle className="h-4 w-4" />
          Cancel Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>অর্ডার বাতিল করুন</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              আপনি কি নিশ্চিত যে <strong>{studentName}</strong> এর এই অর্ডারটি বাতিল করতে চান?
            </span>
            <span className="block text-red-600 dark:text-red-500 font-medium">
              এই প্রক্রিয়াটি আর পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>ফিরে যান</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            হ্যাঁ, বাতিল করুন
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
