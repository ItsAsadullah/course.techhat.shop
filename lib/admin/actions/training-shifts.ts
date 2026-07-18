"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { createClient } from "@/lib/admin/supabase/server";

import { getTrainingLabCapacity } from "@/lib/admin/actions/training-labs";

import {
  parseTrainingDays,
  trainingShiftSchema,
  type TrainingShiftValues,
} from "@/lib/schema/training.schema";

import type {
  TrainingDay,
  TrainingShift,
  TrainingShiftCapacity,
} from "@/types/admin/training";

type ActionError = {
  code: string;
  message: string;
};

type ActionSuccess<T> = {
  success: true;
  data: T;
};

type ActionFailure = {
  success: false;
  error: ActionError;
};

type ActionResult<T> =
  | ActionSuccess<T>
  | ActionFailure;

type ShiftValidationResult =
  ActionResult<true>;

type ShiftConflictResult =
  ActionResult<boolean>;

type ArchiveShiftRpcResult = {
  success: boolean;
  error?: string | null;
};

const ACTIVE_ENROLLMENT_STATUSES = [
  "pending",
  "active",
  "suspended",
] as const;

const TERMINAL_BATCH_STATUSES = [
  "archived",
  "completed",
  "cancelled",
] as const;

async function requireAdmin(): Promise<
  | {
    user: NonNullable<
      Awaited<
        ReturnType<
          Awaited<
            ReturnType<typeof createClient>
          >["auth"]["getUser"]
        >
      >["data"]["user"]
    >;
    error: null;
  }
  | {
    user: null;
    error: "UNAUTHORIZED";
  }
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      user: null,
      error: "UNAUTHORIZED",
    };
  }

  const role =
    user.app_metadata?.app_role ??
    user.user_metadata?.role;

  if (String(role).toLowerCase() !== "admin") {
    return {
      user: null,
      error: "UNAUTHORIZED",
    };
  }

  return {
    user,
    error: null,
  };
}

function unauthorizedResult(): ActionFailure {
  return {
    success: false,
    error: {
      code: "UNAUTHORIZED",
      message: "Admin access required.",
    },
  };
}

function getValidationError(
  error: ZodError
): ActionFailure {
  const firstIssue = error.issues[0];

  return {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message:
        firstIssue?.message ??
        "Invalid training shift data.",
    },
  };
}

function revalidateTrainingShiftPaths(
  shiftId?: string
): void {
  revalidatePath("/admin/training");
  revalidatePath("/admin/training/shifts");

  if (shiftId) {
    revalidatePath(
      `/admin/training/shifts/${shiftId}`
    );
  }
}

function isArchiveShiftRpcResult(
  value: unknown
): value is ArchiveShiftRpcResult {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Record<string, unknown>;

  if (
    typeof candidate.success !== "boolean"
  ) {
    return false;
  }

  if (
    candidate.error !== undefined &&
    candidate.error !== null &&
    typeof candidate.error !== "string"
  ) {
    return false;
  }

  return true;
}

function mapShiftDatabaseError(
  error: {
    code?: string | null;
  },
  operation: "create" | "update"
): ActionFailure {
  if (error.code === "23505") {
    return {
      success: false,
      error: {
        code: "SHIFT_CODE_ALREADY_EXISTS",
        message:
          "এই শিফট কোডটি ইতোমধ্যে ব্যবহার করা হয়েছে। অন্য একটি ইউনিক কোড ব্যবহার করুন।",
      },
    };
  }

  if (error.code === "23503") {
    return {
      success: false,
      error: {
        code: "SHIFT_REFERENCE_INVALID",
        message:
          "নির্বাচিত ল্যাব বা সংশ্লিষ্ট তথ্যটি আর পাওয়া যাচ্ছে না। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।",
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
          ? "শিফট তৈরি করা যায়নি।"
          : "শিফট আপডেট করা যায়নি।",
    },
  };
}

export async function getTrainingShifts(): Promise<{
  data: TrainingShift[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("training_shifts")
    .select(`
      *,
      lab:lab_id (
        id,
        name,
        code,
        usable_computers,
        students_per_computer,
        manual_capacity_limit
      )
    `)
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch training shifts:",
      error
    );

    return {
      data: null,
      error:
        "Training shifts could not be loaded.",
    };
  }

  return {
    data: data as TrainingShift[],
    error: null,
  };
}

