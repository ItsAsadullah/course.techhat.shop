import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PrintButton } from "@/components/admin/print-button";
import { PrintStyles } from "@/components/admin/print-styles";
import { getPaymentById } from "@/lib/admin/actions/payments";

interface ReceiptPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const { id } = await params;
  const payment = await getPaymentById(id);

  if (!payment) {
    notFound();
  }

  const receiptNo = payment.id.slice(0, 8).toUpperCase();
  const translations: Record<string, unknown>[] = (payment.enrollment as unknown as Record<string, unknown>)?.course ? (((payment.enrollment as unknown as Record<string, unknown>).course as Record<string, unknown>).course_translations as Record<string, unknown>[]) : [];
  const courseName = (translations.find((item: Record<string, unknown>) => item.lang === "en")?.name || translations.find((item: Record<string, unknown>) => item.lang === "bn")?.name || "Legacy / Unassigned Payment") as string;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/payments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payments
          </Link>
        </Button>
        <PrintButton />
      </div>

      <Card className="max-w-2xl mx-auto print:shadow-none print:border-0">
        <CardContent className="p-8">
          <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              TechHat Computer Training Center
            </h1>
            <p className="text-slate-600">Money Receipt</p>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <p className="text-sm text-slate-500">Receipt No</p>
              <p className="font-mono font-medium">{receiptNo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium">
                {format(new Date(payment.payment_date), "MMMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <ReceiptRow
              label="Received From"
              value={payment.student?.name || "N/A"}
            />
            <ReceiptRow
              label="Phone Number"
              value={payment.student?.phone || "N/A"}
            />
            <ReceiptRow
              label="Course"
              value={courseName}
            />
            <ReceiptRow label="Payment Method" value={payment.payment_method} />
            <ReceiptRow
              label="Remarks"
              value={payment.remarks || "Course fee payment"}
            />
          </div>

          <div className="border-t-2 border-dashed border-slate-300 pt-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-slate-700">
                Amount Received
              </span>
              <span className="text-3xl font-bold text-slate-900">
                ৳{Number(payment.amount).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="border-t border-slate-400 pt-2">
              <p className="text-sm text-slate-600">Student Signature</p>
            </div>
            <div className="border-t border-slate-400 pt-2 text-right">
              <p className="text-sm text-slate-600">Authorized Signature</p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            Thank you for choosing TechHat Computer Training Center.
          </p>
        </CardContent>
      </Card>

      <PrintStyles />
    </div>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}
