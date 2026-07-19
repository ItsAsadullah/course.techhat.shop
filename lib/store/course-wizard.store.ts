import { create } from "zustand";
import type { CourseFormValues } from "@/lib/schema/course-wizard.schema";

// =====================================================
// Course Wizard UI state (not form data — RHF owns that).
// Mirrors the draft/dirty idiom in settings.store.ts.
// =====================================================

export type WizardLanguage = "en" | "bn" | "both";
export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface CourseWizardState {
  courseId: string | null;
  activeStep: string; // step key, e.g. "general"
  language: WizardLanguage;
  saveStatus: SaveStatus;
  lastSavedAt: number | null;
  isDirty: boolean;
  completedSteps: Record<string, boolean>;
  formValues: CourseFormValues | null;

  setCourseId: (id: string | null) => void;
  setActiveStep: (key: string) => void;
  setLanguage: (lang: WizardLanguage) => void;
  setSaveStatus: (status: SaveStatus, savedAt?: number | null) => void;
  setDirty: (dirty: boolean) => void;
  setStepCompleted: (key: string, done: boolean) => void;
  setFormValues: (values: CourseFormValues) => void;
  reset: () => void;
}

const initial = {
  courseId: null as string | null,
  activeStep: "general",
  language: "both" as WizardLanguage,
  saveStatus: "idle" as SaveStatus,
  lastSavedAt: null as number | null,
  isDirty: false,
  completedSteps: {} as Record<string, boolean>,
  formValues: null as CourseFormValues | null,
};

export const useCourseWizardStore = create<CourseWizardState>((set) => ({
  ...initial,
  setCourseId: (courseId) => set({ courseId }),
  setActiveStep: (activeStep) => set({ activeStep }),
  setLanguage: (language) => set({ language }),
  setSaveStatus: (saveStatus, savedAt) =>
    set((s) => ({
      saveStatus,
      lastSavedAt: saveStatus === "saved" ? savedAt ?? Date.now() : s.lastSavedAt,
      isDirty: saveStatus === "saved" ? false : s.isDirty,
    })),
  setDirty: (isDirty) => set({ isDirty }),
  setStepCompleted: (key, done) =>
    set((s) => ({ completedSteps: { ...s.completedSteps, [key]: done } })),
  setFormValues: (values) => set({ formValues: values }),
  reset: () => set({ ...initial, completedSteps: {} }),
}));