export async function getTrainingShiftById(
  id: string
): Promise<TrainingShift | null> {
  if (!id) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("training_shifts")
    .select(`
      *,
      lab:lab_id (
        id,
        name,
        code,
        usable_computers,
        students_per_computer,
        manual_capacity_limit
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch training shift:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return data as TrainingShift;
}

export async function getTrainingShiftCapacity(
  id: string
): Promise<TrainingShiftCapacity | null> {
  if (!id) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_training_shift_capacity",
    {
      p_shift_id: id,
    }
  );

  if (error || !data) {
    console.error(
      "Failed to fetch shift capacity:",
      error
    );

    return null;
  }

  return data as TrainingShiftCapacity;
}

export async function validateShiftTimeConflict(
  labId: string,
  startTime: string,
  endTime: string,
  classDays: TrainingDay[],
  excludeShiftId?: string
): Promise<ShiftConflictResult> {
  const supabase = await createClient();

  let query = supabase
    .from("training_shifts")
    .select(
      "id, class_days, start_time, end_time"
    )
    .eq("lab_id", labId)
    .eq("status", "active");

  if (excludeShiftId) {
    query = query.neq("id", excludeShiftId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Failed to validate shift conflicts:",
      error
    );

    return {
      success: false,
      error: {
        code: "SHIFT_CONFLICT_CHECK_FAILED",
        message:
          "শিফটের সময়সূচির সংঘর্ষ যাচাই করা যায়নি।",
      },
    };
  }

  for (const existing of data ?? []) {
    const parsedDays = parseTrainingDays(
      existing.class_days
    );

    if (!parsedDays) {
      console.error(
        "Invalid existing shift schedule data:",
        {
          shiftId: existing.id,
        }
      );

      return {
        success: false,
        error: {
          code: "SHIFT_SCHEDULE_DATA_INVALID",
          message:
            "একটি বিদ্যমান শিফটের সময়সূচির তথ্য সঠিক নয়। তথ্যটি ঠিক না করা পর্যন্ত নতুন সময়সূচি যাচাই করা যাবে না।",
        },
      };
    }

    const daysOverlap = parsedDays.some(
      (day) => classDays.includes(day)
    );

    if (!daysOverlap) {
      continue;
    }

    const timeOverlap =
      startTime < existing.end_time &&
      endTime > existing.start_time;

    if (timeOverlap) {
      return {
        success: true,
        data: true,
      };
    }
  }

  return {
    success: true,
    data: false,
  };
}

async function validateShiftConfiguration(
  values: TrainingShiftValues,
  excludeShiftId?: string
): Promise<ShiftValidationResult> {
  const labCapacityResult =
    await getTrainingLabCapacity(values.lab_id);

  if (
    !labCapacityResult ||
    !labCapacityResult.success
  ) {
    return {
      success: false,
      error: {
        code: "LAB_CAPACITY_CHECK_FAILED",
        message:
          "নির্বাচিত ল্যাবের ধারণক্ষমতা যাচাই করা যায়নি।",
      },
    };
  }

  const labEffectiveCapacity =
    labCapacityResult.effective_capacity;

  if (
    values.capacity_override !== null &&
    values.capacity_override !== undefined &&
    values.capacity_override >
    labEffectiveCapacity
  ) {
    return {
      success: false,
      error: {
        code: "CAPACITY_EXCEEDED",
        message: `শিফটের ধারণক্ষমতা (${values.capacity_override}) ল্যাবের কার্যকর ধারণক্ষমতা (${labEffectiveCapacity}) থেকে বেশি হতে পারবে না।`,
      },
    };
  }

  /*
   * Inactive shifts do not participate in the
   * active lab schedule.
   *
   * Conflict validation will run when the shift
   * is created or updated as active.
   */
  if (values.status !== "active") {
    return {
      success: true,
      data: true,
    };
  }

  const conflictResult =
    await validateShiftTimeConflict(
      values.lab_id,
      values.start_time,
      values.end_time,
      values.class_days,
      excludeShiftId
    );

  if (!conflictResult.success) {
    return conflictResult;
  }

  if (conflictResult.data) {
    return {
      success: false,
      error: {
        code: "SHIFT_SCHEDULE_CONFLICT",
        message:
          "এই শিফটের সময়সূচি একই ল্যাবের অন্য একটি সক্রিয় শিফটের সাথে সাংঘর্ষিক।",
      },
    };
  }

  return {
    success: true,
    data: true,
  };
}

async function validateShiftDeactivation(
  shiftId: string
): Promise<ShiftValidationResult> {
  const supabase = await createClient();

  const {
    data: batches,
    error: batchError,
  } = await supabase
    .from("course_batches")
    .select("id")
    .eq("shift_id", shiftId)
    .not(
      "status",
      "in",
      `("${TERMINAL_BATCH_STATUSES.join(
        '","'
      )}")`
    )
    .limit(1);

  if (batchError) {
    console.error(
      "Failed to check shift batch dependencies:",
      batchError
    );

    return {
      success: false,
      error: {
        code: "SHIFT_DEPENDENCY_CHECK_FAILED",
        message:
          "শিফটের ব্যাচ নির্ভরতা যাচাই করা যায়নি।",
      },
    };
  }

  if (batches && batches.length > 0) {
    return {
      success: false,
      error: {
        code: "SHIFT_HAS_ACTIVE_BATCHES",
        message:
          "এই শিফটের সাথে সংযুক্ত সক্রিয় ব্যাচ রয়েছে। আগে ব্যাচগুলো আর্কাইভ, সম্পন্ন, বাতিল বা স্থানান্তর করুন।",
      },
    };
  }

  const {
    data: enrollments,
    error: enrollmentError,
  } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("shift_id", shiftId)
    .in(
      "status",
      [...ACTIVE_ENROLLMENT_STATUSES]
    )
    .limit(1);

  if (enrollmentError) {
    console.error(
      "Failed to check shift enrollment dependencies:",
      enrollmentError
    );

    return {
      success: false,
      error: {
        code: "SHIFT_DEPENDENCY_CHECK_FAILED",
        message:
          "শিফটের এনরোলমেন্ট নির্ভরতা যাচাই করা যায়নি।",
      },
    };
  }

  if (
    enrollments &&
    enrollments.length > 0
  ) {
    return {
      success: false,
      error: {
        code: "SHIFT_HAS_ACTIVE_ENROLLMENTS",
        message:
          "এই শিফটের সাথে সংযুক্ত সক্রিয় এনরোলমেন্ট রয়েছে। আগে শিক্ষার্থীদের অন্য শিফটে স্থানান্তর করুন।",
      },
    };
  }

  return {
    success: true,
    data: true,
  };
}

