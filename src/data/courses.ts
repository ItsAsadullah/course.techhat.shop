import {
  Monitor, Palette, Code2, BarChart3, Camera, Database,
  Calculator, Globe
} from "lucide-react"

export interface CourseModule {
  title: string;
  topics: string[];
}

export interface Course {
  slug: string;
  icon: any;
  name: string;
  nameEn: string;
  duration: string;
  fee: string;
  monthlyFee: string;
  students: string;
  color: string;
  bg: string;
  border: string;
  badge: string;
  badgeColor: string;
  features: string[];
  image?: string;
  mode: "online" | "offline";
  // Detail page fields
  fullDescription: string;
  learningOutcomes: string[];
  modules: CourseModule[];
  certificateType: string;
}

export const onlineCourses: Course[] = [
  {
    slug: "ms-office",
    icon: Monitor,
    name: "মাইক্রোসফট অফিস",
    nameEn: "MS Office (Basic & Advanced)",
    duration: "৩ মাস",
    fee: "৩,০০০",
    monthlyFee: "১,৫০০",
    students: "১২০+",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "জনপ্রিয়",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    features: ["Word, Excel, PowerPoint", "Data Entry & Management", "Practical Project"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    mode: "online" as const,
    fullDescription: "মাইক্রোসফট অফিস কোর্সে আপনি ওয়ার্ড, এক্সেল এবং পাওয়ারপয়েন্টের বেসিক থেকে অ্যাডভান্সড লেভেল পর্যন্ত শিখতে পারবেন। ডাটা এন্ট্রি এবং অফিস ম্যানেজমেন্টে দক্ষতা অর্জনের জন্য এটি একটি চমৎকার কোর্স।",
    learningOutcomes: [
      "Microsoft Word-এ প্রফেশনাল ডকুমেন্ট তৈরি ও ফরম্যাটিং",
      "Microsoft Excel-এ ডেটা অ্যানালাইসিস এবং ফর্মুলা ব্যবহার",
      "PowerPoint-এ আকর্ষণীয় প্রেজেন্টেশন তৈরি",
      "দ্রুত টাইপিং এবং ডাটা এন্ট্রি শর্টকাট",
      "প্র্যাক্টিক্যাল প্রজেক্টের মাধ্যমে রিয়েল-লাইফ কাজ শেখা"
    ],
    modules: [
      {
        title: "মডিউল ১: Microsoft Word",
        topics: ["ইন্টারফেস পরিচিতি", "টেক্সট ফরম্যাটিং ও স্টাইলিং", "টেবিল ও ইমেজ ইনসার্ট", "পেজ লেআউট ও প্রিন্টিং"]
      },
      {
        title: "মডিউল ২: Microsoft Excel",
        topics: ["বেসিক ফাংশন ও ফর্মুলা", "ডেটা সর্টিং ও ফিল্টারিং", "পিভট টেবিল ও চার্ট", "অ্যাডভান্সড ফর্মুলা (VLOOKUP, IF)"]
      },
      {
        title: "মডিউল ৩: Microsoft PowerPoint",
        topics: ["স্লাইড ডিজাইন ও ট্রানজিশন", "অ্যানিমেশন প্রয়োগ", "মাস্টার স্লাইড ব্যবহার", "প্রফেশনাল প্রেজেন্টেশন ডেলিভারি"]
      }
    ],
    certificateType: "Government Approved / Institute Certificate"
  },
  {
    slug: "graphic-design",
    icon: Palette,
    name: "গ্রাফিক ডিজাইন",
    nameEn: "Graphic Design",
    duration: "৪ মাস",
    fee: "৫,০০০",
    monthlyFee: "১,৫০০",
    students: "৯০+",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
    badge: "সেরা চয়েস",
    badgeColor: "bg-pink-100 text-pink-700 border-pink-200",
    features: ["Adobe Photoshop", "Illustrator & CorelDRAW", "Logo, Banner Design"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    mode: "online" as const,
    fullDescription: "গ্রাফিক ডিজাইন কোর্সটি তাদের জন্য যারা সৃজনশীল পেশায় ক্যারিয়ার গড়তে চান। এডোবি ফটোশপ এবং ইলাস্ট্রেটরের মাধ্যমে লোগো, ব্যানার, ফ্লায়ার থেকে শুরু করে প্রফেশনাল লেভেলের ডিজাইন শিখতে পারবেন।",
    learningOutcomes: [
      "Adobe Photoshop এর মাধ্যমে ফটো এডিটিং ও ম্যানিপুলেশন",
      "Adobe Illustrator দিয়ে ভেক্টর ডিজাইন তৈরি",
      "প্রফেশনাল লোগো, ব্যানার এবং সোশ্যাল মিডিয়া পোস্ট ডিজাইন",
      "কালার থিওরি এবং টাইপোগ্রাফি সম্পর্কে পূর্ণাঙ্গ ধারণা",
      "ফ্রিল্যান্সিং মার্কেটপ্লেসের জন্য পোর্টফোলিও তৈরি"
    ],
    modules: [
      {
        title: "মডিউল ১: Adobe Photoshop",
        topics: ["ফটো রিটাচিং ও কালার কারেকশন", "ব্যাকগ্রাউন্ড রিমুভাল", "ফটো ম্যানিপুলেশন", "সোশ্যাল মিডিয়া ডিজাইন"]
      },
      {
        title: "মডিউল ২: Adobe Illustrator",
        topics: ["শেপ ও পেন টুল ব্যবহার", "লোগো ডিজাইন", "ব্র্যান্ড আইডেন্টিটি ডিজাইন", "ভেক্টর ইলাস্ট্রেশন"]
      },
      {
        title: "মডিউল ৩: প্রজেক্ট ও ফ্রিল্যান্সিং",
        topics: ["বাস্তব প্রজেক্টে কাজ", "পোর্টফোলিও বিল্ডিং", "Fiverr এবং Upwork গাইডলাইন"]
      }
    ],
    certificateType: "Professional Certificate"
  },
  {
    slug: "web-development",
    icon: Code2,
    name: "ওয়েব ডেভেলপমেন্ট",
    nameEn: "Web Development",
    duration: "৬ মাস",
    fee: "৮,০০০",
    monthlyFee: "১,৫০০",
    students: "৮০+",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    badge: "নতুন",
    badgeColor: "bg-cyan-100 text-cyan-700 border-cyan-200",
    features: ["HTML, CSS, JavaScript", "React.js & Next.js", "Database & API"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    mode: "online" as const,
    fullDescription: "মডার্ন ওয়েব ডেভেলপমেন্ট কোর্সে আপনি স্ক্র্যাচ থেকে একটি সম্পূর্ণ ফুলস্ট্যাক ওয়েব অ্যাপ্লিকেশন তৈরি করা শিখবেন। ফ্রন্টএন্ড থেকে শুরু করে ব্যাকএন্ড এবং ডেটাবেস ম্যানেজমেন্ট সবকিছুই এই কোর্সে কভার করা হয়েছে।",
    learningOutcomes: [
      "HTML5, CSS3 এবং Tailwind CSS দিয়ে রেসপন্সিভ ডিজাইন",
      "JavaScript (ES6+) এর মাধ্যমে ডাইনামিক ওয়েবসাইট তৈরি",
      "React.js এবং Next.js এর মাধ্যমে মডার্ন ফ্রন্টএন্ড ডেভেলপমেন্ট",
      "Node.js ও Express এর মাধ্যমে ব্যাকএন্ড তৈরি",
      "MongoDB ডাটাবেস ইন্টিগ্রেশন এবং REST API তৈরি"
    ],
    modules: [
      {
        title: "মডিউল ১: ফ্রন্টএন্ড বেসিকস",
        topics: ["HTML5", "CSS3 & Flexbox/Grid", "Tailwind CSS", "জাভাস্ক্রিপ্ট ফান্ডামেন্টালস"]
      },
      {
        title: "মডিউল ২: React.js ও Next.js",
        topics: ["React Components ও State", "React Hooks", "Next.js Routing", "API Data Fetching"]
      },
      {
        title: "মডিউল ৩: ব্যাকএন্ড ও ডেটাবেস",
        topics: ["Node.js বেসিকস", "Express.js", "MongoDB ও Mongoose", "Authentication (JWT)"]
      }
    ],
    certificateType: "Professional Full-Stack Certificate"
  },
  {
    slug: "digital-marketing",
    icon: BarChart3,
    name: "ডিজিটাল মার্কেটিং",
    nameEn: "Digital Marketing",
    duration: "৩ মাস",
    fee: "৪,৫০০",
    monthlyFee: "১,৫০০",
    students: "৭০+",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    badge: "",
    badgeColor: "",
    features: ["Facebook & Google Ads", "SEO & Content Marketing", "Freelancing শুরু"],
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c2d3?w=800&q=80",
    mode: "online" as const,
    fullDescription: "ডিজিটাল মার্কেটিং কোর্সে এসইও, সোশ্যাল মিডিয়া মার্কেটিং, ইমেইল মার্কেটিং এবং পেইড অ্যাড ক্যাম্পেইন সম্পর্কে বিস্তারিত শেখানো হয়। যা আপনাকে একজন সফল মার্কেটার হতে সাহায্য করবে।",
    learningOutcomes: [
      "সার্চ ইঞ্জিন অপটিমাইজেশন (SEO) এর মাধ্যমে অর্গানিক ট্রাফিক বৃদ্ধি",
      "ফেসবুক এবং গুগল অ্যাডস ক্যাম্পেইন সেটআপ ও অপটিমাইজেশন",
      "সোশ্যাল মিডিয়া ম্যানেজমেন্ট ও ব্র্যান্ডিং",
      "কন্টেন্ট স্ট্র্যাটেজি এবং ইমেইল মার্কেটিং",
      "অ্যাফিলিয়েট মার্কেটিং এবং লোকাল এসইও"
    ],
    modules: [
      {
        title: "মডিউল ১: Social Media Marketing",
        topics: ["Facebook পেজ ম্যানেজমেন্ট", "Facebook Ads (Basic to Pro)", "Instagram মার্কেটিং"]
      },
      {
        title: "মডিউল ২: SEO (Search Engine Optimization)",
        topics: ["Keyword Research", "On-page SEO", "Off-page SEO & Link Building"]
      },
      {
        title: "মডিউল ৩: Google Ads & Analytics",
        topics: ["Google Search & Display Ads", "Google Analytics", "Performance Tracking"]
      }
    ],
    certificateType: "Digital Marketing Certified"
  }
];

export const offlineCourses: Course[] = [
  {
    slug: "video-editing",
    icon: Camera,
    name: "ভিডিও এডিটিং",
    nameEn: "Video Editing",
    duration: "৩ মাস",
    fee: "৪,০০০",
    monthlyFee: "১,৫০০",
    students: "৬০+",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    badge: "",
    badgeColor: "",
    features: ["Adobe Premiere Pro", "After Effects", "YouTube Content"],
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80",
    mode: "offline" as const,
    fullDescription: "ভিডিও এডিটিং কোর্সে আপনি প্রফেশনাল মানের ভিডিও তৈরি করতে পারবেন। ইউটিউব কন্টেন্ট ক্রিয়েশন থেকে শুরু করে সিনেমাটিক এডিটিং - সবকিছুই এই কোর্সের অন্তর্ভুক্ত।",
    learningOutcomes: [
      "Adobe Premiere Pro এর মাধ্যমে বেসিক ও অ্যাডভান্সড ভিডিও কাট/ট্রিম",
      "কালার গ্রেডিং এবং অডিও কারেকশন",
      "Adobe After Effects দিয়ে মোশন গ্রাফিক্স ও ভিজ্যুয়াল ইফেক্টস",
      "ট্রানজিশন এবং প্রিমিয়ার প্রো প্লাগিন এর ব্যবহার",
      "ইউটিউব এবং সোশ্যাল মিডিয়ার জন্য ভিডিও তৈরি"
    ],
    modules: [
      {
        title: "মডিউল ১: Adobe Premiere Pro",
        topics: ["ইন্টারফেস ও ওয়ার্কস্পেস", "কাট, ট্রিম ও জয়েন", "কালার কারেকশন ও গ্রেডিং"]
      },
      {
        title: "মডিউল ২: Audio & Effects",
        topics: ["অডিও এডিটিং ও নয়েজ রিমুভাল", "ট্রানজিশন ও টাইটেল অ্যানিমেশন"]
      },
      {
        title: "মডিউল ৩: Adobe After Effects",
        topics: ["বেসিক মোশন গ্রাফিক্স", "ভিজ্যুয়াল ইফেক্টস (VFX)", "গ্রিন স্ক্রিন রিমুভাল"]
      }
    ],
    certificateType: "Professional Video Editor"
  },
  {
    slug: "accounting-tally",
    icon: Calculator,
    name: "একাউন্টিং সফটওয়্যার",
    nameEn: "Tally & Accounting",
    duration: "৪ মাস",
    fee: "৬,০০০",
    monthlyFee: "১,৫০০",
    students: "৫৫+",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    badge: "",
    badgeColor: "",
    features: ["Tally Prime", "QuickBooks বেসিক", "Financial Reporting"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    mode: "offline" as const,
    fullDescription: "অ্যাকাউন্টিং সফটওয়্যার কোর্সে কম্পিউটারের মাধ্যমে হিসাবরক্ষণ, ট্যালি প্রাইম এবং কুইক বুকসের ব্যবহার শেখানো হয়। কর্পোরেট জবে অ্যাকাউন্টিং এর জন্য এটি একটি অপরিহার্য কোর্স।",
    learningOutcomes: [
      "ট্যালি প্রাইম (Tally Prime) এর মাধ্যমে ডেটা এন্ট্রি ও ব্যালেন্স শিট তৈরি",
      "ইনভেন্টরি ম্যানেজমেন্ট এবং পেরোল (Payroll)",
      "ট্যাক্স ও ভ্যাট காலকুলেশন (GST/VAT)",
      "কুইক বুকস (QuickBooks) এর প্রাথমিক ধারণা",
      "ফাইনান্সিয়াল রিপোর্টিং এবং অ্যানালাইসিস"
    ],
    modules: [
      {
        title: "মডিউল ১: অ্যাকাউন্টিং বেসিকস",
        topics: ["অ্যাকাউন্টিং এর মূলনীতি", "জার্নাল, লেজার, ট্রায়াল ব্যালেন্স"]
      },
      {
        title: "মডিউল ২: Tally Prime",
        topics: ["কোম্পানি ক্রিয়েশন ও লেজার তৈরি", "ভাউচার এন্ট্রি", "ইনভেন্টরি ম্যানেজমেন্ট", "পেরোল ও ট্যাক্সেশন"]
      },
      {
        title: "মডিউল ৩: QuickBooks & Reporting",
        topics: ["QuickBooks ওভারভিউ", "ফাইনান্সিয়াল রিপোর্ট জেনারেশন", "ডেটা ব্যাকআপ ও সিকিউরিটি"]
      }
    ],
    certificateType: "Computerized Accounting Certified"
  },
  {
    slug: "python-programming",
    icon: Database,
    name: "Python প্রোগ্রামিং",
    nameEn: "Python Programming",
    duration: "৫ মাস",
    fee: "৭,০০০",
    monthlyFee: "১,৫০০",
    students: "৪৫+",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    badge: "নতুন",
    badgeColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    features: ["Python Fundamentals", "Data Analysis", "Automation & Script"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    mode: "offline" as const,
    fullDescription: "পাইথন প্রোগ্রামিং কোর্সে জিরো থেকে অ্যাডভান্স লেভেলের কোডিং শেখানো হয়। সফটওয়্যার ডেভেলপমেন্ট, ডেটা অ্যানালাইসিস বা অটোমেশন—সব ক্ষেত্রেই পাইথন একটি শক্তিশালী ভাষা।",
    learningOutcomes: [
      "পাইথন ফান্ডামেন্টালস (ভ্যারিয়েবলস, লুপস, ফাংশনস)",
      "অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং (OOP)",
      "ফাইল হ্যান্ডেলিং ও ডেটা স্ট্রাকচার",
      "Pandas ও NumPy দিয়ে ডেটা অ্যানালাইসিস",
      "অটোমেশন স্ক্রিপ্ট তৈরি ও ওয়েব স্ক্র্যাপিং"
    ],
    modules: [
      {
        title: "মডিউল ১: Python Basics",
        topics: ["সিনট্যাক্স ও ভ্যারিয়েবল", "কন্ট্রোল ফ্লো ও লুপ", "ফাংশন ও মডিউল"]
      },
      {
        title: "মডিউল ২: Advanced Python",
        topics: ["OOP কনসেপ্টস", "ফাইল আই/ও", "এক্সেপশন হ্যান্ডেলিং"]
      },
      {
        title: "মডিউল ৩: Data Analysis & Automation",
        topics: ["NumPy ও Pandas", "ওয়েব স্ক্র্যাপিং (BeautifulSoup)", "অটোমেশন প্রজেক্ট"]
      }
    ],
    certificateType: "Python Developer Certificate"
  },
  {
    slug: "freelancing-masterclass",
    icon: Globe,
    name: "ফ্রিল্যান্সিং",
    nameEn: "Freelancing Masterclass",
    duration: "২ মাস",
    fee: "৩,০০০",
    monthlyFee: "১,৫০০",
    students: "১০০+",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    badge: "হট",
    badgeColor: "bg-violet-100 text-violet-700 border-violet-200",
    features: ["Fiverr & Upwork", "প্রোফাইল তৈরি", "ক্লায়েন্ট ম্যানেজমেন্ট"],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    mode: "offline" as const,
    fullDescription: "ফ্রিল্যান্সিং মাস্টারক্লাস কোর্সটি তৈরি করা হয়েছে যারা স্কিল শেখার পর অনলাইন থেকে আয় করতে চান। ফাইভার এবং আপওয়ার্কের মত মার্কেটপ্লেসগুলোতে কীভাবে কাজ পেতে হয় তা হাতে-কলমে শেখানো হবে।",
    learningOutcomes: [
      "ফ্রিল্যান্সিং মার্কেটপ্লেস সম্পর্কে পূর্ণাঙ্গ ধারণা",
      "Fiverr-এ প্রফেশনাল গিগ তৈরি এবং র‍্যাংকিং স্ট্র্যাটেজি",
      "Upwork-এ প্রোফাইল অ্যাপ্রুভাল এবং কভার লেটার লেখা",
      "ক্লায়েন্ট কমিউনিকেশন এবং নেগোসিয়েশন",
      "পেমেন্ট গেটওয়ে সেটআপ (Payoneer, Bank)"
    ],
    modules: [
      {
        title: "মডিউল ১: Fiverr Mastery",
        topics: ["অ্যাকাউন্ট ও প্রোফাইল সেটআপ", "গিগ রিসার্চ ও ক্রিয়েশন", "গিগ এসইও ও মার্কেটিং"]
      },
      {
        title: "মডিউল ২: Upwork Success",
        topics: ["১০০% কমপ্লিট প্রোফাইল", "বিডিং স্ট্র্যাটেজি ও কভার লেটার", "প্রজেক্ট ক্যাটালগ তৈরি"]
      },
      {
        title: "মডিউল ৩: Client & Payment",
        topics: ["ক্লায়েন্ট কমিউনিকেশন হ্যাকস", "লং-টার্ম রিলেশনশিপ", "পেওনিয়ার ও পেমেন্ট উইথড্রয়াল"]
      }
    ],
    certificateType: "Certificate of Completion"
  }
];

export const allCourses = [...onlineCourses, ...offlineCourses];

export function getCourseBySlug(slug: string): Course | undefined {
  return allCourses.find((c) => c.slug === slug);
}
