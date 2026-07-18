"use client";

import { useState } from "react";
import { User, Mail, Phone, Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateUserProfile } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  initialData: {
    name: string;
    email: string;
    mobile: string;
    userId: string;
    studentId: string;
  };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email.includes("@student.techhat.local") ? "" : initialData.email);
  const [mobile, setMobile] = useState(initialData.mobile);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const result = await updateUserProfile(
      initialData.userId,
      initialData.studentId,
      name,
      mobile,
      email
    );

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      router.refresh(); // Refresh page to update sidebar names etc.
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(result.error || "Failed to update profile");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl px-4 py-3.5 mb-6 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-sm rounded-2xl px-4 py-3.5 mb-6 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold">Profile updated successfully!</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Full Name</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full rounded-xl pl-11 pr-4 py-3 text-[15px] font-medium outline-none border-2 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500/80 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile Number */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              required
              className="w-full rounded-xl pl-11 pr-4 py-3 text-[15px] font-medium outline-none border-2 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500/80 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Email Address (Optional)</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl pl-11 pr-4 py-3 text-[15px] font-medium outline-none border-2 bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500/80 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-70 shadow-lg shadow-blue-500/25"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
