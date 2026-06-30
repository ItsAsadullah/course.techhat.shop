"use client";

import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ url, title }: { url: string, title: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 py-8 border-t border-b border-slate-200 dark:border-slate-800 my-10">
      <span className="font-bold text-slate-900 dark:text-slate-100">শেয়ার করুন:</span>
      
      <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm">
        <Facebook className="w-5 h-5" />
      </button>
      
      <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors shadow-sm">
        <Twitter className="w-5 h-5" />
      </button>
      
      <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors shadow-sm">
        <Linkedin className="w-5 h-5" />
      </button>

      <button 
        onClick={copyToClipboard}
        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm ml-auto sm:ml-0"
        title="Copy Link"
      >
        {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <LinkIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
