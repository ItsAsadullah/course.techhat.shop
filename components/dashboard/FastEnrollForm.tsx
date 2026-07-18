"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enrollExistingStudent } from "@/lib/actions/admission";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FastEnrollForm({ 
  course, 
  studentId 
}: { 
  course: any; 
  studentId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<string>("offline");
  const [shift, setShift] = useState<string>("");
  const router = useRouter();

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "offline" && !shift) {
      toast.error("Please select a batch/shift");
      return;
    }

    setLoading(true);
    const result = await enrollExistingStudent(studentId, course.id, mode, shift);
    setLoading(false);

    if (result.success) {
      toast.success("Successfully enrolled!");
      router.push("/dashboard/courses");
    } else {
      toast.error(result.error || "Failed to enroll. Please try again.");
    }
  };

  return (
    <form onSubmit={handleEnroll} className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Course Details</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-100 dark:bg-blue-900/50" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">{course.name}</h4>
            <p className="text-sm text-slate-500">Course Fee: ৳{course.fee}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">কোর্সের ধরন (Course Mode) *</label>
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
              required
            >
              <option value="offline">Offline (অফলাইন - ক্লাসরুম)</option>
              <option value="online">Online (অনলাইন)</option>
            </select>
          </div>

          {mode === "offline" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ব্যাচ ও শিফট (Shift) *</label>
              <select 
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                required
              >
                <option value="">Select Shift</option>
                <option value="morning">সকাল (৮:০০ - ১০:০০ AM)</option>
                <option value="noon">দুপুর (১০:০০ - ১২:০০ PM)</option>
                <option value="afternoon">বিকাল (২:০০ - ৪:০০ PM)</option>
                <option value="evening">সন্ধ্যা (৫:০০ - ৭:০০ PM)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
          Your profile information is already saved in our system. You do not need to fill out the admission form again. Click confirm below to proceed with this course enrollment.
        </p>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-lg shadow-blue-500/25"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Enrolling...</>
        ) : (
          <>Confirm Enrollment <ChevronRight className="w-5 h-5" /></>
        )}
      </button>
    </form>
  );
}
