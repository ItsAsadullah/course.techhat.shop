"use client";

import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import { CheckCircle2, Info } from "lucide-react";

export default function PaymentSection({ id }: { id: string }) {
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];

  return (
    <section id={id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 scroll-mt-28">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        {t("sec_payment")}
      </h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-3">
          <Info className="w-5 h-5" />
          পেমেন্ট সম্পর্কে
        </h3>
        <div className="space-y-3 text-sm text-blue-700 dark:text-blue-400">
          <p>
            ফর্ম জমা দেওয়ার পরে আপনাকে একটি <strong>সিকিউর চেকআউট পেজ</strong>-এ নিয়ে যাওয়া হবে যেখানে আপনি নিরাপদে পেমেন্ট সম্পন্ন করতে পারবেন।
          </p>
          <p>
            পেমেন্ট যাচাইয়ের পরে আপনার কোর্স অ্যাক্সেস স্বয়ংক্রিয়ভাবে সক্রিয় হয়ে যাবে।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">বিকাশ / নগদ / রকেট</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">মোবাইল ব্যাংকিং সাপোর্টেড</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">স্বয়ংক্রিয় যাচাইকরণ</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">পেমেন্ট পরিমাণ মিললে তাৎক্ষণিকভাবে অ্যাক্সেস</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">ম্যানুয়াল যাচাই</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">TrxID দিয়ে আবেদন করার সুবিধা</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">নিরাপদ লেনদেন</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Unique Amount দিয়ে নিরাপদ পেমেন্ট সিস্টেম</p>
          </div>
        </div>
      </div>
    </section>
  );
}
