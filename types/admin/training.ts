/* =========================================================
   Training Lab Domain
========================================================= */

export type TrainingLabStatus =
  | "active"
  | "maintenance"
  | "inactive"
  | "archived";

export interface TrainingLab {
  id: string;
  name: string;
  code: string;

  description: string | null;

  room: string | null;
  location: string | null;

  total_computers: number;
  usable_computers: number;
  students_per_computer: number;

  manual_capacity_limit: number | null;

  status: TrainingLabStatus;

  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

/**
 * Lightweight Lab relation returned by Shift queries.
 *
 * Do not use TrainingLab here because Shift queries do not
 * select every TrainingLab database column.
 */
export interface TrainingShiftLabSummary {
  id: string;
  name: string;
  code: string;

  usable_computers: number;
  students_per_computer: number;

  manual_capacity_limit: number | null;
}

/* =========================================================
   Training Schedule Domain
========================================================= */

export const TRAINING_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type TrainingDay =
  (typeof TRAINING_DAYS)[number];

/**
 * Raw schedule value returned from the database.
 *
 * Legacy/current rows may contain:
 * - JSON encoded string
 * - parsed string array
 * - null
 *
 * Business logic must parse this value through
 * parseTrainingDays before treating it as TrainingDay[].
 */
export type TrainingDaysRaw =
  | string
  | string[]
  | null;

/* =========================================================
   Training Shift Domain
========================================================= */

export type TrainingShiftStatus =
  | "active"
  | "inactive"
  | "archived";

export type EditableTrainingShiftStatus = Exclude<
  TrainingShiftStatus,
  "archived"
>;

export interface TrainingShift {
  id: string;
  lab_id: string;

  name_en: string;
  name_bn: string | null;

  /**
   * Shift code is required by the current application
   * schema and mutation contract.
   */
  code: string;

  start_time: string;
  end_time: string;

  class_days: TrainingDaysRaw;

  capacity_override: number | null;

  status: TrainingShiftStatus;
  sort_order: number;

  created_at: string;
  updated_at: string;
  archived_at: string | null;

  /**
   * Optional lightweight Lab relation.
   *
   * Present only when the Shift query explicitly selects
   * the required Lab summary fields.
   */
  lab?: TrainingShiftLabSummary | null;
}

/* =========================================================
   Training Batch Course Summary
========================================================= */

/**
 * Lightweight Course relation used by Training Batch
 * administration screens.
 *
 * The complete Course domain is maintained separately.
 * Batch list/details only require course identity and
 * translated display information.
 */
export interface TrainingBatchCourseSummary {
  id: string;

  name: string;
  name_bn: string | null;

  slug: string;
}

/* =========================================================
   Training Batch Lab Summary
========================================================= */

/**
 * Lightweight Lab relation nested inside a Batch Shift
 * query.
 *
 * Batch queries currently select only these fields.
 */
export interface TrainingBatchLabSummary {
  id: string;

  name: string;
  code: string;

  usable_computers: number;
  manual_capacity_limit: number | null;
}

/* =========================================================
   Training Batch Shift Summary
========================================================= */

/**
 * Lightweight Shift relation used by Training Batch
 * list and details screens.
 *
 * Do not use TrainingShift here because the Batch query
 * does not select the complete TrainingShift database row.
 */
export interface TrainingBatchShiftSummary {
  id: string;

  name_en: string;
  code: string;

  start_time: string;
  end_time: string;

  class_days: TrainingDaysRaw;

  capacity_override: number | null;

  lab: TrainingBatchLabSummary | null;
}

/* =========================================================
   Training Batch Domain
========================================================= */

export type TrainingBatchStatus =
  | "draft"
  | "open"
  | "full"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "archived";

export interface TrainingBatch {
  id: string;

  course_id: string;



  name_en: string;
  name_bn: string | null;

  session: string | null;

  start_date: string | null;
  end_date: string | null;

  admission_deadline: string | null;
  orientation_date: string | null;

