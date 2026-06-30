import type { Metadata } from "next"
import Navbar from "@/components/home/Navbar"
import Footer from "@/components/home/Footer"
import AdmissionForm from "@/components/home/AdmissionForm"

export const metadata: Metadata = {
  title: "ভর্তি ফর্ম | TechHat Computer Training Center",
  description: "TechHat Computer Training Center এ ভর্তি হওয়ার ফর্ম। আজই আপনার কাঙ্ক্ষিত কোর্সে ভর্তি নিশ্চিত করুন।",
}

export default function AdmissionPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <AdmissionForm />
      </main>
      <Footer />
    </>
  )
}
