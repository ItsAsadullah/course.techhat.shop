import {
  TrainingBatchesDashboard,
  type TrainingBatchListItem,
} from "@/components/admin/training/TrainingBatchesDashboard";

import {
  getTrainingBatches,
  getTrainingBatchesCapacity,
} from "@/lib/admin/actions/training-batches";

import type {
  TrainingBatch,
  TrainingBatchCapacityListItem,
} from "@/types/admin/training";

/* =========================================================
   Metadata
========================================================= */

export const metadata = {
  title: "Course Batches",
  description:
    "Manage course batches, training shifts, lab schedules, seat capacity, and student occupancy.",
};

async function resolveBatchCapacities(
  batches: TrainingBatch[]
): Promise<TrainingBatchListItem[]> {
  if (batches.length === 0) return [];

  const capacityResult = await getTrainingBatchesCapacity();

  if (!capacityResult.success) {
    console.error(
      "Failed to resolve bulk batch capacities:",
      capacityResult.error
    );
    return batches.map((batch) => ({
      batch,
      capacity: null,
      capacityError:
        batch.status === "archived" ? null : capacityResult.error.code,
    }));
  }

  const capacityMap = new Map<string, TrainingBatchCapacityListItem>(
    capacityResult.data.map((capacity) => [capacity.batch_id, capacity])
  );

  return batches.map((batch) => {
    if (batch.status === "archived") {
      return { batch, capacity: null, capacityError: null };
    }

    const capacity = capacityMap.get(batch.id) ?? null;

    return {
      batch,
      capacity,
      capacityError: capacity ? null : "CAPACITY_NOT_RETURNED",
    };
  });
}

export default async function TrainingBatchesPage() {
  const batches = await getTrainingBatches();
  const batchItems = await resolveBatchCapacities(batches);

  return <TrainingBatchesDashboard items={batchItems} />;
}
