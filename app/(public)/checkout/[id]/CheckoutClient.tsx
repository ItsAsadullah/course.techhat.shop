"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { submitManualReview } from "@/app/actions/payment";
import { applyCouponToOrder } from "@/lib/actions/coupons";
import { toast } from "sonner";
import { Headphones, HelpCircle, Info, ArrowLeft, Mail, Phone as PhoneIconLucide, MessageCircle, Globe, Send, MessageSquare, Tag } from "lucide-react";

type PaymentMethod = "bkash" | "nagad" | "rocket" | "qr";
type CheckoutStep = "METHOD" | "PAYMENT" | "SUPPORT" | "FAQ" | "INFORMATION";

type PaymentSession = {
  id: string;
  status: string;
  payable_amount_minor: number;
  expires_at: string;
  created_at?: string | null;
};

type CheckoutOrder = {
  id?: string;
  order_number: string;
  courseName?: string | null;
  subtotal_minor: number;
  discount_minor?: number | null;
  total_minor?: number | null;
  courseThumbnail?: string | null;
};

type PaymentSettings = Record<string, string | undefined>;

interface CheckoutClientProps {
  session: PaymentSession;
  order: CheckoutOrder;
  paymentSettings?: PaymentSettings;
  user?: {
    name: string;
    avatar: string | null;
  };
}

interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  description: string;
  badge?: string;
  logoText: string;
  logoClassName: string;
  activeClassName: string;
  logoKey: string;
}

const MANUAL_REVIEW_DELAY_SECONDS = 90;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "qr",
    name: "Bangla QR",
    description: "Recommended",
    badge: "Recommended",
    logoText: "QR",
    logoClassName: "bg-gradient-to-br from-red-500 to-emerald-600",
    activeClassName:
      "border-red-500 bg-red-50/60 dark:border-red-500 dark:bg-red-950/20",
    logoKey: "bangla_qr_logo_url",
  },
  {
    id: "bkash",
    name: "bKash Personal",
    description: "Send Money",
    logoText: "bKash",
    logoClassName: "bg-[#E2136E]",
    activeClassName:
      "border-[#E2136E] bg-pink-50/60 dark:border-[#E2136E] dark:bg-pink-950/20",
    logoKey: "bkash_logo_url",
  },
  {
    id: "nagad",
    name: "Nagad Personal",
    description: "Send Money",
    logoText: "নগদ",
    logoClassName: "bg-[#F15A24]",
    activeClassName:
      "border-[#F15A24] bg-orange-50/60 dark:border-[#F15A24] dark:bg-orange-950/20",
    logoKey: "nagad_logo_url",
  },
  {
    id: "rocket",
    name: "Rocket Personal",
    description: "Send Money",
    logoText: "Rocket",
    logoClassName: "bg-[#8C1569]",
    activeClassName:
      "border-[#8C1569] bg-purple-50/60 dark:border-[#8C1569] dark:bg-purple-950/20",
    logoKey: "rocket_logo_url",
  },
];

function formatMoney(minor: number) {
  return (minor / 100).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function normalizeMobile(value: string) {
  return value.replace(/[^\d+]/g, "").slice(0, 14);
}

function normalizeTrxId(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase()
    .slice(0, 64);
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15 18-6-6 6-6"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 18 6-6-6-6"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4 4L19 6"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 12 2 2 4-4"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path strokeLinecap="round" d="M11 18h2" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M15 15h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" d="M8 8h8M8 12h6" />
    </svg>
  );
}

function Spinner({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        className="opacity-90"
        fill="currentColor"
        d="M21 12a9 9 0 0 0-9-9v3a6 6 0 0 1 6 6h3Z"
      />
    </svg>
  );
}