  /**
   * Batch schedule may be stored as a legacy JSON string,
   * parsed array, or null.
   */
  class_days: TrainingDaysRaw;

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

  /**
   * Optional normalized Course summary.
   *
   * Present when the Batch query explicitly selects the
   * related Course and its translations.
   */
  course?: TrainingBatchCourseSummary | null;



  /**
   * Assigned Training Shifts loaded from the
   * course_batch_shifts junction table.
   *
   * This is the canonical source of truth for
   * Batch-to-Shift relationships.
   */
  shifts: TrainingBatchShiftSummary[];
}

/* =========================================================
   Capacity Error Contract
========================================================= */

export interface TrainingCapacityError {
  success: false;

  /**
   * Stable machine-readable capacity error code returned
   * by the production capacity RPC contract.
   */
  error: string;
}

/* =========================================================
   Training Lab Capacity
========================================================= */

export interface TrainingLabCapacitySuccess {
  success: true;

  lab_id: string;

  computer_capacity: number;
  manual_capacity_limit: number | null;

  effective_capacity: number;
}

export type TrainingLabCapacity =
  | TrainingLabCapacitySuccess
  | TrainingCapacityError;

/* =========================================================
   Training Shift Capacity
========================================================= */

export interface TrainingShiftCapacitySuccess {
  success: true;

  shift_id: string;
  lab_id: string;

  effective_lab_capacity: number;
  capacity_override: number | null;

  effective_shift_capacity: number;
}

export type TrainingShiftCapacity =
  | TrainingShiftCapacitySuccess
  | TrainingCapacityError;

/* =========================================================
   Training Batch Capacity
========================================================= */

export interface TrainingBatchCapacitySuccess {
  success: true;

  batch_id: string;

  /**
   * Number of Training Shifts assigned to this Batch
   * via the course_batch_shifts junction table.
   */
  selected_shift_count: number;

  /**
   * Combined effective capacity of all assigned shifts.
   */
  effective_shift_capacity: number;

  seat_limit: number | null;

  effective_batch_capacity: number;

  occupied: number;
  available: number;

  utilization_percent: number;
  is_full: boolean;
}

export type TrainingBatchCapacity =
  | TrainingBatchCapacitySuccess
  | TrainingCapacityError;

/* =========================================================
   Bulk Training Batch Capacity
========================================================= */

/**
 * One successful capacity row returned by:
 *
 * public.get_training_batches_capacity()
 *
 * The current bulk RPC returns one row for every
 * non-archived Training Batch.
 */
export type TrainingBatchCapacityListItem =
  TrainingBatchCapacitySuccess;

/**
 * Successful data contract returned by the bulk capacity
 * RPC.
 *
 * RPC execution errors are handled at the server action
 * boundary and are not represented as individual rows.
 */
export type TrainingBatchCapacityList =
  TrainingBatchCapacityListItem[];

/* =========================================================
   Bulk Training Batch Capacity Action Result
========================================================= */

/**
 * Explicit alias for the server action result returned by
 * getTrainingBatchesCapacity().
 *
 * Keeping this alias in the Training domain prevents UI
 * components from rebuilding the generic result contract.
 */
export type TrainingBatchCapacityListResult =
  TrainingActionResult<TrainingBatchCapacityList>;

/* =========================================================
   Training Overview
========================================================= */

export interface TrainingOverviewMetrics {
  activeLabs: number;
  activeShifts: number;
  activeBatches: number;

  usableComputers: number;

  effectiveCapacity: number;

  occupiedSeats: number;
  availableSeats: number;

  utilizationPercent: number;
}

/* =========================================================
   Shared Action Result
========================================================= */

export interface TrainingActionError {
  success: false;

  error: {
    code: string;
    message: string;
  };
}

export interface TrainingActionSuccess<T> {
  success: true;

  data: T;
}

export type TrainingActionResult<T> =
  | TrainingActionSuccess<T>
  | TrainingActionError;