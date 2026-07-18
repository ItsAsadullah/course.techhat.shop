"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/admin/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Shield, CheckCircle2 } from "lucide-react";

export function ProfileCard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [malePercentage, setMalePercentage] = useState(0);
  const [femalePercentage, setFemalePercentage] = useState(0);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      const supabase = createClient();
      
      // Fetch User
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email || null);
      }

      // Fetch Student Genders
      const { data: students } = await supabase.from("students").select("gender");
      if (students && students.length > 0) {
        const males = students.filter(s => s.gender?.toLowerCase() === 'male' || s.gender === 'ছেলে').length;
        const females = students.filter(s => s.gender?.toLowerCase() === 'female' || s.gender === 'মেয়ে').length;
        const total = males + females;
        
        if (total > 0) {
          setMalePercentage(Math.round((males / total) * 100));
          setFemalePercentage(Math.round((females / total) * 100));
        }
      }
    };
    fetchUserAndStats();
  }, []);

  return (
    <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[24px] overflow-hidden bg-white">
      <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <CardContent className="px-6 pb-8 relative -mt-14">
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-[6px] border-white bg-white shadow-md flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50" />
            <User className="h-12 w-12 text-indigo-400 relative z-10" strokeWidth={1.5} />
            
            {/* Status indicator */}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-[3px] border-white flex items-center justify-center z-20">
              <CheckCircle2 className="h-3 w-3 text-white" />
            </div>
          </div>
          
          <h2 className="mt-5 text-xl font-bold text-slate-800 tracking-tight">
            {userEmail ? userEmail.split('@')[0] : "Admin User"}
          </h2>
          <p className="text-sm font-semibold text-indigo-500 flex items-center gap-1.5 mt-1 uppercase tracking-wider">
            <Shield className="h-4 w-4" /> Programmer
          </p>
          
          <div className="flex items-center gap-2 text-[13px] text-slate-400 mt-2 font-medium">
            <Mail className="h-3.5 w-3.5" /> {userEmail || "admin@techhat.com"}
          </div>

          <div className="w-full h-[1px] bg-slate-100 my-8" />

          <div className="w-full flex justify-center px-4 gap-8">
            <div className="flex flex-col items-center gap-3">
              <CircularProgress value={malePercentage} color="text-sky-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Male</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <CircularProgress value={femalePercentage} color="text-rose-400" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Female</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CircularProgress({ value, color }: { value: number; color: string }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${color}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[13px] font-bold text-slate-700">{value}%</span>
      </div>
    </div>
  );
}
