# EduCore LMS — Landing Page

কম্পিউটার প্রশিক্ষণ কেন্দ্রের জন্য সম্পূর্ণ ল্যান্ডিং পেজ।

## 📁 ফাইল স্ট্রাকচার

```
app/
├── layout.tsx           ← Root layout (Bengali font)
├── globals.css          ← Global styles
└── page.tsx             ← Main landing page

components/landing/
├── Navbar.tsx           ← Fixed navigation + mobile menu
├── Hero.tsx             ← Hero section with course preview card
├── Stats.tsx            ← 4 key statistics bar
├── Courses.tsx          ← 8 course cards grid
├── Features.tsx         ← Why choose us (6 features)
├── EnrollSteps.tsx      ← 4-step enrollment process
├── AdmissionForm.tsx    ← Full admission form with validation
├── Testimonials.tsx     ← Student reviews + CTA banner
└── Footer.tsx           ← Full footer with contact info
```

## 🚀 সেটআপ

### ১. প্রজেক্ট তৈরি করুন

```bash
npx create-next-app@latest educore-lms --typescript --tailwind --app --src-dir=false
cd educore-lms
```

### ২. shadcn/ui ইনস্টল করুন

```bash
npx shadcn@latest init
```

### ৩. প্যাকেজ ইনস্টল করুন

```bash
# Icons
npm install lucide-react

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# TanStack Table (admin panel-এর জন্য)
npm install @tanstack/react-table

# Charts (dashboard-এর জন্য)
npm install recharts

# PDF (receipt generation)
npm install jspdf jspdf-autotable
```

### ৪. ফাইলগুলো কপি করুন

এই ফোল্ডারের সব ফাইল আপনার প্রজেক্টে কপি করুন।

### ৫. পরিবর্তন করুন

নিচের জায়গাগুলো আপনার তথ্য দিয়ে আপডেট করুন:

| ফাইল | কী পরিবর্তন করবেন |
|------|-------------------|
| `Navbar.tsx` | প্রতিষ্ঠানের নাম, ফোন নম্বর |
| `Hero.tsx` | Headline, description |
| `Footer.tsx` | ঠিকানা, ফোন, ইমেইল, সোশ্যাল লিংক |
| `Courses.tsx` | কোর্সের নাম, ফি, বিবরণ |
| `AdmissionForm.tsx` | API endpoint (`/api/admissions`) |

## 🔗 অ্যাডমিশন ফর্ম — Supabase সংযোগ

`AdmissionForm.tsx`-এ এই API call করুন:

```typescript
// app/api/admissions/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const body = await request.json()

  // students টেবিলে insert করুন
  const { data: student, error: studentError } = await supabase
    .from("students")
    .insert({
      full_name: body.fullName,
      father_name: body.fatherName,
      mother_name: body.motherName,
      phone: body.phone,
      email: body.email,
      date_of_birth: body.dob,
      gender: body.gender,
      address: body.address,
      status: "pending",
    })
    .select()
    .single()

  if (studentError) {
    return NextResponse.json({ error: studentError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, studentId: student.id })
}
```

## 🎨 কাস্টমাইজেশন

**রং পরিবর্তন:** `tailwind.config.ts`-এ `brand` রং পরিবর্তন করুন  
**ফন্ট পরিবর্তন:** `layout.tsx`-এ `Hind_Siliguri` বদলান  
**কোর্স যোগ:** `Courses.tsx`-এর `courses` array-তে নতুন item যোগ করুন  

## ✅ সেকশন চেকলিস্ট

- [x] Navbar — fixed, mobile responsive, scroll effect
- [x] Hero — Bengali headline, CTA, animated course card
- [x] Stats — 4টি মূল পরিসংখ্যান
- [x] Courses — 8টি কোর্স কার্ড, hover effect
- [x] Features — ৬টি বৈশিষ্ট্য
- [x] Enroll Steps — ৪ ধাপে ভর্তি
- [x] Admission Form — সম্পূর্ণ ফর্ম, validation, success state
- [x] Testimonials — ৬জন শিক্ষার্থীর মতামত + CTA banner
- [x] Footer — ঠিকানা, লিংক, শিফট, সোশ্যাল

---

**Next step:** অ্যাডমিন প্যানেল → `/admin` রুট তৈরি করুন
