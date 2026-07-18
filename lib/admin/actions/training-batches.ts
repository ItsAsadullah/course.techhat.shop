"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { createClient } from "@/lib/admin/supabase/server";

import { getTrainingShiftCapacity } from "@/lib/admin/actions/training-shifts";

import {
  trainingBatchSchema,
  type TrainingBatchValues,
} from "@/lib/schema/training.schema";

import type {
  TrainingActionResult,
  TrainingBatch,
  TrainingBatchCapacity,
  TrainingBatchCapacityList,
  TrainingBatchCapacityListResult,
  TrainingBatchCapacityListItem,
  TrainingBatchCourseSummary,
  TrainingBatchShiftSummary,
  TrainingBatchStatus,
  TrainingDaysRaw,
} from "@/types/admin/training";

/* =========================================================
   Internal Query Types
========================================================= */

type BatchCourseTranslationRow = {
  lang: string;
  name: string | null;
  slug: string | null;
};

type BatchCourseRelationRow = {
  id: string;

  course_translations:
  | BatchCourseTranslationRow[]
  | null;
};

type BatchShiftLabRelationRow = {
  id: string;
  name: string;
  code: string;
  usable_computers: number | null;
  manual_capacity_limit: number | null;
};

type BatchShiftRelationRow = {
  id: string;

  name_en: string;
  code: string;

  start_time: string;
  end_time: string;

  class_days: unknown;

  capacity_override: number | null;

  lab:
  | BatchShiftLabRelationRow
  | BatchShiftLabRelationRow[]
  | null;
};

type BatchShiftJunctionRow = {
  shift_id: string;

  sort_order: number;

  shift:
  | BatchShiftRelationRow
  | BatchShiftRelationRow[]
  | null;
};

type TrainingBatchQueryRow = {
  id: string;

  course_id: string;

  name_en: string;
  name_bn: string | null;

  session: string | null;

  start_date: string | null;
  end_date: string | null;

  admission_deadline: string | null;
  orientation_date: string | null;

  class_days: unknown;

  class_time_start: string | null;
  class_time_end: string | null;

  room: string | null;

  seat_limit: number | null;
  waitlist_enabled: boolean;

  status: TrainingBatchStatus;
  sort_order: number;

  created_at: string;
  updated_at: string;
  archived_at: string | null;

  course:
  | BatchCourseRelationRow
  | BatchCourseRelationRow[]
  | null;



  /** Junction table rows with nested shift data */
  course_batch_shifts:
  | BatchShiftJunctionRow[]
  | null;
};

type BulkBatchCapacityRpcRow = {
  success?: unknown;

  batch_id?: unknown;

  selected_shift_count?: unknown;
  effective_shift_capacity?: unknown;
  seat_limit?: unknown;

  effective_batch_capacity?: unknown;

  occupied?: unknown;
  available?: unknown;

  utilization_percent?: unknown;

  is_full?: unknown;

  error?: unknown;
};

type BatchValidationResult =
  TrainingActionResult<true>;

type ExistingBatchState = {
  id: string;

  status: TrainingBatchStatus;

  seat_limit: number | null;
};

/* =========================================================
   Query Contracts
========================================================= */

/**
 * Canonical Training Batch read contract.
 *
 * Keep list and details queries aligned with
 * TrainingBatchQueryRow and TrainingBatch.
 *
 * Do not replace this with "*".
 */
const TRAINING_BATCH_SELECT = `
  id,
  course_id,
  name_en,
  name_bn,
  session,
  start_date,
  end_date,
  admission_deadline,
  orientation_date,
  class_days,
  class_time_start,
  class_time_end,
  room,
  seat_limit,
  waitlist_enabled,
  status,
  sort_order,
  created_at,
  updated_at,
  archived_at,
  course:course_id (
    id,
    course_translations (
      lang,
      name,
      slug
    )
  ),

  course_batch_shifts (
    shift_id,
    sort_order,
    shift:shift_id (
      id,
      name_en,
      code,
      start_time,
      end_time,
      class_days,
      capacity_override,
      lab:lab_id (
        id,
        name,
        code,
        usable_computers,
        manual_capacity_limit
      )
    )
  )
`;

/* =========================================================
   Constants
========================================================= */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ACTIVE_ENROLLMENT_STATUSES = [
  "pending",
  "active",
  "suspended",
] as const;

