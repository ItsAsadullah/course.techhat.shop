'use client';

import { useEffect, useCallback } from 'react';
import { useSettingsStore, SettingGroup } from '@/lib/store/settings.store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateSettings } from '@/lib/actions/settings.actions';
import { toast } from 'sonner';
import FileUpload from '@/components/ui/FileUpload';

interface GeneralSettingsFormProps {
  initialGroup: SettingGroup;
}

export function GeneralSettingsForm({ initialGroup }: GeneralSettingsFormProps) {
  const { 
    updateSetting, 
    updateSettingBn, 
    draftSettings, 
    draftSettingsBn, 
    isDirty,
    clearDirtyFlag,
    activeLanguage,
    setSaveAction
  } = useSettingsStore();

  // Populate local form state fallback
  const getValue = (key: string, type: 'en' | 'bn') => {
    if (type === 'en') {
      if (draftSettings[key] !== undefined) return draftSettings[key] || '';
    } else {
      if (draftSettingsBn[key] !== undefined) return draftSettingsBn[key] || '';
    }
    
    const setting = initialGroup.settings.find(s => s.key === key);
    if (!setting) return '';

    if (type === 'en') {
      return setting.value || setting.defaultValue || '';
    } else {
      return setting.valueBn || setting.value || setting.defaultValue || '';
    }
  };

  const handleSave = useCallback(async () => {
    const keys = Array.from(new Set([...Object.keys(draftSettings), ...Object.keys(draftSettingsBn)]));
    const payload = keys.map(key => ({
      key,
      value: draftSettings[key] ?? null,
      valueBn: draftSettingsBn[key] ?? null,
    }));
    
    const result = await updateSettings(initialGroup.id, payload);
    
    if (result.success) {
      toast.success('Settings saved successfully');
      clearDirtyFlag();
    } else {
      toast.error('Failed to save settings: ' + result.error);
    }
  }, [draftSettings, draftSettingsBn, initialGroup.id, clearDirtyFlag]);

  useEffect(() => {
    setSaveAction(handleSave);
    // Remove the aggressive cleanup of nulling it out, which might cause race conditions
  }, [handleSave, setSaveAction]);

  // We expose handleSave to the sticky panel via an event or ref, 
  // but for now let's just render the fields. The SavePanel can trigger a global save.
  // Actually, a better pattern is triggering the server action in the SavePanel by subscribing to the draft state,
  // OR the SavePanel is just a wrapper that calls a function.
  // We'll update SavePanel later to handle this cleanly.

  const isBn = activeLanguage === 'bn';

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">{isBn ? initialGroup.nameBn : initialGroup.nameEn}</h3>
        <p className="text-sm text-muted-foreground">
          {initialGroup.description}
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="org_name">{isBn ? 'সংস্থার নাম' : 'Organization Name'}</Label>
          <Input 
            id="org_name" 
            value={getValue('org_name', activeLanguage)}
            onChange={(e) => isBn ? updateSettingBn('org_name', e.target.value) : updateSetting('org_name', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="org_short_name">{isBn ? 'সংক্ষিপ্ত নাম' : 'Short Name'}</Label>
          <Input 
            id="org_short_name" 
            value={getValue('org_short_name', activeLanguage)}
            onChange={(e) => isBn ? updateSettingBn('org_short_name', e.target.value) : updateSetting('org_short_name', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="org_subtitle">{isBn ? 'প্রতিষ্ঠানের সাবটাইটেল' : 'Organization Subtitle'}</Label>
          <Input 
            id="org_subtitle" 
            placeholder="Computer Training Center"
            value={getValue('org_subtitle', activeLanguage)}
            onChange={(e) => isBn ? updateSettingBn('org_subtitle', e.target.value) : updateSetting('org_subtitle', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="site_domain">Website Domain (e.g. course.techhat.shop)</Label>
          <Input 
            id="site_domain" 
            placeholder="course.techhat.shop"
            value={getValue('site_domain', 'en')}
            onChange={(e) => updateSetting('site_domain', e.target.value)}
            disabled={isBn}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="org_email">Support Email</Label>
            <Input 
              id="org_email" 
              type="email"
              value={getValue('org_email', 'en')}
              onChange={(e) => updateSetting('org_email', e.target.value)}
              disabled={isBn} // Email shouldn't be translated
            />
            {isBn && <span className="text-xs text-muted-foreground">This field is only editable in English.</span>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="org_phone">Support Phone</Label>
            <Input 
              id="org_phone" 
              value={getValue('org_phone', 'en')}
              onChange={(e) => updateSetting('org_phone', e.target.value)}
              disabled={isBn}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="primary_color">Primary Brand Color</Label>
          <div className="flex items-center gap-4">
            <Input 
              id="primary_color" 
              type="color"
              className="w-16 h-10 p-1"
              value={getValue('primary_color', 'en')}
              onChange={(e) => updateSetting('primary_color', e.target.value)}
              disabled={isBn}
            />
            <Input 
              value={getValue('primary_color', 'en')}
              onChange={(e) => updateSetting('primary_color', e.target.value)}
              className="w-32 font-mono uppercase"
              disabled={isBn}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <FileUpload
              label="Site Logo (Header)"
              value={getValue('site_logo', 'en')}
              onUpload={(url) => updateSetting('site_logo', url)}
              onRemove={() => updateSetting('site_logo', '')}
              folder="settings"
              accept="image/*"
            />
          </div>
          <div className="space-y-2">
            <FileUpload
              label="Favicon (Icon)"
              value={getValue('site_favicon', 'en')}
              onUpload={(url) => updateSetting('site_favicon', url)}
              onRemove={() => updateSetting('site_favicon', '')}
              folder="settings"
              accept="image/png,image/x-icon,image/svg+xml"
            />
          </div>
          <div className="space-y-2">
            <FileUpload
              label="OG Image (Social Share)"
              value={getValue('site_og_image', 'en')}
              onUpload={(url) => updateSetting('site_og_image', url)}
              onRemove={() => updateSetting('site_og_image', '')}
              folder="settings"
              accept="image/*"
            />
          </div>
          <div className="space-y-2">
            <FileUpload
              label="Hero Instructor Photo"
              value={getValue('hero_instructor_image', 'en')}
              onUpload={(url) => updateSetting('hero_instructor_image', url)}
              onRemove={() => updateSetting('hero_instructor_image', '')}
              folder="settings"
              accept="image/*"
            />
          </div>
        </div>
      </div>
      
      {/* Save action exposed just in case, but sticky bar usually handles this */}
      <div className="flex justify-end lg:hidden">
        <Button onClick={handleSave} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
