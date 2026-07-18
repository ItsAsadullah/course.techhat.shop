import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "@/types/admin";
import { ArrowRight, Wallet, Banknote } from "lucide-react";

interface RecentPaymentsProps {
  payments: Payment[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[24px] overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-6 px-8 border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-800">Recent Transactions</CardTitle>
        <Link 
          href="/admin/payments" 
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        {payments.length === 0 ? (
          <div className="py-10 text-center text-sm font-medium text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No transactions yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-5 rounded-[20px] border border-slate-100 bg-white hover:bg-slate-50/80 hover:shadow-lg hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-indigo-600 flex items-center justify-center group-hover:from-indigo-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-indigo-100 group-hover:border-transparent">
                    {payment.payment_method?.toLowerCase() === 'bank' ? (
                      <Banknote className="h-5 w-5" strokeWidth={2} />
                    ) : (
                      <Wallet className="h-5 w-5" strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[15px] group-hover:text-indigo-950 transition-colors">
                      {payment.student?.name || "Unknown Student"}
                    </p>
                    <p className="text-[12px] font-semibold text-slate-500 mt-1 flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">{format(new Date(payment.payment_date), "MMM d, yyyy")}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="uppercase tracking-wider text-[10px] text-slate-400">{payment.payment_method}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-extrabold text-slate-900 text-base tracking-tight">
                    ৳{Number(payment.amount).toLocaleString()}
                  </p>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-lg px-2">
                    {payment.student?.course?.name || "General"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