const CAPACITY_RELEVANT_BATCH_STATUSES:
  readonly TrainingBatchStatus[] = [
    "open",
    "full",
    "ongoing",
  ];

/* =========================================================
   Authentication
========================================================= */

async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return false;
  }

  const role =
    user.app_metadata?.app_role ??
    user.user_metadata?.role;

  return (
    String(role).toLowerCase() === "admin"
  );
}

function unauthorizedResult(): TrainingActionResult<never> {
  return {
    success: false,

    error: {
      code: "UNAUTHORIZED",
      message: "Admin access required.",
    },
  };
}

/* =========================================================
   Relation Helpers
========================================================= */

function firstRelation<T>(
  value: T | T[] | null
): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

/* =========================================================
   Schedule Normalization
========================================================= */

function normalizeTrainingDays(
  value: unknown
): TrainingDaysRaw {
  if (
    typeof value === "string" ||
    Array.isArray(value) ||
    value === null
  ) {
    return value;
  }

  return null;
}

/* =========================================================
   Numeric Normalization
========================================================= */

function normalizeFiniteNumber(
  value: unknown,
  fallback = 0
): number {
  const normalized =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(normalized)
    ? normalized
    : fallback;
}

function normalizeNonNegativeInteger(
  value: unknown
): number {
  return Math.max(
    0,
    Math.trunc(
      normalizeFiniteNumber(value)
    )
  );
}

/* =========================================================
   Course Normalization
========================================================= */

function normalizeCourse(
  relation:
    | BatchCourseRelationRow
    | BatchCourseRelationRow[]
    | null
): TrainingBatchCourseSummary | null {
  const course = firstRelation(relation);

  if (!course) {
    return null;
  }

  const translations =
    course.course_translations ?? [];

  const englishTranslation =
    translations.find(
      (translation) =>
        translation.lang === "en"
    );

  const banglaTranslation =
    translations.find(
      (translation) =>
        translation.lang === "bn"
    );

  const fallbackTranslation =
    translations[0] ?? null;

  return {
    id: course.id,

    name:
      englishTranslation?.name ??
      fallbackTranslation?.name ??
      "Unknown Course",

    name_bn:
      banglaTranslation?.name ?? null,

    slug:
      englishTranslation?.slug ??
      fallbackTranslation?.slug ??
      "",
  };
}

/* =========================================================
   Batch Shift Normalization
========================================================= */

function normalizeBatchShift(
  relation:
    | BatchShiftRelationRow
    | BatchShiftRelationRow[]
    | null
): TrainingBatchShiftSummary | null {
  const shift = firstRelation(relation);

  if (!shift) {
    return null;
  }

  const lab = firstRelation(shift.lab);

  return {
    id: shift.id,

    name_en: shift.name_en,

    code: shift.code,

    start_time: shift.start_time,

    end_time: shift.end_time,

    class_days: normalizeTrainingDays(
      shift.class_days
    ),

    capacity_override: shift.capacity_override ?? null,

    lab: lab
      ? {
        id: lab.id,
        name: lab.name,
        code: lab.code,
        usable_computers: lab.usable_computers ?? 0,
        manual_capacity_limit: lab.manual_capacity_limit ?? null,
      }
      : null,
  };
}

/* =========================================================
   Batch Row Normalization
========================================================= */

function normalizeJunctionShifts(
  junctionRows:
    | BatchShiftJunctionRow[]
    | null
): TrainingBatchShiftSummary[] {
  if (!junctionRows || !Array.isArray(junctionRows)) {
    return [];
  }

  const sorted = [...junctionRows].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const results: TrainingBatchShiftSummary[] = [];

  for (const junctionRow of sorted) {
    const shift = normalizeBatchShift(
      junctionRow.shift
    );

    if (shift) {
      results.push(shift);
    }
  }

  return results;
}

