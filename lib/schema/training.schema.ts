import { z } from "zod";

import {
  TRAINING_DAYS,
  type EditableTrainingShiftStatus,
  type TrainingDay,
} from "@/types/admin/training";

/* =========================================================
   Shared Helpers
========================================================= */

function emptyToNull(value: unknown): unknown {
  if (
    value === "" ||
    value === undefined ||
    value === null
  ) {
    return null;
  }

  return value;
}

function emptyToNullableNumber(value: unknown): unknown {
  if (
    value === "" ||
    value === undefined ||
    value === null
  ) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return null;
    }

    return Number(trimmedValue);
  }

  return value;
}

/* =========================================================
   Training Day Domain
========================================================= */

const trainingDaySet = new Set<string>(TRAINING_DAYS);

export const trainingDaySchema = z.enum(TRAINING_DAYS);

export function isTrainingDay(
  value: unknown
): value is TrainingDay {
  return (
    typeof value === "string" &&
    trainingDaySet.has(value)
  );
}

export function parseTrainingDays(
  raw: unknown
): TrainingDay[] | null {
  let data: unknown;

  try {
    data =
      typeof raw === "string"
        ? JSON.parse(raw)
        : raw;
  } catch {
    return null;
  }

  if (!Array.isArray(data)) {
    return null;
  }

  if (!data.every(isTrainingDay)) {
    return null;
  }

  return [...data];
}

/* =========================================================
   Training Lab Validation
========================================================= */

