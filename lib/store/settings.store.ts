import { create } from 'zustand';

export type SettingType = 'string' | 'boolean' | 'number' | 'json' | 'file' | 'color' | 'password';

export interface SettingItem {
  id: string;
  groupId: string;
  key: string;
  type: SettingType;
  value: string | null;
  defaultValue: string | null;
  valueBn: string | null;
}

export interface SettingGroup {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  description: string | null;
  icon: string | null;
  settings: SettingItem[];
}

interface SettingsState {
  // Global settings state
  groups: SettingGroup[];
  draftSettings: Record<string, string | null>; // key -> value overrides
  draftSettingsBn: Record<string, string | null>; // key -> valueBn overrides
  isDirty: boolean;
  activeLanguage: 'en' | 'bn';
  
  // Actions
  setGroups: (groups: SettingGroup[]) => void;
  updateSetting: (key: string, value: string | null) => void;
  updateSettingBn: (key: string, valueBn: string | null) => void;
  setLanguage: (lang: 'en' | 'bn') => void;
  discardChanges: () => void;
  clearDirtyFlag: () => void;
  
  // Global Save Handler
  saveAction: (() => Promise<void>) | null;
  setSaveAction: (fn: () => Promise<void>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  groups: [],
  draftSettings: {},
  draftSettingsBn: {},
  isDirty: false,
  activeLanguage: 'en',
  
  setGroups: (groups) => set({ groups }),
  
  updateSetting: (key, value) => set((state) => ({ 
    draftSettings: { ...state.draftSettings, [key]: value },
    isDirty: true 
  })),

  updateSettingBn: (key, valueBn) => set((state) => ({
    draftSettingsBn: { ...state.draftSettingsBn, [key]: valueBn },
    isDirty: true
  })),

  setLanguage: (lang) => set({ activeLanguage: lang }),
  
  discardChanges: () => set({ draftSettings: {}, draftSettingsBn: {}, isDirty: false }),
  clearDirtyFlag: () => set({ isDirty: false, draftSettings: {}, draftSettingsBn: {} }),
  
  saveAction: null,
  setSaveAction: (fn) => set(() => ({ saveAction: fn }))
}));
