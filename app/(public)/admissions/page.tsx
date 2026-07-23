import AdmissionForm from "@/components/admission/AdmissionForm";
import Navbar from "@/components/home/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ভর্তি হোন | TechHat IT Institute",
  description: "TechHat IT Institute-এ ভর্তির আবেদন করুন। কম্পিউটার প্রশিক্ষণ কোর্সে আজই যোগ দিন।",
};

export default function AdmissionsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-12 px-4 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              ✨ ভর্তি চলছে
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              আজই ভর্তির আবেদন করুন
            </h1>
            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              নিচের ফর্মটি পূরণ করুন। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdmissionForm showPasswordSection={true} />
        </div>
      </main>
    </>
  );
}
