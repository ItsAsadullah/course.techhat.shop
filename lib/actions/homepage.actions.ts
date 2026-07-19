'use server';

import { createServerClient } from '@/lib/supabase-server';
import { HomepageContentBilingual } from '@/context/HomepageContentContext';

export async function getHomepageContent(): Promise<HomepageContentBilingual> {
  try {
    const supabase = await createServerClient();

    // Get the homepage group ID
    const { data: group } = await supabase
      .from('setting_groups')
      .select('id')
      .eq('slug', 'homepage')
      .single();

    if (!group) {
      return { en: {}, bn: {} };
    }

    // Fetch all homepage settings
    const { data: settings } = await supabase
      .from('system_settings')
      .select('key, value, valueBn')
      .eq('groupId', group.id);

    if (!settings) {
      return { en: {}, bn: {} };
    }

    const en: Record<string, string> = {};
    const bn: Record<string, string> = {};

    for (const s of settings) {
      if (s.value) en[s.key] = s.value;
      if (s.valueBn) bn[s.key] = s.valueBn;
    }

    return { en, bn } as HomepageContentBilingual;
  } catch (err) {
    console.error('Failed to load homepage content:', err);
    return { en: {}, bn: {} };
  }
}
