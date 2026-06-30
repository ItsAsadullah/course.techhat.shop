import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug } from "@/data/courses";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArrowRight, CheckCircle2, BookOpen, Award, Clock, DollarSign } from "lucide-react";

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const course = getCourseBySlug(resolvedParams.slug);

  if (!course) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">হোম</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">{course.name}</span>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-12 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-64 h-64 ${course.bg} blur-[80px] opacity-40 rounded-full pointer-events-none`} />
            
            <div className="flex-1 space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 ${course.bg} border ${course.border} rounded-2xl flex items-center justify-center`}>
                  <course.icon className={`w-7 h-7 ${course.color}`} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{course.name}</h1>
                  <p className="text-slate-500 font-medium">{course.nameEn}</p>
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
                {course.fullDescription}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">মেয়াদ</p>
                    <p className="font-bold text-slate-900">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <DollarSign className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">কোর্স ফি</p>
                    <p className="font-bold text-slate-900">৳{course.fee}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link 
                  href="/admission"
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl ${course.bg} border ${course.border} ${course.color} font-bold text-lg hover:bg-opacity-80 transition-all shadow-sm group`}
                >
                  এখনই ভর্তি হন <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {course.image && (
              <div className="flex-1 w-full relative group">
                <div className={`absolute inset-0 ${course.bg} blur-3xl opacity-30 rounded-full transition-opacity group-hover:opacity-50`} />
                <img 
                  src={course.image} 
                  alt={course.name} 
                  className="w-full h-[350px] object-cover rounded-3xl shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            
            <div className="md:col-span-2 space-y-10">
              {/* Learning Outcomes */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    এই কোর্সে কী কী শিখবেন?
                  </h2>
                </div>
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                    {course.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-3 group">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-slate-700 leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Course Modules */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    কোর্স মডিউল
                  </h2>
                </div>
                <div className="space-y-4">
                  {course.modules.map((module, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-lg text-slate-900 mb-4">{module.title}</h3>
                      <ul className="space-y-3">
                        {module.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="flex items-center gap-3 text-slate-600">
                            <div className={`w-2 h-2 rounded-full ${course.bg} border ${course.border}`} />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 md:sticky md:top-24">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-xl text-slate-900 mb-6 pb-4 border-b border-slate-100">কোর্স সামারি</h3>
                <ul className="space-y-5 mb-8">
                  <li className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> ক্লাস মাধ্যম
                    </span>
                    <span className="font-semibold text-slate-900">{course.mode === 'online' ? 'অনলাইন' : 'অফলাইন'}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> শিক্ষার্থী
                    </span>
                    <span className="font-semibold text-slate-900">{course.students}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> মোট ফি
                    </span>
                    <span className="font-bold text-slate-900 text-lg">৳{course.fee}</span>
                  </li>
                  <li className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">মাসিক ফি</span>
                    <span className={`font-bold text-lg ${course.color}`}>৳{course.monthlyFee}</span>
                  </li>
                </ul>

                <div className="bg-amber-50/50 rounded-2xl p-5 mb-8 border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <h4 className="font-bold text-amber-900">সার্টিফিকেট</h4>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">{course.certificateType}</p>
                </div>

                <Link 
                  href="/admission"
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl ${course.bg} border ${course.border} ${course.color} font-bold hover:bg-opacity-80 transition-all shadow-sm group`}
                >
                  ভর্তি হন <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
