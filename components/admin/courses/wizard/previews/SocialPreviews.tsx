"use client";

import { Globe } from "lucide-react";

export interface PreviewData {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName?: string;
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || "techhat.com";
  }
}

function breadcrumb(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")} › ${u.pathname.split("/").filter(Boolean).join(" › ")}`;
  } catch {
    return url;
  }
}

const clamp = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

/* eslint-disable @next/next/no-img-element */

export function GoogleSearchPreview({ title, description, url }: PreviewData) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <Globe className="h-3.5 w-3.5 text-slate-500" />
        </div>
        <div className="leading-tight">
          <div className="text-xs text-slate-800 dark:text-slate-200">{domainOf(url)}</div>
          <div className="text-[11px] text-slate-500">{breadcrumb(url)}</div>
        </div>
      </div>
      <div className="text-lg text-[#1a0dab] dark:text-blue-400 hover:underline cursor-pointer leading-snug">
        {clamp(title || "Course title — TechHat IT Institute", 60)}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
        {clamp(description || "Your meta description preview appears here. Aim for 120–160 characters.", 160)}
      </p>
    </div>
  );
}

function SocialCard({ title, description, url, image, siteName, tag }: PreviewData & { tag: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="aspect-[1.91/1] w-full bg-slate-100 dark:bg-slate-800">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            {tag} image (1200×630)
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">{domainOf(url)}</div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
          {clamp(title || siteName || "Course title", 70)}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{clamp(description || "", 100)}</p>
      </div>
    </div>
  );
}

export const FacebookSharePreview = (p: PreviewData) => <SocialCard {...p} tag="Facebook" />;
export const TwitterSharePreview = (p: PreviewData) => <SocialCard {...p} tag="Twitter" />;
export const LinkedInPreview = (p: PreviewData) => <SocialCard {...p} tag="LinkedIn" />;
