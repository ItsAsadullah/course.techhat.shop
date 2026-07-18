"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useForm,
  type SubmitHandler,
  type UseFormRegisterReturn,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Monitor,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  editableTrainingBatchStatusSchema,
  trainingBatchSchema,
  type EditableTrainingBatchStatus,
  type TrainingBatchFormInput,
  type TrainingBatchValues,
} from "@/lib/schema/training.schema";

import { saveTrainingBatch } from "@/lib/admin/actions/training-batches";

import {
  getTrainingShiftCapacity,
  getTrainingShifts,
} from "@/lib/admin/actions/training-shifts";

import { createClient } from "@/lib/admin/supabase/client";

import type {
  TrainingBatch,
  TrainingShift,
  TrainingShiftCapacity,
} from "@/types/admin/training";

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

/* =========================================================
   Types
========================================================= */

interface TrainingBatchFormProps {
  initialData?: TrainingBatch;
}

interface CourseTranslationRow {
  lang: string;
  name: string | null;
}

interface CourseRow {
  id: string;
  course_translations:
  | CourseTranslationRow[]
  | null;
}

interface CourseOption {
  id: string;
  name: string;
}

type BatchFormStatus =
  TrainingBatchValues["status"];

/* =========================================================
   Constants
========================================================= */

const BATCH_STATUSES: ReadonlyArray<{
  value: EditableTrainingBatchStatus;
  label: string;
}> = [
    {
      value: "draft",
      label: "Draft",
    },
    {
      value: "open",
      label: "Open (Admissions)",
    },
    {
      value: "full",
      label: "Full",
    },
    {
      value: "ongoing",
      label: "Ongoing (Classes)",
    },
    {
      value: "completed",
      label: "Completed",
    },
    {
      value: "cancelled",
      label: "Cancelled",
    },
  ];

const CAPACITY_REQUIRED_STATUSES:
  ReadonlyArray<BatchFormStatus> = [
    "open",
    "full",
    "ongoing",
  ];

/* =========================================================
   Helpers
========================================================= */

function getCourseName(
  course: CourseRow
): string {
  const translations =
    course.course_translations ?? [];

  const englishTranslation =
    translations.find(
      (translation) =>
        translation.lang === "en"
    );

  return (
    englishTranslation?.name ??
    translations[0]?.name ??
    "Unnamed Course"
  );
}

function mapCourseToOption(
  course: CourseRow
): CourseOption {
  return {
    id: course.id,
    name: getCourseName(course),
  };
}

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

function formatTime(value: string): string {
  if (!value) {
    return "--:--";
  }

  return value.slice(0, 5);
}

function isShiftCapacitySuccess(
  capacity: TrainingShiftCapacity | null
): capacity is Extract<
  TrainingShiftCapacity,
  { success: true }
> {
  return capacity?.success === true;
}

function getShiftCapacityErrorMessage(
  capacity: TrainingShiftCapacity
): string {
  if (capacity.success) {
    return "";
  }

  switch (capacity.error) {
    case "SHIFT_NOT_FOUND":
      return "নির্বাচিত শিফটটি পাওয়া যায়নি।";

    case "LAB_NOT_FOUND":
      return "শিফটের ট্রেনিং ল্যাব পাওয়া যায়নি।";

    case "SHIFT_CAPACITY_EXCEEDS_LAB":
      return "শিফটের capacity ট্রেনিং ল্যাবের capacity থেকে বেশি।";

    default:
      return "শিফটের capacity যাচাই করা যায়নি।";
  }
}

/* =========================================================
   Component
========================================================= */

