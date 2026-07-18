'use client';

import { useTransition, useState, useEffect } from 'react';
import { useSettingsStore, SettingGroup } from '@/lib/store/settings.store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateSettings } from '@/lib/actions/settings.actions';
import { toast } from 'sonner';
import { Bot, KeyRound, Sparkles, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface IntegrationsSettingsFormProps {
  initialGroup: SettingGroup;
}

export type AiModel = {
  id: string;
  provider: 'gemini' | 'openai' | 'anthropic' | 'xai' | 'groq';
  modelName: string;
  apiKey: string;
};

export function IntegrationsSettingsForm({ initialGroup }: IntegrationsSettingsFormProps) {
  const { 
    updateSetting, 
    draftSettings, 
    isDirty,
    clearDirtyFlag,
    activeLanguage,
    setSaveAction
  } = useSettingsStore();

  const [isPending, startTransition] = useTransition();
  const [aiModels, setAiModels] = useState<AiModel[]>([]);
  const [defaultModelId, setDefaultModelId] = useState<string>('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formProvider, setFormProvider] = useState<AiModel['provider']>('gemini');
  const [formModelName, setFormModelName] = useState('');
  const [formApiKey, setFormApiKey] = useState('');

  // Initialize from Zustand / initialGroup
  useEffect(() => {
    // Read JSON setting 'ai_models'
    const rawAiModels = draftSettings['ai_models'] 
      ?? initialGroup.settings.find(s => s.key === 'ai_models')?.value 
      ?? '[]';
    
    try {
      const parsed = JSON.parse(rawAiModels);
      if (Array.isArray(parsed)) setAiModels(parsed);
    } catch {
      setAiModels([]);
    }

    const defaultId = draftSettings['default_ai_model_id']
      ?? initialGroup.settings.find(s => s.key === 'default_ai_model_id')?.value 
      ?? '';
    setDefaultModelId(defaultId);
  }, [draftSettings, initialGroup]);

  // Sync to Zustand
  const saveAiModelsToStore = (models: AiModel[]) => {
    setAiModels(models);
    updateSetting('ai_models', JSON.stringify(models));
  };

  const saveDefaultModelToStore = (id: string) => {
    setDefaultModelId(id);
    updateSetting('default_ai_model_id', id);
  };

  const handleSave = async () => {
    const payload = Object.keys(draftSettings).map(key => ({
      key,
      value: draftSettings[key] ?? null,
    }));
    
    const result = await updateSettings(initialGroup.id, payload);
    
    if (result.success) {
      toast.success('AI Settings updated successfully');
      clearDirtyFlag();
    } else {
      toast.error('Failed to update settings: ' + result.error);
    }
  };

  useEffect(() => {
    setSaveAction(handleSave);
    return () => setSaveAction(() => Promise.resolve());
  }, [draftSettings, initialGroup.id]);

  const openNewModelDialog = () => {
    setEditingId(null);
    setFormProvider('gemini');
    setFormModelName('');
    setFormApiKey('');
    setIsDialogOpen(true);
  };

  const openEditModelDialog = (model: AiModel) => {
    setEditingId(model.id);
    setFormProvider(model.provider);
    setFormModelName(model.modelName);
    setFormApiKey(model.apiKey);
    setIsDialogOpen(true);
  };

  const saveModel = () => {
    if (!formModelName.trim() || !formApiKey.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingId) {
      const updated = aiModels.map(m => m.id === editingId ? {
        id: m.id, provider: formProvider, modelName: formModelName, apiKey: formApiKey
      } : m);
      saveAiModelsToStore(updated);
    } else {
      const newModel: AiModel = {
        id: crypto.randomUUID(),
        provider: formProvider,
        modelName: formModelName,
        apiKey: formApiKey
      };
      saveAiModelsToStore([...aiModels, newModel]);
      // If it's the first model, make it default automatically
      if (aiModels.length === 0) {
        saveDefaultModelToStore(newModel.id);
      }
    }
    setIsDialogOpen(false);
  };

  const removeModel = (id: string) => {
    if (confirm('Are you sure you want to remove this model?')) {
      const updated = aiModels.filter(m => m.id !== id);
      saveAiModelsToStore(updated);
      if (defaultModelId === id) {
        saveDefaultModelToStore(updated[0]?.id || '');
      }
    }
  };

  const isBn = activeLanguage === 'bn';

  return (
    <div className="space-y-8 pb-10">
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{isBn ? 'এআই মডেলস (AI Models)' : 'AI Models Configuration'}</h3>
              <p className="text-sm text-muted-foreground">
                {isBn 
                  ? 'কোর্স অটো-জেনারেট করার জন্য আপনার প্রয়োজনীয় AI মডেলগুলো যোগ করুন।' 
                  : 'Add and manage multiple AI models and API keys for course generation.'}
              </p>
            </div>
          </div>
          
          <Button onClick={openNewModelDialog} size="sm" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            {isBn ? 'নতুন মডেল যোগ করুন' : 'Add New Model'}
          </Button>
        </div>
        
        <div className="p-0">
          {aiModels.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Bot className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground mb-4">No AI models configured yet.</p>
              <Button onClick={openNewModelDialog} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Your First Model
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Default</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Model Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aiModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>
                      <button 
                        onClick={() => saveDefaultModelToStore(model.id)}
                        className={`flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${defaultModelId === model.id ? 'border-primary bg-primary text-white' : 'border-slate-300 hover:border-primary/50'}`}
                        title="Set as Default"
                      >
                        {defaultModelId === model.id && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{model.provider}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{model.modelName}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {model.apiKey.substring(0, 4)}•••••••••••{model.apiKey.slice(-4)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModelDialog(model)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeModel(model.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
        <div className="p-4 border-t bg-muted/20 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isDirty ? 'You have unsaved changes.' : 'All changes are saved.'}
          </p>
          <Button onClick={handleSave} disabled={!isDirty || isPending} className="px-8 shadow-sm">
            {isPending ? 'Saving to Database...' : 'Save AI Settings'}
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit AI Model' : 'Add New AI Model'}</DialogTitle>
            <DialogDescription>
              Enter the provider details and API key for this AI model.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select value={formProvider} onValueChange={(v: any) => setFormProvider(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  <SelectItem value="xai">xAI (Grok)</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="modelName">Model Name <span className="text-muted-foreground text-xs font-normal">(e.g. gpt-4o, gemini-1.5-pro)</span></Label>
              <Input 
                id="modelName" 
                value={formModelName}
                onChange={(e) => setFormModelName(e.target.value)}
                placeholder="Enter exact model ID..."
                className="font-mono text-sm"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input 
                id="apiKey" 
                type="password"
                value={formApiKey}
                onChange={(e) => setFormApiKey(e.target.value)}
                placeholder="Enter secret API key..."
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveModel}>Add to List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
