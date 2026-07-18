import { redirect } from "next/navigation";

import { createClient } from "@/lib/admin/supabase/server";
import {
  dashboardCourses,
  dashboardNotifications,
  dashboardHomeStats,
  genericModuleConfigs,
  quickActionCards,
} from "@/lib/dashboard/data";

export interface DashboardViewer {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  studentId: string;
  batchLabel: string;
  currentTrack: string;
  overallCompletion: number;
  dailyStreak: number;
  learningTime: string;
  todayGoal: string;
  unreadNotifications: number;
}

export async function getDashboardViewer(): Promise<DashboardViewer> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const studentId = (user.user_metadata?.student_id as string | undefined) ?? "guest-student";

  let studentName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    "TechHat Student";
  let email = user.email || user.phone || "student@techhat.local";
  let batchLabel = "Hybrid Batch A-24";

  if (studentId && studentId !== "guest-student") {
    const { data: student } = await supabase
      .from("students")
      .select("id, full_name_en, email, mobile, admission_id")
      .eq("id", studentId)
      .maybeSingle();

    if (student?.full_name_en) studentName = student.full_name_en;
    if (student?.email || student?.mobile) email = student.email || student.mobile || email;

    if (student?.admission_id) {
      const { data: admission } = await supabase
        .from("admissions")
        .select("shift")
        .eq("id", student.admission_id)
        .maybeSingle();

      if (admission?.shift) {
        batchLabel = `${String(admission.shift).replace(/^\w/, (m) => m.toUpperCase())} Shift`;
      }
    }
  }

  return {
    id: user.id,
    name: studentName,
    email,
    avatarUrl: null,
    studentId,
    batchLabel,
    currentTrack: dashboardCourses[0]?.title ?? "Full Stack Web Development",
    overallCompletion: 68,
    dailyStreak: 4,
    learningTime: "2h 18m",
    todayGoal: "Finish one lesson, one quiz, and 15 minutes of typing practice",
    unreadNotifications: dashboardNotifications.length,
  };
}

export async function getDashboardHomePayload() {
  const viewer = await getDashboardViewer();

  return {
    viewer,
    stats: dashboardHomeStats,
    quickActions: quickActionCards,
    notifications: dashboardNotifications,
    courses: dashboardCourses,
    upcoming: [
      {
        title: "UI Engineering Live Critique",
        time: "Today, 8:30 PM",
        detail: "Mentor review and Q&A for dashboard architecture assignments.",
      },
      {
        title: "Dashboard shell assignment",
        time: "Tomorrow, 10:00 PM",
        detail: "Submit responsive layout, empty state, and top navigation system.",
      },
      {
        title: "Typing lab certification sprint",
        time: "Friday, 4:00 PM",
        detail: "Final speed and accuracy checkpoint in lab room 3.",
      },
    ],
  };
}

export async function getModulePayload(slug: string) {
  const viewer = await getDashboardViewer();
  const moduleData = genericModuleConfigs[slug];

  return {
    viewer,
    module: moduleData,
  };
}

export async function getCoursePayload(courseId: string) {
  const viewer = await getDashboardViewer();
  const course = dashboardCourses.find((item) => item.id === courseId) ?? dashboardCourses[0];

  return {
    viewer,
    course,
  };
}

export async function getCourseLessonPayload(courseId: string, lessonId: string) {
  const viewer = await getDashboardViewer();
  const course = dashboardCourses.find((item) => item.id === courseId) ?? dashboardCourses[0];
  const lesson = course.lessons.find((item) => item.id === lessonId) ?? course.lessons[0];

  return {
    viewer,
    course,
    lesson,
    notifications: dashboardNotifications,
  };
}
