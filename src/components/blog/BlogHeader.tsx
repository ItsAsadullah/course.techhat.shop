"use client";

import { Moon, Sun, Type } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

interface BlogHeaderProps {
  title: string;
  author: { name: string; role: string; image: string };
  date: string;
  readTime: string;
  textSize: number;
  setTextSize: (size: number) => void;
}

export default function BlogHeader({ title, author, date, readTime, textSize, setTextSize }: BlogHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-6 leading-tight">
        {title}
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Image 
            src={author.image} 
            alt={author.name} 
            width={56} 
            height={56} 
            className="rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{author.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{author.role}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{date} • {readTime}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-3">
            <Type className="w-4 h-4 text-slate-500" />
            <button 
              onClick={() => setTextSize(Math.max(14, textSize - 2))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <button 
              onClick={() => setTextSize(Math.min(24, textSize + 2))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