function normalizeBatchRow(
  row: TrainingBatchQueryRow
): TrainingBatch {
  const junctionShifts = normalizeJunctionShifts(
    row.course_batch_shifts
  );

  const shifts = junctionShifts;

  return {
    id: row.id,

    course_id: row.course_id,

    name_en: row.name_en,

    name_bn: row.name_bn,

    session: row.session,

    start_date: row.start_date,

    end_date: row.end_date,

    admission_deadline:
      row.admission_deadline,

    orientation_date:
      row.orientation_date,

    class_days: normalizeTrainingDays(
      row.class_days
    ),

    class_time_start:
      row.class_time_start,

    class_time_end:
      row.class_time_end,

    room: row.room,

    seat_limit: row.seat_limit,

    waitlist_enabled:
      row.waitlist_enabled,

    status: row.status,

    sort_order: row.sort_order,

    created_at: row.created_at,

    updated_at: row.updated_at,

    archived_at: row.archived_at,

    course: normalizeCourse(row.course),

    shifts,
  };
}

/* =========================================================
   Bulk Capacity Row Normalization
========================================================= */

function normalizeBulkBatchCapacityRow(
  row: BulkBatchCapacityRpcRow
): TrainingBatchCapacityListItem | null {
  if (row.success !== true) {
    return null;
  }

  if (
    typeof row.batch_id !== "string" ||
    !UUID_REGEX.test(row.batch_id)
  ) {
    return null;
  }

  const effectiveShiftCapacity =
    normalizeNonNegativeInteger(
      row.effective_shift_capacity
    );

  const effectiveBatchCapacity =
    normalizeNonNegativeInteger(
      row.effective_batch_capacity
    );

  const occupied =
    normalizeNonNegativeInteger(
      row.occupied
    );

  const available =
    normalizeNonNegativeInteger(
      row.available
    );

  const utilizationPercent = Math.max(
    0,
    normalizeFiniteNumber(
      row.utilization_percent
    )
  );

  const seatLimit =
    row.seat_limit === null ||
      row.seat_limit === undefined
      ? null
      : normalizeNonNegativeInteger(
        row.seat_limit
      );

  const selectedShiftCount =
    normalizeNonNegativeInteger(
      row.selected_shift_count
    );

  return {
    success: true,

    batch_id: row.batch_id,

    selected_shift_count:
      selectedShiftCount,

    effective_shift_capacity:
      effectiveShiftCapacity,

    seat_limit: seatLimit,

    effective_batch_capacity:
      effectiveBatchCapacity,

    occupied,

    available,

    utilization_percent:
      utilizationPercent,

    is_full: row.is_full === true,
  };
}


/* =========================================================
   Validation Error Mapping
========================================================= */

function getValidationError(
  error: ZodError
): TrainingActionResult<never> {
  return {
    success: false,

    error: {
      code: "VALIDATION_ERROR",

      message:
        error.issues[0]?.message ??
        "Invalid training batch data.",
    },
  };
}

/* =========================================================
   Database Error Mapping
========================================================= */

function mapBatchDatabaseError(
  error: {
    code?: string | null;
  },

  operation: "create" | "update"
): TrainingActionResult<never> {
  if (error.code === "23505") {
    return {
      success: false,

      error: {
        code: "BATCH_ALREADY_EXISTS",

        message:
          "একই তথ্যের একটি ব্যাচ ইতোমধ্যে রয়েছে।",
      },
    };
  }

  if (error.code === "23503") {
    return {
      success: false,

      error: {
        code: "BATCH_REFERENCE_INVALID",

        message:
          "নির্বাচিত কোর্স বা শিফটের তথ্য আর পাওয়া যাচ্ছে না। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।",
      },
    };
  }

  return {
    success: false,

    error: {
      code:
        operation === "create"
          ? "DB_INSERT_ERROR"
          : "DB_UPDATE_ERROR",

      message:
        operation === "create"
          ? "ব্যাচ তৈরি করা যায়নি।"
          : "ব্যাচ আপডেট করা যায়নি।",
    },
  };
}

/* =========================================================
   Cache Revalidation
========================================================= */

function revalidateTrainingBatchPaths(
  batchId?: string
): void {
  revalidatePath("/admin/training");

  revalidatePath(
    "/admin/training/batches"
  );

  if (batchId) {
    revalidatePath(
      `/admin/training/batches/${batchId}`
    );
  }
}

/* =========================================================
   Query Actions
========================================================= */

export async function getTrainingBatches(): Promise<
  TrainingBatch[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_batches")
    .select(TRAINING_BATCH_SELECT)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch training batches:",
      error
    );

    return [];
  }

  return (data ?? []).map((row) =>
    normalizeBatchRow(
      row as unknown as TrainingBatchQueryRow
    )
  );
}

