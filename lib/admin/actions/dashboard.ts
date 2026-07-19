"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { DashboardStats } from "@/types/admin";

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabaseAdmin = getAdminClient();

  const { count: totalStudents, error: studentsError } = await supabaseAdmin
    .from("students")
    .select("*", { count: "exact", head: true });

  if (studentsError) {
    throw new Error(`Failed to fetch stats: ${studentsError.message}`);
  }

  const { data: students, error: feeError } = await supabaseAdmin
    .from("students")
    .select("total_course_fee");

  if (feeError) {
    throw new Error(`Failed to fetch fees: ${feeError.message}`);
  }

  const { data: payments, error: paymentsError } = await supabaseAdmin
    .from("payments")
    .select("amount");

  if (paymentsError) {
    throw new Error(`Failed to fetch payments: ${paymentsError.message}`);
  }

  const totalRevenue = (payments || []).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  const totalCourseFees = (students || []).reduce(
    (sum, student) => sum + Number(student.total_course_fee || 0),
    0
  );

  const { count: totalCourses, error: coursesError } = await supabaseAdmin
    .from("courses")
    .select("*", { count: "exact", head: true });

  if (coursesError) {
    console.error("Failed to fetch total courses:", coursesError);
  }

  return {
    totalStudents: totalStudents || 0,
    totalRevenue,
    totalDues: totalCourseFees - totalRevenue,
    totalCourses: totalCourses || 0,
  };
}

import { format, subMonths, startOfMonth, endOfMonth, isSameMonth } from "date-fns";

export async function getChartData() {
  const supabaseAdmin = getAdminClient();
  
  // We will generate the last 6 months
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i);
    return {
      date: d,
      name: format(d, "MMM yyyy"),
      revenue: 0,
      students: 0,
    };
  });

  const startDate = startOfMonth(months[0].date).toISOString();
  const endDate = endOfMonth(months[5].date).toISOString();

  // Fetch payments for the last 6 months
  const { data: payments } = await supabaseAdmin
    .from("payments")
    .select("amount, payment_date")
    .gte("payment_date", startDate)
    .lte("payment_date", endDate);

  // Fetch students for the last 6 months
  const { data: students } = await supabaseAdmin
    .from("students")
    .select("created_at")
    .gte("created_at", startDate)
    .lte("created_at", endDate);

  if (payments) {
    payments.forEach(p => {
      const pDate = new Date(p.payment_date);
      const monthObj = months.find(m => isSameMonth(m.date, pDate));
      if (monthObj) {
        monthObj.revenue += Number(p.amount) || 0;
      }
    });
  }

  if (students) {
    students.forEach(s => {
      const sDate = new Date(s.created_at);
      const monthObj = months.find(m => isSameMonth(m.date, sDate));
      if (monthObj) {
        monthObj.students += 1;
      }
    });
  }

  return months.map(({ name, revenue, students }) => ({
    name,
    revenue,
    students,
  }));
}
