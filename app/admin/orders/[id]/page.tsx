import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  ReceiptText,
  ShieldCheck,
  UserRound,
  WalletCards,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getOrderById } from "@/lib/admin/actions/orders";

import { OrderApproveActions } from "@/components/admin/OrderApproveActions";
import { OrderCancelAction } from "@/components/admin/OrderCancelAction";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

function formatMoney(minor?: number | null) {
  return ((minor ?? 0) / 100).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date?: string | null) {
  if (!date) {
    return "—";
  }

  try {
    return format(
      new Date(date),
      "dd MMM yyyy, hh:mm a",
    );
  } catch {
    return "—";
  }
}

function getStatusTone(status?: string | null): StatusTone {
  switch (status) {
    case "PAID":
    case "APPROVED":
    case "COMPLETED":
      return "success";

    case "PENDING":
    case "PENDING_PAYMENT":
    case "PENDING_MANUAL_REVIEW":
      return "warning";

    case "CANCELLED":
    case "REJECTED":
    case "FAILED":
    case "EXPIRED":
      return "danger";

    case "PROCESSING":
      return "info";

    default:
      return "neutral";
  }
}

function getStatusLabel(status?: string | null) {
  if (!status) {
    return "Unknown";
  }

  switch (status) {
    case "PAID":
      return "Paid";

    case "PENDING":
      return "Pending";

    case "PENDING_PAYMENT":
      return "Pending Payment";

    case "PENDING_MANUAL_REVIEW":
      return "Pending Review";

    case "APPROVED":
      return "Approved";

    case "REJECTED":
      return "Rejected";

    case "CANCELLED":
      return "Cancelled";

    case "FAILED":
      return "Failed";

    case "EXPIRED":
      return "Expired";

    case "PROCESSING":
      return "Processing";

    default:
      return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) =>
          character.toUpperCase(),
        );
  }
}

function StatusBadge({
  status,
}: {
  status?: string | null;
}) {
  const tone = getStatusTone(status);

  const toneClasses: Record<StatusTone, string> = {
    success:
      "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-500",
    warning:
      "border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-500",
    danger:
      "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-500",
    info:
      "border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500",
    neutral:
      "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300",
  };

  const dotClasses: Record<StatusTone, string> = {
    success: "bg-emerald-50 dark:bg-emerald-900/100",
    warning: "bg-amber-50 dark:bg-amber-900/100",
    danger: "bg-red-50 dark:bg-red-900/100",
    info: "bg-blue-50 dark:bg-blue-900/200",
    neutral: "bg-slate-400",
  };

  return (
    <Badge
      variant="outline"
      className={[
        "h-7 gap-2 rounded-full px-3",
        "text-[11px] font-semibold",
        toneClasses[tone],
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          dotClasses[tone],
        ].join(" ")}
      />

      {getStatusLabel(status)}
    </Badge>
  );
}

function SectionHeader({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {action}
    </div>
  );
}

