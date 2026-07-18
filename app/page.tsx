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
    featured: [] as any[], popular: [] as any[], online: [] as any[], offline: [] as any[], all: [] as any[]
  }));

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Roadmap />
        <Stats />
        <DynamicCourses courseData={courseData as any} />
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
