"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useLang } from "@/context/GlobalLangContext";

export default function TermsPage() {
  const { lang, isBn } = useLang();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col">
      <title>{isBn ? "শর্তাবলী | TechHat" : "Terms & Conditions | TechHat"}</title>
      <Navbar />
      
      <main className="flex-1 pt-36 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800">
            <h1 className={`text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 ${isBn ? "font-bn" : ""}`}>
              {isBn ? "শর্তাবলী ও " : "Terms and "}<span className="text-blue-600 dark:text-blue-500">{isBn ? "নিয়মাবলি" : "Conditions"}</span>
            </h1>
            
            <div className={`prose prose-slate dark:prose-invert max-w-none ${isBn ? "font-bn text-lg leading-relaxed" : ""}`}>
              {isBn ? (
                <>
                  <p>
                    টেকহ্যাট কম্পিউটার ট্রেনিং সেন্টারে ভর্তি হওয়ার পূর্বে নিম্নলিখিত শর্তাবলী ও নিয়মাবলি মনোযোগ সহকারে পড়ার অনুরোধ করা হলো। আমাদের যেকোনো কোর্সে ভর্তি হওয়ার অর্থ হলো আপনি এই শর্তাবলীর সাথে সম্পূর্ণ একমত।
                  </p>
                  
                  <h3>১. কোর্সে ভর্তি ও নিয়মাবলি</h3>
                  <ul>
                    <li>ভর্তির সময় প্রদানকৃত সকল তথ্য (নাম, ঠিকানা, শিক্ষাগত যোগ্যতা ইত্যাদি) সম্পূর্ণ সত্য ও নির্ভুল হতে হবে। কোনো ভুল তথ্যের কারণে আপনার ভর্তি বাতিল হতে পারে।</li>
                    <li>ক্লাসে নিয়মিত উপস্থিত থাকা বাধ্যতামূলক। পর্যাপ্ত উপস্থিতি ছাড়া সার্টিফিকেট প্রদান করা হবে না।</li>
                    <li>শিক্ষককে ও সহপাঠীদের সর্বদা সম্মান করতে হবে। প্রতিষ্ঠানের পরিবেশ নষ্ট হয় এমন কোনো আচরণ গ্রহণযোগ্য নয়।</li>
                  </ul>
                  
                  <h3>২. পেমেন্ট ও রিফান্ড পলিসি</h3>
                  <ul>
                    <li>নির্ধারিত সময়ের মধ্যে কোর্সের সম্পূর্ণ ফি পরিশোধ করতে হবে। ফি বকেয়া থাকলে ক্লাস বা পরীক্ষায় অংশগ্রহণ স্থগিত হতে পারে।</li>
                    <li>ভর্তির পর কোর্স শুরু হওয়ার আগে বাতিল করলে আংশিক রিফান্ড বিবেচনা করা হতে পারে (কর্তৃপক্ষের সিদ্ধান্ত সাপেক্ষে)। কোর্স শুরু হয়ে গেলে কোনো প্রকার ফি রিফান্ড বা ফেরতযোগ্য নয়।</li>
                    <li>শুধুমাত্র আমাদের ওয়েবসাইট বা অফিসিয়াল নম্বরে পেমেন্ট করতে হবে। কোনো তৃতীয় পক্ষের মাধ্যমে প্রতারিত হলে কর্তৃপক্ষ দায়ী থাকবে না।</li>
                  </ul>
                  
                  <h3>৩. মেধা সম্পদ (Intellectual Property)</h3>
                  <ul>
                    <li>টেকহ্যাট কর্তৃক প্রদানকৃত সকল কোর্স ম্যাটেরিয়াল (ভিডিও, শিট, সফটওয়্যার, সোর্স কোড) শুধুমাত্র আপনার ব্যক্তিগত শেখার জন্য।</li>
                    <li>এইসব ম্যাটেরিয়াল অন্য কারো সাথে শেয়ার করা, বিক্রি করা বা অনলাইনে পাবলিকলি আপলোড করা সম্পূর্ণ বেআইনি। এমন কাজের প্রমাণ পেলে আইনানুগ ব্যবস্থা নেওয়া হবে।</li>
                  </ul>
                  
                  <h3>৪. সনদ বা সার্টিফিকেট</h3>
                  <ul>
                    <li>সফলভাবে কোর্স শেষ করার পর এবং ফাইনাল প্রজেক্ট/পরীক্ষায় উত্তীর্ণ হওয়ার পরই কেবল সার্টিফিকেট প্রদান করা হবে।</li>
                    <li>সার্টিফিকেটে নামের বানান বা অন্যান্য তথ্য আপনার দেওয়া তথ্যের ওপর ভিত্তি করে তৈরি হবে, তাই ফর্ম পূরণে সতর্কতা অবলম্বন করুন।</li>
                  </ul>
                  
                  <h3>৫. শর্তাবলীর পরিবর্তন</h3>
                  <p>
                    কর্তৃপক্ষ যেকোনো সময় এই শর্তাবলী পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। কোনো বড় ধরনের পরিবর্তন হলে শিক্ষার্থীদের নোটিশের মাধ্যমে জানিয়ে দেওয়া হবে।
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Please read the following Terms and Conditions carefully before enrolling at TechHat Computer Training Center. By enrolling in any of our courses, you agree to comply with and be bound by these terms.
                  </p>
                  
                  <h3>1. Enrollment and Rules</h3>
                  <ul>
                    <li>All information provided during admission (name, address, academic details) must be true and accurate. False information may lead to cancellation of your admission.</li>
                    <li>Regular attendance in classes is mandatory. Certificates will not be issued without sufficient attendance.</li>
                    <li>You must maintain respectful behavior towards instructors and peers. Any misconduct disrupting the institution's environment is strictly prohibited.</li>
                  </ul>
                  
                  <h3>2. Payment and Refund Policy</h3>
                  <ul>
                    <li>Course fees must be paid in full within the designated timeframe. Failure to clear dues may result in suspension from classes or exams.</li>
                    <li>If admission is canceled before the course starts, a partial refund may be considered (subject to authority's discretion). Once the course begins, fees are strictly non-refundable.</li>
                    <li>Payments must only be made through our official website or authorized numbers. The authority holds no responsibility for third-party scams.</li>
                  </ul>
                  
                  <h3>3. Intellectual Property</h3>
                  <ul>
                    <li>All course materials (videos, notes, software, source codes) provided by TechHat are for your personal educational use only.</li>
                    <li>Sharing, selling, or publicly distributing these materials online is strictly illegal. Legal action will be taken if found guilty of piracy.</li>
                  </ul>
                  
                  <h3>4. Certification</h3>
                  <ul>
                    <li>Certificates will only be awarded upon successful completion of the course and passing the final projects/exams.</li>
                    <li>The name and details on the certificate will be generated based on the information you provide during admission, so please fill out the form carefully.</li>
                  </ul>
                  
                  <h3>5. Modification of Terms</h3>
                  <p>
                    The authority reserves the right to modify or update these terms and conditions at any time. Significant changes will be communicated to students via notice.
                  </p>
                </>
              )}
              
              <p className="mt-8 text-sm text-slate-500 font-sans">
                {isBn ? "সর্বশেষ আপডেট: " : "Last updated: "} {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