function DataField({
  label,
  value,
  mono = false,
  valueClassName = "",
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>

      <div
        className={[
          "mt-1.5 text-sm font-medium text-slate-800 dark:text-slate-100",
          mono ? "font-mono" : "",
          valueClassName,
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  date,
  tone = "neutral",
  isLast = false,
}: {
  title: string;
  description?: string;
  date?: string | null;
  tone?: StatusTone;
  isLast?: boolean;
}) {
  const toneClasses: Record<StatusTone, string> = {
    success:
      "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-500",
    warning:
      "border-amber-500 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500",
    danger:
      "border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500",
    info:
      "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    neutral:
      "border-slate-300 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400",
  };

  return (
    <div className="relative flex gap-4">
      {!isLast ? (
        <div className="absolute bottom-[-24px] left-[17px] top-9 w-px bg-slate-200" />
      ) : null}

      <div
        className={[
          "relative z-10 flex h-9 w-9 shrink-0",
          "items-center justify-center rounded-full",
          "border-2",
          toneClasses[tone],
        ].join(" ")}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
      </div>

      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </p>

          <p className="text-xs text-slate-400">
            {formatDate(date)}
          </p>
        </div>

        {description ? (
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const result = await getOrderById(id);

  if (!result) {
    notFound();
  }

  const { order, session, review } = result;

  const student = order.students as { id?: string; full_name_en?: string; full_name_bn?: string; mobile?: string; email?: string; guardian_mobile?: string; };
  const course = order.courses as Record<string, unknown>;

  const hasPendingReview =
    review?.status === "PENDING";

  const isOrderClosed =
    order.order_status === "CANCELLED" ||
    order.order_status === "PAID";

  const orderNumber =
    order.order_number ||
    id.slice(0, 8).toUpperCase();

  const payableAmount =
    session?.payable_amount_minor ??
    order.total_minor ??
    0;

  const submittedReviewText =
    review?.submitted_trx_id || "";

  const transactionParts =
    submittedReviewText.match(
      /^(.*?)\s*\(From:\s*(.*?)\)$/i,
    );

  const submittedTrxId =
    transactionParts?.[1]?.trim() ||
    submittedReviewText ||
    "—";

  const submittedSender =
    transactionParts?.[2]?.trim() || "—";

  const timelineItems = [
    {
      id: "order-created",
      title: "Order created",
      description: `${student?.full_name_en || "Student"} initiated course enrollment.`,
      date: order.created_at,
      tone: "info" as StatusTone,
    },

    ...(session
      ? [
        {
          id: "payment-session",
          title: "Payment session created",
          description: `Unique payable amount ৳${formatMoney(
            session.payable_amount_minor,
          )} assigned to this order.`,
          date: session.created_at,
          tone: "neutral" as StatusTone,
        },
      ]
      : []),

    ...(review
      ? [
        {
          id: "manual-review",
          title: "Manual verification requested",
          description: `Transaction ID ${submittedTrxId} was submitted for payment review.`,
          date: review.created_at,
          tone: "warning" as StatusTone,
        },
      ]
      : []),

    ...(review?.reviewed_at
      ? [
        {
          id: "review-completed",
          title:
            review.status === "APPROVED"
              ? "Payment approved"
              : "Payment rejected",
          description:
            review.status === "APPROVED"
              ? "The submitted payment was reviewed and approved."
              : review.rejection_reason ||
              "The submitted payment was rejected.",
          date: review.reviewed_at,
          tone:
            review.status === "APPROVED"
              ? ("success" as StatusTone)
              : ("danger" as StatusTone),
        },
      ]
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 pb-10">
      {/* Page Header */}
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="-ml-3 h-8 gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-950"
              >
                <Link href="/admin/orders">
                  <ArrowLeft className="h-4 w-4" />
                  Orders
                </Link>
              </Button>

              <span className="text-slate-300">/</span>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Order details
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                <ReceiptText className="h-5 w-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-mono text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                    {orderNumber}
                  </h1>

                  <StatusBadge
                    status={order.order_status}
                  />
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />

                    Created {formatDate(order.created_at)}
                  </span>

                  <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                  <span className="font-mono">
                    ID: {id.slice(0, 12)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {student?.id ? (
              <Button
                variant="outline"
                asChild
                className="gap-2"
              >
                <Link
                  href={`/admin/students/${student.id}`}
                >
                  <UserRound className="h-4 w-4" />
                  View Student
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : null}

            {!isOrderClosed ? (
              <OrderCancelAction
                orderId={id}
                studentName={
                  (student?.full_name_en as string) || "Student"
                }
              />
            ) : null}
          </div>
        </div>

        {/* Summary Strip */}
        <div className="grid border-t border-slate-100 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 sm:border-r lg:border-b-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
              Order Total
            </p>

            <p className="mt-1 font-mono text-lg font-bold text-slate-950">
              ৳{formatMoney(order.total_minor)}
            </p>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 lg:border-b-0 lg:border-r">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
              Payable Amount
            </p>

            <p className="mt-1 font-mono text-lg font-bold text-blue-700 dark:text-blue-500">
              ৳{formatMoney(payableAmount)}
            </p>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 sm:border-b-0 sm:border-r">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
              Payment
            </p>

            <div className="mt-1.5">
              <StatusBadge
                status={
                  session?.status || "NO_SESSION"
                }
              />
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
              Manual Review
            </p>

            <div className="mt-1.5">
              {review ? (
                <StatusBadge status={review.status} />
              ) : (
                <span className="text-sm font-medium text-slate-400">
                  Not submitted
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Pending Review Alert */}
      {hasPendingReview ? (
        <section className="overflow-hidden rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-500">
                <AlertCircle className="h-6 w-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-amber-950">
                    Payment verification required
                  </h2>

                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-white/70 dark:bg-slate-900/70 text-amber-700 dark:text-amber-500"
                  >
                    Action Required
                  </Badge>
                </div>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-amber-800 dark:text-amber-400">
                  স্টুডেন্ট ম্যানুয়াল পেমেন্ট তথ্য
                  সাবমিট করেছে। Transaction ID এবং sender
                  number যাচাই করে পেমেন্ট approve অথবা
                  reject করুন।
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-white/70 dark:bg-slate-900/70 px-3 py-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-500">
                      Transaction ID
                    </p>

                    <p className="mt-0.5 font-mono text-sm font-bold text-amber-950">
                      {submittedTrxId}
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-white/70 dark:bg-slate-900/70 px-3 py-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-500">
                      Sender
                    </p>

                    <p className="mt-0.5 font-mono text-sm font-bold text-amber-950">
                      {submittedSender}
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-white/70 dark:bg-slate-900/70 px-3 py-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-500">
                      Amount
                    </p>

                    <p className="mt-0.5 font-mono text-sm font-bold text-amber-950">
                      ৳{formatMoney(payableAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-slate-900 p-3 shadow-sm">
              <OrderApproveActions
                reviewId={review.id}
                studentName={
                  (student?.full_name_en as string) || "Student"
                }
                trxId={review.submitted_trx_id}
                amountStr={formatMoney(payableAmount)}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Main Workspace */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          {/* Order Details */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <SectionHeader
              icon={<ReceiptText className="h-4 w-4" />}
              title="Order overview"
              description="Course enrollment and order pricing information."
              action={
                <StatusBadge
                  status={order.order_status}
                />
              }
            />

            <div className="p-5 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <GraduationCap className="h-7 w-7" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
                      Course
                    </p>

                    <h3 className="mt-1.5 text-lg font-semibold leading-7 text-slate-950">
                      {(course?.title as string) || "Course unavailable"}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Enrollment order for{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {student?.full_name_en || "Student"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-400">
                    Total Amount
                  </p>

                  <p className="mt-2 font-mono text-3xl font-bold tracking-tight">
                    ৳{formatMoney(order.total_minor)}
                  </p>

                  {order.discount_minor > 0 ? (
                    <p className="mt-2 text-xs text-emerald-300">
                      ৳{formatMoney(order.discount_minor)}{" "}
                      discount applied
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">
                      No discount applied
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 sm:grid-cols-3">
                <DataField
                  label="Subtotal"
                  value={`৳${formatMoney(
                    order.subtotal_minor,
                  )}`}
                  mono
                />

                <DataField
                  label="Discount"
                  value={
                    order.discount_minor > 0
                      ? `-৳${formatMoney(
                        order.discount_minor,
                      )}`
                      : "৳0.00"
                  }
                  mono
                  valueClassName={
                    order.discount_minor > 0
                      ? "text-red-600 dark:text-red-500"
                      : ""
                  }
                />

                <DataField
                  label="Final Total"
                  value={`৳${formatMoney(
                    order.total_minor,
                  )}`}
                  mono
                  valueClassName="font-bold text-emerald-700 dark:text-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* Student Information */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <SectionHeader
              icon={<UserRound className="h-4 w-4" />}
              title="Student information"
              description="Customer and enrollment contact details."
            />

            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-xl font-bold text-slate-700 dark:text-slate-200">
                  {student?.full_name_en
                    ?.trim()
                    ?.charAt(0)
                    ?.toUpperCase() || "S"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {student?.full_name_en || "—"}
                  </h3>

                  {student?.full_name_bn ? (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {student.full_name_bn}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {student?.mobile ? (
                      <a
                        href={`tel:${student.mobile}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:bg-blue-900/20 hover:text-blue-700 dark:text-blue-500"
                      >
                        <Phone className="h-3.5 w-3.5" />

                        <span className="font-mono">
                          {student.mobile}
                        </span>
                      </a>
                    ) : null}

                    {student?.email ? (
                      <a
                        href={`mailto:${student.email}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:bg-blue-900/20 hover:text-blue-700 dark:text-blue-500"
                      >
                        <Mail className="h-3.5 w-3.5" />

                        {student.email}
                      </a>
                    ) : null}
                  </div>
                </div>

                {student?.id ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/admin/students/${student.id}`}
                    >
                      Student Profile
                    </Link>
                  </Button>
                ) : null}
              </div>

              {student?.guardian_mobile ? (
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
                  <DataField
                    label="Guardian Mobile"
                    value={
                      <a
                        href={`tel:${student.guardian_mobile}`}
                        className="inline-flex items-center gap-2 hover:text-blue-600 dark:text-blue-400"
                      >
                        <Phone className="h-4 w-4 text-slate-400" />

                        <span className="font-mono">
                          {student.guardian_mobile}
                        </span>
                      </a>
                    }
                  />
                </div>
              ) : null}
            </div>
          </section>

          {/* Payment Session */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <SectionHeader
              icon={<CreditCard className="h-4 w-4" />}
              title="Payment session"
              description="Unique payment amount and verification session information."
              action={
                session ? (
                  <StatusBadge status={session.status} />
                ) : null
              }
            />

            {session ? (
              <div className="p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <WalletCards className="h-4 w-4" />

                      <p className="text-xs font-medium">
                        Base Amount
                      </p>
                    </div>

                    <p className="mt-3 font-mono text-xl font-bold text-slate-900 dark:text-slate-50">
                      ৳
                      {formatMoney(
                        session.base_amount_minor,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20/70 p-4">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <ShieldCheck className="h-4 w-4" />

                      <p className="text-xs font-medium">
                        Unique Payable
                      </p>
                    </div>

                    <p className="mt-3 font-mono text-xl font-bold text-blue-800 dark:text-blue-400">
                      ৳
                      {formatMoney(
                        session.payable_amount_minor,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Clock3 className="h-4 w-4" />

                      <p className="text-xs font-medium">
                        Session Expiry
                      </p>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {formatDate(session.expires_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="grid gap-5 p-4 sm:grid-cols-2">
                    <DataField
                      label="Session ID"
                      value={
                        <span className="break-all">
                          {session.id}
                        </span>
                      }
                      mono
                    />

                    <DataField
                      label="Created At"
                      value={formatDate(session.created_at)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <CreditCard className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  No payment session
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-400">
                  এই order-এর জন্য এখনো কোনো payment
                  session তৈরি হয়নি।
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <aside className="space-y-6">
          {/* Payment Review */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm xl:sticky xl:top-6">
            <SectionHeader
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Payment verification"
              description="Review submitted transaction details."
              action={
                review ? (
                  <StatusBadge status={review.status} />
                ) : null
              }
            />

            {review ? (
              <div className="p-5 sm:p-6">
                <div
                  className={[
                    "rounded-2xl border p-5",
                    review.status === "PENDING"
                      ? "border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10/60"
                      : review.status === "APPROVED"
                        ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10/50"
                        : "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10/50",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                        Transaction ID
                      </p>

                      <p className="mt-2 break-all font-mono text-lg font-bold text-slate-950">
                        {submittedTrxId}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 shadow-sm">
                      <Hash className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                  <DataField
                    label="Sender Number"
                    value={
                      submittedSender !== "—" ? (
                        <a
                          href={`tel:${submittedSender}`}
                          className="inline-flex items-center gap-2 hover:text-blue-600 dark:text-blue-400"
                        >
                          <Phone className="h-4 w-4 text-slate-400" />

                          <span className="font-mono">
                            {submittedSender}
                          </span>
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />

                  <DataField
                    label="Expected Amount"
                    value={`৳${formatMoney(
                      payableAmount,
                    )}`}
                    mono
                    valueClassName="text-lg font-bold text-slate-950"
                  />

                  <DataField
                    label="Submitted At"
                    value={formatDate(review.created_at)}
                  />

                  {review.reviewed_at ? (
                    <DataField
                      label="Reviewed At"
                      value={formatDate(review.reviewed_at)}
                    />
                  ) : null}
                </div>

                {review.rejection_reason ? (
                  <div className="mt-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-500" />

                      <div>
                        <p className="text-xs font-semibold text-red-800 dark:text-red-400">
                          Rejection reason
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-500">
                          {review.rejection_reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {review.status === "APPROVED" ? (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" />

                    <div>
                      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                        Payment approved
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700 dark:text-emerald-500">
                        এই পেমেন্ট সফলভাবে যাচাই এবং
                        approve করা হয়েছে।
                      </p>
                    </div>
                  </div>
                ) : null}

                {hasPendingReview ? (
                  <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <p className="mb-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Approve করার আগে Transaction ID,
                      sender number এবং exact payable amount
                      যাচাই করুন।
                    </p>

                    <OrderApproveActions
                      reviewId={review.id}
                      studentName={
                        student?.full_name_en || "Student"
                      }
                      trxId={review.submitted_trx_id}
                      amountStr={formatMoney(
                        payableAmount,
                      )}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <Clock3 className="h-7 w-7" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Waiting for payment
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
                  স্টুডেন্ট এখনো manual payment verification
                  request সাবমিট করেনি।
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* Activity Timeline */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <SectionHeader
          icon={<Clock3 className="h-4 w-4" />}
          title="Order activity"
          description="Complete history of this order and payment verification."
        />

        <div className="p-5 sm:p-6">
          <div className="mx-auto max-w-4xl">
            {timelineItems.map((item, index) => (
              <TimelineItem
                key={item.id}
                title={item.title}
                description={item.description}
                date={item.date}
                tone={item.tone}
                isLast={
                  index === timelineItems.length - 1
                }
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}