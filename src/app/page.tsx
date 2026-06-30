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
          title="আমাদের অনলাইন কোর্সসমূহ"
          subtitle="অনলাইন কোর্স"
          description="ঘরে বসে শিল্প-বিশেষজ্ঞদের গাইডেন্সে দক্ষতা অর্জন করুন এবং ক্যারিয়ার গড়ুন।"
          courses={onlineCourses}
        />
        <Courses 
          id="offline-courses"
          title="আমাদের অফলাইন কোর্সসমূহ"
          subtitle="অফলাইন কোর্স"
          description="হাতে-কলমে প্রশিক্ষণে প্রাকটিক্যাল লার্নিং এবং ক্যারিয়ার ডেভেলপমেন্ট করুন।"
          courses={offlineCourses}
          backgroundColor="bg-white"
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
