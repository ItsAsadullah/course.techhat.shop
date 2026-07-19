"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createTrainingShift,
  updateTrainingShift,
} from "@/lib/admin/actions/training-shifts";

import { getTrainingLabs } from "@/lib/admin/actions/training-labs";

import {
  parseTrainingDays,
  trainingShiftSchema,
  type TrainingShiftFormInput,
  type TrainingShiftValues,
} from "@/lib/schema/training.schema";

import {
  TRAINING_DAYS,
  type EditableTrainingShiftStatus,
  type TrainingDay,
  type TrainingLab,
  type TrainingShift,
} from "@/types/admin/training";

interface TrainingShiftFormProps {
  mode: "create" | "edit";
  initialData?: TrainingShift;
}

interface InitialScheduleState {
  days: TrainingDay[];
  error: string | null;
}

function getInitialEditableStatus(
  shift?: TrainingShift
): EditableTrainingShiftStatus {
  if (!shift) {
    return "active";
  }

  if (
    shift.status === "active" ||
    shift.status === "inactive"
  ) {
    return shift.status;
  }

  throw new Error(
    "Archived shifts cannot be opened in the normal edit form."
  );
}

function getInitialSchedule(
  shift?: TrainingShift
): InitialScheduleState {
  if (!shift) {
    return {
      days: [],
      error: null,
    };
  }

  const parsedDays = parseTrainingDays(
    shift.class_days
  );

  if (!parsedDays) {
    return {
      days: [],
      error:
        "এই শিফটের সংরক্ষিত ক্লাস ডে তথ্য সঠিক নয়। তথ্য ঠিক না করা পর্যন্ত শিফটটি এডিট করা যাবে না।",
    };
  }

  return {
    days: parsedDays,
    error: null,
  };
}

