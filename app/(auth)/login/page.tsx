"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Keyboard, Mail, Lock, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import NavControls from "@/components/ui/NavControls";
import { useLang } from "@/context/GlobalLangContext";
import { createClient } from "@/lib/admin/supabase/client";
import { lookupEmailByPhone } from "@/lib/actions/auth";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/";
  const { t, isBn }  = useLang();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    
    // Check if the input is a phone number or an email
    const isPhone = /^[0-9+]+$/.test(identifier);
    let loginEmail = identifier.toLowerCase();

    if (isPhone) {
      // Supabase Phone Auth provider is disabled, so we map the phone to the user's email
      const mappedEmail = await lookupEmailByPhone(identifier);
      if (mappedEmail) {
        loginEmail = mappedEmail;
      } else {
        // If lookup fails, try the fallback generated email
        loginEmail = `${identifier}@student.techhat.local`;
      }
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password
    });

    setLoading(false);
    if (authError) {
      setError(t("auth_invalid"));
    } else {
      const role = data.user?.user_metadata?.role || "student";
      const dest = callbackUrl === "/" ? (role === "admin" ? "/admin" : "/dashboard") : callbackUrl;
      router.push(dest);
      router.refresh();
    }
  }

  return (
    <div className="relative flex flex-col min-h-full transition-colors duration-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      
      {/* ── Ambient Background Glows (Increased brightness for better contrast) ──────────────── */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/20 dark:bg-cyan-500/15 blur-[100px] pointer-events-none block" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/20 dark:bg-violet-500/15 blur-[100px] pointer-events-none block" />

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-all duration-300">
            <Keyboard className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-black text-base tracking-tight leading-none block text-slate-900 dark:text-white">{t("techhat")}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest leading-none text-slate-500 dark:text-slate-400">{t("computer_training")}</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <NavControls />
          <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-300 group border-slate-200 bg-white hover:bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className={isBn ? "font-bn" : ""}>{t("nav_home")}</span>
          </Link>
        </div>
      </div>

      {/* ── Form — vertically centered ───────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-16 pb-12">
        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-10 text-center">
            <div className="inline-block px-4 py-1.5 mb-5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
              <p className={`text-cyan-700 dark:text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase ${isBn ? "font-bn tracking-normal" : ""}`}>{t("auth_welcome")}</p>
            </div>
            <h1 className={`text-4xl font-black mb-3 tracking-tight text-slate-900 dark:text-white ${isBn ? "font-bn" : ""}`}>
              {t("auth_login_title")}
            </h1>
            <p className={`text-base text-slate-500 dark:text-slate-400 font-medium ${isBn ? "font-bn" : ""}`}>{t("auth_login_sub")}</p>
          </div>

          {/* Form Card (Highly visible) */}
          <div className="p-8 sm:p-10 rounded-[2rem] backdrop-blur-xl border transition-all duration-300 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            
            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl px-4 py-3.5 mb-6 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ${isBn ? "font-bn tracking-normal text-sm" : ""}`}>{t("auth_email_label")}</label>
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-300 ${focusedInput === 'email' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    required
                    placeholder="Email or Mobile Number"
                    className="
                      w-full rounded-2xl pl-12 pr-4 py-4 text-[15px] font-medium transition-all duration-300
                      outline-none border-2
                      bg-slate-50 dark:bg-slate-950/50 
                      border-slate-200 dark:border-slate-800 
                      text-slate-900 dark:text-white 
                      placeholder-slate-400 dark:placeholder-slate-500 
                      hover:border-slate-300 dark:hover:border-slate-700 
                      focus:border-cyan-500 dark:focus:border-cyan-500/80 
                      focus:bg-white dark:focus:bg-slate-900
                      shadow-sm dark:shadow-inner
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ${isBn ? "font-bn tracking-normal text-sm" : ""}`}>{t("auth_pass_label")}</label>
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-300 ${focusedInput === 'password' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    required
                    placeholder="••••••••"
                    className="
                      w-full rounded-2xl pl-12 pr-12 py-4 text-[15px] font-medium transition-all duration-300
                      outline-none border-2
                      bg-slate-50 dark:bg-slate-950/50 
                      border-slate-200 dark:border-slate-800 
                      text-slate-900 dark:text-white 
                      placeholder-slate-400 dark:placeholder-slate-500 
                      hover:border-slate-300 dark:hover:border-slate-700 
                      focus:border-cyan-500 dark:focus:border-cyan-500/80 
                      focus:bg-white dark:focus:bg-slate-900
                      shadow-sm dark:shadow-inner
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-[15px] text-white
                  bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500
                  hover:from-cyan-500 hover:to-blue-500 dark:hover:from-cyan-400 dark:hover:to-blue-400
                  hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed
                  shadow-lg shadow-cyan-500/25 dark:shadow-cyan-500/20
                  transition-all duration-300 mt-8 group
                "
              >
                <span className={`relative z-10 flex items-center justify-center gap-2 ${isBn ? "font-bn text-lg" : ""}`}>
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? t("auth_login_loading") : t("auth_login_btn")}
                </span>
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className={`text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${isBn ? "font-bn tracking-normal" : ""}`}>{t("or")}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            <p className="text-center text-[15px] font-medium text-slate-600 dark:text-slate-400">
              <span className={isBn ? "font-bn" : ""}>{t("auth_no_account")}</span>{" "}
              <Link href="/register" className={`text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-bold transition-colors ${isBn ? "font-bn" : ""}`}>
                {t("auth_create_free")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <p className="relative z-10 text-center text-xs font-semibold pb-6 text-slate-400 dark:text-slate-600">
        &copy; {new Date().getFullYear()} {t("techhat")}
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
