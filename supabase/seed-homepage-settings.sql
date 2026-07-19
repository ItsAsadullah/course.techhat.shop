-- =====================================================
-- Seed homepage content settings group
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Insert the homepage settings group
INSERT INTO setting_groups (slug, "nameEn", "nameBn", description, icon)
VALUES ('homepage', 'Homepage Content', 'হোমপেজ কনটেন্ট', 'Manage all content shown on the public homepage', 'LayoutDashboard')
ON CONFLICT (slug) DO NOTHING;

-- 2. Get the group ID for use below
DO $$
DECLARE
  gid uuid;
BEGIN
  SELECT id INTO gid FROM setting_groups WHERE slug = 'homepage';

  -- HERO SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'hero_badge', 'string', 'Welcome to TechHat Computer Training Center', 'টেকহ্যাট কম্পিউটার ট্রেনিং সেন্টারে স্বাগতম', 'Welcome to TechHat'),
  (gid, 'hero_title1', 'string', 'Learn Computer', 'কম্পিউটার শেখা হোক', 'Learn Computer'),
  (gid, 'hero_title2', 'string', 'in an easy, modern & practical way', 'সহজ, আধুনিক ও বাস্তবমুখী উপায়ে', 'in a practical way'),
  (gid, 'hero_desc1', 'string', 'Build your skills for the future. Take hands-on training under the guidance of experienced instructors and build your successful career.', 'ভবিষ্যতের জন্য নিজেকে দক্ষ করে তুলুন। অভিজ্ঞ প্রশিক্ষকের তত্ত্বাবধানে হাতে-কলমে প্রশিক্ষণ নিয়ে গড়ে তুলুন আপনার সফল ক্যারিয়ার।', 'Build your skills.'),
  (gid, 'hero_desc2', 'string', 'Enroll today in your favorite course.', 'আজই ভর্তি হন আপনার পছন্দের কোর্সে।', 'Enroll today.'),
  (gid, 'hero_badge_students', 'string', '5000+', '৫০০০+', '5000+'),
  (gid, 'hero_badge_rating', 'string', '4.9/5', '৪.৯/৫', '4.9/5'),
  (gid, 'hero_badge_cert', 'string', '100%', '১০০%', '100%'),
  (gid, 'hero_total_courses', 'string', '15+', '১৫+', '15+')
  ON CONFLICT (key) DO NOTHING;

  -- VIDEO SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'homepage_video_id', 'string', 'pGrBqoI4HKg', 'pGrBqoI4HKg', 'pGrBqoI4HKg')
  ON CONFLICT (key) DO NOTHING;

  -- STATS SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'stat_students_value', 'string', '5000+', '৫০০০+', '5000+'),
  (gid, 'stat_students_label', 'string', 'Successful Students', 'সফল শিক্ষার্থী', 'Successful Students'),
  (gid, 'stat_courses_value', 'string', '15+', '১৫+', '15+'),
  (gid, 'stat_courses_label', 'string', 'Total Courses', 'কোর্স সমূহ', 'Total Courses'),
  (gid, 'stat_success_value', 'string', '95%', '৯৫%', '95%'),
  (gid, 'stat_success_label', 'string', 'Success Rate', 'সাফল্যের হার', 'Success Rate'),
  (gid, 'stat_exp_value', 'string', '10+', '১০+', '10+'),
  (gid, 'stat_exp_label', 'string', 'Years Experience', 'বছরের অভিজ্ঞতা', 'Years Experience')
  ON CONFLICT (key) DO NOTHING;

  -- FEATURES SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'feat_title1', 'string', 'Why Choose Us?', 'কেন আমাদের বেছে নেবেন?', 'Why Choose Us?'),
  (gid, 'feat_title2', 'string', 'Student Success', 'শিক্ষার্থীর সফলতাই', 'Student Success'),
  (gid, 'feat_title3', 'string', 'is our goal', 'আমাদের লক্ষ্য', 'is our goal'),
  (gid, 'feat_desc', 'string', 'We believe any student can succeed with proper guidance.', 'আমরা বিশ্বাস করি সঠিক গাইডেন্সের মাধ্যমে যেকোনো শিক্ষার্থী সফল হতে পারে।', ''),
  (gid, 'feat_stat1_v', 'string', '95%', '৯৫%', '95%'),
  (gid, 'feat_stat1_l', 'string', 'Student Satisfaction', 'শিক্ষার্থী সন্তুষ্টি', 'Student Satisfaction'),
  (gid, 'feat_stat2_v', 'string', '85%', '৮৫%', '85%'),
  (gid, 'feat_stat2_l', 'string', 'Job Placement', 'চাকরি প্লেসমেন্ট', 'Job Placement'),
  (gid, 'feat_stat3_v', 'string', '50+', '৫০+', '50+'),
  (gid, 'feat_stat3_l', 'string', 'Partner Companies', 'পার্টনার কোম্পানি', 'Partner Companies'),
  (gid, 'feat_review_tag', 'string', 'Student Experience', 'শিক্ষার্থীর অভিজ্ঞতা', 'Student Experience'),
  (gid, 'feat_review_text', 'string', '"By studying at TechHat, I learned Graphic Design in just 3 months."', '"TechHat-এ পড়ে আমি মাত্র ৩ মাসে Graphic Design শিখেছি।"', ''),
  (gid, 'feat_review_name', 'string', 'Rafi Ahmed', 'রাফি আহমেদ', 'Rafi Ahmed'),
  (gid, 'feat_review_role', 'string', 'Graphic Design, Batch 2023', 'Graphic Design, ব্যাচ ২০২৩', ''),
  (gid, 'feat_card1_t', 'string', 'Modern Computer Lab', 'আধুনিক কম্পিউটার ল্যাব', ''),
  (gid, 'feat_card1_d', 'string', 'Equipped with modern computers and software.', 'সর্বাধুনিক কম্পিউটার ও সফটওয়্যার দিয়ে সজ্জিত।', ''),
  (gid, 'feat_card2_t', 'string', 'Small Batch Classes', 'ছোট ব্যাচে ক্লাস', ''),
  (gid, 'feat_card2_d', 'string', 'Max 20 students per batch.', 'প্রতিটি ব্যাচে সর্বোচ্চ ২০ জন শিক্ষার্থী।', ''),
  (gid, 'feat_card3_t', 'string', 'Govt. Approved Certificate', 'সরকার অনুমোদিত সার্টিফিকেট', ''),
  (gid, 'feat_card3_d', 'string', 'Nationally recognized certificate provided.', 'জাতীয়ভাবে স্বীকৃত সার্টিফিকেট প্রদান করা হয়।', ''),
  (gid, 'feat_card4_t', 'string', 'Job Assistance', 'চাকরির সহায়তা', ''),
  (gid, 'feat_card4_d', 'string', 'CV making, interview prep, and company linkup.', 'সিভি তৈরি, ইন্টারভিউ প্রস্তুতি ও কোম্পানি লিংকআপ।', ''),
  (gid, 'feat_card5_t', 'string', 'Online Class Facility', 'অনলাইন ক্লাস সুবিধা', ''),
  (gid, 'feat_card5_d', 'string', 'Recorded videos if you miss a class.', 'ক্লাস মিস হলে রেকর্ডেড ভিডিও দেখার সুবিধা।', ''),
  (gid, 'feat_card6_t', 'string', '24/7 Support', '২৪/৭ সাপোর্ট', ''),
  (gid, 'feat_card6_d', 'string', '24/7 support through WhatsApp and Facebook.', 'WhatsApp ও Facebook এর মাধ্যমে সর্বক্ষণিক সহায়তা।', '')
  ON CONFLICT (key) DO NOTHING;

  -- ABOUT SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'about_tag', 'string', 'About Us', 'আমাদের সম্পর্কে', 'About Us'),
  (gid, 'about_title', 'string', 'Your companion in the journey of easy learning', 'শেখা সহজ ও দক্ষতার পথে আপনার সঙ্গী', ''),
  (gid, 'about_desc', 'string', 'We are a modern computer training center.', 'আমরা একটি আধুনিক কম্পিউটার ট্রেনিং সেন্টার।', ''),
  (gid, 'about_card1_t', 'string', 'Experienced Instructors', 'অভিজ্ঞ প্রশিক্ষক', ''),
  (gid, 'about_card1_d', 'string', 'Teachers with long experience will guide you.', 'দীর্ঘ অভিজ্ঞতা সম্পন্ন শিক্ষকরা আপনাকে গাইড করবেন।', ''),
  (gid, 'about_card2_t', 'string', 'Our Courses', 'আমাদের কোর্স', ''),
  (gid, 'about_card2_d', 'string', 'Courses accessible from anywhere.', 'যেকোন অবস্থান থেকে কোর্স অংশ নেওয়া সম্ভব।', ''),
  (gid, 'about_card3_t', 'string', 'Modern Lab Facility', 'আধুনিক ল্যাব সুবিধা', ''),
  (gid, 'about_card3_d', 'string', 'State-of-the-art computer lab.', 'সর্বাধুনিক কম্পিউটার ও সফটওয়্যার ল্যাব।', ''),
  (gid, 'about_card4_t', 'string', 'Certificate', 'সার্টিফিকেট', ''),
  (gid, 'about_card4_d', 'string', 'Certificate and job guideline after course.', 'কোর্স শেষে সার্টিফিকেট এবং জব গাইডলাইন।', '')
  ON CONFLICT (key) DO NOTHING;

  -- ROADMAP SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'rm_title', 'string', 'Are you also facing such problems?', 'তুমিও কি এমন সমস্যার সম্মুখীন?', ''),
  (gid, 'rm_desc', 'string', 'These are very common problems when learning programming', 'প্রোগ্রামিং শেখার সময় এগুলো খুব সাধারণ সমস্যা', ''),
  (gid, 'rm_sol', 'string', 'Our Solution: Project-based Learning', 'আমাদের সল্যুশন: প্রজেক্ট-ভিত্তিক লার্নিং', ''),
  (gid, 'rm_s1_i', 'string', 'Even if you find resources,', 'রিসোর্স খুঁজে পেলেও,', ''),
  (gid, 'rm_s1_e', 'string', 'You don''t find guidance', 'গাইডেন্স খুঁজে পাও না', ''),
  (gid, 'rm_s2_i', 'string', 'You understand tutorials,', 'টিউটোরিয়াল দেখলে বোঝো', ''),
  (gid, 'rm_s2_e', 'string', 'But can''t do it yourself', 'কিন্তু নিজে করতে পারো না', ''),
  (gid, 'rm_s3_i', 'string', 'Trying to be consistent,', 'নিয়ম করে চলতে গিয়ে মাঝেই', ''),
  (gid, 'rm_s3_e', 'string', 'You lose interest halfway', 'আগ্রহ হারিয়ে ফেলো', ''),
  (gid, 'rm_s4_i', 'string', 'Can build logic with AI,', 'কমপ্লেক্স লজিক AI এর সাহায্যে তৈরি করতে পারলেও', ''),
  (gid, 'rm_s4_e', 'string', 'But can''t write code yourself', 'নিজে কোড লিখতে পারো না', '')
  ON CONFLICT (key) DO NOTHING;

  -- ENROLL STEPS SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'en_tag', 'string', 'Enrollment Process', 'ভর্তি প্রক্রিয়া', ''),
  (gid, 'en_title', 'string', 'Enrollment in just 4 steps', 'মাত্র ৪টি ধাপে ভর্তি সম্পন্ন', ''),
  (gid, 'en_desc', 'string', 'The admission process is completely simple and hassle-free.', 'ভর্তি প্রক্রিয়া সম্পূর্ণ সহজ ও ঝামেলামুক্ত।', ''),
  (gid, 'en_req_title', 'string', 'What is required for admission', 'ভর্তিতে যা যা লাগবে', ''),
  (gid, 'en_req_desc', 'string', '1 passport photo | NID photocopy | Educational certificate photocopy | Admission fee 500 Taka', '১ কপি পাসপোর্ট সাইজ ছবি | জাতীয় পরিচয়পত্র ফটোকপি | সর্বশেষ শিক্ষাগত সনদের ফটোকপি | ভর্তি ফি ৫০০ টাকা', ''),
  (gid, 'en_s1_i', 'string', 'Step 01', 'ধাপ ০১', ''),
  (gid, 'en_s1_e', 'string', 'Fill out the form', 'ফর্ম পূরণ করুন', ''),
  (gid, 'en_s1_d', 'string', 'Fill out the admission form online or in-person.', 'অনলাইনে বা সরাসরি অফিসে এসে ভর্তির আবেদন ফর্ম পূরণ করুন।', ''),
  (gid, 'en_s2_i', 'string', 'Step 02', 'ধাপ ০২', ''),
  (gid, 'en_s2_e', 'string', 'Pay the fee', 'ফি পরিশোধ করুন', ''),
  (gid, 'en_s2_d', 'string', 'Pay the admission fee and collect the receipt.', 'ভর্তি ফি ও প্রথম মাসের বেতন পরিশোধ করুন।', ''),
  (gid, 'en_s3_i', 'string', 'Step 03', 'ধাপ ০৩', ''),
  (gid, 'en_s3_e', 'string', 'Start Classes', 'ক্লাস শুরু করুন', ''),
  (gid, 'en_s3_d', 'string', 'Join classes according to your batch and shift.', 'ব্যাচ ও শিফট অনুযায়ী ক্লাসে যোগ দিন।', ''),
  (gid, 'en_s4_i', 'string', 'Step 04', 'ধাপ ০৪', ''),
  (gid, 'en_s4_e', 'string', 'Get Certificate', 'সার্টিফিকেট নিন', ''),
  (gid, 'en_s4_d', 'string', 'Upon completion, receive a government-approved certificate.', 'কোর্স সফলভাবে সম্পন্ন করলে সরকার অনুমোদিত সার্টিফিকেট পাবেন।', '')
  ON CONFLICT (key) DO NOTHING;

  -- FAQ SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'faq_tag', 'string', 'Frequently Asked Questions (FAQs)', 'সাধারণ জিজ্ঞাসা (FAQs)', ''),
  (gid, 'faq_title', 'string', 'Find Answers to Your Questions', 'আপনার প্রশ্নের উত্তর খুঁজুন', ''),
  (gid, 'faq_desc1', 'string', 'Answers to common questions asked by our users.', 'আমাদের ব্যবহারকারীদের সাধারণ প্রশ্নের উত্তর।', ''),
  (gid, 'faq_q1', 'string', 'How can I enroll in a course?', 'আমি কিভাবে কোর্সে ভর্তি হব?', ''),
  (gid, 'faq_a1', 'string', 'Click the Enroll button or visit our office directly, or call 01788-827474.', 'Enroll বাটনে ক্লিক করুন বা সরাসরি অফিসে যোগাযোগ করুন অথবা 01788-827474 এ কল করুন।', ''),
  (gid, 'faq_q2', 'string', 'Can I access my courses on a mobile device?', 'আমি কি মোবাইলে কোর্স অ্যাক্সেস করতে পারব?', ''),
  (gid, 'faq_a2', 'string', 'Yes, you can access our courses from any smartphone.', 'হ্যাঁ, আপনি যেকোনো স্মার্টফোন থেকে কোর্স অ্যাক্সেস করতে পারবেন।', ''),
  (gid, 'faq_q3', 'string', 'How long will I have access to the course?', 'আমি কতক্ষণ কোর্সে অংশগ্রহণ করতে পারব?', ''),
  (gid, 'faq_a3', 'string', 'The course will be in your account for a lifetime.', 'কোর্সটি আপনার অ্যাকাউন্টে আজীবন থাকবে।', ''),
  (gid, 'faq_q4', 'string', 'What if I need help during the course?', 'কোর্স চলাকালীন সাহায্যের প্রশ্ন হলে?', ''),
  (gid, 'faq_a4', 'string', 'We have dedicated live support groups where you will get any help.', 'আমাদের ডেডিকেটেড লাইভ সাপোর্ট গ্রুপ আছে।', '')
  ON CONFLICT (key) DO NOTHING;

  -- FOOTER SECTION
  INSERT INTO system_settings ("groupId", key, type, value, "valueBn", "defaultValue") VALUES
  (gid, 'ft_desc', 'string', 'One of the most trusted computer training centers in Bangladesh. Helping students build IT careers since 2015.', 'বাংলাদেশের অন্যতম বিশ্বস্ত কম্পিউটার প্রশিক্ষণ কেন্দ্র। ২০১৫ সাল থেকে শিক্ষার্থীদের আইটি ক্যারিয়ার গড়তে সহায়তা করে আসছি।', ''),
  (gid, 'ft_addr', 'string', '123, Main Road, City, District, Bangladesh', '১২৩, মেইন রোড, শহর, জেলা, বাংলাদেশ', ''),
  (gid, 'ft_phone', 'string', '01788-827474', '01788-827474', ''),
  (gid, 'ft_email', 'string', 'info@techhat.shop', 'info@techhat.shop', ''),
  (gid, 'ft_days', 'string', 'Sat – Thu', 'শনি – বৃহস্পতি', ''),
  (gid, 'ft_hours', 'string', '8:00 AM – 9:00 PM', 'সকাল ৮টা – রাত ৯টা', ''),
  (gid, 'ft_map_embed', 'string', '', '', ''),
  (gid, 'ft_facebook', 'string', 'https://facebook.com/techhat', 'https://facebook.com/techhat', ''),
  (gid, 'ft_youtube', 'string', 'https://youtube.com/@techhat', 'https://youtube.com/@techhat', ''),
  (gid, 'ft_whatsapp', 'string', 'https://wa.me/8801788827474', 'https://wa.me/8801788827474', '')
  ON CONFLICT (key) DO NOTHING;

END $$;
