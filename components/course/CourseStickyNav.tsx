"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/context/GlobalLangContext";

interface NavItem {
  id: string;
  label: string;
}

export default function CourseStickyNav({
  hasAbout = true,
  hasOutcomes = true,
  hasCurriculum = true,
  hasProjects = true,
  hasFaq = true,
}: {
  hasAbout?: boolean;
  hasOutcomes?: boolean;
  hasCurriculum?: boolean;
  hasProjects?: boolean;
  hasFaq?: boolean;
}) {
  const { isBn } = useLang();

  const navItems = useMemo(() => [
    ...(hasAbout ? [{ id: "about", label: isBn ? "কোর্স সম্পর্কে" : "About Course" }] : []),
    ...(hasOutcomes ? [{ id: "outcomes", label: isBn ? "শেখার ফলাফল" : "Outcomes" }] : []),
    ...(hasCurriculum ? [{ id: "curriculum", label: isBn ? "কারিকুলাম" : "Curriculum" }] : []),
    ...(hasProjects ? [{ id: "projects", label: isBn ? "প্রজেক্টসমুহ" : "Projects" }] : []),
    ...(hasFaq ? [{ id: "faq", label: "FAQ" }] : []),
  ], [hasAbout, hasOutcomes, hasCurriculum, hasProjects, hasFaq, isBn]);

  const [activeId, setActiveId] = useState<string>(navItems.length > 0 ? navItems[0].id : "");

  useEffect(() => {
    const handleScroll = () => {
      // Use a threshold roughly equal to the scroll-margin-top offset (e.g. 150-200px)
      const scrollPosition = window.scrollY + 200; 

      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          return;
        }
      }
      
      // If scrolled at the very top before any section, default to the first one
      if (navItems.length > 0) {
        setActiveId(navItems[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check on mount
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <div className="sticky top-[64px] md:top-[72px] z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-y border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 md:py-4">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
