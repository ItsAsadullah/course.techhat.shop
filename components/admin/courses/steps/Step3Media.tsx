"use client";

import { UseFormReturn } from "react-hook-form";
import { CourseWizardValues } from "@/lib/schema/course.schema";
import { UploadCloud, Video, FileText, Link as LinkIcon, PlayCircle } from "lucide-react";

interface Step3Props {
  form: any;
}

const inputCls = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all placeholder:text-slate-400";
const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

export default function Step3Media({ form }: Step3Props) {
  const { register, watch, setValue } = form;
  const thumbnailUrl = watch("step3.thumbnail_url");
  const bannerUrl = watch("step3.banner_url");
  const videoType = watch("step3.intro_video_type");

  return (
    <div className="space-y-6">
      {/* Thumbnail */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">থাম্বনেইল ও ব্যানার</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Thumbnail */}
          <div>
            <label className={labelCls}>কোর্স থাম্বনেইল URL</label>
            <input
              {...register("step3.thumbnail_url")}
              placeholder="https://example.com/thumbnail.jpg"
              className={inputCls}
            />
            {thumbnailUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-36">
                <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            )}
            {!thumbnailUrl && (
              <div className="mt-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 h-36 flex flex-col items-center justify-center text-slate-400">
                <UploadCloud className="w-8 h-8 mb-2" />
                <p className="text-xs">থাম্বনেইল প্রিভিউ</p>
              </div>
            )}
          </div>

          {/* Banner */}
          <div>
            <label className={labelCls}>কোর্স ব্যানার URL</label>
            <input
              {...register("step3.banner_url")}
              placeholder="https://example.com/banner.jpg"
              className={inputCls}
            />
            {bannerUrl ? (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-36">
                <img src={bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="mt-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 h-36 flex flex-col items-center justify-center text-slate-400">
                <UploadCloud className="w-8 h-8 mb-2" />
                <p className="text-xs">ব্যানার প্রিভিউ</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Intro Video */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">ইন্ট্রো ভিডিও</h3>

        {/* Video Type Selector */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { value: "youtube", icon: PlayCircle, label: "YouTube", color: "text-red-500" },
            { value: "vimeo", icon: Video, label: "Vimeo", color: "text-blue-500" },
            { value: "direct", icon: LinkIcon, label: "Direct URL", color: "text-slate-500" },
          ].map(({ value, icon: Icon, label, color }) => {
            const isActive = videoType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue("step3.intro_video_type", value as any)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  isActive
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </button>
            );
          })}
        </div>

        {videoType && (
          <div>
            <label className={labelCls}>
              {videoType === "youtube" ? "YouTube Video URL / ID" : videoType === "vimeo" ? "Vimeo Video URL / ID" : "ভিডিও Direct URL"}
            </label>
            <input
              {...register("step3.intro_video_url")}
              placeholder={videoType === "youtube" ? "https://youtube.com/watch?v=..." : "https://..."}
              className={inputCls}
            />
          </div>
        )}
      </div>

      {/* Demo Video */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">ডেমো ভিডিও ও ফাইল</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>ডেমো ভিডিও URL</label>
            <input {...register("step3.demo_video_url")} placeholder="Demo video URL" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>ব্রোশার PDF URL</label>
            <input {...register("step3.brochure_pdf_url")} placeholder="Brochure PDF URL" className={inputCls} />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          ফাইল আপলোডের জন্য Cloudinary বা যেকোনো CDN URL ব্যবহার করুন
        </p>
      </div>
    </div>
  );
}

