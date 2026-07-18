"use client";

import React, { useState, useEffect } from "react";

interface DobSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function DobSelector({ value, onChange, error }: DobSelectorProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-");
      if (y && m && d) {
        setYear(y);
        setMonth(m);
        setDay(d);
      }
    }
  }, [value]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 5 - i);
  const months = [
    { value: "01", label: "January (01)" },
    { value: "02", label: "February (02)" },
    { value: "03", label: "March (03)" },
    { value: "04", label: "April (04)" },
    { value: "05", label: "May (05)" },
    { value: "06", label: "June (06)" },
    { value: "07", label: "July (07)" },
    { value: "08", label: "August (08)" },
    { value: "09", label: "September (09)" },
    { value: "10", label: "October (10)" },
    { value: "11", label: "November (11)" },
    { value: "12", label: "December (12)" },
  ];

  const getDaysInMonth = (y: string, m: string) => {
    if (!y || !m) return 31;
    return new Date(parseInt(y), parseInt(m), 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, "0"));

  const triggerChange = (newY: string, newM: string, newD: string) => {
    if (newY && newM && newD) {
      onChange(`${newY}-${newM}-${newD}`);
    } else {
      onChange(""); // Clear if incomplete
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const y = e.target.value;
    setYear(y);
    let d = day;
    if (month && d) {
      const maxDays = getDaysInMonth(y, month);
      if (parseInt(d) > maxDays) d = maxDays.toString().padStart(2, "0");
    }
    setDay(d);
    triggerChange(y, month, d);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = e.target.value;
    setMonth(m);
    let d = day;
    if (year && d) {
      const maxDays = getDaysInMonth(year, m);
      if (parseInt(d) > maxDays) d = maxDays.toString().padStart(2, "0");
    }
    setDay(d);
    triggerChange(year, m, d);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const d = e.target.value;
    setDay(d);
    triggerChange(year, month, d);
  };

  const selectClass = `flex-1 rounded-xl border ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-800 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all text-slate-700 dark:text-slate-200 cursor-pointer appearance-none`;

  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <select value={day} onChange={handleDayChange} className={selectClass} style={{ width: '100%' }}>
          <option value="" disabled>Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      <div className="relative flex-[1.5]">
        <select value={month} onChange={handleMonthChange} className={selectClass} style={{ width: '100%' }}>
          <option value="" disabled>Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      <div className="relative flex-1">
        <select value={year} onChange={handleYearChange} className={selectClass} style={{ width: '100%' }}>
          <option value="" disabled>Year</option>
          {years.map((y) => (
            <option key={y} value={y.toString()}>
              {y}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
}