function PaymentMethodLogo({
  method,
  logoUrl,
  size = "normal",
}: {
  method: PaymentMethodConfig;
  logoUrl?: string;
  size?: "normal" | "large" | "xl";
}) {
  if (logoUrl) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden ${
          size === "xl" ? "h-20 w-32" : size === "large" ? "h-16 w-24" : "h-12 w-16"
        }`}
      >
        <Image
          src={logoUrl}
          alt={`${method.name} logo`}
          fill
          sizes={size === "xl" ? "128px" : size === "large" ? "96px" : "64px"}
          className={`object-contain ${size === "xl" ? "p-1" : "p-2"}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl px-2 font-bold text-white shadow-sm ${method.logoClassName
        } ${size === "xl"
          ? "h-20 min-w-32 text-lg"
          : size === "large"
          ? "h-16 min-w-24 text-base"
          : "h-12 min-w-16 text-xs"
        }`}
    >
      {method.logoText}
    </div>
  );
}

export default function CheckoutClient({
  session,
  order,
  paymentSettings,
  user,
}: CheckoutClientProps) {
  const router = useRouter();

  const [step, setStep] = useState<CheckoutStep>("METHOD");

  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [activeMethod, setActiveMethod] =
    useState<PaymentMethod>(paymentSettings?.bangla_qr_image_url ? "qr" : "bkash");

  const [status, setStatus] = useState(session.status);

  const [timeLeft, setTimeLeft] = useState("00:00");
  const [isExpired, setIsExpired] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [trxId, setTrxId] = useState("");
  const [senderMobile, setSenderMobile] = useState("");

  const [manualFormOpen, setManualFormOpen] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  const [copiedField, setCopiedField] = useState<
    "amount" | "number" | null
  >(null);

  const amountStr = useMemo(
    () => formatMoney(session.payable_amount_minor),
    [session.payable_amount_minor]
  );

  const courseFee = useMemo(
    () => formatMoney(order.subtotal_minor),
    [order.subtotal_minor]
  );

  const discountMinor = order.discount_minor ?? 0;

  const discountStr = useMemo(
    () => formatMoney(discountMinor),
    [discountMinor]
  );

  const courseName = order.courseName || "কোর্স";

  const activeMethodInfo = useMemo(
    () =>
      PAYMENT_METHODS.find(
        (method) => method.id === activeMethod
      ) ?? PAYMENT_METHODS[0],
    [activeMethod]
  );

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (!order.id) {
      toast.error("Order ID not found.");
      return;
    }
    
    setApplyingCoupon(true);
    try {
      const res = await applyCouponToOrder(order.id, couponCode);
      if (res.success) {
        toast.success(res.message);
        setCouponCode("");
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Failed to apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const manualReviewAvailable =
    elapsedSeconds >= MANUAL_REVIEW_DELAY_SECONDS;

  const getMethodNumber = useCallback(() => {
    if (!paymentSettings) {
      return "";
    }

    switch (activeMethod) {
      case "bkash":
        return paymentSettings.bkash_personal_number || "";

      case "nagad":
        return paymentSettings.nagad_personal_number || "";

      case "rocket":
        return paymentSettings.rocket_personal_number || "";

      default:
        return "";
    }
  }, [activeMethod, paymentSettings]);

  const methodNumber = getMethodNumber();

  const copyValue = useCallback(
    async (
      value: string,
      field: "amount" | "number"
    ) => {
      try {
        await navigator.clipboard.writeText(value);

        setCopiedField(field);

        window.setTimeout(() => {
          setCopiedField(null);
        }, 1800);
      } catch {
        setCopiedField(null);
      }
    },
    []
  );

  useEffect(() => {
    const createdAt = session.created_at
      ? new Date(session.created_at).getTime()
      : Date.now();

    const expiryAt = new Date(session.expires_at).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const distance = expiryAt - now;

      setElapsedSeconds(
        Math.max(
          0,
          Math.floor((now - createdAt) / 1000)
        )
      );

      if (distance <= 0) {
        setIsExpired(true);
        setTimeLeft("00:00");
        return;
      }

      const totalSeconds = Math.floor(distance / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setIsExpired(false);

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    };

    updateTimer();

    const interval = window.setInterval(updateTimer, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [session.created_at, session.expires_at]);

  useEffect(() => {
    const channel = supabase
      .channel(`checkout-payment-${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payment_sessions",
          filter: `id=eq.${session.id}`,
        },
        (payload) => {
          const nextStatus = String(
            payload.new.status ?? ""
          );

          setStatus(nextStatus);

          if (nextStatus === "PAID") {
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router, session.id]);

  const handleManualSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedTrxId = normalizeTrxId(trxId);
    const normalizedMobile = normalizeMobile(senderMobile);

    if (!normalizedTrxId || !normalizedMobile) {
      return;
    }

    setManualLoading(true);

    try {
      const result = await submitManualReview(
        session.id,
        `${normalizedTrxId} (From: ${normalizedMobile})`
      );

      if (result.success) {
        setStatus("PENDING_MANUAL_REVIEW");
        setManualFormOpen(false);
        return;
      }

      window.alert(
        result.error ||
        "পেমেন্ট তথ্য জমা দেওয়া যায়নি।"
      );
    } catch {
      window.alert(
        "এই মুহূর্তে পেমেন্ট তথ্য জমা দেওয়া যাচ্ছে না।"
      );
    } finally {
      setManualLoading(false);
    }
  };

  if (status === "PAID") {
    return (
      <div className="mx-auto flex min-h-[620px] w-full max-w-xl items-center justify-center rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckIcon />
          </div>

          <h2 className="mt-6 text-3xl font-black text-slate-950 dark:text-white">
            পেমেন্ট সফল!
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            আপনার পেমেন্ট সফলভাবে যাচাই হয়েছে।
            কোর্স এক্সেস প্রস্তুত করা হচ্ছে।
          </p>

          <div className="mt-6 flex justify-center text-emerald-600">
            <Spinner className="h-7 w-7" />
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950">
        <div className="p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50">
            <ClockIcon />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
            পেমেন্ট সেশনের সময় শেষ
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            নতুন পেমেন্ট সেশন তৈরি করতে ড্যাশবোর্ডে
            ফিরে যান।
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-7 min-h-12 rounded-xl bg-slate-950 px-7 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  if (status === "PENDING_MANUAL_REVIEW") {
    return (
      <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950">
        <div className="p-10 text-center">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50">
            <ClockIcon />

            <span className="absolute right-0 top-0 h-4 w-4 rounded-full bg-blue-500">
              <span className="absolute inset-0 animate-ping rounded-full bg-blue-400" />
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-950 dark:text-white">
            পেমেন্ট যাচাই করা হচ্ছে
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            আপনার পেমেন্ট তথ্য সফলভাবে জমা হয়েছে।
            যাচাই সম্পন্ন হলে এই পেজ স্বয়ংক্রিয়ভাবে
            আপডেট হবে।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[900px]">
      {step !== "PAYMENT" ? (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-950">
          <div className="grid min-h-[500px] lg:grid-cols-[42%_58%]">
            <aside className="relative flex flex-col border-b border-slate-200 p-5 dark:border-slate-800 lg:border-b-0 lg:border-r lg:p-6 bg-white dark:bg-slate-950">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">কমপ্লিট পেমেন্ট</h2>
              
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-6">
                <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="w-20 h-14 relative rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
                    {order.courseThumbnail ? (
                      <Image
                        src={order.courseThumbnail}
                        alt={courseName || "Course"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                        {courseName ? courseName.charAt(0) : "C"}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                    {courseName}
                  </h3>
                </div>

                <div className="p-5">
                  <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
                    পেমেন্ট ডিটেইলস
                  </h4>
                  
                  <div className="flex items-center justify-between text-[15px] mb-3 text-slate-600 dark:text-slate-400">
                    <span>কোর্সের মূল্য</span>
                    <span className="font-semibold text-slate-900 dark:text-white">৳ {courseFee}</span>
                  </div>

                  {discountMinor > 0 ? (
                    <div className="flex items-center justify-between text-[14px] mb-3 text-emerald-600 dark:text-emerald-500">
                      <span className="flex items-center gap-1.5">
                        <CheckIcon />
                        <span className="font-semibold">প্রোমো ডিসকাউন্ট</span>
                      </span>
                      <span className="font-semibold">- ৳ {discountStr}</span>
                    </div>
                  ) : null}

                  <div className="border-t border-slate-200 dark:border-slate-800 my-4"></div>

                  <div className="flex items-center justify-between text-[15px]">
                    <span className="text-slate-900 dark:text-white font-bold">টোটাল পেমেন্ট:</span>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">৳ {amountStr}</span>
                  </div>
                  
                  <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
                    <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={applyingCoupon || !couponCode.trim()}
                        className="px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                      >
                        {applyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-orange-600 bg-orange-50/80 dark:bg-orange-950/20 dark:text-orange-400 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                <PhoneIconLucide className="w-5 h-5 shrink-0" />
                <span className="leading-snug">
                  প্রয়োজনে কল করুন <strong>+8801968897412</strong> (সকাল ১০টা থেকে রাত ১০টা)
                </span>
              </div>
            </aside>

            <main className="p-5 lg:p-6 flex flex-col">
              {step === "SUPPORT" ? (
                <div className="flex-1 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setStep('METHOD')} className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Support</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="mailto:support@techhat.shop" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:shadow-md dark:hover:border-red-900/50 transition-all group bg-white dark:bg-slate-950">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-600 dark:bg-red-950/40 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">ইমেলের মাধ্যমে যোগাযোগ করুন</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">support@techhat.shop</p>
                      </div>
                    </a>

                    <a href="tel:+8801700000000" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:shadow-md dark:hover:border-red-900/50 transition-all group bg-white dark:bg-slate-950">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-50 text-orange-600 dark:bg-orange-950/40 group-hover:scale-110 transition-transform">
                        <PhoneIconLucide className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">ফোনের মাধ্যমে যোগাযোগ করুন</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">+880 1700 000 000</p>
                      </div>
                    </a>

                    <a href="https://wa.me/8801700000000" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:shadow-md dark:hover:border-red-900/50 transition-all group bg-white dark:bg-slate-950">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">WhatsApp</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">+880 1700 000 000</p>
                      </div>
                    </a>

                    <a href="https://course.techhat.shop" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:shadow-md dark:hover:border-red-900/50 transition-all group bg-white dark:bg-slate-950">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-950/40 group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">Website</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">course.techhat.shop</p>
                      </div>
                    </a>
                    
                    <a href="https://t.me/techhat" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:shadow-md dark:hover:border-red-900/50 transition-all group bg-white dark:bg-slate-950">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-50 text-sky-600 dark:bg-sky-950/40 group-hover:scale-110 transition-transform">
                        <Send className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">Telegram</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">@techhat</p>
                      </div>
                    </a>

                    <a href="https://facebook.com/techhat" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:shadow-md dark:hover:border-red-900/50 transition-all group bg-white dark:bg-slate-950">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 group-hover:scale-110 transition-transform">
                        <FacebookIcon />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">Facebook Page</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">TechHat</p>
                      </div>
                    </a>
                  </div>
                </div>
              ) : step === "FAQ" ? (
                <div className="flex-1 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setStep('METHOD')} className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">FAQ</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">How long does manual verification take?</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Verification typically takes 5-10 minutes during working hours. Please wait patiently on the verification screen.</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">What happens if I close the window?</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Your order will still be processed. You can check your email or dashboard for updates.</p>
                    </div>
                  </div>
                </div>
              ) : step === "INFORMATION" ? (
                <div className="flex-1 w-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setStep('METHOD')} className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Information</h2>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 prose dark:prose-invert prose-sm max-w-none">
                    <p>TechHat is a premium IT education provider. By purchasing this course, you agree to our terms of service.</p>
                    <p>If you face any issues with your payment, please use the Support tab to contact our team.</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 w-full animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex items-center gap-4">
                {user?.avatar ? (
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 shadow-sm dark:bg-blue-950/40">
                    <Image
                      src={user.avatar}
                      alt={user.name || "User"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-black text-blue-600 dark:bg-blue-950/40">
                    {(user?.name || courseName || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-lg font-bold text-slate-600 dark:text-slate-300">
                    Welcome Back!
                  </p>

                  <p className="text-xs font-semibold text-slate-500">
                    Secure checkout
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (activeMethod === "qr") setActiveMethod("bkash");
                  }}
                  className={`flex min-h-20 flex-col items-center justify-center rounded-2xl border transition ${
                    activeMethod !== "qr"
                      ? "border-red-500 bg-red-50/60 text-red-600 dark:border-red-500 dark:bg-red-950/20"
                      : "border-slate-200 text-slate-500 hover:border-blue-400 hover:bg-blue-50/40 dark:border-slate-800"
                  }`}
                >
                  <PhoneIcon />

                  <span className="mt-2 text-sm font-bold">
                    MFS
                  </span>
                </button>

                {paymentSettings?.bangla_qr_enabled === 'true' && (
                  <button
                    type="button"
                    onClick={() => setActiveMethod("qr")}
                    className={`flex min-h-20 flex-col items-center justify-center rounded-2xl border transition ${
                      activeMethod === "qr"
                        ? "border-emerald-500 bg-emerald-50/60 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-950/20"
                        : "border-slate-200 text-slate-500 hover:border-blue-400 hover:bg-blue-50/40 dark:border-slate-800"
                    }`}
                  >
                    {paymentSettings?.bangla_qr_logo_url ? (
                      <div className="relative h-6 w-14 shrink-0">
                        <Image
                          src={paymentSettings.bangla_qr_logo_url}
                          alt="Bangla QR"
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <QrIcon />
                    )}

                    <span className="mt-2 text-sm font-bold">
                      Bangla QR
                    </span>
                  </button>
                )}
              </div>

              {activeMethod !== "qr" && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-base font-black text-slate-950 dark:text-white">
                    পেমেন্ট পদ্ধতি নির্বাচন করুন
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {PAYMENT_METHODS.filter(m => {
                      if (m.id === 'qr') return false; // Do not show QR here
                      if (m.id === 'bkash') return paymentSettings?.bkash_enabled !== 'false';
                      if (m.id === 'nagad') return paymentSettings?.nagad_enabled !== 'false';
                      if (m.id === 'rocket') return paymentSettings?.rocket_enabled !== 'false';
                      return true;
                    }).map((method) => {
                      const isActive =
                        activeMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setActiveMethod(method.id)
                          }
                          className={`relative flex min-h-[116px] flex-col items-center justify-center rounded-2xl border p-4 text-center transition duration-200 ${isActive
                            ? method.activeClassName
                            : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                            }`}
                        >
                          {method.badge ? (
                            <span className="absolute right-2 top-2 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                              {method.badge}
                            </span>
                          ) : null}

                          <PaymentMethodLogo
                            method={method}
                            logoUrl={paymentSettings?.[method.logoKey as string]}
                          />

                          <p className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                            {method.name}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            {method.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeMethod === "qr" && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-base font-black text-slate-950 dark:text-white">
                    Bangla QR গাইডলাইন
                  </h2>

                  <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/20 text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                    <p>
                      <strong className="text-slate-800 dark:text-slate-200">Bangla QR</strong> হলো বাংলাদেশের ন্যাশনাল পেমেন্ট কিউআর স্ট্যান্ডার্ড। এর মাধ্যমে আপনি যেকোনো সাপোর্টেড ব্যাংক বা MFS অ্যাপ থেকে স্ক্যান করে পেমেন্ট করতে পারবেন।
                    </p>
                    
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">যেসব অ্যাপ সাপোর্ট করে:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>bKash, Nagad, Rocket, Upay ইত্যাদি অ্যাপের QR স্ক্যানার।</li>
                        <li>City Touch, CellFin, EBL Skybanking সহ অন্যান্য সাপোর্টেড ব্যাংকিং অ্যাপ।</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">কীভাবে পেমেন্ট করবেন?</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>নিচের <strong>Pay {amountStr}BDT</strong> বাটনে ক্লিক করুন।</li>
                        <li>পরবর্তী স্ক্রিনে একটি QR Code দেখতে পাবেন।</li>
                        <li>আপনার ব্যাংক বা MFS অ্যাপ থেকে QR স্ক্যান করে পেমেন্ট করুন।</li>
                        <li>পেমেন্ট সফল হলে Transaction ID দিয়ে পেমেন্ট ভেরিফাই করুন।</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep("PAYMENT")}
                className="mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-6 text-base font-black text-white shadow-lg focus:outline-none focus:ring-4 transition-all"
                style={{
                  backgroundColor: activeMethod === "bkash" ? "#D91C5C" : activeMethod === "nagad" ? "#F15A24" : activeMethod === "rocket" ? "#8C1569" : "#10b981",
                  boxShadow: `0 10px 15px -3px ${activeMethod === "bkash" ? "rgba(217,28,92,0.3)" : activeMethod === "nagad" ? "rgba(241,90,36,0.3)" : activeMethod === "rocket" ? "rgba(140,21,105,0.3)" : "rgba(16,185,129,0.3)"}`
                }}
              >
                Pay {amountStr}BDT
                <ArrowRightIcon />
              </button>

              <p className="mt-6 text-xs leading-5 text-slate-400">
                উপরের বাটনে ক্লিক করে আপনি নির্বাচিত
                পেমেন্ট পদ্ধতির মাধ্যমে পেমেন্ট সম্পন্ন করতে
                পারবেন। পেমেন্ট স্বয়ংক্রিয়ভাবে যাচাই করা হবে।
              </p>
              </div>
              )}

              <div className="mt-10 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Powered by{" "}
                  <strong className="text-slate-950 dark:text-white">
                    TechHat
                  </strong>
                </span>

                <span className="flex items-center gap-2">
                  <ShieldIcon />
                  Secured
                </span>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep("METHOD")}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 dark:bg-red-950/40"
                  aria-label="Back to payment methods"
                >
                  <ArrowLeftIcon />
                </button>

                <p className="text-sm font-bold text-slate-500">
                  Powered by TechHat
                </p>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-xs font-bold text-slate-500 dark:bg-slate-900">
                  BN
                </div>
              </header>

              <div className="p-4 sm:p-5">
                <div className="flex justify-center pb-3">
                  <PaymentMethodLogo
                    method={activeMethodInfo}
                    logoUrl={paymentSettings?.[activeMethodInfo.logoKey]}
                    size="xl"
                  />
                </div>

                <div className="mt-1 grid grid-cols-2 gap-3">
                  <div className="flex min-h-10 items-center gap-3 rounded-2xl border border-slate-200 px-3 dark:border-slate-800">
                    <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                      <Image
                        src="/logo.png"
                        alt="TechHat Logo"
                        fill
                        sizes="28px"
                        className="object-contain p-1"
                      />
                    </div>

                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      TechHat
                    </span>
                  </div>

                  <div className="flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 px-3 font-mono text-lg font-black text-slate-700 dark:border-slate-800 dark:text-slate-200">
                    {amountStr} BDT
                  </div>
                </div>

                <div
                  className={`mt-2 rounded-2xl p-3 text-white ${activeMethod === "bkash"
                    ? "bg-[#D91C5C]"
                    : activeMethod === "nagad"
                      ? "bg-[#F15A24]"
                      : activeMethod === "rocket"
                        ? "bg-[#8C1569]"
                        : "bg-slate-900"
                    }`}
                >
                  {activeMethod === "qr" ? (
                    <div className="flex flex-col items-center py-1">
                      <p className="text-sm font-bold">
                        Bangla QR দিয়ে পেমেন্ট করুন
                      </p>

                      <div className="mt-3 rounded-xl bg-white p-3 shadow-xl">
                        {paymentSettings?.bangla_qr_image_url ? (
                          <div className="relative h-44 w-44 sm:h-48 sm:w-48">
                            <Image
                              src={
                                paymentSettings.bangla_qr_image_url
                              }
                              alt="Bangla QR"
                              fill
                              sizes="192px"
                              className="object-contain"
                              priority
                            />
                          </div>
                        ) : (
                          <div className="flex h-44 w-44 items-center justify-center text-slate-400">
                            QR Code not configured
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-center text-xs sm:text-sm leading-5 text-white/80">
                        যেকোনো Bangla QR সমর্থিত অ্যাপ থেকে
                        QR স্ক্যান করুন এবং ঠিক{" "}
                        <strong>৳{amountStr}</strong>{" "}
                        পেমেন্ট করুন।
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-white/20">
                      <li className="flex items-center gap-3 py-1.5 first:pt-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm font-medium">
                          আপনার {activeMethodInfo.name} App খুলুন।
                        </span>
                      </li>

                      <li className="flex items-center gap-3 py-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm font-medium">
                          &quot;Send Money&quot; নির্বাচন করুন।
                        </span>
                      </li>

                      <li className="flex items-center gap-3 py-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm font-medium">
                          নম্বর দিন:{" "}
                          <strong>
                            {methodNumber || "Number not configured"}
                          </strong>
                        </span>

                        {methodNumber ? (
                          <button
                            type="button"
                            onClick={() => copyValue(methodNumber, "number")}
                            className="ml-3 flex h-6 w-6 items-center justify-center rounded bg-white text-slate-800 transition hover:bg-slate-100"
                            aria-label="Copy payment number"
                          >
                            {copiedField === "number" ? <CheckIcon /> : <CopyIcon />}
                          </button>
                        ) : null}
                      </li>

                      <li className="flex items-center gap-3 py-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm font-medium">
                          Amount দিন:{" "}
                          <strong>
                            {amountStr} BDT
                          </strong>
                        </span>

                        <button
                          type="button"
                          onClick={() => copyValue(amountStr, "amount")}
                          className="ml-3 flex h-6 w-6 items-center justify-center rounded bg-white text-slate-800 transition hover:bg-slate-100"
                          aria-label="Copy payment amount"
                        >
                          {copiedField === "amount" ? <CheckIcon /> : <CopyIcon />}
                        </button>
                      </li>

                      <li className="flex items-center gap-3 py-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm font-medium">
                          আপনার PIN দিয়ে পেমেন্ট নিশ্চিত করুন।
                        </span>
                      </li>

                      <li className="flex items-center gap-3 py-1.5 last:pb-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-sm font-medium">
                          নিচের বক্সে Transaction ID এবং আপনার নম্বর দিয়ে Verify করুন।
                        </span>
                      </li>
                    </ul>
                  )}
                </div>

              <div className="mt-3 flex flex-col items-center text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-[#D91C5C] dark:bg-pink-950/30">
                  <Spinner className="h-4 w-4" />
                </div>

                <h2 className="mt-2 text-sm font-black text-slate-950 dark:text-white">
                  Waiting for Payment..
                </h2>

                <p className="mx-auto mt-1 max-w-[500px] text-[11px] sm:text-xs leading-4 sm:leading-5 text-slate-500">
                  Please complete the payment via App or USSD using the exact amount shown above. The system will automatically detect and verify your transaction.
                </p>
              </div>

              <div className="mt-3 px-4 pb-3">
                <form
                  onSubmit={handleManualSubmit}
                  className="grid gap-2 md:grid-cols-2 items-end"
                >
                  <div className="text-left space-y-1">
                    <label
                      htmlFor="trx-id"
                      className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
                    >
                      Transaction ID
                    </label>

                    <input
                      id="trx-id"
                      type="text"
                      placeholder="Enter transaction ID"
                      value={trxId}
                      onChange={(event) =>
                        setTrxId(
                          normalizeTrxId(
                            event.target.value
                          )
                        )
                      }
                      required
                      className="min-h-[38px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm uppercase outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-red-950"
                    />
                  </div>

                  <div className="text-left space-y-1">
                    <label
                      htmlFor="sender-mobile"
                      className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
                    >
                      Sender Mobile Number
                    </label>

                    <input
                      id="sender-mobile"
                      type="tel"
                      inputMode="tel"
                      placeholder="017XXXXXXXX"
                      value={senderMobile}
                      onChange={(event) =>
                        setSenderMobile(
                          normalizeMobile(
                            event.target.value
                          )
                        )
                      }
                      required
                      className="min-h-[38px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-red-950"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      manualLoading ||
                      !trxId.trim() ||
                      !senderMobile.trim()
                    }
                    className="md:col-span-2 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    {manualLoading ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Payment"
                    )}
                  </button>
                </form>

                <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400">
                  <ShieldIcon />
                  Secured payment verification by TechHat
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
  );
}