"use client";

import { UseFormReturn, Path } from "react-hook-form";
import { CourseWizardValues } from "@/lib/schema/course.schema";

interface Step2Props {
  form: UseFormReturn<CourseWizardValues>;
}

const inputCls = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all placeholder:text-slate-400";
const textareaCls = `${inputCls} min-h-[100px] resize-y`;
const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
const errorCls = "text-red-500 text-xs mt-1";
const hintCls = "text-xs text-slate-400 mt-1";

// Dual field: BN + EN side by side
function DualField({
  labelBn,
  labelEn,
  nameBn,
  nameEn,
  form,
  placeholderBn,
  placeholderEn,
  multiline = false,
  hint,
}: {
  labelBn: string;
  labelEn: string;
  nameBn: keyof CourseWizardValues["step2"];
  nameEn: keyof CourseWizardValues["step2"];
  form: UseFormReturn<CourseWizardValues>;
  placeholderBn?: string;
  placeholderEn?: string;
  multiline?: boolean;
  hint?: string;
}) {
  const { register } = form;
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>{labelBn}</label>
        <Tag
          {...register(`step2.${nameBn}` as Path<CourseWizardValues>)}
          placeholder={placeholderBn}
          className={multiline ? textareaCls : inputCls}
        />
        {hint && <p className={hintCls}>{hint}</p>}
      </div>
      <div>
        <label className={labelCls}>{labelEn}</label>
        <Tag
          {...register(`step2.${nameEn}` as Path<CourseWizardValues>)}
          placeholder={placeholderEn}
          className={multiline ? textareaCls : inputCls}
        />
        {hint && <p className={hintCls}>{hint}</p>}
      </div>
    </div>
  );
}

export default function Step2CourseInfo({ form }: Step2Props) {
  const { formState: { errors } } = form;
  const step2Errors = errors.step2 || {};

  return (
    <div className="space-y-6">
      {/* Short Description */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">সংক্ষিপ্ত বিবরণ</h3>
        <DualField
          labelBn="সংক্ষিপ্ত বিবরণ (Bangla) *"
          labelEn="Short Description (English) *"
          nameBn="short_description_bn"
          nameEn="short_description_en"
          form={form}
          placeholderBn="কোর্সটি সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন..."
          placeholderEn="Brief description of the course..."
          multiline
        />
        {step2Errors.short_description_bn && <p className={errorCls}>{step2Errors.short_description_bn.message}</p>}
        {step2Errors.short_description_en && <p className={errorCls}>{step2Errors.short_description_en.message}</p>}
      </div>

      {/* Long Description */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">বিস্তারিত বিবরণ</h3>
        <DualField
          labelBn="বিস্তারিত বিবরণ (Bangla)"
          labelEn="Long Description (English)"
          nameBn="long_description_bn"
          nameEn="long_description_en"
          form={form}
          placeholderBn="কোর্সের বিস্তারিত বিবরণ লিখুন..."
          placeholderEn="Detailed description of the course..."
          multiline
        />
      </div>

      {/* Objectives */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">কোর্সের উদ্দেশ্য ও শেখার ফলাফল</h3>
        <div className="space-y-4">
          <DualField
            labelBn="কোর্সের উদ্দেশ্য (Bangla)"
            labelEn="Course Objectives (English)"
            nameBn="objectives_bn"
            nameEn="objectives_en"
            form={form}
            placeholderBn="প্রতিটি পয়েন্ট নতুন লাইনে লিখুন"
            placeholderEn="One objective per line"
            multiline
            hint="প্রতিটি পয়েন্ট আলাদা লাইনে লিখুন"
          />
          <DualField
            labelBn="শেখার ফলাফল (Bangla)"
            labelEn="Learning Outcomes (English)"
            nameBn="learning_outcomes_bn"
            nameEn="learning_outcomes_en"
            form={form}
            placeholderBn="কোর্স শেষে কী শিখবে"
            placeholderEn="What students will learn"
            multiline
            hint="প্রতিটি পয়েন্ট আলাদা লাইনে লিখুন"
          />
          <DualField
            labelBn="কোর্সের সুবিধা (Bangla)"
            labelEn="Course Benefits (English)"
            nameBn="benefits_bn"
            nameEn="benefits_en"
            form={form}
            multiline
            hint="প্রতিটি পয়েন্ট আলাদা লাইনে লিখুন"
          />
        </div>
      </div>

      {/* Target & Requirements */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">যোগ্যতা ও লক্ষ্য দর্শক</h3>
        <div className="space-y-4">
          <DualField
            labelBn="কারা যোগ দিতে পারবে (Bangla)"
            labelEn="Who Should Join (English)"
            nameBn="who_should_join_bn"
            nameEn="who_should_join_en"
            form={form}
            multiline
            hint="প্রতিটি পয়েন্ট আলাদা লাইনে লিখুন"
          />
          <DualField
            labelBn="পূর্বশর্ত (Bangla)"
            labelEn="Requirements (English)"
            nameBn="requirements_bn"
            nameEn="requirements_en"
            form={form}
            multiline
            hint="প্রতিটি পয়েন্ট আলাদা লাইনে লিখুন"
          />
        </div>
      </div>

      {/* Skills & Career */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">দক্ষতা ও ক্যারিয়ার সুযোগ</h3>
        <div className="space-y-4">
          <DualField
            labelBn="যেসব দক্ষতা অর্জন হবে (Bangla)"
            labelEn="Skills Covered (English)"
            nameBn="skills_covered_bn"
            nameEn="skills_covered_en"
            form={form}
            multiline
            hint="প্রতিটি স্কিল আলাদা লাইনে লিখুন"
          />
          <DualField
            labelBn="ক্যারিয়ার সুযোগ (Bangla)"
            labelEn="Career Opportunities (English)"
            nameBn="career_opportunities_bn"
            nameEn="career_opportunities_en"
            form={form}
            multiline
            hint="প্রতিটি পয়েন্ট আলাদা লাইনে লিখুন"
          />
        </div>
      </div>
    </div>
  );
}

