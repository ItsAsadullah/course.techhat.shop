"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/lib/actions/orders";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, MapPin, CheckCircle2, ChevronRight, CalendarDays, Clock, Users, ShieldCheck, ArrowRight, Loader2, Map } from "lucide-react";

interface CourseData {
  id: string;
  nameEn: string;
  type: string;
  fee: number;
  discountPercent: number;
  finalPrice: number;
  thumbnail: string | null;
}

interface BatchData {
  id: string;
  name_en: string;
  class_days: string;
  class_time_start: string;
  class_time_end: string;
  available_seats: number;
}

export default function EnrollmentResolverClient({
  course,
  user,
  student,
  availableBatches,
}: {
  course: CourseData;
  user: Record<string, unknown>;
  student: Record<string, unknown>;
  availableBatches: BatchData[];
}) {
  const router = useRouter();
  
  // States
  const [step, setStep] = useState<number>(student ? (course.type === "offline" ? 2 : 3) : 1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullNameEn: (student?.full_name_en as string) || "",
    fullNameBn: (student?.full_name_bn as string) || "",
    mobile: (student?.mobile as string) || (user.phone as string) || "",
    guardianMobile: (student?.guardian_mobile as string) || "",
    bloodGroup: (student?.blood_group as string) || "",
    village: "",
    union: "",
    upazila: "",
    district: "",
  });
  
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  const totalSteps = course.type === "offline" ? 3 : 2;
  const currentDisplayStep = step === 3 && course.type !== "offline" ? 2 : step;

  const handleCreateOrder = async () => {
    if (course.type === "offline" && !selectedBatchId) {
      toast.error("Please select a batch.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await createOrder({
        courseId: course.id,
        batchId: selectedBatchId || undefined,
        studentData: !student ? formData : undefined,
        isFree: course.finalPrice <= 0
      });

      if (!res.success) {
        toast.error(res.error || "Failed to create order");
        setLoading(false);
        return;
      }

      if (course.finalPrice <= 0 || res.status === "PAID") {
        toast.success("Enrolled successfully!");
        router.push("/dashboard/courses");
      } else {
        router.push(`/checkout/${res.orderId}`);
      }
    } catch (err) {
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: "Profile", isActive: step >= 1 },
    ...(course.type === "offline" ? [{ num: 2, title: "Batch", isActive: step >= 2 }] : []),
    { num: course.type === "offline" ? 3 : 2, title: "Summary", isActive: step === (course.type === "offline" ? 3 : 2) }
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
          Join {course.nameEn}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Complete your enrollment securely. It only takes a few minutes to start your journey with TechHat.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8 px-4">
        <div className="flex items-center justify-between relative max-w-md mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentDisplayStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                s.isActive 
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 ring-4 ring-white dark:ring-slate-900' 
                  : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-xs font-semibold ${s.isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Profile</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Fill in your basic information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name (English) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all dark:text-white" 
                      placeholder="e.g. Rakib Hossain"
                      value={formData.fullNameEn} 
                      onChange={e => setFormData({...formData, fullNameEn: e.target.value})} 
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name (Bangla) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all dark:text-white font-bn" 
                      placeholder="যেমন: রাকিব হোসেন"
                      value={formData.fullNameBn} 
                      onChange={e => setFormData({...formData, fullNameBn: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all dark:text-white" 
                      placeholder="01XXXXXXXXX"
                      value={formData.mobile} 
                      onChange={e => setFormData({...formData, mobile: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Guardian Mobile</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all dark:text-white" 
                      placeholder="01XXXXXXXXX"
                      value={formData.guardianMobile} 
                      onChange={e => setFormData({...formData, guardianMobile: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="md:col-span-2 mt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Address Details</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Village/Moholla <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} placeholder="Purbo Para" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Union <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white" value={formData.union} onChange={e => setFormData({...formData, union: e.target.value})} placeholder="5 No. Union" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upazila <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white" value={formData.upazila} onChange={e => setFormData({...formData, upazila: e.target.value})} placeholder="Sadar" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">District <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm dark:text-white" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="Dhaka" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-8 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button 
                  onClick={() => {
                    if(!formData.fullNameEn || !formData.fullNameBn || !formData.mobile || !formData.village || !formData.union || !formData.upazila || !formData.district) {
                      toast.error("Please fill all required fields");
                      return;
                    }
                    setStep(course.type === "offline" ? 2 : 3);
                  }}
                  className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && course.type === "offline" && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Select Batch</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Choose a convenient time for your classes</p>
                </div>
              </div>
              
              {availableBatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-800 dark:text-orange-400 mb-2">No Active Batches</h3>
                  <p className="text-orange-600/80 dark:text-orange-300/70 max-w-sm">We are preparing new batches for this course. Please check back later or contact support.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableBatches.map(batch => (
                    <div 
                      key={batch.id} 
                      onClick={() => setSelectedBatchId(batch.id)}
                      className={`relative group p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                        selectedBatchId === batch.id 
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-[0_10px_30px_rgba(59,130,246,0.15)]' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900/50 hover:shadow-md'
                      }`}
                    >
                      {selectedBatchId === batch.id && (
                        <div className="absolute top-0 right-0">
                          <div className="w-16 h-16 bg-blue-500 absolute -top-8 -right-8 rotate-45"></div>
                          <CheckCircle2 className="w-4 h-4 text-white absolute top-2 right-2" />
                        </div>
                      )}
                      
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 pr-6">{batch.name_en}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-4 h-4" />
                          </div>
                          <span>{batch.class_days}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <span>{batch.class_time_start} - {batch.class_time_end}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-blue-600 dark:text-blue-400">{batch.available_seats} Seats Available</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                {!student ? (
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors">
                    Back
                  </button>
                ) : <div></div>}
                <button 
                  onClick={() => setStep(3)} 
                  disabled={!selectedBatchId}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                    selectedBatchId 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-lg hover:-translate-y-0.5' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === (course.type === "offline" ? 3 : 2) && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Summary</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Review your enrollment details</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 dark:bg-cyan-400/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80 mb-6">
                  {course.thumbnail ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md">
                      <img src={course.thumbnail} alt={course.nameEn} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md text-white font-bold text-3xl">
                      {course.nameEn.charAt(0)}
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <span className="inline-block px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                      {course.type === "offline" ? "Offline Course" : "Online Course"}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">{course.nameEn}</h3>
                    {course.type === "offline" && selectedBatchId && (
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        Batch: {availableBatches.find(b => b.id === selectedBatchId)?.name_en}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative z-10 space-y-4 px-2 md:px-0">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                    <span>Course Fee</span>
                    <span>৳{course.fee.toFixed(2)}</span>
                  </div>
                  
                  {course.discountPercent > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount ({course.discountPercent}%)</span>
                      <span>- ৳{(course.fee - course.finalPrice).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="h-px bg-slate-200 dark:bg-slate-800/80 my-2"></div>
                  
                  <div className="flex justify-between items-center text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    <span>Total Payable</span>
                    <span className="text-cyan-600 dark:text-cyan-400">৳{course.finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 mt-6">
                <button 
                  onClick={() => setStep(course.type === "offline" ? 2 : 1)} 
                  className="px-6 py-2.5 rounded-xl font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleCreateOrder} 
                  disabled={loading}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      {course.finalPrice > 0 ? "Proceed to Payment" : "Enroll for Free"} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

