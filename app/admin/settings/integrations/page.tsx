import { getSettingsByGroup } from '@/lib/actions/settings.actions';
import { IntegrationsSettingsForm } from '@/components/settings/IntegrationsSettingsForm';

export const dynamic = 'force-dynamic';

export default async function IntegrationsSettingsPage() {
  const integrationsGroup = await getSettingsByGroup('integrations');

  if (!integrationsGroup) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed">
        <p className="text-muted-foreground">Integrations settings not found or not initialized.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations & API</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage third-party API connections, AI integrations, and external services.
        </p>
      </div>
      
      <IntegrationsSettingsForm initialGroup={integrationsGroup} />
    </div>
  );
}
