import type { Metadata } from "next"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import Stats from "@/components/landing/Stats"
import Courses from "@/components/landing/Courses"
import Features from "@/components/landing/Features"
import EnrollSteps from "@/components/landing/EnrollSteps"
import AdmissionForm from "@/components/landing/AdmissionForm"
import Testimonials from "@/components/landing/Testimonials"
import Footer from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "EduCore IT Training Center | কম্পিউটার প্রশিক্ষণ কেন্দ্র",
  description:
    "বাংলাদেশের শীর্ষ কম্পিউটার প্রশিক্ষণ কেন্দ্র। ওয়েব ডেভেলপমেন্ট, গ্রাফিক ডিজাইন, ডিজিটাল মার্কেটিং সহ ১৫+ কোর্স। হাতে-কলমে প্রশিক্ষণ। সার্টিফিকেট প্রদান।",
  keywords: ["কম্পিউটার প্রশিক্ষণ", "IT training", "web development", "graphic design", "Bangladesh"],
  openGraph: {
    title: "EduCore IT Training Center",
    description: "হাতে-কলমে আইটি প্রশিক্ষণ। সার্টিফিকেট প্রদান। চাকরির সহায়তা।",
    type: "website",
    locale: "bn_BD",
  },
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Courses />
        <Features />
        <EnrollSteps />
        <AdmissionForm />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
