"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

export default function PasswordSection({ id }: { id: string }) {
  const { register, formState: { errors } } = useFormContext<AdmissionFormValues>();
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section
      id={id}
      className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/30 rounded-2xl p-6 md:p-8 border border-blue-200 dark:border-blue-800/50 scroll-mt-28"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t("sec_password")}
        </h2>
      </div>

      <div className="flex items-start gap-2 mb-6 p-3 bg-blue-100/60 dark:bg-blue-900/30 rounded-xl border border-blue-200/60 dark:border-blue-800/40">
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t("password_hint")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {t("password")} *
          </label>
          <div className={`flex rounded-xl border overflow-hidden transition-all shadow-sm ${
            errors.password
              ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400/20 bg-red-50 dark:bg-red-950/30"
              : "border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 bg-white dark:bg-slate-900"
          }`}>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder={t("password_placeholder")}
              className="flex-1 px-4 py-3 text-sm outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {t("confirm_password")} *
          </label>
          <div className={`flex rounded-xl border overflow-hidden transition-all shadow-sm ${
            errors.confirmPassword
              ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400/20 bg-red-50 dark:bg-red-950/30"
              : "border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 bg-white dark:bg-slate-900"
          }`}>
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder={t("confirm_password_placeholder")}
              className="flex-1 px-4 py-3 text-sm outline-none bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
