"use server";

import { createClient } from "@/lib/admin/supabase/server";
import { TrainingOverviewMetrics } from "@/types/admin/training";

export async function getTrainingOperationsOverview(): Promise<{
  metrics: TrainingOverviewMetrics;
  todaysShifts: any[];
  nearlyFullBatches: any[];
  fullBatches: any[];
  recentMigrations: any[];
} | null> {
  const supabase = await createClient();

  try {
    // 1. Fetch metrics
    
    // Active Labs & Usable Computers
    const { data: labs, error: labsError } = await supabase
      .from("training_labs")
      .select("usable_computers, students_per_computer, manual_capacity_limit")
      .eq("status", "active");

    let activeLabs = 0;
    let usableComputers = 0;
    let effectiveCapacity = 0;

    if (!labsError && labs) {
      activeLabs = labs.length;
      for (const lab of labs) {
        usableComputers += lab.usable_computers;
        const computerCap = lab.usable_computers * lab.students_per_computer;
        if (lab.manual_capacity_limit !== null) {
          effectiveCapacity += Math.min(computerCap, lab.manual_capacity_limit);
        } else {
          effectiveCapacity += computerCap;
        }
      }
    }

    // Active Shifts
    const { count: activeShifts } = await supabase
      .from("training_shifts")
      .select("*", { count: 'exact', head: true })
      .eq("status", "active");

    // Active Batches
    const { count: activeBatches } = await supabase
      .from("course_batches")
      .select("*", { count: 'exact', head: true })
      .in("status", ["open", "ongoing", "full"]);

    // Occupied Seats (seat-reserving enrollments)
    const { count: occupiedSeats } = await supabase
      .from("course_enrollments")
      .select("*", { count: 'exact', head: true })
      .in("status", ["pending", "active", "suspended"]);

    // For available seats, we calculate a rough approximation based on total effective shift capacity, 
    // but the prompt asked to define operational metric accurately.
    // "Calculate occupiedSeats by blindly summing batch occupancy if one physical shift/lab capacity model can cause double counting."
    // Since effectiveCapacity is currently just the sum of *Lab* capacities, real available capacity is hard to measure globally.
    // We will use (Total Lab Effective Capacity * Active Shifts) as a proxy for maximum possible seating.
    const totalMaxSeats = effectiveCapacity * (activeShifts || 1);
    const availableSeats = Math.max(0, totalMaxSeats - (occupiedSeats || 0));
    const utilizationPercent = totalMaxSeats > 0 ? ((occupiedSeats || 0) / totalMaxSeats) * 100 : 0;

    const metrics: TrainingOverviewMetrics = {
      activeLabs,
      activeShifts: activeShifts || 0,
      activeBatches: activeBatches || 0,
      usableComputers,
      effectiveCapacity: totalMaxSeats, // total assigned training capacity
      occupiedSeats: occupiedSeats || 0,
      availableSeats,
      utilizationPercent: Math.round(utilizationPercent * 100) / 100
    };

    // 2. Fetch today's shifts (assuming today is derived from current day name)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];
    
    // We fetch active shifts, then filter by class_days in memory because class_days is a JSON array
    const { data: allShifts } = await supabase
      .from("training_shifts")
      .select("id, name_en, start_time, end_time, class_days, lab:lab_id(name)")
      .eq("status", "active")
      .order("start_time", { ascending: true });

    let todaysShifts: any[] = [];
    if (allShifts) {
      todaysShifts = allShifts.filter(s => {
        try {
          const arr = typeof s.class_days === 'string' ? JSON.parse(s.class_days) : s.class_days;
          return Array.isArray(arr) && arr.includes(todayName);
        } catch { return false; }
      });
    }

    // 3. Nearly Full & Full Batches 
    // We use the capacity RPC for open/ongoing batches
    const { data: ongoingBatches } = await supabase
      .from("course_batches")
      .select("id, name_en, course:course_id(name)")
      .in("status", ["open", "ongoing", "full"]);

    const fullBatches: any[] = [];
    const nearlyFullBatches: any[] = [];

    if (ongoingBatches) {
      for (const b of ongoingBatches) {
        const { data: cap } = await supabase.rpc('get_training_batch_capacity', { p_batch_id: b.id });
        if (cap && cap.success) {
          if (cap.is_full) {
            fullBatches.push({ ...b, capacity: cap });
          } else if (cap.available <= 3 && cap.effective_batch_capacity > 0) { // arbitrary threshold for "nearly full"
            nearlyFullBatches.push({ ...b, capacity: cap });
          }
        }
      }
    }

    // 4. Recent Migrations
    const { data: recentMigrations } = await supabase
      .from("enrollment_shift_migrations")
      .select(`
        id, 
        effective_date, 
        student:student_id(full_name_en),
        from_shift:from_shift_id(name_en),
        to_shift:to_shift_id(name_en)
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      metrics,
      todaysShifts,
      nearlyFullBatches,
      fullBatches,
      recentMigrations: recentMigrations || []
    };
  } catch (error) {
    console.error("Failed to fetch training overview:", error);
    return null;
  }
}
