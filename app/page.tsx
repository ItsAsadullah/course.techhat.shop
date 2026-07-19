import Navbar from "@/components/home/Navbar"
import Hero from "@/components/home/Hero"
import AboutSection from "@/components/home/AboutSection"
import Stats from "@/components/home/Stats"
import DynamicCourses from "@/components/home/DynamicCourses"
import Features from "@/components/home/Features"
import Roadmap from "@/components/home/Roadmap"
import EnrollSteps from "@/components/home/EnrollSteps"
import TeamSection from "@/components/home/TeamSection"
import Testimonials from "@/components/home/Testimonials"
import SuccessGallery from "@/components/home/SuccessGallery"
import FaqSection from "@/components/home/FaqSection"
import BlogSection from "@/components/home/BlogSection"
import Footer from "@/components/home/Footer"
import { getHomepageCourses } from "@/lib/admin/actions/courses"

export const revalidate = 60; // Revalidate every 60 seconds

export default async function LandingPage() {
  // Fetch live courses from database
  const courseData = await getHomepageCourses().catch(() => ({
    featured: [], popular: [], online: [], offline: [], all: [],
  }) as Awaited<ReturnType<typeof getHomepageCourses>>);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeData = courseData as unknown as Parameters<typeof DynamicCourses>[0]["courseData"];

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Roadmap />
        <Stats />
        <DynamicCourses courseData={safeData} />
        <Features />
        <AboutSection />
        <EnrollSteps />
        <TeamSection />
        <Testimonials />
        <SuccessGallery />
        <FaqSection />
        <BlogSection />
      </main>
      <Footer />
    </>
  )
}