export async function getTrainingBatchById(
  id: string
): Promise<TrainingBatch | null> {
  if (!id || !UUID_REGEX.test(id)) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_batches")
    .select(TRAINING_BATCH_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch training batch:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return normalizeBatchRow(
    data as unknown as TrainingBatchQueryRow
  );
}

/* =========================================================
   Single Batch Capacity Query
========================================================= */

export async function getTrainingBatchCapacity(
  id: string
): Promise<TrainingBatchCapacity | null> {
  if (!id || !UUID_REGEX.test(id)) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_training_batch_capacity",
    {
      p_batch_id: id,
    }
  );

  if (error || !data) {
    console.error(
      "Failed to fetch batch capacity:",
      error
    );

    return null;
  }

  if (
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    console.error(
      "Invalid batch capacity RPC response:",
      data
    );

    return null;
  }

  return data as TrainingBatchCapacity;
}

/* =========================================================
   Bulk Batch Capacity Query
========================================================= */

export async function getTrainingBatchesCapacity():
  Promise<TrainingBatchCapacityListResult> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
      "get_training_batches_capacity"
    );

    if (error) {
      console.error(
        "Failed to fetch bulk batch capacity:",
        error
      );

      return {
        success: false,

        error: {
          code:
            "BATCH_CAPACITY_LIST_FETCH_FAILED",

          message:
            "ব্যাচগুলোর ধারণক্ষমতার তথ্য লোড করা যায়নি।",
        },
      };
    }

    if (!Array.isArray(data)) {
      console.error(
        "Invalid bulk batch capacity RPC response:",
        data
      );

      return {
        success: false,

        error: {
          code:
            "BATCH_CAPACITY_LIST_INVALID_RESPONSE",

          message:
            "ব্যাচ ধারণক্ষমতার তথ্য সঠিক ফরম্যাটে পাওয়া যায়নি।",
        },
      };
    }

    const capacities: TrainingBatchCapacityList =
      [];

    for (const rawRow of data) {
      if (
        typeof rawRow !== "object" ||
        rawRow === null ||
        Array.isArray(rawRow)
      ) {
        console.error(
          "Invalid bulk batch capacity row:",
          rawRow
        );

        return {
          success: false,

          error: {
            code:
              "BATCH_CAPACITY_ROW_INVALID",

            message:
              "এক বা একাধিক ব্যাচের ধারণক্ষমতার তথ্য সঠিক নয়।",
          },
        };
      }

      const capacity =
        normalizeBulkBatchCapacityRow(
          rawRow as BulkBatchCapacityRpcRow
        );

      if (!capacity) {
        console.error(
          "Unable to normalize bulk batch capacity row:",
          rawRow
        );

        return {
          success: false,

          error: {
            code:
              "BATCH_CAPACITY_ROW_INVALID",

            message:
              "এক বা একাধিক ব্যাচের ধারণক্ষমতার তথ্য যাচাই করা যায়নি।",
          },
        };
      }

      capacities.push(capacity);
    }

    return {
      success: true,

      data: capacities,
    };
  } catch (error: unknown) {
    console.error(
      "getTrainingBatchesCapacity unexpected error:",
      error
    );

    return {
      success: false,

      error: {
        code: "SERVER_ERROR",

        message:
          "ব্যাচ ধারণক্ষমতার তথ্য লোড করার সময় অপ্রত্যাশিত সমস্যা হয়েছে।",
      },
    };
  }
}

/* =========================================================
   Enrollment Occupancy
========================================================= */

async function getBatchOccupiedSeats(
  batchId: string
): Promise<TrainingActionResult<number>> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("course_enrollments")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("batch_id", batchId)
    .in(
      "status",
      [...ACTIVE_ENROLLMENT_STATUSES]
    );

  if (error) {
    console.error(
      "Failed to count batch occupied seats:",
      error
    );

    return {
      success: false,

      error: {
        code:
          "BATCH_OCCUPANCY_CHECK_FAILED",

        message:
          "ব্যাচের বর্তমান শিক্ষার্থী সংখ্যা যাচাই করা যায়নি।",
      },
    };
  }

  return {
    success: true,

    data: count ?? 0,
  };
}

/* =========================================================
   Shift Validation
========================================================= */

async function validateSelectedShift(
  shiftId: string
): Promise<
  TrainingActionResult<{
    effectiveCapacity: number;
  }>
