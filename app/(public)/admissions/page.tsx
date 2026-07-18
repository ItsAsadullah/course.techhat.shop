import { redirect } from "next/navigation";

export default async function AdmissionsPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const resolvedParams = await searchParams;
  const courseParam = resolvedParams?.course;

  if (courseParam) {
    redirect(`/enroll/${courseParam}`);
  } else {
    redirect("/courses");
  }
}

