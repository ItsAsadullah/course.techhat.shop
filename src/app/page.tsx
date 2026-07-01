"use client"

import Navbar from "@/components/home/Navbar"
import Hero from "@/components/home/Hero"
import AboutSection from "@/components/home/AboutSection"
import Stats from "@/components/home/Stats"
import Courses from "@/components/home/Courses"
import Features from "@/components/home/Features"
import Roadmap from "@/components/home/Roadmap"
import EnrollSteps from "@/components/home/EnrollSteps"
import TeamSection from "@/components/home/TeamSection"
import Testimonials from "@/components/home/Testimonials"
import SuccessGallery from "@/components/home/SuccessGallery"
import FaqSection from "@/components/home/FaqSection"
import BlogSection from "@/components/home/BlogSection"
import Footer from "@/components/home/Footer"
import { onlineCourses, offlineCourses } from "@/data/courses"

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Roadmap />
        <Stats />
        <Courses 
          id="online-courses"
          title="courses_online_title"
          subtitle="courses_online_sub"
          description="courses_online_desc"
          courses={onlineCourses}
        />
        <Courses 
          id="offline-courses"
          title="courses_offline_title"
          subtitle="courses_offline_sub"
          description="courses_offline_desc"
          courses={offlineCourses}
          backgroundColor="bg-white dark:bg-slate-900"
        />
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
