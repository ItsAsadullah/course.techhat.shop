import { Metadata } from 'next';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { SettingsSavePanel } from '@/components/settings/SettingsSavePanel';
import { SettingsHeader } from '@/components/settings/SettingsHeader';

export const metadata: Metadata = {
  title: 'Settings | TechHat IT Institute',
  description: 'Enterprise Settings Management System',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[800px] overflow-hidden bg-muted/40 rounded-xl border">
      {/* Sidebar */}
      <SettingsSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <SettingsHeader />
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </div>
      </main>

      {/* Sticky Save Bar (Rendered globally for all setting pages) */}
      <SettingsSavePanel />
    </div>
  );
}