> {
  const supabase = await createClient();

  const { data: shift, error } =
    await supabase
      .from("training_shifts")
      .select("id, status")
      .eq("id", shiftId)
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to validate selected shift:",
      error
    );

    return {
      success: false,

      error: {
        code: "SHIFT_LOOKUP_FAILED",

        message:
          "নির্বাচিত শিফট যাচাই করা যায়নি।",
      },
    };
  }

  if (!shift) {
    return {
      success: false,

      error: {
        code: "SHIFT_NOT_FOUND",

        message:
          "নির্বাচিত শিফটটি পাওয়া যায়নি।",
      },
    };
  }

  if (shift.status === "archived") {
    return {
      success: false,
      error: {
        code: "SHIFT_ARCHIVED",
        message:
          "আর্কাইভ করা শিফটে ব্যাচ অ্যাসাইন করা যাবে না।",
      },
    };
  }

  if (shift.status !== "active") {
    return {
      success: false,

      error: {
        code: "SHIFT_NOT_ACTIVE",

        message:
          "শুধু সক্রিয় শিফটে ব্যাচ অ্যাসাইন করা যাবে।",
      },
    };
  }

  const capacity =
    await getTrainingShiftCapacity(shiftId);

  if (!capacity) {
    return {
      success: false,

      error: {
        code:
          "SHIFT_CAPACITY_CHECK_FAILED",

        message:
          "নির্বাচিত শিফটের ধারণক্ষমতা যাচাই করা যায়নি।",
      },
    };
  }

  if (!capacity.success) {
    return {
      success: false,

      error: {
        code: capacity.error,

        message:
          "নির্বাচিত শিফটের ধারণক্ষমতার তথ্য সঠিক নয়।",
      },
    };
  }

  return {
    success: true,

    data: {
      effectiveCapacity:
        capacity.effective_shift_capacity,
    },
  };
}

/* =========================================================
   Batch Configuration Validation (Multi-Shift)
========================================================= */

async function validateBatchConfiguration(
  values: TrainingBatchValues,

  existingBatchId?: string
): Promise<BatchValidationResult> {
  let combinedShiftCapacity: number | null =
    null;

  if (values.shift_ids.length > 0) {
    let totalCapacity = 0;

    for (const shiftId of values.shift_ids) {
      const shiftResult =
        await validateSelectedShift(shiftId);

      if (!shiftResult.success) {
        return shiftResult;
      }

      totalCapacity +=
        shiftResult.data.effectiveCapacity;
    }

    combinedShiftCapacity = totalCapacity;
  }

  if (
    values.seat_limit !== null &&
    values.seat_limit !== undefined &&
    values.seat_limit <= 0
  ) {
    return {
      success: false,

      error: {
        code: "BATCH_SEAT_LIMIT_INVALID",

        message:
          "ব্যাচের আসন সংখ্যা অবশ্যই ১ বা তার বেশি হতে হবে।",
      },
    };
  }

  if (
    combinedShiftCapacity !== null &&
    values.seat_limit !== null &&
    values.seat_limit !== undefined &&
    values.seat_limit > combinedShiftCapacity
  ) {
    return {
      success: false,

      error: {
        code:
          "BATCH_CAPACITY_EXCEEDS_SHIFT",

        message:
          `ব্যাচের আসন সংখ্যা (${values.seat_limit}) ` +
          `শিফটগুলোর মোট কার্যকর ধারণক্ষমতা (${combinedShiftCapacity}) ` +
          "থেকে বেশি হতে পারবে না।",
      },
    };
  }

  const effectiveCapacity =
    values.seat_limit ?? combinedShiftCapacity;

  if (
    CAPACITY_RELEVANT_BATCH_STATUSES.includes(
      values.status
    ) &&
    (
      effectiveCapacity === null ||
      effectiveCapacity <= 0
    )
  ) {
    return {
      success: false,

      error: {
        code:
          "BATCH_CAPACITY_NOT_CONFIGURED",

        message:
          "Open, Full বা Ongoing ব্যাচের জন্য কমপক্ষে একটি সক্রিয় শিফট অথবা বৈধ আসন সীমা নির্ধারণ করতে হবে।",
      },
    };
  }

  if (existingBatchId) {
    const occupancyResult =
      await getBatchOccupiedSeats(
        existingBatchId
      );

    if (!occupancyResult.success) {
      return occupancyResult;
    }

    const occupied = occupancyResult.data;

    if (
      effectiveCapacity !== null &&
      effectiveCapacity < occupied
    ) {
      return {
        success: false,

        error: {
          code:
            "BATCH_CAPACITY_BELOW_OCCUPANCY",

          message:
            `এই ব্যাচে বর্তমানে ${occupied} জন ` +
            "সক্রিয়/সংরক্ষিত শিক্ষার্থী রয়েছে। " +
            `ব্যাচের ধারণক্ষমতা ${occupied}-এর নিচে করা যাবে না।`,
        },
      };
    }
  }

  return {
    success: true,

    data: true,
  };
}