export async function createTrainingShift(
  rawValues: unknown
): Promise<ActionResult<string>> {
  try {
    const access = await requireAdmin();

    if (access.error) {
      return unauthorizedResult();
    }

    const values =
      trainingShiftSchema.parse(rawValues);

    const configurationResult =
      await validateShiftConfiguration(values);

    if (!configurationResult.success) {
      return configurationResult;
    }

    const supabase = await createClient();

    const payload = {
      lab_id: values.lab_id,
      name_en: values.name_en,
      name_bn:
        values.name_bn?.trim() || null,
      code: values.code,
      start_time: values.start_time,
      end_time: values.end_time,
      class_days: JSON.stringify(
        values.class_days
      ),
      capacity_override:
        values.capacity_override ?? null,
      status: values.status,
      sort_order: values.sort_order,
    };

    const { data, error } = await supabase
      .from("training_shifts")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error(
        "createTrainingShift database error:",
        error
      );

      return mapShiftDatabaseError(
        error,
        "create"
      );
    }

    revalidateTrainingShiftPaths(data.id);

    return {
      success: true,
      data: data.id,
    };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return getValidationError(error);
    }

    console.error(
      "createTrainingShift unexpected error:",
      error
    );

    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message:
          "শিফট তৈরি করার সময় অপ্রত্যাশিত সমস্যা হয়েছে।",
      },
    };
  }
}

