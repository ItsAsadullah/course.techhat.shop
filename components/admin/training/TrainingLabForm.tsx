"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainingLabSchema } from "@/lib/schema/training.schema";
import { createTrainingLab, updateTrainingLab } from "@/lib/admin/actions/training-labs";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { TrainingLab } from "@/types/admin/training";

interface Props {
  mode?: "create" | "edit";
  labId?: string;
  initialData?: TrainingLab;
}

type FormStatus = "active" | "maintenance" | "inactive";

function getInitialStatus(status?: string): FormStatus {
  if (status === "active" || status === "maintenance" || status === "inactive") {
    return status;
  }
  return "active";
}

export function TrainingLabForm({ mode = "create", labId, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.input<typeof trainingLabSchema>>({
    resolver: zodResolver(trainingLabSchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      description: initialData?.description || "",
      room: initialData?.room || "",
      location: initialData?.location || "",
      total_computers: initialData?.total_computers || 0,
      usable_computers: initialData?.usable_computers || 0,
      students_per_computer: initialData?.students_per_computer || 1,
      manual_capacity_limit: initialData?.manual_capacity_limit || null,
      status: getInitialStatus(initialData?.status),
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const status = watch("status");
  
  const usableComputers = Number(watch("usable_computers")) || 0;
  const studentsPerComputer = Number(watch("students_per_computer")) || 1;
  const manualCapacity = watch("manual_capacity_limit");
  
  const physicalCapacity = usableComputers * studentsPerComputer;
  const effectiveCapacity = (manualCapacity !== null && manualCapacity !== undefined && String(manualCapacity).trim() !== "") 
    ? Number(manualCapacity) 
    : physicalCapacity;

  async function onSubmit(data: z.input<typeof trainingLabSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "create") {
        const result = await createTrainingLab(data);
        if (result.success) {
          toast.success("Training lab created successfully.");
          router.push(`/admin/training/labs/${result.data.labId}`);
        } else {
          setError(result.error.message);
        }
      } else {
        if (!labId) {
          setError("Lab ID is missing.");
          setIsSubmitting(false);
          return;
        }
        const result = await updateTrainingLab(labId, data);
        if (result.success) {
          toast.success("Training lab updated successfully.");
          router.push(`/admin/training/labs/${result.data.labId}`);
        } else {
          setError(result.error.message);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-500 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Lab Name <span className="text-red-500">*</span></Label>
          <Input id="name" {...register("name")} placeholder="e.g. Computer Lab A" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Lab Code <span className="text-red-500">*</span></Label>
          <Input id="code" {...register("code")} placeholder="e.g. LAB-A" />
          {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="room">Room Number</Label>
          <Input id="room" {...register("room")} placeholder="e.g. 101" />
          {errors.room && <p className="text-red-500 text-sm">{errors.room.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location / Building</Label>
          <Input id="location" {...register("location")} placeholder="e.g. Main Campus" />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="Optional description..." className="resize-none" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
          <Label htmlFor="total_computers">Total Computers <span className="text-red-500">*</span></Label>
          <Input type="number" id="total_computers" {...register("total_computers")} />
          {errors.total_computers && <p className="text-red-500 text-sm">{errors.total_computers.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="usable_computers">Usable Computers <span className="text-red-500">*</span></Label>
          <Input type="number" id="usable_computers" {...register("usable_computers")} />
          {errors.usable_computers && <p className="text-red-500 text-sm">{errors.usable_computers.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="students_per_computer">Students Per Computer <span className="text-red-500">*</span></Label>
          <Input type="number" id="students_per_computer" {...register("students_per_computer")} />
          {errors.students_per_computer && <p className="text-red-500 text-sm">{errors.students_per_computer.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manual_capacity_limit">Manual Capacity Limit (Optional)</Label>
          <Input type="number" id="manual_capacity_limit" {...register("manual_capacity_limit")} placeholder="Leaves unconstrained if empty" />
          {errors.manual_capacity_limit && <p className="text-red-500 text-sm">{errors.manual_capacity_limit.message}</p>}
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg space-y-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Capacity Summary</p>
        <div className="text-sm text-slate-500 dark:text-slate-400 flex justify-between">
          <span>Physical Capacity:</span>
          <span>{physicalCapacity} students</span>
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <span>Effective Capacity:</span>
          <span>{effectiveCapacity} students</span>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Label>Status</Label>
        <Select value={status} onValueChange={(val) => setValue("status", getInitialStatus(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? (mode === "create" ? "Creating Lab..." : "Saving Changes...") : (mode === "create" ? "Create Lab" : "Save Changes")}
        </Button>
      </div>
    </form>
  );
}