/* =========================================================
   Save Batch (Atomic Multi-Shift)
========================================================= */

export async function saveTrainingBatch(
  id: string | null,

  rawValues: unknown
): Promise<TrainingActionResult<string>> {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return unauthorizedResult();
    }

    if (id && !UUID_REGEX.test(id)) {
      return {
        success: false,

        error: {
          code: "INVALID_BATCH_ID",

          message: "Invalid Batch ID.",
        },
      };
    }

    const values =
      trainingBatchSchema.parse(rawValues);

    const supabase = await createClient();

    let existingBatch:
      | ExistingBatchState
      | null = null;

    if (id) {
      const {
        data: existing,

        error: existingError,
      } = await supabase
        .from("course_batches")
        .select(
          "id, status, seat_limit"
        )
        .eq("id", id)
        .maybeSingle();

      if (existingError) {
        console.error(
          "Failed to load batch before update:",
          existingError
        );

        return {
          success: false,

          error: {
            code: "BATCH_LOOKUP_FAILED",

            message:
              "ব্যাচের বর্তমান তথ্য যাচাই করা যায়নি।",
          },
        };
      }

      if (!existing) {
        return {
          success: false,

          error: {
            code: "BATCH_NOT_FOUND",

            message:
              "ব্যাচটি খুঁজে পাওয়া যায়নি।",
          },
        };
      }

      existingBatch =
        existing as ExistingBatchState;

      if (
        existingBatch.status === "archived"
      ) {
        return {
          success: false,

          error: {
            code: "BATCH_ARCHIVED",

            message:
              "আর্কাইভ করা ব্যাচ এডিট করা যাবে না।",
          },
        };
      }
    }

    const validationResult =
      await validateBatchConfiguration(
        values,
        id ?? undefined
      );

    if (!validationResult.success) {
      return validationResult;
    }

    // Build JSONB payload for the atomic RPC.
    const rpcPayload = {
      course_id: values.course_id,
      name_en: values.name_en,
      name_bn: values.name_bn?.trim() || "",
      session: values.session?.trim() || "",
      start_date: values.start_date || "",
      end_date: values.end_date || "",
      admission_deadline: values.admission_deadline || "",
      orientation_date: values.orientation_date || "",
      seat_limit: values.seat_limit !== null ? String(values.seat_limit) : "",
      waitlist_enabled: String(values.waitlist_enabled),
      status: values.status,
      sort_order: String(values.sort_order),
    };

    const { data, error } = await supabase.rpc("save_training_batch_with_shifts", {
      p_batch_id: id ?? null,
      p_payload: rpcPayload,
      p_shift_ids: values.shift_ids,
    });

    if (error) {
      console.error("saveTrainingBatch RPC error:", error);
      return mapBatchDatabaseError(error, id ? "update" : "create");
    }

    const rpcResult = data as { success: boolean; batch_id: string; error?: string; code?: string; message?: string };
    
    if (!rpcResult.success) {
      console.error("RPC returned logic error:", rpcResult);
      return {
        success: false,
        error: {
          code: (rpcResult.code as any) || "RPC_LOGIC_ERROR",
          message: rpcResult.message || rpcResult.error || "An unknown error occurred during saving.",
        },
      };
    }

    revalidatePath("/admin/training/batches");
    if (id) {
      revalidatePath(`/admin/training/batches/${id}`);
    }

    return {
      success: true,
      data: rpcResult.batch_id,
    };
  } catch (error) {
    console.error("Failed to save training batch:", error);
    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check the form for errors.",
        },
      };
    }
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred. Please try again.",
      },
    };
  }
}

