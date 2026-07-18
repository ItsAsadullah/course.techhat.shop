"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Keyboard, User, Mail, Lock, Loader2, AlertCircle, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import NavControls from "@/components/ui/NavControls";
import { useLang } from "@/context/GlobalLangContext";
import { createClient } from "@/lib/admin/supabase/client";

import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { t, isBn } = useLang();

  const [registerMethod, setRegisterMethod] = useState<"mobile" | "email">("mobile");
  
  const [name,     setName]     = useState("");
  const [mobile,   setMobile]   = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const finalMobile = registerMethod === "mobile" ? mobile : "";
    const finalEmail = registerMethod === "email" ? email : "";

    const result = await registerUser(name, finalMobile, finalEmail, password);

    setLoading(false);

    if (!result.success) {
      setError(result.error || t("auth_reg_failed"));
    } else {
      setSuccess(true);
      
      // Auto login after successful registration
      const supabase = createClient();
      const loginEmail = registerMethod === "email" ? email : `${mobile}@student.techhat.local`;
      await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password
      });

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    }
  }

  return (
    <div className="relative flex flex-col min-h-full transition-colors duration-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      
      {/* ── Ambient Background Glows ──────────────────────────────── */}
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/20 dark:bg-violet-500/15 blur-[100px] pointer-events-none block" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-pink-500/20 dark:bg-pink-500/15 blur-[100px] pointer-events-none block" />

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
          
          <div className="mb-8 text-center">
            <div className="inline-block px-4 py-1.5 mb-5 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
              <p className={`text-violet-700 dark:text-violet-400 text-xs font-bold tracking-[0.2em] uppercase ${isBn ? "font-bn tracking-normal" : ""}`}>{t("auth_new_member")}</p>
            </div>
            <h1 className={`text-4xl font-black mb-3 tracking-tight text-slate-900 dark:text-white ${isBn ? "font-bn" : ""}`}>
              {t("auth_reg_title")}
            </h1>
            <p className={`text-base text-slate-500 dark:text-slate-400 font-medium ${isBn ? "font-bn" : ""}`}>{t("auth_reg_sub")}</p>
          </div>

          {/* Form Card (Highly visible) */}
          <div className="p-8 sm:p-10 rounded-[2rem] backdrop-blur-xl border transition-all duration-300 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            
            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-2xl px-4 py-3.5 mb-6 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-2xl px-4 py-3.5 mb-6 animate-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-semibold">{t("auth_reg_success")}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Method Toggle */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => { setRegisterMethod("mobile"); setError(""); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${registerMethod === "mobile" ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => { setRegisterMethod("email"); setError(""); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${registerMethod === "email" ? "bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  Email
                </button>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ${isBn ? "font-bn tracking-normal text-sm" : ""}`}>{t("auth_name_label")}</label>
                <div className="relative group">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-300 ${focusedInput === 'name' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    required
                    placeholder="Your Name"
                    className="
                      w-full rounded-2xl pl-12 pr-4 py-4 text-[15px] font-medium transition-all duration-300
                      outline-none border-2
                      bg-slate-50 dark:bg-slate-950/50 
                      border-slate-200 dark:border-slate-800 
                      text-slate-900 dark:text-white 
                      placeholder-slate-400 dark:placeholder-slate-500 
                      hover:border-slate-300 dark:hover:border-slate-700 
                      focus:border-violet-500 dark:focus:border-violet-500/80 
                      focus:bg-white dark:focus:bg-slate-900
                      shadow-sm dark:shadow-inner
                    "
                  />
                </div>
              </div>

              {/* Email or Mobile based on toggle */}
              {registerMethod === "email" ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-right-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ${isBn ? "font-bn tracking-normal text-sm" : ""}`}>{t("auth_email_label")}</label>
                  <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-300 ${focusedInput === 'email' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      required={registerMethod === "email"}
                      placeholder="you@example.com"
                      className="
                        w-full rounded-2xl pl-12 pr-4 py-4 text-[15px] font-medium transition-all duration-300
                        outline-none border-2
                        bg-slate-50 dark:bg-slate-950/50 
                        border-slate-200 dark:border-slate-800 
                        text-slate-900 dark:text-white 
                        placeholder-slate-400 dark:placeholder-slate-500 
                        hover:border-slate-300 dark:hover:border-slate-700 
                        focus:border-violet-500 dark:focus:border-violet-500/80 
                        focus:bg-white dark:focus:bg-slate-900
                        shadow-sm dark:shadow-inner
                      "
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ${isBn ? "font-bn tracking-normal text-sm" : ""}`}>Mobile Number</label>
                  <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-300 ${focusedInput === 'mobile' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      onFocus={() => setFocusedInput('mobile')}
                      onBlur={() => setFocusedInput(null)}
                      required={registerMethod === "mobile"}
                      placeholder="e.g. 01700000000"
                      className="
                        w-full rounded-2xl pl-12 pr-4 py-4 text-[15px] font-medium transition-all duration-300
                        outline-none border-2
                        bg-slate-50 dark:bg-slate-950/50 
                        border-slate-200 dark:border-slate-800 
                        text-slate-900 dark:text-white 
                        placeholder-slate-400 dark:placeholder-slate-500 
                        hover:border-slate-300 dark:hover:border-slate-700 
                        focus:border-violet-500 dark:focus:border-violet-500/80 
                        focus:bg-white dark:focus:bg-slate-900
                        shadow-sm dark:shadow-inner
                      "
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ${isBn ? "font-bn tracking-normal text-sm" : ""}`}>{t("auth_pass_label")}</label>
                <div className="relative group">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-300 ${focusedInput === 'password' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    required
                    minLength={6}
                    placeholder="min. 6 characters"
                    className="
                      w-full rounded-2xl pl-12 pr-12 py-4 text-[15px] font-medium transition-all duration-300
                      outline-none border-2
                      bg-slate-50 dark:bg-slate-950/50 
                      border-slate-200 dark:border-slate-800 
                      text-slate-900 dark:text-white 
                      placeholder-slate-400 dark:placeholder-slate-500 
                      hover:border-slate-300 dark:hover:border-slate-700 
                      focus:border-violet-500 dark:focus:border-violet-500/80 
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
                disabled={loading || success}
                className="
                  w-full relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-[15px] text-white
                  bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-500 dark:to-pink-500
                  hover:from-violet-500 hover:to-pink-500 dark:hover:from-violet-400 dark:hover:to-pink-400
                  hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed
                  shadow-lg shadow-violet-500/25 dark:shadow-violet-500/20
                  transition-all duration-300 mt-7 group
                "
              >
                <span className={`relative z-10 flex items-center justify-center gap-2 ${isBn ? "font-bn text-lg" : ""}`}>
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? t("auth_reg_loading") : t("auth_reg_btn")}
                </span>
              </button>
            </form>

            <p className={`text-center text-[12px] font-semibold mt-5 text-slate-500 dark:text-slate-400 ${isBn ? "font-bn tracking-wide" : ""}`}>
              {t("auth_terms")}
            </p>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className={`text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${isBn ? "font-bn tracking-normal" : ""}`}>{t("or")}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            <p className="text-center text-[15px] font-medium text-slate-600 dark:text-slate-400">
              <span className={isBn ? "font-bn" : ""}>{t("auth_have_account")}</span>{" "}
              <Link href="/login" className={`text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-bold transition-colors ${isBn ? "font-bn" : ""}`}>
                {t("auth_signin_link")}
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