export async function updateTrainingShift(
  id: string,
  rawValues: unknown
): Promise<ActionResult<string>> {
  try {
    const access = await requireAdmin();

    if (access.error) {
      return unauthorizedResult();
    }

    if (!id) {
      return {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Shift ID is required.",
        },
      };
    }

    const values =
      trainingShiftSchema.parse(rawValues);

    const supabase = await createClient();

    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("training_shifts")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      console.error(
        "Failed to load shift before update:",
        existingError
      );

      return {
        success: false,
        error: {
          code: "SHIFT_LOOKUP_FAILED",
          message:
            "শিফটের বর্তমান তথ্য যাচাই করা যায়নি।",
        },
      };
    }

    if (!existing) {
      return {
        success: false,
        error: {
          code: "SHIFT_NOT_FOUND",
          message: "Shift not found.",
        },
      };
    }

    if (existing.status === "archived") {
      return {
        success: false,
        error: {
          code: "SHIFT_ARCHIVED",
          message:
            "আর্কাইভ করা শিফট এডিট করা যাবে না।",
        },
      };
    }

    if (
      existing.status === "active" &&
      values.status === "inactive"
    ) {
      const dependencyResult =
        await validateShiftDeactivation(id);

      if (!dependencyResult.success) {
        return dependencyResult;
      }
    }

    const configurationResult =
      await validateShiftConfiguration(
        values,
        id
      );

    if (!configurationResult.success) {
      return configurationResult;
    }

    const payload = {
      lab_id: values.lab_id,
      name_en: values.name_en,
      name_bn:
        values.name_bn?.trim() || null,
      code: values.code,
      start_time: values.start_time,
      end_time: values.end_time,
      class_days: JSON.stringify(
        values.class_days
      ),
      capacity_override:
        values.capacity_override ?? null,
      status: values.status,
      sort_order: values.sort_order,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("training_shifts")
      .update(payload)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error(
        "updateTrainingShift database error:",
        error
      );

      return mapShiftDatabaseError(
        error,
        "update"
      );
    }

    if (!data) {
      return {
        success: false,
        error: {
          code: "SHIFT_NOT_FOUND",
          message:
            "Shift not found or no longer exists.",
        },
      };
    }

    revalidateTrainingShiftPaths(id);

    return {
      success: true,
      data: data.id,
    };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return getValidationError(error);
    }

    console.error(
      "updateTrainingShift unexpected error:",
      error
    );

    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message:
          "শিফট আপডেট করার সময় অপ্রত্যাশিত সমস্যা হয়েছে।",
      },
    };
  }
}

export async function archiveTrainingShift(
  id: string
): Promise<ActionResult<boolean>> {
  try {
    const access = await requireAdmin();

    if (access.error) {
      return unauthorizedResult();
    }

    if (!id) {
      return {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Shift ID is required.",
        },
      };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
      "archive_training_shift",
      {
        p_shift_id: id,
      }
    );

    if (error) {
      console.error(
        "archiveTrainingShift database error:",
        error
      );

      return {
        success: false,
        error: {
          code: "DB_ARCHIVE_ERROR",
          message:
            "শিফট আর্কাইভ করার সময় ডেটাবেস সমস্যা হয়েছে।",
        },
      };
    }

    if (!isArchiveShiftRpcResult(data)) {
      console.error(
        "Invalid archive_training_shift RPC response:",
        data
      );

      return {
        success: false,
        error: {
          code: "INVALID_RPC_RESPONSE",
          message:
            "শিফট আর্কাইভ সার্ভিস থেকে সঠিক response পাওয়া যায়নি।",
        },
      };
    }

    if (!data.success) {
      const errorCode =
        data.error ?? "ARCHIVE_FAILED";

      const errorMap: Record<
        string,
        string
      > = {
        SHIFT_NOT_FOUND:
          "শিফটটি খুঁজে পাওয়া যায়নি।",

        ALREADY_ARCHIVED:
          "শিফটটি ইতোমধ্যে আর্কাইভ করা হয়েছে।",

        SHIFT_HAS_ACTIVE_BATCHES:
          "এই শিফটের সাথে সংযুক্ত সক্রিয় ব্যাচ রয়েছে। আগে ব্যাচগুলো আর্কাইভ বা স্থানান্তর করুন।",

        SHIFT_HAS_ACTIVE_ENROLLMENTS:
          "এই শিফটের সাথে সংযুক্ত সক্রিয় এনরোলমেন্ট রয়েছে।",

        DATABASE_ERROR:
          "শিফট আর্কাইভ করার সময় ডেটাবেস সমস্যা হয়েছে।",
      };

      return {
        success: false,
        error: {
          code: errorCode,
          message:
            errorMap[errorCode] ??
            "শিফট আর্কাইভ করা যায়নি।",
        },
      };
    }

    revalidateTrainingShiftPaths(id);

    return {
      success: true,
      data: true,
    };
  } catch (error: unknown) {
    console.error(
      "archiveTrainingShift unexpected error:",
      error
    );

    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message:
          "শিফট আর্কাইভ করার সময় অপ্রত্যাশিত সমস্যা হয়েছে।",
      },
    };
  }
}