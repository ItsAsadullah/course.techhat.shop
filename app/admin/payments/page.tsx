import { getPayments, getPaymentMetrics } from "@/lib/admin/actions/payments";
import { PaymentsDashboard } from "@/components/admin/payments/PaymentsDashboard";

export default async function PaymentsPage() {
  const [payments, metrics] = await Promise.all([
    getPayments(),
    getPaymentMetrics()
  ]);

  return (
    <PaymentsDashboard payments={payments} metrics={metrics} />
  );
}
