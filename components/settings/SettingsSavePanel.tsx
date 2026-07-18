'use client';

import { useSettingsStore } from '@/lib/store/settings.store';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';

export function SettingsSavePanel() {
  const { isDirty, discardChanges, saveAction } = useSettingsStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (saveAction) {
      setIsSaving(true);
      try {
        await saveAction();
      } catch (err) {
        console.error("Error during saveAction:", err);
      } finally {
        setIsSaving(false);
      }
    } else {
      console.error("Save action is not registered in the store!");
      toast.error("Save action not registered. Please refresh the page.");
    }
  };

  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border bg-background/80 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="rounded-full bg-amber-500/20 p-2 text-amber-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground">Unsaved changes</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Careful - you have unsaved changes!
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={discardChanges}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                Discard
              </Button>
              <Button 
                size="sm" 
                className="gap-2 shadow-md hover:shadow-lg transition-shadow"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
