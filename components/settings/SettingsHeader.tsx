'use client';

import { Search, Download, Upload, Languages } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/lib/store/settings.store';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

export function SettingsHeader() {
  const { activeLanguage, setLanguage } = useSettingsStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b bg-background/80 px-4 py-3 backdrop-blur-md md:px-8">
      <div className="flex flex-col gap-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search settings (e.g. SMTP, Currency)..." 
            className="w-72 bg-muted/50 pl-9 rounded-full focus-visible:ring-primary/50"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
        
        <div className="hidden lg:flex items-center rounded-md border p-1 bg-muted/30">
          <Button 
            variant={activeLanguage === 'en' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 px-3 text-xs"
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
          <Button 
            variant={activeLanguage === 'bn' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-7 px-3 text-xs"
            onClick={() => setLanguage('bn')}
          >
            বাংলা
          </Button>
        </div>
        
        <Button variant="outline" size="sm" className="hidden lg:flex" onClick={() => alert('Import Feature')}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" size="sm" className="hidden lg:flex" onClick={() => alert('Export Feature')}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