/* =========================================================
   Delete Batch
========================================================= */

export async function deleteTrainingBatch(
  id: string
): Promise<TrainingActionResult<boolean>> {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return unauthorizedResult();
    }

    if (!id || !UUID_REGEX.test(id)) {
      return {
        success: false,
        error: {
          code: "INVALID_BATCH_ID",
          message: "Invalid Batch ID.",
        },
      };
    }

    const supabase = await createClient();

    // Check if batch exists and its status
    const { data: existing, error: existingError } = await supabase
      .from("course_batches")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      console.error("Failed to lookup batch before deletion:", existingError);
      return {
        success: false,
        error: {
          code: "BATCH_LOOKUP_FAILED",
          message: "Failed to verify batch details.",
        },
      };
    }

    if (!existing) {
      return {
        success: false,
        error: {
          code: "BATCH_NOT_FOUND",
          message: "Batch not found.",
        },
      };
    }

    // Attempt to delete
    const { error: deleteError } = await supabase
      .from("course_batches")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Failed to delete training batch:", deleteError);
      
      // Handle foreign key constraint errors
      if (deleteError.code === "23503") {
        return {
          success: false,
          error: {
            code: "BATCH_IN_USE",
            message: "Cannot delete this batch because it is currently linked to students or other records. Please archive it instead.",
          },
        };
      }

      return {
        success: false,
        error: {
          code: "DELETE_FAILED",
          message: "Failed to delete the batch.",
        },
      };
    }

    revalidateTrainingBatchPaths();

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    console.error("Unexpected error deleting batch:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
      },
    };
  }
}

/* =========================================================
   Archive Batch
========================================================= */

export async function archiveTrainingBatch(
  id: string
): Promise<TrainingActionResult<boolean>> {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return unauthorizedResult();

    if (!id || !UUID_REGEX.test(id)) {
      return {
        success: false,
        error: { code: "INVALID_BATCH_ID", message: "Invalid Batch ID." },
      };
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("course_batches")
      .update({ 
        status: "archived", 
        archived_at: new Date().toISOString() 
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to archive training batch:", error);
      return {
        success: false,
        error: { code: "ARCHIVE_FAILED", message: "Failed to archive the batch." },
      };
    }

    revalidateTrainingBatchPaths();
    return { success: true, data: true };
  } catch (error) {
    console.error("Unexpected error archiving batch:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
    };
  }
}

/* =========================================================
   Duplicate Batch
========================================================= */

export async function duplicateTrainingBatch(
  id: string
): Promise<TrainingActionResult<string>> {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) return unauthorizedResult();

    const batch = await getTrainingBatchById(id);
    if (!batch) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Batch not found." },
      };
    }

    const supabase = await createClient();

    const rpcPayload = {
      course_id: batch.course_id,
      name_en: batch.name_en + " (Copy)",
      name_bn: batch.name_bn || "",
      session: batch.session || "",
      start_date: batch.start_date || "",
      end_date: batch.end_date || "",
      admission_deadline: batch.admission_deadline || "",
      orientation_date: batch.orientation_date || "",
      seat_limit: batch.seat_limit !== null ? String(batch.seat_limit) : "",
      waitlist_enabled: String(batch.waitlist_enabled),
      status: "draft",
      sort_order: "0",
    };

    const shiftIds = batch.shifts.map((s) => s.id);

    const { data, error } = await supabase.rpc("save_training_batch_with_shifts", {
      p_batch_id: null,
      p_payload: rpcPayload,
      p_shift_ids: shiftIds,
    });

    if (error) {
      console.error("Failed to duplicate training batch:", error);
      return {
        success: false,
        error: { code: "DUPLICATE_FAILED", message: "Failed to duplicate the batch." },
      };
    }

    const rpcResult = data as { success: boolean; batch_id: string; error?: string; code?: string; message?: string };
    
    if (!rpcResult.success) {
      console.error("RPC returned logic error on duplication:", rpcResult);
      return {
        success: false,
        error: {
          code: (rpcResult.code as any) || "RPC_LOGIC_ERROR",
          message: rpcResult.message || rpcResult.error || "Failed to duplicate.",
        },
      };
    }

    revalidateTrainingBatchPaths();
    return { success: true, data: rpcResult.batch_id };
  } catch (error) {
    console.error("Unexpected error duplicating batch:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
    };
  }
}

