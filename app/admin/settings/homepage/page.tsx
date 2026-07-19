import { getSettingsByGroup } from '@/lib/actions/settings.actions';
import { HomepageSettingsForm } from '@/components/settings/HomepageSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function HomepageSettingsPage() {
  const homepageGroup = await getSettingsByGroup('homepage');

  if (!homepageGroup) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed">
        <p className="text-muted-foreground">Homepage settings not found. Please run the SQL seed script.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Homepage Content</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage all the text, numbers, and content displayed on the public homepage.
        </p>
      </div>
      
      <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle>Content Editor</CardTitle>
          <CardDescription>
            Update sections individually. Changes will apply immediately to the live site.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <HomepageSettingsForm initialGroup={homepageGroup} />
        </CardContent>
      </Card>
    </div>
  );
}
