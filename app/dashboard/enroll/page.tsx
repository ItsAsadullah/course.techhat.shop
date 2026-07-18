import { redirect } from "next/navigation";

export default async function FastEnrollPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const params = await searchParams;
  const courseSlug = params.course;

  if (courseSlug) {
    redirect(`/enroll/${courseSlug}`);
  } else {
    redirect("/dashboard/courses");
  }
}

