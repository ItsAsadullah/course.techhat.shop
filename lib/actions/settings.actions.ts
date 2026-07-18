'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidateTag } from 'next/cache';
import { SettingGroup, SettingItem } from '@/lib/store/settings.store';

export async function getSettingsByGroup(groupSlug: string): Promise<SettingGroup | null> {
  const supabase = await createServerClient();
  
  // Fetch group
  const { data: groupData, error: groupError } = await supabase
    .from('setting_groups')
    .select('*')
    .eq('slug', groupSlug)
    .single();

  if (groupError || !groupData) {
    console.error(`Error fetching setting group ${groupSlug}:`, JSON.stringify(groupError, null, 2));
    return null;
  }

  // Fetch settings for group
  const { data: settingsData, error: settingsError } = await supabase
    .from('system_settings')
    .select('*')
    .eq('groupId', groupData.id)
    .order('key');

  if (settingsError) {
    console.error(`Error fetching settings for group ${groupData.id}:`, settingsError);
    return null;
  }

  return {
    id: groupData.id,
    slug: groupData.slug,
    nameEn: groupData.nameEn,
    nameBn: groupData.nameBn,
    description: groupData.description,
    icon: groupData.icon,
    settings: settingsData.map((s: any) => ({
      id: s.id,
      groupId: s.groupId,
      key: s.key,
      type: s.type,
      value: s.value,
      defaultValue: s.defaultValue,
      valueBn: s.valueBn,
    }))
  };
}

export async function updateSettings(groupId: string, payload: { key: string; value: string | null; valueBn?: string | null }[]) {
  const supabase = await createServerClient();
  
  // Supabase upsert logic. We need the actual setting IDs to update, or match by key.
  // Since key is UNIQUE, we can match by key.
  
  for (const item of payload) {
    const updateData: any = {};
    if (item.value !== undefined) updateData.value = item.value;
    if (item.valueBn !== undefined) updateData.valueBn = item.valueBn;
    updateData.updatedAt = new Date().toISOString();

    // To safely handle upsert with group association, we must first check if it exists,
    // or upsert matching by key. But 'key' is unique.
    const { data: existing } = await supabase
      .from('system_settings')
      .select('id, groupId')
      .eq('key', item.key)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('system_settings')
        .update(updateData)
        .eq('id', existing.id);
      
      if (error) {
        console.error(`Failed to update setting ${item.key}:`, error);
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase
        .from('system_settings')
        .insert({
          groupId,
          key: item.key,
          type: 'string',
          ...updateData
        });

      if (error) {
        console.error(`Failed to insert setting ${item.key}:`, error);
        return { success: false, error: error.message };
      }
    }
  }

  // @ts-ignore
  revalidateTag('settings');
  return { success: true };
}
