"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useLang } from "@/context/GlobalLangContext";

export default function PrivacyPolicyPage() {
  const { lang, isBn } = useLang();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col">
      <title>{isBn ? "প্রাইভেসি পলিসি | TechHat" : "Privacy Policy | TechHat"}</title>
      <Navbar />
      
      <main className="flex-1 pt-36 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800">
            <h1 className={`text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 ${isBn ? "font-bn" : ""}`}>
              {isBn ? "প্রাইভেসি " : "Privacy "}<span className="text-blue-600 dark:text-blue-500">{isBn ? "পলিসি" : "Policy"}</span>
            </h1>
            
            <div className={`prose prose-slate dark:prose-invert max-w-none ${isBn ? "font-bn text-lg leading-relaxed" : ""}`}>
              {isBn ? (
                <>
                  <p>
                    টেকহ্যাট কম্পিউটার ট্রেনিং সেন্টারে স্বাগতম। আমরা আপনার গোপনীয়তাকে সম্মান করি এবং আপনার ব্যক্তিগত ডেটা সুরক্ষিত রাখতে প্রতিশ্রুতিবদ্ধ। আপনি যখন আমাদের ওয়েবসাইট ভিজিট করেন বা আমাদের সেবাসমূহ ব্যবহার করেন, তখন আমরা কীভাবে আপনার তথ্য সংগ্রহ ও ব্যবহার করি তা এই পলিসিতে উল্লেখ করা হয়েছে।
                  </p>
                  
                  <h3>১. আমরা কী তথ্য সংগ্রহ করি</h3>
                  <p>আপনাকে উন্নত সেবা প্রদানের লক্ষ্যে আমরা কিছু প্রয়োজনীয় তথ্য সংগ্রহ করে থাকি:</p>
                  <ul>
                    <li><strong>ব্যক্তিগত তথ্য:</strong> আপনার নাম, জন্ম তারিখ, লিঙ্গ, জাতীয় পরিচয়পত্র (NID) নম্বর ইত্যাদি।</li>
                    <li><strong>যোগাযোগের তথ্য:</strong> ইমেইল ঠিকানা, মোবাইল নম্বর এবং বর্তমান ও স্থায়ী ঠিকানা।</li>
                    <li><strong>শিক্ষাগত তথ্য:</strong> আপনার পূর্ববর্তী শিক্ষাগত যোগ্যতা এবং প্রতিষ্ঠানের নাম।</li>
                    <li><strong>পেমেন্ট তথ্য:</strong> ট্রানজেকশন আইডি, যে নম্বর থেকে পেমেন্ট করা হয়েছে এবং পেমেন্টের তারিখ। (আমরা কোনো পিন বা কার্ডের গোপন তথ্য সংরক্ষণ করি না)।</li>
                  </ul>
                  
                  <h3>২. তথ্য কীভাবে ব্যবহার করা হয়</h3>
                  <p>সংগৃহীত তথ্যগুলো আমরা নিম্নলিখিত কাজে ব্যবহার করে থাকি:</p>
                  <ul>
                    <li>কোর্সে আপনার ভর্তি প্রক্রিয়া সম্পন্ন করতে এবং আপনার প্রোফাইল তৈরি করতে।</li>
                    <li>কোর্স সংক্রান্ত আপডেট, নোটিশ এবং গুরুত্বপূর্ণ তথ্য আপনাকে জানাতে।</li>
                    <li>পেমেন্ট ভেরিফাই করতে এবং রশিদ প্রদান করতে।</li>
                    <li>কোর্স শেষে আপনার জন্য সঠিক সার্টিফিকেট প্রস্তুত করতে।</li>
                  </ul>
                  
                  <h3>৩. ডেটা সুরক্ষা এবং শেয়ারিং</h3>
                  <p>
                    আপনার ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদ। আমরা উন্নত নিরাপত্তা ব্যবস্থা ব্যবহার করে আপনার ডেটা সংরক্ষণ করি। আমরা কখনোই আপনার ব্যক্তিগত তথ্য কোনো থার্ড-পার্টি বা বাইরের প্রতিষ্ঠানের কাছে বিক্রি বা শেয়ার করি না, তবে আইনানুগ কোনো প্রয়োজনে সরকারি সংস্থাকে তথ্য প্রদান করতে বাধ্য থাকতে পারি।
                  </p>
                  
                  <h3>৪. কুকিজ (Cookies)</h3>
                  <p>
                    আমাদের ওয়েবসাইটের ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে আমরা কুকিজ ব্যবহার করতে পারি। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকিজ বন্ধ করে রাখতে পারেন, তবে এতে ওয়েবসাইটের কিছু ফিচারের কার্যকারিতা কমে যেতে পারে।
                  </p>
                  
                  <h3>৫. আপনার অধিকার</h3>
                  <p>
                    আপনার প্রদানকৃত যেকোনো তথ্য দেখার, আপডেট করার বা প্রয়োজনে মুছে ফেলার জন্য অনুরোধ করার অধিকার আপনার রয়েছে। এ সংক্রান্ত যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন।
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Welcome to TechHat Computer Training Center. We respect your privacy and are committed to protecting your personal data. This privacy policy informs you how we collect, use, and protect your information when you visit our website or use our services.
                  </p>
                  
                  <h3>1. Information We Collect</h3>
                  <p>We collect necessary information to provide you with better services:</p>
                  <ul>
                    <li><strong>Identity Data:</strong> Name, date of birth, gender, National ID (NID) number, etc.</li>
                    <li><strong>Contact Data:</strong> Email address, mobile number, and your present/permanent address.</li>
                    <li><strong>Educational Data:</strong> Your previous academic qualifications and institution details.</li>
                    <li><strong>Payment Data:</strong> Transaction ID, sender mobile number, and payment date. (We do not store PINs or confidential card details).</li>
                  </ul>
                  
                  <h3>2. How We Use Your Information</h3>
                  <p>We use the collected information for the following purposes:</p>
                  <ul>
                    <li>To process your admission and create your student profile.</li>
                    <li>To communicate course updates, notices, and important information.</li>
                    <li>To verify payments and issue receipts.</li>
                    <li>To prepare your official certificate upon course completion.</li>
                  </ul>
                  
                  <h3>3. Data Security and Sharing</h3>
                  <p>
                    Your personal information is safe with us. We use advanced security measures to store your data. We never sell or share your personal information with any third-party organizations, except when legally required by government authorities.
                  </p>
                  
                  <h3>4. Cookies</h3>
                  <p>
                    We may use cookies to improve user experience on our website. You can choose to disable cookies from your browser settings, although this may affect the functionality of certain website features.
                  </p>
                  
                  <h3>5. Your Rights</h3>
                  <p>
                    You have the right to request access to, update, or delete the personal information you have provided to us. Please contact us for any privacy-related concerns.
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
