"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Course } from "@/types/admin";

// Legacy form — kept for backward compatibility
// New code should use /admin/courses/new (CourseWizard)

interface CourseFormProps {
  course?: Course;
  onSuccess?: () => void;
}

export function CourseForm({ course, onSuccess }: CourseFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    // Deprecated: use /admin/courses/new wizard instead
    alert("Please use the new Course Wizard at /admin/courses/new");
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Course Name *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={course?.name || ""}
          placeholder="e.g., Web Development"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration *</Label>
        <Input
          id="duration"
          name="duration"
          defaultValue={course?.duration || ""}
          placeholder="e.g., 6 months"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fee">Default Fee (৳) *</Label>
        <Input
          id="fee"
          name="fee"
          type="number"
          min="0"
          step="0.01"
          defaultValue={course?.fee || ""}
          placeholder="Enter course fee"
          required
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : course ? "Update Course" : "Add Course"}
      </Button>
    </form>
  );
}
