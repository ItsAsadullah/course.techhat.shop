'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, Building2, Globe, UserPlus, BookOpen, 
  Users, Clock, FileText, Award, CreditCard, Mail, 
  Bell, Shield, Lock, Languages, Palette, LineChart, 
  Plug, Database, Archive, History, Code 
} from 'lucide-react';
import { motion } from 'framer-motion';

const SETTINGS_CATEGORIES = [
  { group: 'Core', items: [
    { name: 'General', slug: 'general', icon: Settings },
    { name: 'Organization', slug: 'organization', icon: Building2 },
    { name: 'Website', slug: 'website', icon: Globe },
    { name: 'Homepage Content', slug: 'homepage', icon: FileText },
  ]},
  { group: 'Academic', items: [
    { name: 'Admissions', slug: 'admissions', icon: UserPlus },
    { name: 'Courses', slug: 'courses', icon: BookOpen },
    { name: 'Course Categories', slug: 'categories', icon: BookOpen },
    { name: 'Students', slug: 'students', icon: Users },
    { name: 'Attendance', slug: 'attendance', icon: Clock },
    { name: 'Examinations', slug: 'examinations', icon: FileText },
    { name: 'Certificates', slug: 'certificates', icon: Award },
  ]},
  { group: 'Finance', items: [
    { name: 'Payments', slug: 'payments', icon: CreditCard },
  ]},
  { group: 'Communication', items: [
    { name: 'SMS & Email', slug: 'sms-email', icon: Mail },
    { name: 'Notifications', slug: 'notifications', icon: Bell },
  ]},
  { group: 'System', items: [
    { name: 'Users & Roles', slug: 'users-roles', icon: Shield },
    { name: 'Security', slug: 'security', icon: Lock },
    { name: 'Localization', slug: 'localization', icon: Languages },
    { name: 'Appearance', slug: 'appearance', icon: Palette },
  ]},
  { group: 'Advanced', items: [
    { name: 'Analytics', slug: 'analytics', icon: LineChart },
    { name: 'Integrations', slug: 'integrations', icon: Plug },
    { name: 'Storage', slug: 'storage', icon: Database },
    { name: 'Backup & Restore', slug: 'backup-restore', icon: Archive },
    { name: 'Audit Logs', slug: 'audit-logs', icon: History },
    { name: 'Developer', slug: 'developer', icon: Code },
  ]}
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background/50 backdrop-blur-xl hidden md:flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold tracking-tight">Settings Hub</h2>
        <p className="text-xs text-muted-foreground mt-1">Manage system configurations</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {SETTINGS_CATEGORIES.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.group}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === `/admin/settings/${item.slug}`;
                  const Icon = item.icon;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={`/admin/settings/${item.slug}`}
                        className={cn(
                          "relative flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors",
                          isActive 
                            ? "text-admin-primary font-medium bg-admin-primary/10" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 w-1 h-full bg-admin-primary rounded-r-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