export const trainingLabSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Lab name is required"),

    code: z
      .string()
      .trim()
      .min(1, "Lab code is required"),

    description: z
      .string()
      .optional()
      .nullable()
      .default(""),

    room: z
      .string()
      .optional()
      .nullable()
      .default(""),

    location: z
      .string()
      .optional()
      .nullable()
      .default(""),

    total_computers: z.coerce
      .number()
      .int("Must be a whole number")
      .min(1, "Must be at least 1")
      .default(1),

    usable_computers: z.coerce
      .number()
      .int("Must be a whole number")
      .min(0, "Must be at least 0")
      .default(0),

    students_per_computer: z.coerce
      .number()
      .int("Must be a whole number")
      .min(1, "Must be at least 1")
      .default(1),

    manual_capacity_limit: z.preprocess(
      emptyToNullableNumber,
      z
        .number()
        .int("Must be a whole number")
        .min(1, "Must be greater than 0")
        .nullable()
    ),

    status: z
      .enum([
        "active",
        "maintenance",
        "inactive",
      ])
      .default("active"),
  })
  .superRefine((data, ctx) => {
    if (
      data.usable_computers >
      data.total_computers
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Usable computers cannot exceed total computers",
        path: ["usable_computers"],
      });
    }

    const physicalCapacity =
      data.usable_computers *
      data.students_per_computer;

    if (
      data.manual_capacity_limit !== null &&
      data.manual_capacity_limit >
      physicalCapacity
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Manual capacity (${data.manual_capacity_limit}) cannot exceed physical capacity (${physicalCapacity})`,
        path: ["manual_capacity_limit"],
      });
    }
  });

export type TrainingLabFormInput = z.input<
  typeof trainingLabSchema
>;

export type TrainingLabValues = z.output<
  typeof trainingLabSchema
>;

/* =========================================================
   Training Shift Validation
========================================================= */

export const trainingShiftSchema = z
  .object({
    lab_id: z
      .string()
      .uuid("Lab ID must be a valid UUID"),

    name_en: z
      .string()
      .trim()
      .min(
        1,
        "Shift name (EN) is required"
      ),

    name_bn: z
      .string()
      .optional()
      .nullable()
      .default(""),

    code: z
      .string()
      .trim()
      .min(1, "Shift code is required"),

    start_time: z
      .string()
      .min(1, "Start time is required")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
        "Invalid time format"
      ),

    end_time: z
      .string()
      .min(1, "End time is required")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
        "Invalid time format"
      ),

    class_days: z
      .array(trainingDaySchema)
      .min(
        1,
        "At least one training day must be selected"
      ),

    capacity_override: z.preprocess(
      emptyToNullableNumber,
      z
        .number()
        .int("Must be a whole number")
        .min(1, "Must be positive")
        .nullable()
    ),

    status: z
      .enum(["active", "inactive"])
      .default("active"),

    sort_order: z.coerce
      .number()
      .int("Sort order must be a whole number")
      .default(0),
  })
  .superRefine((data, ctx) => {
    if (
      data.start_time &&
      data.end_time &&
      data.start_time >= data.end_time
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Start time must be before end time",
        path: ["end_time"],
      });
    }
  });

export type TrainingShiftFormInput = z.input<
  typeof trainingShiftSchema
>;

export type TrainingShiftValues = z.output<
  typeof trainingShiftSchema
>;

type TrainingShiftSchemaStatus =
  TrainingShiftValues["status"];

const editableStatusTypeCheck: Record<
  EditableTrainingShiftStatus,
  TrainingShiftSchemaStatus
> = {
  active: "active",
  inactive: "inactive",
};

void editableStatusTypeCheck;

/* =========================================================
   Training Batch Validation
========================================================= */

export const editableTrainingBatchStatusSchema = z.enum([
  "draft",
  "open",
  "full",
  "ongoing",
  "completed",
  "cancelled",
]);

export type EditableTrainingBatchStatus = z.infer<
  typeof editableTrainingBatchStatusSchema
>;

export const trainingBatchSchema = z
  .object({
    course_id: z
      .string()
      .uuid("Please select a valid course"),

    shift_ids: z
      .array(
        z.string().uuid("Each shift must be a valid UUID")
      )
      .default([])
      .transform((ids) => [...new Set(ids)]),

    name_en: z
      .string()
      .trim()
      .min(
        1,
        "Batch name (EN) is required"
      ),

    name_bn: z
      .string()
      .trim()
      .optional()
      .nullable()
      .default(""),

    session: z
      .string()
      .trim()
      .optional()
      .nullable()
      .default(""),

    start_date: z.preprocess(
      emptyToNull,
      z.string().nullable()
    ),

    end_date: z.preprocess(
      emptyToNull,
      z.string().nullable()
    ),

    admission_deadline: z.preprocess(
      emptyToNull,
      z.string().nullable()
    ),

    orientation_date: z.preprocess(
      emptyToNull,
      z.string().nullable()
    ),

    seat_limit: z.preprocess(
      emptyToNullableNumber,
      z
        .number()
        .int("Seat limit must be a whole number")
        .min(
          1,
          "Seat limit must be at least 1"
        )
        .nullable()
    ),

    waitlist_enabled: z
      .boolean()
      .default(false),

    status: editableTrainingBatchStatusSchema
      .default("draft"),

    sort_order: z.coerce
      .number()
      .int("Sort order must be a whole number")
      .default(0),
  })
  .superRefine((data, ctx) => {
    if (
      data.start_date &&
      data.end_date &&
      data.start_date > data.end_date
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Start date must be before end date",
        path: ["end_date"],
      });
    }

    if (
      data.admission_deadline &&
      data.start_date &&
      data.admission_deadline >
      data.start_date
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Admission deadline cannot be after the batch start date",
        path: ["admission_deadline"],
      });
    }

    if (
      data.orientation_date &&
      data.end_date &&
      data.orientation_date >
      data.end_date
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Orientation date cannot be after the batch end date",
        path: ["orientation_date"],
      });
    }

    const capacityRequiredStatuses:
      EditableTrainingBatchStatus[] = [
        "open",
        "full",
        "ongoing",
      ];

    if (
      capacityRequiredStatuses.includes(
        data.status
      ) &&
      data.shift_ids.length === 0 &&
      data.seat_limit === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one shift or a manual seat limit is required for this batch status",
        path: ["seat_limit"],
      });
    }
  });

export type TrainingBatchFormInput = z.input<
  typeof trainingBatchSchema
>;

export type TrainingBatchValues = z.output<
  typeof trainingBatchSchema
>;