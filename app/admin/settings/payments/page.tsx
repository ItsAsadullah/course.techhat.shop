import { getSettingsByGroup } from '@/lib/actions/settings.actions';
import { PaymentSettingsForm } from '@/components/settings/PaymentSettingsForm';

export const dynamic = 'force-dynamic';

export default async function PaymentSettingsPage() {
  const paymentsGroup = await getSettingsByGroup('payments');

  if (!paymentsGroup) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed">
        <p className="text-muted-foreground">Payment settings not found or not initialized.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage mobile banking numbers, Bangla QR code, and payment gateway configurations.
        </p>
      </div>
      
      <PaymentSettingsForm initialGroup={paymentsGroup} />
    </div>
  );
}
