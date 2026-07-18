import { createClient } from "@/lib/admin/supabase/server";
import { getCourseBySlug } from "@/lib/admin/actions/courses";
import { redirect } from "next/navigation";
import { createOrder } from "@/lib/actions/orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enroll in Course | TechHat IT Institute",
};

export default async function EnrollmentResolverPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  // 1. Fetch Course
  const course = await getCourseBySlug(slug);
  if (!course) {
    redirect("/courses");
  }

  // 2. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=/enroll/${slug}`);
  }

  // 3. Check Existing Enrollment
  const { data: existingEnrollment } = await supabase
    .from("course_enrollments")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();

  if (existingEnrollment) {
    // If they already have an enrollment, send them to dashboard
    redirect("/dashboard/courses");
  }
  
  // 4. Calculate prices to check if it's free
  const courseFee = parseFloat(course.pricing?.course_fee?.toString() || "0");
  const discount = parseFloat(course.pricing?.discount_percent?.toString() || "0");
  const finalPrice = courseFee - (courseFee * discount / 100);

  // 5. Automatically create the order and redirect to checkout
  // If it's an offline course, batchId will be undefined. 
  // It can be assigned manually later by admins, or selected on checkout if needed.
  const orderRes = await createOrder({
    courseId: course.id,
    batchId: undefined, 
    studentData: undefined, // Let the backend silently create the student profile
    isFree: finalPrice <= 0
  });

  if (!orderRes.success) {
    // If there is an error creating the order, redirect to courses page with error parameter
    // (In a real app we might want a dedicated error page, but this is a fallback)
    redirect(`/courses?error=enrollment_failed`);
  }

  if (finalPrice <= 0 || orderRes.status === "PAID") {
    redirect("/dashboard/courses");
  } else {
    redirect(`/checkout/${orderRes.orderId}`);
  }
}
