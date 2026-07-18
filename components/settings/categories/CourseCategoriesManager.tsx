"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, FolderTree, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CourseCategory } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
} from "@/lib/admin/actions/categories";

interface CourseCategoriesManagerProps {
  initialCategories: CourseCategory[];
}

type CategoryFormData = {
  id?: string;
  name_en: string;
  name_bn: string;
  slug: string;
  parent_id: string | null;
  is_active: boolean;
};

const DEFAULT_FORM: CategoryFormData = {
  name_en: "",
  name_bn: "",
  slug: "",
  parent_id: null,
  is_active: true,
};

export function CourseCategoriesManager({ initialCategories }: CourseCategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>(DEFAULT_FORM);

  // Group by parent
  const mainCategories = categories.filter((c) => !c.parent_id);
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parent_id === parentId);

  const handleOpenDialog = (parent_id: string | null = null, existingData?: CourseCategory) => {
    if (existingData) {
      setFormData({
        id: existingData.id,
        name_en: existingData.name_en,
        name_bn: existingData.name_bn,
        slug: existingData.slug,
        parent_id: existingData.parent_id,
        is_active: existingData.is_active ?? true,
      });
    } else {
      setFormData({ ...DEFAULT_FORM, parent_id });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (formData.id) {
          const res = await updateCourseCategory(formData.id, {
            name_en: formData.name_en,
            name_bn: formData.name_bn,
            slug: formData.slug,
            parent_id: formData.parent_id,
          });
          if (res.success) {
            toast.success("Category updated successfully");
            // Optimistic update
            setCategories((prev) =>
              prev.map((c) => (c.id === formData.id ? { ...c, ...formData } : c))
            );
          } else {
            toast.error(res.error || "Failed to update category");
          }
        } else {
          const res = await createCourseCategory({
            name_en: formData.name_en,
            name_bn: formData.name_bn,
            slug: formData.slug,
            parent_id: formData.parent_id,
          });
          if (res.success) {
            toast.success("Category created successfully");
            // A simple refresh trick since the real ID is on server:
            window.location.reload(); 
          } else {
            toast.error(res.error || "Failed to create category");
          }
        }
      } catch (err) {
        toast.error("An error occurred");
      } finally {
        setIsDialogOpen(false);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    startTransition(async () => {
      const res = await deleteCourseCategory(id);
      if (res.success) {
        toast.success("Category deleted");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(res.error || "Failed to delete");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-blue-500" />
          Manage Course Categories
        </h2>
        <Button onClick={() => handleOpenDialog(null)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </Button>
      </div>

      {mainCategories.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500">
          No categories found. Create one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {mainCategories.map((mainCat) => (
            <div key={mainCat.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{mainCat.name_en}</h3>
                  <p className="text-sm text-slate-500">{mainCat.name_bn} • /{mainCat.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(mainCat.id)}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Sub-category
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(null, mainCat)}>
                    <Edit2 className="w-4 h-4 text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(mainCat.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* Subcategories */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {getSubcategories(mainCat.id).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between pl-10 pr-4 py-3 bg-white dark:bg-slate-900">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">{sub.name_en}</h4>
                      <p className="text-xs text-slate-400">{sub.name_bn} • /{sub.slug}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(mainCat.id, sub)}>
                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(sub.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formData.id 
                ? "Edit Category" 
                : formData.parent_id 
                  ? `Add Sub-category to ${categories.find(c => c.id === formData.parent_id)?.name_en || ""}`
                  : "Add Main Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div>
              <Label htmlFor="name_en">Name (English) *</Label>
              <Input 
                id="name_en" 
                required 
                value={formData.name_en} 
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} 
                placeholder="e.g. Web Development"
              />
            </div>
            <div>
              <Label htmlFor="name_bn">Name (Bangla) *</Label>
              <Input 
                id="name_bn" 
                required 
                value={formData.name_bn} 
                onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })} 
                placeholder="যেমন ওয়েব ডেভেলপমেন্ট"
                className="font-bn"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input 
                id="slug" 
                required 
                value={formData.slug} 
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} 
                placeholder="e.g. web-development"
              />
              <p className="text-xs text-slate-500 mt-1">Must be unique, lowercase, no spaces.</p>
            </div>
            <div>
              <Label htmlFor="parent_id">Parent Category (Optional)</Label>
              <select
                id="parent_id"
                value={formData.parent_id || ""}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              >
                <option value="">-- None (Make this a Main Category) --</option>
                {mainCategories.map((c) => (
                  <option key={c.id} value={c.id} disabled={c.id === formData.id}>
                    {c.name_en} ({c.name_bn})
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Category"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
