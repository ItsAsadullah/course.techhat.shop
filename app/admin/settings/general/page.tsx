import { getSettingsByGroup } from '@/lib/actions/settings.actions';
import { GeneralSettingsForm } from '@/components/settings/GeneralSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function GeneralSettingsPage() {
  const generalGroup = await getSettingsByGroup('general');

  if (!generalGroup) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed">
        <p className="text-muted-foreground">General settings not found or not initialized.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">General Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your organization's basic details and branding.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>
            These details will be displayed publicly on the website and in system emails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeneralSettingsForm initialGroup={generalGroup} />
        </CardContent>
      </Card>
    </div>
  );
}
