'use client';

import { useState, useCallback } from 'react';
import { SettingGroup, SettingItem } from '@/lib/store/settings.store';
import { updateSettings } from '@/lib/actions/settings.actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2 } from 'lucide-react';

interface Props {
  initialGroup: SettingGroup;
}

function SettingField({ s, lang, onChange }: { s: SettingItem; lang: 'en' | 'bn'; onChange: (key: string, val: string, lang: 'en' | 'bn') => void }) {
  const val = (lang === 'en' ? s.value : s.valueBn) ?? '';
  const isLong = val.length > 80 || (s.defaultValue ?? '').length > 80;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(s.key, e.target.value, lang);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-500 uppercase tracking-widest">
        {s.key} <span className="text-blue-400 font-bold">[{lang === 'bn' ? 'বাংলা' : 'EN'}]</span>
      </Label>
      {isLong ? (
        <Textarea
          className="text-sm min-h-[72px]"
          value={val}
          onChange={handleChange}
          placeholder={s.defaultValue ?? ''}
        />
      ) : (
        <Input
          className="text-sm"
          value={val}
          onChange={handleChange}
          placeholder={s.defaultValue ?? ''}
        />
      )}
    </div>
  );
}

const SECTIONS: { id: string; label: string; labelBn: string; keys: string[] }[] = [
  {
    id: 'hero', label: 'Hero Section', labelBn: 'হিরো সেকশন',
    keys: ['hero_badge', 'hero_title1', 'hero_title2', 'hero_desc1', 'hero_desc2', 'hero_badge_students', 'hero_badge_rating', 'hero_badge_cert', 'hero_total_courses'],
  },
  {
    id: 'video', label: 'Video', labelBn: 'ভিডিও',
    keys: ['homepage_video_id'],
  },
  {
    id: 'stats', label: 'Stats', labelBn: 'স্ট্যাটস',
    keys: ['stat_students_value', 'stat_students_label', 'stat_courses_value', 'stat_courses_label', 'stat_success_value', 'stat_success_label', 'stat_exp_value', 'stat_exp_label'],
  },
  {
    id: 'features', label: 'Features', labelBn: 'ফিচার',
    keys: ['feat_title1', 'feat_title2', 'feat_title3', 'feat_desc', 'feat_stat1_v', 'feat_stat1_l', 'feat_stat2_v', 'feat_stat2_l', 'feat_stat3_v', 'feat_stat3_l', 'feat_review_tag', 'feat_review_text', 'feat_review_name', 'feat_review_role', 'feat_card1_t', 'feat_card1_d', 'feat_card2_t', 'feat_card2_d', 'feat_card3_t', 'feat_card3_d', 'feat_card4_t', 'feat_card4_d', 'feat_card5_t', 'feat_card5_d', 'feat_card6_t', 'feat_card6_d'],
  },
  {
    id: 'about', label: 'About', labelBn: 'আমাদের সম্পর্কে',
    keys: ['about_tag', 'about_title', 'about_desc', 'about_card1_t', 'about_card1_d', 'about_card2_t', 'about_card2_d', 'about_card3_t', 'about_card3_d', 'about_card4_t', 'about_card4_d'],
  },
  {
    id: 'roadmap', label: 'Roadmap', labelBn: 'রোডম্যাপ',
    keys: ['rm_title', 'rm_desc', 'rm_sol', 'rm_s1_i', 'rm_s1_e', 'rm_s2_i', 'rm_s2_e', 'rm_s3_i', 'rm_s3_e', 'rm_s4_i', 'rm_s4_e'],
  },
  {
    id: 'enroll', label: 'Enroll Steps', labelBn: 'ভর্তি প্রক্রিয়া',
    keys: ['en_tag', 'en_title', 'en_desc', 'en_req_title', 'en_req_desc', 'en_s1_i', 'en_s1_e', 'en_s1_d', 'en_s2_i', 'en_s2_e', 'en_s2_d', 'en_s3_i', 'en_s3_e', 'en_s3_d', 'en_s4_i', 'en_s4_e', 'en_s4_d'],
  },
  {
    id: 'faq', label: 'FAQ', labelBn: 'FAQ',
    keys: ['faq_tag', 'faq_title', 'faq_desc1', 'faq_q1', 'faq_a1', 'faq_q2', 'faq_a2', 'faq_q3', 'faq_a3', 'faq_q4', 'faq_a4'],
  },
  {
    id: 'footer', label: 'Footer', labelBn: 'ফুটার',
    keys: ['ft_desc', 'ft_addr', 'ft_phone', 'ft_email', 'ft_days', 'ft_hours', 'ft_facebook', 'ft_youtube', 'ft_whatsapp'],
  },
];

export function HomepageSettingsForm({ initialGroup }: Props) {
  const [settings, setSettings] = useState<Record<string, { value: string | null; valueBn: string | null }>>(
    Object.fromEntries(
      initialGroup.settings.map(s => [s.key, { value: s.value, valueBn: s.valueBn }])
    )
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  const handleChange = useCallback((key: string, val: string, l: 'en' | 'bn') => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...(l === 'en' ? { value: val } : { valueBn: val }),
      },
    }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = Object.entries(settings).map(([key, { value, valueBn }]) => ({
        key,
        value: value ?? null,
        valueBn: valueBn ?? null,
      }));
      await updateSettings(initialGroup.id, payload);
      toast.success('Homepage content saved successfully!');
    } catch (err) {
      toast.error('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const settingMap = new Map(initialGroup.settings.map(s => [s.key, s]));

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full p-1">
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang('bn')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${lang === 'bn' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            বাংলা
          </button>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Changes
        </Button>
      </div>

      {/* Section Tabs */}
      <Tabs defaultValue="hero">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl">
          {SECTIONS.map(sec => (
            <TabsTrigger
              key={sec.id}
              value={sec.id}
              className="text-xs rounded-lg px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              {lang === 'bn' ? sec.labelBn : sec.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SECTIONS.map(sec => (
          <TabsContent key={sec.id} value={sec.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sec.keys.map(key => {
                const s = settingMap.get(key);
                if (!s) return (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                      {key} <span className="text-amber-500">[not seeded]</span>
                    </Label>
                    <p className="text-xs text-slate-400">Run the SQL seed script first.</p>
                  </div>
                );
                const localS = { ...s, value: settings[key]?.value ?? s.value, valueBn: settings[key]?.valueBn ?? s.valueBn };
                return (
                  <SettingField key={key} s={localS} lang={lang} onChange={handleChange} />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
