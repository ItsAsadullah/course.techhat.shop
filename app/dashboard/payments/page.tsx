import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import { CreditCard, Receipt, AlertCircle, CheckCircle2, Clock, Download, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const studentId = user.user_metadata?.student_id;
  
  if (!studentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Profile Incomplete</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          Please complete your admission form to access payment records.
        </p>
      </div>
    );
  }

  const { getStudentPayments } = await import("@/lib/actions/studentData");
  const { payments, totalPaid, totalDue } = await getStudentPayments(studentId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Payments & Billing</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your course fees, installments, and invoices.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/25">
          <CreditCard className="w-5 h-5" /> Make a Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <p className="text-blue-100 font-medium mb-1">Total Paid</p>
            <h2 className="text-4xl font-black mb-6">{totalPaid}</h2>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <CheckCircle2 className="w-4 h-4" /> 1 Installment completed
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Due</p>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">{totalDue}</h2>
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 font-medium">
              <AlertCircle className="w-4 h-4" /> Next installment due by Nov 01
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-400" /> Payment History
          </h2>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-900 dark:text-white">{payment.id}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{payment.date}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900 dark:text-white mb-0.5 line-clamp-1">{payment.type}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{payment.courseName}</p>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-900 dark:text-white">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-5">
                      {payment.status === 'paid' ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Paid via {payment.method}</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">Due</Badge>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {payment.status === 'paid' ? (
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors text-xs">
                          <Download className="w-3.5 h-3.5" /> Receipt
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs">
                          Pay Now <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