export function TrainingShiftForm({
  mode,
  initialData,
}: TrainingShiftFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [formError, setFormError] = useState<
    string | null
  >(null);

  const [labs, setLabs] = useState<
    TrainingLab[]
  >([]);

  const [loadingLabs, setLoadingLabs] =
    useState(true);

  const initialSchedule = useMemo(
    () => getInitialSchedule(initialData),
    [initialData]
  );

  const editableStatus = useMemo(
    () => getInitialEditableStatus(initialData),
    [initialData]
  );

  const hasInvalidInitialSchedule =
    mode === "edit" &&
    initialSchedule.error !== null;

  const form = useForm<
    TrainingShiftFormInput,
    unknown,
    TrainingShiftValues
  >({
    resolver: zodResolver(trainingShiftSchema),

    defaultValues: {
      lab_id: initialData?.lab_id ?? "",
      name_en: initialData?.name_en ?? "",
      name_bn: initialData?.name_bn ?? "",
      code: initialData?.code ?? "",
      start_time: initialData?.start_time ?? "",
      end_time: initialData?.end_time ?? "",
      class_days: initialSchedule.days,
      capacity_override:
        initialData?.capacity_override ?? null,
      status: editableStatus,
      sort_order: initialData?.sort_order ?? 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const status = watch("status");
  const labId = watch("lab_id");
  const classDays = watch("class_days");

  useEffect(() => {
    let active = true;

    async function loadLabs() {
      setLoadingLabs(true);

      try {
        const data = await getTrainingLabs();

        if (!active) {
          return;
        }

        setLabs(
          data.filter(
            (lab) =>
              lab.status === "active" ||
              lab.id === initialData?.lab_id
          )
        );
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        console.error(
          "Failed to load training labs:",
          error
        );

        setFormError(
          "ট্রেনিং ল্যাবের তথ্য লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
        );
      } finally {
        if (active) {
          setLoadingLabs(false);
        }
      }
    }

    void loadLabs();

    return () => {
      active = false;
    };
  }, [initialData?.lab_id]);

  async function onSubmit(
    data: TrainingShiftValues
  ) {
    if (hasInvalidInitialSchedule) {
      setFormError(
        initialSchedule.error ??
        "Invalid schedule data."
      );

      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const result =
        mode === "edit" && initialData?.id
          ? await updateTrainingShift(
            initialData.id,
            data
          )
          : await createTrainingShift(data);

      if (!result.success) {
        setFormError(result.error.message);
        return;
      }

      router.push(
        `/admin/training/shifts/${result.data}`
      );

      router.refresh();
    } catch (error: unknown) {
      setFormError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleDay(day: TrainingDay) {
    const currentDays = classDays ?? [];

    const nextDays = currentDays.includes(day)
      ? currentDays.filter(
        (currentDay) => currentDay !== day
      )
      : [...currentDays, day];

    setValue("class_days", nextDays, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleLabChange(value: string) {
    setValue("lab_id", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleStatusChange(
    value: EditableTrainingShiftStatus
  ) {
    setValue("status", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl space-y-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
    >
      {(formError || initialSchedule.error) && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4 text-sm font-medium text-red-700 dark:text-red-500"
        >
          {formError ?? initialSchedule.error}
        </div>
      )}

      {hasInvalidInitialSchedule && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Schedule data requires administrator
            attention
          </p>

          <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">
            এই শিফটের class_days ডেটা invalid।
            ভুল ডেটাকে খালি schedule হিসেবে ধরে edit
            করা হচ্ছে না।
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name_en">
            Shift Name (EN){" "}
            <span className="text-red-500">
              *
            </span>
          </Label>

          <Input
            id="name_en"
            {...register("name_en")}
            placeholder="e.g. Morning Shift"
            disabled={hasInvalidInitialSchedule}
          />

          {errors.name_en && (
            <p className="text-sm text-red-500">
              {errors.name_en.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name_bn">
            Shift Name (BN)
          </Label>

          <Input
            id="name_bn"
            {...register("name_bn")}
            placeholder="e.g. মর্নিং শিফট"
            disabled={hasInvalidInitialSchedule}
          />

          {errors.name_bn && (
            <p className="text-sm text-red-500">
              {errors.name_bn.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">
            Shift Code{" "}
            <span className="text-red-500">
              *
            </span>
          </Label>

          <Input
            id="code"
            {...register("code")}
            placeholder="e.g. MORN-1"
            disabled={hasInvalidInitialSchedule}
          />

          {errors.code && (
            <p className="text-sm text-red-500">
              {errors.code.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Assigned Lab{" "}
            <span className="text-red-500">
              *
            </span>
          </Label>

          <Select
            value={labId}
            onValueChange={handleLabChange}
            disabled={
              loadingLabs ||
              hasInvalidInitialSchedule
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingLabs
                    ? "Loading labs..."
                    : "Select a lab"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {labs.map((lab) => (
                <SelectItem
                  key={lab.id}
                  value={lab.id}
                >
                  {lab.name} ({lab.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.lab_id && (
            <p className="text-sm text-red-500">
              {errors.lab_id.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-t border-slate-100 dark:border-slate-800 pt-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_time">
            Start Time (24h){" "}
            <span className="text-red-500">
              *
            </span>
          </Label>

          <Input
            type="time"
            id="start_time"
            {...register("start_time")}
            disabled={hasInvalidInitialSchedule}
          />

          {errors.start_time && (
            <p className="text-sm text-red-500">
              {errors.start_time.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">
            End Time (24h){" "}
            <span className="text-red-500">
              *
            </span>
          </Label>

          <Input
            type="time"
            id="end_time"
            {...register("end_time")}
            disabled={hasInvalidInitialSchedule}
          />

          {errors.end_time && (
            <p className="text-sm text-red-500">
              {errors.end_time.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <Label>
          Class Days{" "}
          <span className="text-red-500">
            *
          </span>
        </Label>

        <div className="flex flex-wrap gap-4">
          {TRAINING_DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={`day-${day}`}
                checked={
                  classDays?.includes(day) ??
                  false
                }
                onCheckedChange={() =>
                  toggleDay(day)
                }
                disabled={
                  hasInvalidInitialSchedule
                }
              />

              <label
                htmlFor={`day-${day}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {day}
              </label>
            </div>
          ))}
        </div>

        {errors.class_days && (
          <p className="text-sm text-red-500">
            {errors.class_days.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 border-t border-slate-100 dark:border-slate-800 pt-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="capacity_override">
            Capacity Override
          </Label>

          <Input
            type="number"
            id="capacity_override"
            {...register("capacity_override")}
            placeholder="Uses lab capacity if empty"
            disabled={hasInvalidInitialSchedule}
          />

          {errors.capacity_override && (
            <p className="text-sm text-red-500">
              {errors.capacity_override.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">
            Sort Order
          </Label>

          <Input
            type="number"
            id="sort_order"
            {...register("sort_order")}
            disabled={hasInvalidInitialSchedule}
          />

          {errors.sort_order && (
            <p className="text-sm text-red-500">
              {errors.sort_order.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={hasInvalidInitialSchedule}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">
                Active
              </SelectItem>

              <SelectItem value="inactive">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>

          {errors.status && (
            <p className="text-sm text-red-500">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            hasInvalidInitialSchedule
          }
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {mode === "edit"
            ? "Update Shift"
            : "Create Shift"}
        </Button>
      </div>
    </form>
  );
}