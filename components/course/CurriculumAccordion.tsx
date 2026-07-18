"use client";

import { useState, useEffect, useState as useReactState } from "react";
import { BookOpen, CheckCircle2, ChevronDown, Lock, Play } from "lucide-react";
import { CustomYouTubePlayer } from "./CustomYouTubePlayer";
import { getVideoEmbedUrl, getVideoKind } from "@/lib/video";
import { useLang } from "@/context/GlobalLangContext";

type Lesson = {
  id?: string;
  title?: string;
  title_en?: string | null;
  title_bn?: string | null;
  lesson_type?: string | null;
  video_url?: string | null;
  duration_minutes?: number | null;
};

type CurriculumModule = {
  id?: string;
  title?: string;
  title_en?: string | null;
  title_bn?: string | null;
  description_en?: string | null;
  description_bn?: string | null;
  lessons?: Lesson[];
  topics?: string[];
};

export default function CurriculumAccordion({ modules }: { modules: CurriculumModule[] }) {
  const { isBn } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeLessons, setActiveLessons] = useState<Record<number, number | null>>({});
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [finishedVideos, setFinishedVideos] = useState<Record<string, boolean>>({});

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const lessonKey = (moduleIndex: number, lessonIndex: number) => `${moduleIndex}:${lessonIndex}`;

  const isLessonCompleted = (moduleIndex: number, lessonIndex: number) =>
    !!completedLessons[lessonKey(moduleIndex, lessonIndex)];

  const canOpenLesson = (moduleIndex: number, lessonIndex: number) =>
    lessonIndex === 0 || isLessonCompleted(moduleIndex, lessonIndex - 1);

  const openLesson = (moduleIndex: number, lessonIndex: number) => {
    if (!canOpenLesson(moduleIndex, lessonIndex)) return;
    setActiveLessons((prev) => ({
      ...prev,
      [moduleIndex]: prev[moduleIndex] === lessonIndex ? null : lessonIndex,
    }));
  };

  const completeLesson = (moduleIndex: number, lessonIndex: number, totalLessons: number) => {
    setCompletedLessons((prev) => ({
      ...prev,
      [lessonKey(moduleIndex, lessonIndex)]: true
    }));
    setActiveLessons((prev) => ({
      ...prev,
      [moduleIndex]: lessonIndex + 1 < totalLessons ? lessonIndex + 1 : null,
    }));
  };

  const handleVideoEnd = (moduleIndex: number, lessonIndex: number) => {
    setFinishedVideos((prev) => ({
      ...prev,
      [lessonKey(moduleIndex, lessonIndex)]: true
    }));
  };

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const isOpen = openIndex === index;
        const lessons =
          Array.isArray(module.lessons) && module.lessons.length > 0
            ? module.lessons
            : Array.isArray(module.topics)
              ? module.topics.map((topic: string) => ({ title_bn: topic, lesson_type: "article" }))
              : [];

        return (
          <div
            key={module.id || index}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
            }}
            className={`relative group rounded-2xl transition-all duration-500 ${isOpen ? "z-10 mt-2 mb-4" : "z-0"}`}
          >
            <div
              className="pointer-events-none absolute -inset-px z-30 rounded-[18px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(168, 85, 247, 0.15), transparent 40%)",
              }}
            />

            <div
              className={`absolute -inset-[2px] rounded-[18px] bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 blur-md transition-all duration-500 ${
                isOpen ? "animate-pulse opacity-70" : "group-hover:opacity-40"
              }`}
            />

            <div
              className={`absolute -inset-[2px] rounded-[18px] bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-500 ${
                isOpen ? "opacity-100" : "group-hover:opacity-30"
              }`}
            />

            <div
              className={`relative overflow-hidden rounded-2xl transition-colors duration-300 ${
                isOpen
                  ? "bg-white dark:bg-slate-950"
                  : "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="group/btn flex w-full items-start gap-4 p-5 text-left transition-colors md:p-6"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl transition-all duration-500 md:h-16 md:w-16 ${
                    isOpen
                      ? "scale-105 bg-linear-to-br from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "bg-slate-50 text-slate-500 group-hover/btn:bg-slate-100 group-hover/btn:text-cyan-500 dark:bg-slate-800/50 dark:text-slate-400 dark:group-hover/btn:bg-slate-800"
                  }`}
                >
                  <span className="mb-0.5 text-[10px] font-bold uppercase tracking-wider opacity-80 md:text-[11px]">
                    {isBn ? "মডিউল" : "Module"}
                  </span>
                  <span className="text-xl font-black leading-none md:text-2xl">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                </div>

                <div className="flex-1 pt-1 md:pt-2">
                  <h3
                    className={`text-base font-bold leading-snug transition-colors md:text-lg ${
                      isOpen
                        ? "bg-linear-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-purple-400"
                        : "text-slate-900 group-hover/btn:text-cyan-600 dark:text-white dark:group-hover/btn:text-cyan-400"
                    }`}
                  >
                    {isBn 
                      ? (module.title_bn || module.title_en || module.title || `মডিউল ${index + 1}`) 
                      : (module.title_en || module.title_bn || module.title || `Module ${index + 1}`)}
                  </h3>
                  {(isBn ? (module.description_bn || module.description_en) : (module.description_en || module.description_bn)) && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {isBn ? (module.description_bn || module.description_en) : (module.description_en || module.description_bn)}
                    </p>
                  )}
                </div>

                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                    isOpen
                      ? "rotate-180 bg-purple-100 text-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.3)] dark:bg-purple-900/40 dark:text-purple-400"
                      : "bg-slate-100 text-slate-400 group-hover/btn:bg-cyan-50 group-hover/btn:text-cyan-500 dark:bg-slate-800 dark:group-hover/btn:bg-cyan-900/20"
                  }`}
                >
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  {lessons.length > 0 ? (
                    <div className="flex flex-col p-5 pt-0 md:p-6 md:pt-0">
                      <div className="border-t border-slate-100 pt-6 dark:border-slate-800 md:pl-[5.5rem]">
                        <div className="relative space-y-6 border-l-2 border-slate-100 pb-2 pl-6 dark:border-slate-800/60">
                          {lessons.map((lesson: Lesson, lessonIndex: number) => {
                            const videoUrl = getVideoEmbedUrl(lesson.video_url);
                            const videoKind = getVideoKind(lesson.video_url);
                            
                            let youtubeId = null;
                            if (videoKind === "youtube" && videoUrl) {
                              const match = videoUrl.match(/\/embed\/([^/?]+)/);
                              if (match) {
                                youtubeId = match[1];
                              }
                            }
                            
                            const durationMinutes = lesson.duration_minutes ?? 0;
                            const hasAccess = (lesson as any)._hasAccess ?? true;
                            const unlocked = canOpenLesson(index, lessonIndex) && hasAccess;
                            const completed = isLessonCompleted(index, lessonIndex);
                            const isActiveLesson = activeLessons[index] === lessonIndex && unlocked;
                            const title = isBn 
                              ? (lesson.title_bn || lesson.title_en || lesson.title || `লেসন ${lessonIndex + 1}`)
                              : (lesson.title_en || lesson.title_bn || lesson.title || `Lesson ${lessonIndex + 1}`);

                            return (
                              <div key={lessonIndex}>
                                <button
                                  type="button"
                                  onClick={() => openLesson(index, lessonIndex)}
                                  disabled={!unlocked}
                                  className={`flex w-full items-start gap-4 rounded-xl p-3 text-left transition-all sm:items-center ${
                                    isActiveLesson
                                      ? "bg-indigo-50/50 dark:bg-indigo-500/10"
                                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                  } ${!unlocked ? "cursor-not-allowed opacity-60" : ""}`}
                                >
                                  <div
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:mt-0 ${
                                      isActiveLesson
                                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                                        : completed
                                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                                    }`}
                                  >
                                    {completed ? (
                                      <CheckCircle2 className="h-4 w-4" />
                                    ) : !unlocked ? (
                                      <Lock className="h-4 w-4" />
                                    ) : (
                                      <Play className="h-4 w-4 ml-0.5" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4
                                      className={`font-medium leading-tight ${
                                        isActiveLesson
                                          ? "text-indigo-950 dark:text-indigo-200"
                                          : completed
                                            ? "text-slate-700 dark:text-slate-300"
                                            : "text-slate-600 dark:text-slate-400"
                                      }`}
                                    >
                                      {title}
                                    </h4>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
                                      {durationMinutes > 0 && (
                                        <span className="flex items-center gap-1.5">
                                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                          {durationMinutes} {isBn ? "মিনিট" : "Mins"}
                                        </span>
                                      )}
                                      {!unlocked && (
                                        <span>
                                          {!hasAccess 
                                            ? (isBn ? "লক করা আছে (কোর্স কিনুন)" : "Locked (Buy Course)") 
                                            : (isBn ? "আগের লেসন শেষ করুন" : "Finish previous lesson")}
                                        </span>
                                      )}
                                      {completed && <span className="text-emerald-600 dark:text-emerald-400">{isBn ? "সম্পন্ন" : "Completed"}</span>}
                                    </div>
                                  </div>
                                </button>

                                {isActiveLesson && videoUrl && (
                                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-sm dark:border-slate-800 md:ml-[3.75rem]">
                                    {videoKind === "youtube" && youtubeId ? (
                                      <CustomYouTubePlayer 
                                        youtubeId={youtubeId} 
                                        onEnd={() => handleVideoEnd(index, lessonIndex)}
                                      />
                                    ) : videoKind === "direct" ? (
                                      <video
                                        controls
                                        className="aspect-video w-full bg-black"
                                        src={lesson.video_url || undefined}
                                        onEnded={() => handleVideoEnd(index, lessonIndex)}
                                      />
                                    ) : (
                                      <iframe
                                        src={videoUrl}
                                        title={title}
                                        className="aspect-video w-full bg-black"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                      />
                                    )}
                                    <div className="flex items-center justify-between gap-3 bg-white p-3 dark:bg-slate-900">
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {finishedVideos[lessonKey(index, lessonIndex)]
                                          ? (isBn ? "ভিডিও দেখা শেষ! এখন আপনি লেসন সম্পন্ন করতে পারেন।" : "Video finished! You can now mark the lesson as complete.")
                                          : (isBn ? "ভিডিওটি সম্পূর্ণ দেখার পর লেসন সম্পন্ন করার বাটনটি দৃশ্যমান হবে।" : "The complete button will be visible after watching the video fully.")}
                                      </p>
                                      {finishedVideos[lessonKey(index, lessonIndex)] ? (
                                        <button
                                          type="button"
                                          onClick={() => completeLesson(index, lessonIndex, lessons.length)}
                                          className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                          {isBn ? "লেসন শেষ করেছি" : "Completed"}
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          disabled
                                          className="shrink-0 rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
                                        >
                                          {isBn ? "ভিডিও চলমান..." : "Playing..."}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {isActiveLesson && !videoUrl && (
                                  <div className="mt-3 flex justify-end md:ml-[3.75rem]">
                                    <button
                                      type="button"
                                      onClick={() => completeLesson(index, lessonIndex, lessons.length)}
                                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                      {isBn ? "লেসন শেষ করেছি" : "Completed"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 pt-0 text-sm text-slate-500 dark:text-slate-400 md:p-6 md:pl-[5.5rem] md:pt-0">
                      {isBn ? "এই মডিউলে কোনো লেসন যুক্ত করা হয়নি।" : "No lessons have been added to this module yet."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
