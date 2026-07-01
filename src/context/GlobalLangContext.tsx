"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "bn";

export const translations = {
  en: {
    // Navbar
    nav_home: "Home",
    nav_features: "Features",
    nav_how: "How it works",
    nav_courses: "Courses",
    nav_contact: "Contact",
    nav_software: "Software",
    nav_login: "Login",
    nav_register: "Register",
    
    // Common
    or: "or",
    back_home: "Back to Home",
    techhat: "TechHat",
    computer_training: "Computer Training Center",

    // Auth - Login
    auth_welcome: "Welcome",
    auth_login_title: "Sign In",
    auth_login_sub: "Login to your account",
    auth_email_label: "Email",
    auth_pass_label: "Password",
    auth_login_btn: "Sign In →",
    auth_login_loading: "Signing in...",
    auth_no_account: "Don't have an account?",
    auth_create_free: "Create for free →",
    auth_invalid: "Invalid email or password.",

    // Auth - Register
    auth_new_member: "New Member",
    auth_reg_title: "Sign Up",
    auth_reg_sub: "Create a new account",
    auth_name_label: "Full Name",
    auth_reg_btn: "Register",
    auth_reg_loading: "Registering...",
    auth_terms: "By creating an account, you agree to our terms and conditions.",
    auth_have_account: "Already have an account?",
    auth_signin_link: "Login →",
    auth_reg_failed: "Registration failed.",
    auth_reg_success: "Registration successful! Redirecting to home...",

    // Hero
    hero_badge: "Welcome to TechHat Computer Training Center",
    hero_title1: "Learn Computer",
    hero_title2: "in an easy, modern & practical way",
    hero_desc1: "Build your skills for the future. Take hands-on training under the guidance of experienced instructors and build your successful career.",
    hero_desc2: "Enroll today in your favorite course.",
    hero_btn_courses: "View Courses",
    hero_btn_enroll: "Enroll Now",
    hero_total_courses: "Total Courses",
    hero_badge_students: "Students",
    hero_badge_rating: "Rating",
    hero_badge_cert: "Certificate",

    // Stats
    stat_students_label: "Successful Students",
    stat_students_desc: "trained so far",
    stat_courses_label: "Total Courses",
    stat_courses_desc: "offline & online",
    stat_success_label: "Success Rate",
    stat_success_desc: "passed the exam",
    stat_exp_label: "Years Experience",
    stat_exp_desc: "in quality training",

    // Courses
    courses_online_title: "Our Online Courses",
    courses_online_sub: "Online Courses",
    courses_online_desc: "Learn skills and build a career from home under the guidance of industry experts.",
    courses_offline_title: "Our Offline Courses",
    courses_offline_sub: "Offline Courses",
    courses_offline_desc: "Learn practically with hands-on training and develop your career.",
    course_online: "Online",
    course_offline: "Offline",
    course_students: "Students",
    course_monthly_fee: "Monthly Fee",
    course_details: "Details",
    course_enroll: "Enroll Now",
    course_call_info: "Call for consultation or to view all courses",
    course_learn_more: "Learn More",

    // Features
    feat_title1: "Why Choose Us?",
    feat_title2: "Student's Success",
    feat_title3: "is our goal",
    feat_desc: "We believe any student can succeed with proper guidance and hands-on practice. Our training methodology is designed according to industry needs.",
    feat_stat1_v: "95%",
    feat_stat1_l: "Student Satisfaction",
    feat_stat2_v: "85%",
    feat_stat2_l: "Job Placement",
    feat_stat3_v: "50+",
    feat_stat3_l: "Partner Companies",
    feat_review_tag: "Student Experience",
    feat_review_text: '"By studying at TechHat, I learned Graphic Design in just 3 months and now earn 50,000+ Taka per month on Fiverr."',
    feat_review_name: "Rafi Ahmed",
    feat_review_role: "Graphic Design, Batch 2023",
    feat_card1_t: "Modern Computer Lab",
    feat_card1_d: "Equipped with modern computers and software. Dedicated computer for each student.",
    feat_card2_t: "Small Batch Classes",
    feat_card2_d: "Max 20 students per batch. Individual attention from the teacher.",
    feat_card3_t: "Govt. Approved Certificate",
    feat_card3_d: "Nationally and internationally recognized certificate provided upon course completion.",
    feat_card4_t: "Job Assistance",
    feat_card4_d: "CV making, interview preparation, and company linkup facilities for job assistance.",
    feat_card5_t: "Online Class Facility",
    feat_card5_d: "Recorded videos if you miss a class. Learn from anywhere at any time.",
    feat_card6_t: "24/7 Support",
    feat_card6_d: "24/7 support through WhatsApp and Facebook groups for any study related problems.",

    // About
    about_tag: "About Us",
    about_title: "Your companion in the journey of easy learning and skill building",
    about_desc: "We are a modern computer training center where every student is taught new technologies, software, and IT skills easily. Our courses are designed for everyone from beginners to experts.",
    about_card1_t: "Experienced Instructors",
    about_card1_d: "Teachers with long experience will guide you properly.",
    about_card2_t: "Our Courses",
    about_card2_d: "It is possible to participate in courses from anywhere.",
    about_card3_t: "Modern Lab Facility",
    about_card3_d: "State-of-the-art computer and software lab.",
    about_card4_t: "Certificate",
    about_card4_d: "Certificate and job guideline after the course.",
    about_btn: "View Courses",
    about_float_off: "For All Courses",
    about_float_rev: "AVG Reviews",
    about_float_sat: "Satisfied Students",
    about_float_exc: "Excellent",

    // Roadmap
    rm_s1_i: "Even if you find resources,",
    rm_s1_e: "You don't find guidance",
    rm_s2_i: "You understand tutorials,",
    rm_s2_e: "But can't do it yourself",
    rm_s3_i: "Trying to be consistent,",
    rm_s3_e: "You lose interest halfway",
    rm_s4_i: "Can build logic with AI,",
    rm_s4_e: "But can't write code yourself",
    rm_title: "Are you also facing such problems?",
    rm_desc: "These are very common problems when learning programming",
    rm_sol: "Our Solution: Project-based Learning",

    // EnrollSteps
    en_s1_i: "Step 01",
    en_s1_e: "Fill out the form",
    en_s1_d: "Fill out the admission application form online or in-person at the office.",
    en_s2_i: "Step 02",
    en_s2_e: "Pay the fee",
    en_s2_d: "Pay the admission fee and first month's tuition. Collect the receipt.",
    en_s3_i: "Step 03",
    en_s3_e: "Start Classes",
    en_s3_d: "Join classes according to your batch and shift. Learn hands-on.",
    en_s4_i: "Step 04",
    en_s4_e: "Get Certificate",
    en_s4_d: "Upon successful completion of the course, you will receive a government-approved certificate.",
    en_tag: "Enrollment Process",
    en_title: "Enrollment in just 4 steps",
    en_desc: "The admission process is completely simple and hassle-free. You can also apply online.",
    en_req_title: "What is required for admission",
    en_req_desc: "1 copy of passport size photo | Photocopy of NID / Birth Certificate | Photocopy of latest educational certificate | Admission fee 500 Taka (Cash or bKash)",

    // Team
    team_tag: "Our Expert Instructors",
    team_title: "Meet Our Expert Instructors",
    team_desc: "Learn from experienced professionals who are passionate about helping students build real-world skills.",
    team_top: "Top Instructor",
    team_qual: "Qualifications",
    team_spec: "Specialized In",
    team_rating: "Rating",
    team_students: "Students",
    team_courses: "Courses",
    team_btn: "View Profile",

    // Testimonials
    test_tag: "Student Reviews",
    test_title: "They Speak of Their Success",
    test_desc: "Hear from a few of our thousands of successful students.",
    test_cta_title: "You Can Be Successful Too!",
    test_cta_desc: "Start your IT career today. Get proper guidance and hands-on training.",
    test_cta_btn1: "Enroll Now →",
    test_cta_btn2: "📞 Call Now",

    // SuccessGallery
    sg_tag: "Glimpse of our center's success",
    sg_title1: "See our students' success in",
    sg_title2: "learning and building",
    sg_desc1: "Our students have achieved great success by completing hands-on projects and courses.",
    sg_desc2: "Here are some examples and success stories through their pictures, which will inspire you too.",

    // FAQ
    faq_tag: "Frequently Asked Questions (FAQs)",
    faq_title: "Find Answers to Your Questions",
    faq_desc1: "Welcome to our frequently asked questions section! Here, we have compiled",
    faq_desc2: "answers to some common questions asked by our users.",
    faq_q1: "How can I enroll in a course?",
    faq_a1: "Click the Enroll button to enroll in any course online, or visit our office directly, or call 01788-827474.",
    faq_q2: "Can I access my courses on a mobile device?",
    faq_a2: "Yes, you can access our courses from any smartphone.",
    faq_q3: "How long will I have access to the course?",
    faq_a3: "The course will be in your account for a lifetime, you can watch it anytime.",
    faq_q4: "What if I need help with questions during the course?",
    faq_a4: "We have dedicated live support groups where you will get any help.",

    // Blog
    blog_title: "Recent Blog Posts",
    blog_desc: "Read important blog posts about computer technology.",
    blog_read: "Read More",

    // Footer
    ft_desc: "One of the most trusted computer training centers in Bangladesh. Helping students build IT careers since 2015.",
    ft_addr: "123, Main Road, City, District, Bangladesh",
    ft_days: "Sat – Thu",
    ft_hours: "8:00 AM – 9:00 PM",
    ft_ql: "Quick Links",
    ft_cs: "Class Shifts",
    ft_sm: "Social Media",
    ft_embed: "Embed here",
    ft_rights: "All rights reserved.",
    ft_privacy: "Privacy Policy",
    ft_terms: "Terms & Conditions",
    ft_refund: "Refund Policy",

    // TypingMaster
    tm_badge: "Free Bilingual Typing Tutor",
    tm_title1: "Master Typing ",
    tm_title2: "At Lightning Speed",
    tm_desc: "Learn Bengali (Bijoy & Avro) and English typing — with structured lessons, real-time speed tests, and fun games.",
    tm_btn_start: "Start for Free",
    tm_btn_guest: "Start without Sign in (Guest Mode)",
    tm_check1: "No credit card required",
    tm_check2: "Free forever",
    tm_check3: "Works on all devices",
    tm_stat1: "Active Students",
    tm_stat2: "Average Improvement",
    tm_stat3: "Uptime",
    tm_stat4: "Bengali & English",
    tm_feat_tag: "Everything You Need",
    tm_feat_title1: "On One Platform, ",
    tm_feat_title2: "Complete Typing Skills",
    tm_feat_desc: "From the first lesson to 100+ WPM — everything is here.",
    tm_f1_t: "Structured Lessons",
    tm_f1_d: "Learn step-by-step starting from the home row keys — beginner to advanced.",
    tm_f2_t: "Speed Test",
    tm_f2_d: "Take 1, 3, or 5-minute tests. Track WPM and accuracy over time.",
    tm_f3_t: "Typing Games",
    tm_f3_d: "Beat boredom with falling word games. Make practice fun.",
    tm_f4_t: "Progress Analysis",
    tm_f4_d: "View speed history, accuracy trends, and personal records at a glance.",
    tm_view: "View ",
    tm_step_tag: "Simple Process",
    tm_step_title: "Start in Minutes",
    tm_s1_t: "Create a Free Account",
    tm_s1_d: "Sign up in seconds — no credit card required.",
    tm_s2_t: "Choose Your Learning Path",
    tm_s2_d: "Choose from structured lessons, free practice, or quick speed tests.",
    tm_s3_t: "Track Your Progress",
    tm_s3_d: "Watch WPM increase as muscle memory and accuracy improve.",
    tm_lang_tag: "Bilingual Support",
    tm_lang_title1: "Type in ",
    tm_lang_title2: "Bengali & English",
    tm_lang_desc: "The only typing tutor built for Bangladeshi students. Learn Bijoy & Avro keyboard layouts and English.",
    tm_l1: "Bijoy Keyboard Layout",
    tm_l2: "Avro Keyboard Layout",
    tm_l3: "English QWERTY / Touch Typing",
    tm_b1: "Bijoy Keyboard",
    tm_b2: "Avro Phonetic",
    tm_b3: "Unicode Support",
    tm_cta_title1: "Ready to type ",
    tm_cta_title2: "fast?",
    tm_cta_desc: "Thousands of students have improved their typing speed with this platform.",
  },
  bn: {
    // Navbar
    nav_home: "হোমপেজ",
    nav_features: "কেন আমরা?",
    nav_how: "ভর্তি প্রক্রিয়া",
    nav_courses: "কোর্সসমূহ",
    nav_contact: "যোগাযোগ",
    nav_software: "সফটওয়ার",
    nav_login: "লগইন",
    nav_register: "রেজিস্ট্রেশন",
    
    // Common
    or: "অথবা",
    back_home: "হোমপেজে ফিরে যান",
    techhat: "TechHat",
    computer_training: "Computer Training Center",

    // Auth - Login
    auth_welcome: "স্বাগতম",
    auth_login_title: "সাইন ইন",
    auth_login_sub: "আপনার অ্যাকাউন্টে লগইন করুন",
    auth_email_label: "ইমেইল",
    auth_pass_label: "পাসওয়ার্ড",
    auth_login_btn: "সাইন ইন →",
    auth_login_loading: "লগইন হচ্ছে...",
    auth_no_account: "অ্যাকাউন্ট নেই?",
    auth_create_free: "বিনামূল্যে তৈরি করুন →",
    auth_invalid: "ইমেইল বা পাসওয়ার্ড সঠিক নয়।",

    // Auth - Register
    auth_new_member: "নতুন অ্যাকাউন্ট",
    auth_reg_title: "রেজিস্ট্রেশন করুন",
    auth_reg_sub: "আপনার নতুন অ্যাকাউন্ট তৈরি করুন",
    auth_name_label: "আপনার নাম",
    auth_reg_btn: "রেজিস্ট্রেশন করুন",
    auth_reg_loading: "রেজিস্ট্রেশন হচ্ছে...",
    auth_terms: "অ্যাকাউন্ট তৈরি করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন।",
    auth_have_account: "অ্যাকাউন্ট আছে?",
    auth_signin_link: "লগইন করুন →",
    auth_reg_failed: "রেজিস্ট্রেশন ব্যর্থ হয়েছে।",
    auth_reg_success: "রেজিস্ট্রেশন সফল! হোম পেজে যাচ্ছেন...",

    // Hero
    hero_badge: "টেকহ্যাট কম্পিউটার ট্রেনিং সেন্টারে স্বাগতম",
    hero_title1: "কম্পিউটার শেখা হোক",
    hero_title2: "সহজ, আধুনিক ও বাস্তবমুখী উপায়ে",
    hero_desc1: "ভবিষ্যতের জন্য নিজেকে দক্ষ করে তুলুন। অভিজ্ঞ প্রশিক্ষকের তত্ত্বাবধানে হাতে-কলমে প্রশিক্ষণ নিয়ে গড়ে তুলুন আপনার সফল ক্যারিয়ার।",
    hero_desc2: "আজই ভর্তি হন আপনার পছন্দের কোর্সে।",
    hero_btn_courses: "কোর্সসমূহ দেখুন",
    hero_btn_enroll: "ভর্তি হোন",
    hero_total_courses: "মোট কোর্স",
    hero_badge_students: "শিক্ষার্থী",
    hero_badge_rating: "রেটিং",
    hero_badge_cert: "সার্টিফিকেট",

    // Stats
    stat_students_label: "সফল শিক্ষার্থী",
    stat_students_desc: "এখন পর্যন্ত প্রশিক্ষিত",
    stat_courses_label: "কোর্স সমূহ",
    stat_courses_desc: "অফলাইন ও অনলাইন",
    stat_success_label: "সাফল্যের হার",
    stat_success_desc: "পরীক্ষায় উত্তীর্ণ",
    stat_exp_label: "বছরের অভিজ্ঞতা",
    stat_exp_desc: "মানসম্পন্ন প্রশিক্ষণে",

    // Courses
    courses_online_title: "আমাদের অনলাইন কোর্সসমূহ",
    courses_online_sub: "অনলাইন কোর্স",
    courses_online_desc: "ঘরে বসে শিল্প-বিশেষজ্ঞদের গাইডেন্সে দক্ষতা অর্জন করুন এবং ক্যারিয়ার গড়ুন।",
    courses_offline_title: "আমাদের অফলাইন কোর্সসমূহ",
    courses_offline_sub: "অফলাইন কোর্স",
    courses_offline_desc: "হাতে-কলমে প্রশিক্ষণে প্রাকটিক্যাল লার্নিং এবং ক্যারিয়ার ডেভেলপমেন্ট করুন।",
    course_online: "অনলাইন",
    course_offline: "অফলাইন",
    course_students: "শিক্ষার্থী",
    course_monthly_fee: "মাসিক বেতন",
    course_details: "বিস্তারিত",
    course_enroll: "ভর্তি হন",
    course_call_info: "সমস্ত কোর্স দেখতে বা পরামর্শের জন্য কল করুন",
    course_learn_more: "আরও তথ্য জানুন",

    // Features
    feat_title1: "কেন আমাদের বেছে নেবেন?",
    feat_title2: "শিক্ষার্থীর সফলতাই",
    feat_title3: "আমাদের লক্ষ্য",
    feat_desc: "আমরা বিশ্বাস করি সঠিক গাইডেন্স ও হাতে-কলমে অনুশীলনের মাধ্যমে যেকোনো শিক্ষার্থী সফল হতে পারে। আমাদের প্রশিক্ষণ পদ্ধতি তাই শিল্প চাহিদার সাথে সঙ্গতি রেখে তৈরি করা হয়েছে।",
    feat_stat1_v: "৯৫%",
    feat_stat1_l: "শিক্ষার্থী সন্তুষ্টি",
    feat_stat2_v: "৮৫%",
    feat_stat2_l: "চাকরি প্লেসমেন্ট",
    feat_stat3_v: "৫০+",
    feat_stat3_l: "পার্টনার কোম্পানি",
    feat_review_tag: "শিক্ষার্থীর অভিজ্ঞতা",
    feat_review_text: '"TechHat-এ পড়ে আমি মাত্র ৩ মাসে Graphic Design শিখেছি এবং এখন Fiverr-এ প্রতি মাসে ৫০,০০০+ টাকা আয় করছি।"',
    feat_review_name: "রাফি আহমেদ",
    feat_review_role: "Graphic Design, ব্যাচ ২০২৩",
    feat_card1_t: "আধুনিক কম্পিউটার ল্যাব",
    feat_card1_d: "সর্বাধুনিক কম্পিউটার ও সফটওয়্যার দিয়ে সজ্জিত ল্যাব। প্রতিটি শিক্ষার্থীর জন্য আলাদা কম্পিউটার নিশ্চিত।",
    feat_card2_t: "ছোট ব্যাচে ক্লাস",
    feat_card2_d: "প্রতিটি ব্যাচে সর্বোচ্চ ২০ জন শিক্ষার্থী। শিক্ষকের ব্যক্তিগত মনোযোগ পাওয়ার সুযোগ।",
    feat_card3_t: "সরকার অনুমোদিত সার্টিফিকেট",
    feat_card3_d: "কোর্স সম্পন্নের পর জাতীয় ও আন্তর্জাতিকভাবে স্বীকৃত সার্টিফিকেট প্রদান করা হয়।",
    feat_card4_t: "চাকরির সহায়তা",
    feat_card4_d: "কোর্স শেষে চাকরি পেতে সিভি তৈরি, ইন্টারভিউ প্রস্তুতি ও কোম্পানি লিংকআপের সুবিধা।",
    feat_card5_t: "অনলাইন ক্লাস সুবিধা",
    feat_card5_d: "ক্লাস মিস হলে রেকর্ডেড ভিডিও দেখার সুবিধা। যেকোনো সময় যেকোনো জায়গা থেকে।",
    feat_card6_t: "২৪/৭ সাপোর্ট",
    feat_card6_d: "পড়াশোনার যেকোনো সমস্যায় WhatsApp ও Facebook গ্রুপের মাধ্যমে সর্বক্ষণিক সহায়তা।",

    // About
    about_tag: "আমাদের সম্পর্কে",
    about_title: "শেখা সহজ ও দক্ষতার পথে আপনার সঙ্গী",
    about_desc: "আমরা একটি আধুনিক কম্পিউটার ট্রেনিং সেন্টার যেখানে প্রত্যেক শিক্ষার্থীকে নতুন প্রযুক্তি, সফটওয়্যার ও আইটি স্কিল শেখানো হয় সহজভাবে। আমাদের কোর্সগুলো তৈরি করা হয়েছে শুরু থেকে এক্সপার্ট পর্যন্ত সবার জন্য।",
    about_card1_t: "অভিজ্ঞ প্রশিক্ষক",
    about_card1_d: "দীর্ঘ অভিজ্ঞতা সম্পন্ন শিক্ষকরা আপনাকে সঠিকভাবে গাইড করবেন।",
    about_card2_t: "আমাদের কোর্স",
    about_card2_d: "যেকোন অবস্থান থেকে কোর্স অংশ নেওয়া সম্ভব।",
    about_card3_t: "আধুনিক ল্যাব সুবিধা",
    about_card3_d: "সর্বাধুনিক কম্পিউটার ও সফটওয়্যার ল্যাব।",
    about_card4_t: "সার্টিফিকেট",
    about_card4_d: "কোর্স শেষে সার্টিফিকেট এবং জব গাইডলাইন।",
    about_btn: "কোর্স দেখুন",
    about_float_off: "সকল কোর্সের জন্য",
    about_float_rev: "গড় রিভিউ",
    about_float_sat: "সন্তুষ্ট শিক্ষার্থী",
    about_float_exc: "অসাধারণ",

    // Roadmap
    rm_s1_i: "রিসোর্স খুঁজে পেলেও,",
    rm_s1_e: "গাইডেন্স খুঁজে পাও না",
    rm_s2_i: "টিউটোরিয়াল দেখলে বোঝো",
    rm_s2_e: "কিন্তু নিজে করতে পারো না",
    rm_s3_i: "নিয়ম করে চলতে গিয়ে মাঝেই",
    rm_s3_e: "আগ্রহ হারিয়ে ফেলো",
    rm_s4_i: "কমপ্লেক্স লজিক AI এর সাহায্যে তৈরি করতে পারলেও",
    rm_s4_e: "নিজে কোড লিখতে পারো না",
    rm_title: "তুমিও কি এমন সমস্যার সম্মুখীন?",
    rm_desc: "প্রোগ্রামিং শেখার সময় এগুলো খুব সাধারণ সমস্যা",
    rm_sol: "আমাদের সল্যুশন: প্রজেক্ট-ভিত্তিক লার্নিং",

    // EnrollSteps
    en_s1_i: "ধাপ ০১",
    en_s1_e: "ফর্ম পূরণ করুন",
    en_s1_d: "অনলাইনে বা সরাসরি অফিসে এসে ভর্তির আবেদন ফর্ম পূরণ করুন।",
    en_s2_i: "ধাপ ০২",
    en_s2_e: "ফি পরিশোধ করুন",
    en_s2_d: "ভর্তি ফি ও প্রথম মাসের বেতন পরিশোধ করুন। রসিদ সংগ্রহ করুন।",
    en_s3_i: "ধাপ ০৩",
    en_s3_e: "ক্লাস শুরু করুন",
    en_s3_d: "ব্যাচ ও শিফট অনুযায়ী ক্লাসে যোগ দিন। হাতে-কলমে শিখুন।",
    en_s4_i: "ধাপ ০৪",
    en_s4_e: "সার্টিফিকেট নিন",
    en_s4_d: "কোর্স সফলভাবে সম্পন্ন করলে সরকার অনুমোদিত সার্টিফিকেট পাবেন।",
    en_tag: "ভর্তি প্রক্রিয়া",
    en_title: "মাত্র ৪টি ধাপে ভর্তি সম্পন্ন",
    en_desc: "ভর্তি প্রক্রিয়া সম্পূর্ণ সহজ ও ঝামেলামুক্ত। অনলাইনেও আবেদন করা যায়।",
    en_req_title: "ভর্তিতে যা যা লাগবে",
    en_req_desc: "১ কপি পাসপোর্ট সাইজ ছবি | জাতীয় পরিচয়পত্র / জন্ম সনদ-এর ফটোকপি | সর্বশেষ শিক্ষাগত সনদের ফটোকপি | ভর্তি ফি ৫০০ টাকা (নগদ বা বিকাশে)",

    // Team
    team_tag: "আমাদের অভিজ্ঞ প্রশিক্ষক",
    team_title: "আমাদের অভিজ্ঞ প্রশিক্ষকদের সাথে পরিচিত হোন",
    team_desc: "অভিজ্ঞ পেশাদারদের কাছ থেকে শিখুন যারা শিক্ষার্থীদের বাস্তব-বিশ্বের দক্ষতা অর্জনে সাহায্য করতে আগ্রহী।",
    team_top: "সেরা প্রশিক্ষক",
    team_qual: "যোগ্যতা",
    team_spec: "বিশেষজ্ঞ",
    team_rating: "রেটিং",
    team_students: "শিক্ষার্থী",
    team_courses: "কোর্স",
    team_btn: "প্রোফাইল দেখুন",

    // Testimonials
    test_tag: "শিক্ষার্থীদের মতামত",
    test_title: "তারা বলছেন তাদের সাফল্যের কথা",
    test_desc: "আমাদের হাজারো সফল শিক্ষার্থীর মধ্য থেকে কয়েকজনের কথা জানুন।",
    test_cta_title: "আপনিও সফল হতে পারেন!",
    test_cta_desc: "আজই শুরু করুন আপনার আইটি ক্যারিয়ার। সঠিক দিকনির্দেশনা ও হাতে-কলমে প্রশিক্ষণ পান।",
    test_cta_btn1: "এখনই ভর্তি হন →",
    test_cta_btn2: "📞 কল করুন",

    // SuccessGallery
    sg_tag: "আমাদের সেন্টারের সাফল্যের ঝলক",
    sg_title1: "শিখতে এবং গড়তে দেখুন আমাদের",
    sg_title2: "শিক্ষার্থীদের সাফল্য",
    sg_desc1: "আমাদের শিক্ষার্থীরা হাতে-কলমে প্রজেক্ট এবং কোর্স সম্পন্ন করে দারুন সাফল্য অর্জন করেছে।",
    sg_desc2: "এখানে তাদের ছবির মাধ্যমে কিছু উদাহরণ এবং সাফল্যের গল্প তুলে ধরা হলো, যা আপনাকেও অনুপ্রাণিত করবে।",

    // FAQ
    faq_tag: "সাধারণ জিজ্ঞাসা (FAQs)",
    faq_title: "আপনার প্রশ্নের উত্তর খুঁজুন",
    faq_desc1: "আমাদের প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী বিভাগে স্বাগতম! এখানে, আমরা আমাদের",
    faq_desc2: "ব্যবহারকারীদের জিজ্ঞাসা করা কিছু সাধারণ প্রশ্নের উত্তর সংকলন করেছি।",
    faq_q1: "আমি কিভাবে কোর্সে ভর্তি হব?",
    faq_a1: "আমাদের যেকোন কোর্সে ভর্তি হলে Enroll বাটনে ক্লিক করুন এবং অনলাইনে ভর্তি হলে সরাসরি অফিসে যোগাযোগ করুন অথবা 01788-827474 এই নম্বরে কল করুন।",
    faq_q2: "আমি কি আমার কোর্সগুলো মোবাইল ডিভাইসে অ্যাক্সেস করতে পারব?",
    faq_a2: "হ্যাঁ, আপনি যেকোনো স্মার্টফোন থেকে আমাদের কোর্স অ্যাক্সেস করতে পারবেন।",
    faq_q3: "আমি কতক্ষণ কোর্সে অংশগ্রহণ করতে পারব?",
    faq_a3: "কোর্সটি আপনার অ্যাকাউন্টে আজীবন থাকবে, আপনি যে কোনো সময় দেখতে পারবেন।",
    faq_q4: "কোর্স চলাকালীন সাহায্যের প্রশ্নগুলির প্রয়োজন হলে?",
    faq_a4: "আমাদের ডেডিকেটেড লাইভ সাপোর্ট গ্রুপ আছে যেখানে আপনি যেকোনো সাহায্য পাবেন।",

    // Blog
    blog_title: "সাম্প্রতিক ব্লগ পোস্ট",
    blog_desc: "কম্পিউটার টেকনোলজি সম্পর্কে গুরুত্বপূর্ণ ব্লগ পোস্ট পড়ুন।",
    blog_read: "আরও পড়ুন",

    // Footer
    ft_desc: "বাংলাদেশের অন্যতম বিশ্বস্ত কম্পিউটার প্রশিক্ষণ কেন্দ্র। ২০১৫ সাল থেকে শিক্ষার্থীদের আইটি ক্যারিয়ার গড়তে সহায়তা করে আসছি।",
    ft_addr: "১২৩, মেইন রোড, শহর, জেলা, বাংলাদেশ",
    ft_days: "শনি – বৃহস্পতি",
    ft_hours: "সকাল ৮টা – রাত ৯টা",
    ft_ql: "দ্রুত লিংক",
    ft_cs: "ক্লাসের শিফট",
    ft_sm: "সোশ্যাল মিডিয়া",
    ft_embed: "এখানে embed করুন",
    ft_rights: "সকল অধিকার সংরক্ষিত।",
    ft_privacy: "গোপনীয়তা নীতি",
    ft_terms: "শর্তাবলী",
    ft_refund: "রিফান্ড নীতি",

    // TypingMaster
    tm_badge: "বিনামূল্যে দ্বিভাষিক টাইপিং টিউটর",
    tm_title1: "টাইপিং আয়ত্ত করুন ",
    tm_title2: "বিদ্যুৎ গতিতে",
    tm_desc: "বাংলা (বিজয় ও অভ্র) এবং ইংরেজি টাইপিং শিখুন — কাঠামোগত পাঠ, রিয়েল-টাইম স্পিড টেস্ট এবং মজাদার গেমস দিয়ে।",
    tm_btn_start: "বিনামূল্যে শুরু করুন",
    tm_btn_guest: "সাইনইন ছাড়াই শুরু করুন (গেস্ট মোড)",
    tm_check1: "কোনো ক্রেডিট কার্ড লাগবে না",
    tm_check2: "বিনামূল্যে চিরতরে",
    tm_check3: "সব ডিভাইসে কাজ করে",
    tm_stat1: "সক্রিয় শিক্ষার্থী",
    tm_stat2: "গড় উন্নতি",
    tm_stat3: "আপটাইম",
    tm_stat4: "বাংলা ও ইংরেজি",
    tm_feat_tag: "আপনার যা দরকার",
    tm_feat_title1: "একটি প্ল্যাটফর্মে, ",
    tm_feat_title2: "সম্পূর্ণ টাইপিং দক্ষতা",
    tm_feat_desc: "প্রথম পাঠ থেকে ১০০+ WPM পর্যন্ত — সব কিছু এখানেই আছে।",
    tm_f1_t: "কাঠামোগত পাঠ",
    tm_f1_d: "হোম রো কী থেকে শুরু করে ধাপে ধাপে শিখুন — নতুন থেকে অ্যাডভান্সড পর্যন্ত।",
    tm_f2_t: "স্পিড টেস্ট",
    tm_f2_d: "১, ৩ বা ৫ মিনিটের টেস্ট নিন। সময়ের সাথে WPM এবং নির্ভুলতা ট্র্যাক করুন।",
    tm_f3_t: "টাইপিং গেমস",
    tm_f3_d: "পড়ন্ত শব্দের গেমে বিরক্তি দূর করুন। অনুশীলনকে মজাদার করুন।",
    tm_f4_t: "অগ্রগতি বিশ্লেষণ",
    tm_f4_d: "স্পিড ইতিহাস, নির্ভুলতার ট্রেন্ড এবং ব্যক্তিগত রেকর্ড এক নজরে দেখুন।",
    tm_view: "দেখুন ",
    tm_step_tag: "সহজ প্রক্রিয়া",
    tm_step_title: "মিনিটেই শুরু করুন",
    tm_s1_t: "বিনামূল্যে অ্যাকাউন্ট তৈরি করুন",
    tm_s1_d: "কয়েক সেকেন্ডে সাইন আপ করুন — কোনো ক্রেডিট কার্ড লাগবে না।",
    tm_s2_t: "আপনার শেখার পথ বেছে নিন",
    tm_s2_d: "কাঠামোগত পাঠ, বিনামূল্যে অনুশীলন, বা দ্রুত স্পিড টেস্ট থেকে বেছে নিন।",
    tm_s3_t: "আপনার অগ্রগতি ট্র্যাক করুন",
    tm_s3_d: "পেশীর স্মৃতি ও নির্ভুলতা বাড়ানোর সাথে সাথে WPM বাড়তে দেখুন।",
    tm_lang_tag: "দ্বিভাষিক সমর্থন",
    tm_lang_title1: "টাইপ করুন ",
    tm_lang_title2: "বাংলা ও ইংরেজিতে",
    tm_lang_desc: "বাংলাদেশি শিক্ষার্থীদের জন্য তৈরি একমাত্র টাইপিং টিউটর। বিজয় ও অভ্র কীবোর্ড লেআউট এবং ইংরেজি শিখুন।",
    tm_l1: "বিজয় কীবোর্ড লেআউট",
    tm_l2: "অভ্র কীবোর্ড লেআউট",
    tm_l3: "ইংরেজি QWERTY / টাচ টাইপিং",
    tm_b1: "Bijoy কীবোর্ড",
    tm_b2: "Avro ফোনেটিক",
    tm_b3: "ইউনিকোড সাপোর্ট",
    tm_cta_title1: "দ্রুত টাইপ করতে ",
    tm_cta_title2: "প্রস্তুত?",
    tm_cta_desc: "হাজার হাজার শিক্ষার্থী এই প্ল্যাটফর্ম দিয়ে তাদের টাইপিং গতি উন্নত করেছেন।",
  },
} as const;

type TKey = keyof typeof translations.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
  isBn: boolean;
}

const GlobalLangContext = createContext<LangContextType>({
  lang: "bn",
  setLang: () => {},
  t: (key) => translations.bn[key],
  isBn: true,
});

export function GlobalLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const stored = localStorage.getItem("techhat-lang") as Lang | null;
    if (stored === "en" || stored === "bn") {
      setLangState(stored);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("techhat-lang", l);
  };

  const t = (key: TKey): string => translations[lang][key] as string;

  return (
    <GlobalLangContext.Provider value={{ lang, setLang, t, isBn: lang === "bn" }}>
      {children}
    </GlobalLangContext.Provider>
  );
}

export function useLang() {
  return useContext(GlobalLangContext);
}