export function TrainingBatchForm({
  initialData,
}: TrainingBatchFormProps) {
  const router = useRouter();

  const isArchived =
    initialData?.status === "archived";

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    loadingDependencies,
    setLoadingDependencies,
  ] = useState(true);

  const [
    loadingCapacity,
    setLoadingCapacity,
  ] = useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [shifts, setShifts] = useState<
    TrainingShift[]
  >([]);

  const [courses, setCourses] = useState<
    CourseOption[]
  >([]);

  const [
    selectedShiftCapacity,
    setSelectedShiftCapacity,
  ] = useState<TrainingShiftCapacity | null>(
    null
  );

  const form = useForm<
    TrainingBatchFormInput,
    unknown,
    TrainingBatchValues
  >({
    resolver: zodResolver(trainingBatchSchema),

    defaultValues: {
      course_id:
        initialData?.course_id ?? "",

      shift_ids:
        initialData?.shifts?.map((s) => s.id) ?? [],

      name_en:
        initialData?.name_en ?? "",

      name_bn:
        initialData?.name_bn ?? "",

      session:
        initialData?.session ?? "",

      start_date:
        initialData?.start_date ?? "",

      end_date:
        initialData?.end_date ?? "",

      admission_deadline:
        initialData?.admission_deadline ?? "",

      orientation_date:
        initialData?.orientation_date ?? "",

      seat_limit:
        initialData?.seat_limit ?? null,

      waitlist_enabled:
        initialData?.waitlist_enabled ?? false,

      status:
        initialData?.status === "archived"
          ? "draft"
          : initialData?.status ?? "draft",

      sort_order:
        initialData?.sort_order ?? 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isDirty,
    },
    setError: setFormError,
    setValue,
    watch,
  } = form;

  const watchedStatus = watch("status");

  const status: BatchFormStatus =
    watchedStatus ?? "draft";

  const courseId = watch("course_id");

  const shiftIds = watch("shift_ids") ?? [];

  const seatLimit = watch("seat_limit");

  const waitlistEnabled = watch(
    "waitlist_enabled"
  );

  const selectedShifts = useMemo(
    () =>
      shifts.filter((shift) =>
        shiftIds.includes(shift.id)
      ),
    [shiftIds, shifts]
  );

  const normalizedSeatLimit = useMemo(() => {
    if (
      seatLimit === "" ||
      seatLimit === null ||
      seatLimit === undefined
    ) {
      return null;
    }

    const numericValue = Number(seatLimit);

    return Number.isFinite(numericValue)
      ? numericValue
      : null;
  }, [seatLimit]);

  const combinedCapacity = useMemo(() => {
    return selectedShifts.reduce((total, shift) => {
      const shiftCap = shift.capacity_override ?? shift.lab?.manual_capacity_limit ?? shift.lab?.usable_computers ?? 0;
      return total + shiftCap;
    }, 0);
  }, [selectedShifts]);

  const effectiveBatchCapacity = useMemo(() => {
    if (normalizedSeatLimit !== null && combinedCapacity > 0) {
      return Math.min(normalizedSeatLimit, combinedCapacity);
    }
    if (normalizedSeatLimit !== null) {
      return normalizedSeatLimit;
    }
    return combinedCapacity;
  }, [normalizedSeatLimit, combinedCapacity]);

  const capacityIsRequired =
    CAPACITY_REQUIRED_STATUSES.includes(
      status
    );

  const hasCapacityConfiguration =
    effectiveBatchCapacity !== null &&
    effectiveBatchCapacity > 0;

  /* =========================================================
     Dependency Loading
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadDependencies() {
      setLoadingDependencies(true);
      setError(null);

      try {
        const supabase = createClient();

        const [
          shiftsResult,
          coursesResult,
        ] = await Promise.all([
          getTrainingShifts(),

          supabase
            .from("courses")
            .select(`
              id,
              course_translations (
                lang,
                name
              )
            `)
            .eq("status", "published"),
        ]);

        if (cancelled) {
          return;
        }

        if (shiftsResult.error) {
          throw new Error(
            shiftsResult.error
          );
        }

        const availableShifts =
          shiftsResult.data ?? [];

        setShifts(
          availableShifts.filter(
            (shift) =>
              shift.status === "active" ||
              initialData?.shifts?.some(
                (s) => s.id === shift.id
              )
          )
        );

        if (coursesResult.error) {
          throw new Error(
            coursesResult.error.message
          );
        }

        const courseRows =
          (coursesResult.data ??
            []) as CourseRow[];

        const mappedCourses =
          courseRows.map(mapCourseToOption);

        if (
          initialData?.course_id &&
          !mappedCourses.some(
            (course) =>
              course.id ===
              initialData.course_id
          )
        ) {
          const currentCourseResult =
            await supabase
              .from("courses")
              .select(`
                id,
                course_translations (
                  lang,
                  name
                )
              `)
              .eq(
                "id",
                initialData.course_id
              )
              .maybeSingle();

          if (currentCourseResult.error) {
            throw new Error(
              currentCourseResult.error.message
            );
          }

          if (currentCourseResult.data) {
            mappedCourses.push(
              mapCourseToOption(
                currentCourseResult.data as CourseRow
              )
            );
          }
        }

        setCourses(mappedCourses);
      } catch (loadError: unknown) {
        if (!cancelled) {
          setError(
            getErrorMessage(loadError)
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDependencies(false);
        }
      }
    }

    void loadDependencies();

    return () => {
      cancelled = true;
    };
  }, [
    initialData?.course_id,
    initialData?.shifts,
  ]);

  /* =========================================================
     Capacity Loading (Disabled - Handled server-side now)
  ========================================================= */
  useEffect(() => {
    // Multi-shift capacity is complex to preview live.
    // It is fully validated and combined during form submission.
    setLoadingCapacity(false);
  }, []);

  /* =========================================================
     Submit
  ========================================================= */

  const onSubmit: SubmitHandler<
    TrainingBatchValues
  > = async (data) => {
    if (isSubmitting || isArchived) {
      return;
    }

    setError(null);

    // Capacity checks are now strictly handled by the atomic save RPC.
    // We can rely on server validation to reject invalid capacities.

    const submittedEffectiveCapacity =
      data.seat_limit;

    if (
      CAPACITY_REQUIRED_STATUSES.includes(
        data.status
      ) &&
      data.shift_ids.length === 0
    ) {
      const message =
        "This batch status requires a valid capacity configuration.";

      setFormError("seat_limit", {
        type: "manual",
        message,
      });

      setError(message);

      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await saveTrainingBatch(
          initialData?.id ?? null,
          data
        );

      if (!result.success) {
        setError(result.error.message);

        return;
      }

      router.push(
        "/admin/training/batches"
      );

      router.refresh();
    } catch (submitError: unknown) {
      setError(
        getErrorMessage(submitError)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     Archived Protection
  ========================================================= */

  if (isArchived) {
    return (
      <div className="max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <AlertCircle className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-amber-950">
              Archived batch
            </h2>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              This batch is archived and cannot
              be edited from the standard batch
              form.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={() =>
                router.push(
                  "/admin/training/batches"
                )
              }
            >
              Back to batches
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl space-y-6"
    >
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Batch Assignment */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-950">
            Batch Assignment
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Assign the course and training
            shift for this batch.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Course
              <span className="ml-1 text-red-500">
                *
              </span>
            </Label>

            <Select
              value={courseId}
              onValueChange={(value) =>
                setValue(
                  "course_id",
                  value,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
              disabled={
                loadingDependencies ||
                Boolean(initialData)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingDependencies
                      ? "Loading courses..."
                      : "Select a course"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {courses.map((course) => (
                  <SelectItem
                    key={course.id}
                    value={course.id}
                  >
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.course_id && (
              <p className="text-sm text-red-600">
                {errors.course_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Assigned Shifts</Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shifts.length === 0 ? (
                <div className="text-sm text-slate-500">
                  {loadingDependencies ? "Loading shifts..." : "No active shifts found."}
                </div>
              ) : (
                shifts.map((shift) => (
                  <label
                    key={shift.id}
                    className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      shiftIds.includes(shift.id)
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <Checkbox
                      checked={shiftIds.includes(shift.id)}
                      onCheckedChange={(checked) => {
                        const newIds = checked
                          ? [...shiftIds, shift.id]
                          : shiftIds.filter((id) => id !== shift.id);
                        setValue("shift_ids", newIds, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm font-medium ${shiftIds.includes(shift.id) ? "text-blue-900" : "text-slate-900"}`}>
                        {shift.name_en}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>

            {errors.shift_ids && (
              <p className="text-sm text-red-600">
                {errors.shift_ids.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Selected Shifts & Live Summary Preview */}

      {selectedShifts.length > 0 && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock3 className="h-5 w-5 text-blue-700" />
              <h3 className="font-semibold text-slate-950">
                Selected Shifts ({selectedShifts.length})
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
               {selectedShifts.map((shift) => (
                 <div key={shift.id} className="bg-white border border-blue-100 rounded-lg px-3 py-2 text-sm">
                   <span className="font-medium text-slate-900">{shift.name_en}</span>
                   <span className="text-slate-500 ml-2 text-xs">
                     {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                   </span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Live Capacity Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Selected Shifts</p>
                <p className="text-lg font-medium text-slate-900">{selectedShifts.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Combined Capacity</p>
                <p className="text-lg font-medium text-slate-900">{combinedCapacity}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Seat Limit</p>
                <p className="text-lg font-medium text-slate-900">{normalizedSeatLimit ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Effective Capacity</p>
                <p className="text-lg font-bold text-blue-700">{effectiveBatchCapacity}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Batch Information */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-950">
            Batch Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure the batch identity and
            academic session.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="name_en">
              Batch Name (EN)
              <span className="ml-1 text-red-500">
                *
              </span>
            </Label>

            <Input
              id="name_en"
              {...register("name_en")}
              placeholder="Batch 101"
            />

            {errors.name_en && (
              <p className="text-sm text-red-600">
                {errors.name_en.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_bn">
              Batch Name (BN)
            </Label>

            <Input
              id="name_bn"
              {...register("name_bn")}
              placeholder="ব্যাচ ১০১"
            />

            {errors.name_bn && (
              <p className="text-sm text-red-600">
                {errors.name_bn.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="session">
              Session
            </Label>

            <Input
              id="session"
              {...register("session")}
              placeholder="2026"
            />

            {errors.session && (
              <p className="text-sm text-red-600">
                {errors.session.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Batch Schedule */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-slate-500" />

            <h2 className="text-base font-semibold text-slate-950">
              Batch Schedule
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Define admission and training
            schedule dates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
          <DateField
            id="start_date"
            label="Start Date"
            error={
              errors.start_date?.message
            }
            registration={register(
              "start_date"
            )}
          />

          <DateField
            id="end_date"
            label="End Date"
            error={errors.end_date?.message}
            registration={register(
              "end_date"
            )}
          />

          <DateField
            id="admission_deadline"
            label="Admission Deadline"
            error={
              errors.admission_deadline
                ?.message
            }
            registration={register(
              "admission_deadline"
            )}
          />

          <DateField
            id="orientation_date"
            label="Orientation Date"
            error={
              errors.orientation_date
                ?.message
            }
            registration={register(
              "orientation_date"
            )}
          />
        </div>
      </section>

      {/* Capacity and Status */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-950">
            Capacity & Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure batch capacity,
            waitlist and lifecycle status.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="seat_limit">
              Seat Limit
            </Label>

            <Input
              id="seat_limit"
              type="number"
              min={1}
              {...register("seat_limit")}
              placeholder={
                shiftIds.length > 0
                  ? "Uses combined shift capacity"
                  : "Enter seat limit"
              }
            />

            {errors.seat_limit && (
              <p className="text-sm text-red-600">
                {errors.seat_limit.message}
              </p>
            )}

            {!errors.seat_limit &&
              shiftIds.length > 0 && (
                <p className="text-xs text-slate-500">
                  Leave empty to use the combined capacity of selected shifts.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>

            <Select
              value={status}
              onValueChange={(value) => {
                const parsedStatus =
                  editableTrainingBatchStatusSchema.safeParse(
                    value
                  );

                if (!parsedStatus.success) {
                  return;
                }

                setValue(
                  "status",
                  parsedStatus.data,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                {BATCH_STATUSES.map(
                  (batchStatus) => (
                    <SelectItem
                      key={batchStatus.value}
                      value={batchStatus.value}
                    >
                      {batchStatus.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {errors.status && (
              <p className="text-sm text-red-600">
                {errors.status.message}
              </p>
            )}

            {capacityIsRequired &&
              !hasCapacityConfiguration && (
                <p className="text-xs font-medium text-amber-700">
                  This status requires a valid
                  capacity configuration.
                </p>
              )}
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="waitlist_enabled"
                  checked={waitlistEnabled}
                  onCheckedChange={(checked) =>
                    setValue(
                      "waitlist_enabled",
                      checked === true,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      }
                    )
                  }
                />

                <div>
                  <Label
                    htmlFor="waitlist_enabled"
                    className="cursor-pointer"
                  >
                    Enable Waitlist
                  </Label>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Allow students to join a
                    waiting list when the batch
                    reaches full capacity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      <div className="sticky bottom-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {isDirty ? (
            <>
              <AlertCircle className="h-4 w-4 text-amber-600" />

              <span>
                You have unsaved changes.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

              <span>
                No unsaved changes.
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
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
              loadingDependencies ||
              loadingCapacity
            }
            className="min-w-36"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : initialData ? (
              "Update Batch"
            ) : (
              "Create Batch"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* =========================================================
   Date Field
========================================================= */

interface DateFieldProps {
  id: string;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

function DateField({
  id,
  label,
  error,
  registration,
}: DateFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
      </Label>

      <Input
        id={id}
        type="date"
        {...registration}
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}