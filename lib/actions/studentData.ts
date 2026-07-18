"use server";

import { createClient } from "@/lib/admin/supabase/server";

export async function getStudentDashboardStats(studentId: string) {
  const supabase = await createClient();

  // 1. Get Enrolled Courses Count
  const { count: enrolledCount } = await supabase
    .from("course_enrollments")
    .select("id", { count: "exact", head: true })
    .eq("student_id", studentId);

  // 2. Get Completed Courses Count (Assuming completed if they have a certificate)
  const { count: completedCount } = await supabase
    .from("student_achievements")
    .select("id", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("badge_id", "course_completion"); // example badge

  // 3. Get Pending Assignments Count
  const { count: pendingAssignmentsCount } = await supabase
    .from("assignment_submissions")
    .select("id", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("status", "pending");

  // 4. Get Gamification Profile
  const { data: gamification } = await supabase
    .from("gamification_profiles")
    .select("*")
    .eq("student_id", studentId)
    .single();

  return {
    enrolledCourses: enrolledCount || 0,
    completedCourses: completedCount || 0,
    pendingAssignments: pendingAssignmentsCount || 0,
    certificatesEarned: completedCount || 0,
    xp: gamification?.xp_points || 0,
    streak: gamification?.current_streak || 0
  };
}

export async function getStudentEnrolledCourses(studentId: string, userId: string) {
  const supabase = await createClient();

  // 1. Fetch course_enrollments for the user
  const { data: enrollments, error } = await supabase
    .from("course_enrollments")
    .select("course_id, status")
    .eq("user_id", userId);

  if (error || !enrollments || enrollments.length === 0) return [];

  const courseIds = enrollments.map((e: any) => e.course_id);

  // Fetch courses with translations and media
  const { data: coursesData } = await supabase
    .from("courses")
    .select(`
      id,
      course_code,
      course_type,
      course_translations(name, slug, short_description),
      course_media(thumbnail_url)
    `)
    .in("id", courseIds)
    .eq("course_translations.lang", "en"); 

  if (!coursesData) return [];

  // Map to a friendlier format
  return coursesData.map((c: any) => {
    const enrollment = enrollments.find((e: any) => e.course_id === c.id) as any;
    // If it's active in course_enrollments, we consider it approved/accessible
    const displayStatus = enrollment?.status === 'active' ? 'approved' : enrollment?.status;
    
    return {
      id: c.id,
      code: c.course_code,
      type: c.course_type,
      name: c.course_translations?.[0]?.name || "Unknown Course",
      slug: c.course_translations?.[0]?.slug || "",
      description: c.course_translations?.[0]?.short_description || "",
      thumbnail: (c as any).course_media?.thumbnail_url || null,
      progress: enrollment?.progress || 0,
      status: displayStatus || "pending"
    };
  });
}

export async function getStudentAssignments(studentId: string) {
  const supabase = await createClient();

  // 1. Fetch enrolled course IDs
  const { data: admissions } = await supabase
    .from("admissions")
    .select("course_id")
    .eq("student_id", studentId)
    .not("course_id", "is", null);

  const courseIds = admissions?.map(a => a.course_id) || [];
  if (courseIds.length === 0) return [];

  // 2. Fetch assignments for these courses
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      id, title, due_date, total_marks, course_id,
      courses(id, course_translations(name))
    `)
    .in("course_id", courseIds)
    .eq("courses.course_translations.lang", "en");

  if (!assignments || assignments.length === 0) return [];

  // 3. Fetch submissions for this student
  const assignmentIds = assignments.map(a => a.id);
  const { data: submissions } = await supabase
    .from("assignment_submissions")
    .select("assignment_id, status, marks_obtained, submitted_at")
    .eq("student_id", studentId)
    .in("assignment_id", assignmentIds);

  // Map them together
  return assignments.map((a: any) => {
    const sub = submissions?.find(s => s.assignment_id === a.id);
    return {
      id: a.id,
      courseName: a.courses?.course_translations?.[0]?.name || "Unknown Course",
      title: a.title,
      dueDate: new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: sub?.status || 'pending',
      marks: sub?.marks_obtained || null,
      totalMarks: a.total_marks || 100
    };
  });
}

export async function getCoursePlayerDetails(studentId: string, courseId: string) {
  const supabase = await createClient();

  // 1. Fetch Course info
  const { data: courseData } = await supabase
    .from("courses")
    .select(`
      id,
      course_translations(name, instructor_name)
    `)
    .eq("id", courseId)
    .single();

  // 2. Fetch Modules & Lessons
  const { data: modulesData } = await supabase
    .from("course_modules")
    .select(`
      id,
      title_en,
      course_lessons(id, title_en, lesson_type, duration_minutes, video_url, content)
    `)
    .eq("course_id", courseId)
    .order('sort_order', { ascending: true });

  // 3. Fetch Student Progress
  const { data: progressData } = await supabase
    .from("student_progress")
    .select("lesson_id, is_completed")
    .eq("student_id", studentId)
    .eq("course_id", courseId);

  const completedLessonIds = progressData?.filter(p => p.is_completed).map(p => p.lesson_id) || [];

  return {
    course: {
      id: courseData?.id || courseId,
      name: courseData?.course_translations?.[0]?.name || "Unknown Course",
      instructor: "Instructor", // Should come from a relation, placeholder for now
      progress: 0 // Calculate based on completed / total
    },
    modules: modulesData || [],
    completedLessonIds
  };
}

export async function getStudentQuizzes(studentId: string) {
  const supabase = await createClient();

  // 1. Fetch enrolled course IDs
  const { data: admissions } = await supabase
    .from("admissions")
    .select("course_id")
    .eq("student_id", studentId)
    .not("course_id", "is", null);

  const courseIds = admissions?.map(a => a.course_id) || [];
  if (courseIds.length === 0) return [];

  // 2. Fetch quiz lessons for enrolled courses
  const { data: quizzes } = await supabase
    .from("course_lessons")
    .select(`
      id,
      title_en,
      duration_minutes,
      course_modules(course_id, courses(course_translations(name)))
    `)
    .eq("lesson_type", "quiz")
    .in("course_modules.course_id", courseIds); // Supabase allows querying through relations conditionally, but it might be complex
    // Actually, joining course_modules might not work like this in Supabase without proper setup.

  // Let's use a simpler approach: get modules first
  const { data: modules } = await supabase
    .from("course_modules")
    .select("id, course_id, courses(course_translations(name))")
    .in("course_id", courseIds);
    
  if (!modules || modules.length === 0) return [];
  const moduleIds = modules.map(m => m.id);

  const { data: quizLessons } = await supabase
    .from("course_lessons")
    .select("id, title_en, duration_minutes, module_id")
    .eq("lesson_type", "quiz")
    .in("module_id", moduleIds);

  if (!quizLessons) return [];

  // 3. Fetch progress to see if completed
  const lessonIds = quizLessons.map(q => q.id);
  const { data: progress } = await supabase
    .from("student_progress")
    .select("lesson_id, is_completed")
    .eq("student_id", studentId)
    .in("lesson_id", lessonIds)
    .eq("is_completed", true);

  const completedIds = progress?.map(p => p.lesson_id) || [];

  return quizLessons.map((quiz: any) => {
    const module = modules.find(m => m.id === quiz.module_id);
    const isCompleted = completedIds.includes(quiz.id);
    
    return {
      id: quiz.id,
      courseName: (module as any)?.courses?.course_translations?.[0]?.name || "Course",
      title: quiz.title_en,
      duration: `${quiz.duration_minutes || 10} mins`,
      totalQuestions: 10, // Mocked for now
      status: isCompleted ? "completed" : "available",
      score: isCompleted ? 100 : null, // Mocked for now since we don't have quiz_scores table
      passingScore: 80
    };
  });
}

export async function getStudentPayments(studentId: string) {
  const supabase = await createClient();

  const { data: admissions } = await supabase
    .from("admissions")
    .select(`
      id, payment_method, payment_number, payment_trx, created_at, status, course_id
    `)
    .eq("student_id", studentId);

  if (!admissions || admissions.length === 0) return { payments: [], totalPaid: 0, totalDue: 0 };

  const courseIds = admissions.map(a => a.course_id).filter(id => id != null);
  
  let coursesData: any[] = [];
  if (courseIds.length > 0) {
    const { data: courses } = await supabase
      .from("courses")
      .select("id, course_translations(name), course_pricing(course_fee, admission_fee)")
      .in("id", courseIds)
      .eq("course_translations.lang", "en");
      
    coursesData = courses || [];
  }

  let totalPaid = 0;
  let totalDue = 0;

  const payments = admissions.map(a => {
    const course = coursesData.find(c => c.id === a.course_id);
    const courseName = course?.course_translations?.[0]?.name || "Unknown Course";
    
    // In a real scenario, payments might be separated into a payments/invoices table.
    // For now, we derive from admission fee.
    const admissionFee = course?.course_pricing?.[0]?.admission_fee || 5000;
    
    totalPaid += admissionFee;

    return {
      id: `inv-${a.id.substring(0, 6)}`,
      courseName: courseName,
      amount: `৳ ${admissionFee.toLocaleString()}`,
      date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: "paid",
      type: "Admission Fee",
      method: a.payment_method || "Online"
    };
  });

  return {
    payments,
    totalPaid: `৳ ${totalPaid.toLocaleString()}`,
    totalDue: `৳ ${totalDue.toLocaleString()}`
  };
}

export async function getStudentCertificates(studentId: string) {
  const supabase = await createClient();

  // Fetch enrolled courses
  const { data: admissions } = await supabase
    .from("admissions")
    .select("course_id")
    .eq("student_id", studentId)
    .not("course_id", "is", null);

  const courseIds = admissions?.map(a => a.course_id) || [];
  if (courseIds.length === 0) return [];

  // Fetch courses with translations and media
  const { data: coursesData } = await supabase
    .from("courses")
    .select(`
      id,
      course_translations(name),
      course_media(thumbnail_url)
    `)
    .in("id", courseIds)
    .eq("course_translations.lang", "en");

  if (!coursesData) return [];

  // For now, let's mock the progress for certificates, 
  // ideally this should fetch from student_achievements or calculate 100% progress
  const { data: achievements } = await supabase
    .from("student_achievements")
    .select("*")
    .eq("student_id", studentId)
    .eq("badge_id", "course_completion");

  return coursesData.map((c: any) => {
    const isCompleted = achievements?.some(a => a.course_id === c.id);
    
    return {
      id: `CERT-${new Date().getFullYear()}-${c.id.substring(0, 4)}`,
      courseId: c.id,
      courseName: c.course_translations?.[0]?.name || "Unknown Course",
      issueDate: isCompleted ? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null,
      grade: isCompleted ? "A+" : null, // Mock grade
      status: isCompleted ? "issued" : "locked",
      image: c.course_media?.thumbnail_url || null,
      progress: isCompleted ? 100 : Math.floor(Math.random() * 80) // Mock progress for locked certificates
    };
  });
}

export async function getStudentAttendance(studentId: string) {
  const supabase = await createClient();

  const { data: attendance } = await supabase
    .from("student_attendance")
    .select("status, date")
    .eq("student_id", studentId);

  if (!attendance || attendance.length === 0) {
    return {
      overallAttendance: 0,
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
      records: []
    };
  }

  const presentDays = attendance.filter(a => a.status === 'present').length;
  const absentDays = attendance.filter(a => a.status === 'absent').length;
  const lateDays = attendance.filter(a => a.status === 'late').length;
  const totalDays = attendance.length;
  
  const overallAttendance = totalDays > 0 ? Math.round(((presentDays + lateDays * 0.5) / totalDays) * 100) : 0;

  return {
    overallAttendance,
    presentDays,
    absentDays,
    lateDays,
    records: attendance
  };
}

export async function getStudentOfflineCourses(studentId: string) {
  const supabase = await createClient();

  // Fetch enrolled courses
  const { data: admissions } = await supabase
    .from("admissions")
    .select("course_id")
    .eq("student_id", studentId)
    .not("course_id", "is", null);

  const courseIds = admissions?.map(a => a.course_id) || [];
  if (courseIds.length === 0) return { courses: [], notices: [] };

  // Fetch offline courses
  const { data: offlineCourses } = await supabase
    .from("courses")
    .select(`
      id,
      course_code,
      course_translations(name, instructor_name),
      course_duration(session, class_days, class_time_start, class_time_end, duration_text_en)
    `)
    .in("id", courseIds)
    .eq("course_type", "offline")
    .eq("course_translations.lang", "en");

  // Mocking notices for now, as we don't have a notices table yet
  const notices = [
    { title: "Lab closed on National Holiday", date: "Oct 15, 2026", type: "Urgent", color: "red" },
    { title: "React Assignment Presentation", date: "Oct 20, 2026", type: "Event", color: "blue" },
    { title: "New software installed in Lab 2", date: "Oct 10, 2026", type: "Update", color: "emerald" }
  ];

  const mappedCourses = offlineCourses?.map(c => ({
    id: c.id,
    code: c.course_code,
    name: c.course_translations?.[0]?.name || "Unknown Course",
    instructor: c.course_translations?.[0]?.instructor_name || "Tahmid Hasan",
    schedule: "Every Sunday, Tuesday, Thursday • 3:00 PM - 5:00 PM", // Ideally derived from course_duration
    location: "TechHat IT Institute, Lab 2, 4th Floor",
    progress: 35 // Mock
  })) || [];

  return { courses: mappedCourses, notices };
}

export async function getStudentLiveClasses(studentId: string) {
  const supabase = await createClient();

  // Fetch enrolled courses
  const { data: admissions } = await supabase
    .from("admissions")
    .select("course_id")
    .eq("student_id", studentId)
    .not("course_id", "is", null);

  const courseIds = admissions?.map(a => a.course_id) || [];
  if (courseIds.length === 0) return { upcomingClasses: [], recordings: [] };

  // Fetch live courses
  const { data: liveCourses } = await supabase
    .from("courses")
    .select(`
      id,
      course_translations(name, instructor_name)
    `)
    .in("id", courseIds)
    .in("course_type", ["live_class", "online"])
    .eq("course_translations.lang", "en");

  // Since we don't have a live schedule table yet, we map courses to mock sessions
  const upcomingClasses = liveCourses?.map((c, i) => ({
    id: `live-${c.id}`,
    courseName: c.course_translations?.[0]?.name || "Live Course",
    topic: `Session ${i + 1}: Live Interaction`,
    time: i === 0 ? "Tonight, 8:00 PM" : "Tomorrow, 4:00 PM",
    duration: "2 Hours",
    trainer: c.course_translations?.[0]?.instructor_name || "Instructor",
    platform: i === 0 ? "Zoom" : "Google Meet",
    joinLink: "#"
  })) || [];

  const recordings = liveCourses?.map((c, i) => ({
    id: `rec-${c.id}`,
    title: `Recorded Session for ${c.course_translations?.[0]?.name || "Course"}`,
    date: `Recorded on Oct ${10 - i}, 2026 • 2h 15m`,
    watchLink: "#"
  })) || [];

  return { upcomingClasses, recordings };
}

export async function getStudentSupportTickets(studentId: string) {
  const supabase = await createClient();
  
  // Checking for support_tickets table, which doesn't exist yet in the schema provided.
  // We will return an empty array until the table is created.
  
  /*
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  */
  
  const tickets: any[] = []; // Mocked empty response for real data

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return { 
    tickets,
    totalTickets: tickets.length,
    openTickets,
    resolvedTickets
  };
}
