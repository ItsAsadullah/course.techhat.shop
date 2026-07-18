"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { domAnimation, LazyMotion, m } from "framer-motion";
import {
  ArrowDownUp,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Copy,
  Download,
  Ellipsis,
  Filter,
  GraduationCap,
  Grid2X2,
  Import,
  Layers3,
  LayoutList,
  Monitor,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteTrainingBatch, archiveTrainingBatch, duplicateTrainingBatch } from "@/lib/admin/actions/training-batches";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  TrainingBatch,
  TrainingBatchCapacityListItem,
  TrainingBatchStatus,
} from "@/types/admin/training";

export interface TrainingBatchListItem {
  batch: TrainingBatch;
  capacity: TrainingBatchCapacityListItem | null;
  capacityError: string | null;
}

type ViewMode = "grid" | "list";
type SortMode =
  | "newest"
  | "oldest"
  | "name"
  | "status"
  | "utilization"
  | "available";
type CapacityMode = "all" | "available" | "nearly-full" | "full" | "unavailable";

const STATUS_META: Record<
  TrainingBatchStatus,
  { label: string; className: string; dotClassName: string }
> = {
  draft: {
    label: "Draft",
    className: "border-slate-200 bg-slate-100 text-slate-700",
    dotClassName: "bg-slate-500",
  },
  open: {
    label: "Open",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClassName: "bg-emerald-500",
  },
  full: {
    label: "Full",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    dotClassName: "bg-rose-500",
  },
  ongoing: {
    label: "Running",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    dotClassName: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    className: "border-violet-200 bg-violet-50 text-violet-700",
    dotClassName: "bg-violet-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClassName: "bg-amber-500",
  },
  archived: {
    label: "Archived",
    className: "border-slate-200 bg-slate-100 text-slate-500",
    dotClassName: "bg-slate-400",
  },
};

function formatDate(value: string | null): string {
  if (!value) {
    return "TBA";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string | null): string {
  if (!value) {
    return "TBA";
  }

  return value.slice(0, 5);
}

function formatRelativeShare(value: number, total: number): string {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

function csvEscape(value: string | number | null | undefined): string {
  const text = String(value ?? "");
  const escaped = text.replace(/"/g, "\"\"");
  return `"${escaped}"`;
}

function downloadCsv(items: TrainingBatchListItem[]) {
  const rows = [
    [
      "Batch",
      "Course",
      "Status",
      "Session",
      "Start Date",
      "End Date",
      "Primary Shift",
      "Lab",
      "Effective Capacity",
      "Occupied",
      "Available",
    ],
    ...items.map(({ batch, capacity }) => [
      batch.name_en,
      batch.course?.name ?? "",
      batch.status,
      batch.session ?? "",
      batch.start_date ?? "",
      batch.end_date ?? "",
      batch.shifts?.[0]?.name_en ?? "",
      batch.shifts?.[0]?.lab?.name ?? "",
      capacity?.effective_batch_capacity ?? "",
      capacity?.occupied ?? "",
      capacity?.available ?? "",
    ]),
  ];

  const csv = rows
    .map((row) => row.map((cell) => csvEscape(cell)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "training-batches.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as TrainingBatchStatus];

  if (!meta) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        {status}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        meta.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClassName)} />
      {meta.label}
    </span>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  accent,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
  icon: React.ElementType;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-transparent bg-admin-surface p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1.5 opacity-90",
          accent
        )}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          <p className="text-[14px] font-medium text-slate-500 tracking-tight">{title}</p>
          <div className="text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-primary/10 text-admin-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function SoftMetaChip({
  icon: Icon,
  label,
  tone = "default",
}: {
  icon: React.ElementType;
  label: string;
  tone?: "default" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone === "success" && "bg-emerald-50 text-emerald-700",
        tone === "warning" && "bg-amber-50 text-amber-700",
        tone === "default" && "bg-slate-100 text-slate-600"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function CircularCapacity({
  utilization,
}: {
  utilization: number;
}) {
  const clamped = Math.min(Math.max(utilization, 0), 100);
  const tone =
    clamped >= 100
      ? "#ef4444"
      : clamped >= 80
        ? "#f59e0b"
        : "#2563eb";

  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${tone} ${clamped * 3.6}deg, #E5E7EB 0deg)`,
        }}
      />
      <div className="absolute inset-[5px] rounded-full bg-white" />
      <span className="relative text-xs font-semibold text-slate-700">
        {Math.round(clamped)}%
      </span>
    </div>
  );
}

function CapacityPanel({
  item,
}: {
  item: TrainingBatchListItem;
}) {
  const { batch, capacity, capacityError } = item;

  if (batch.status === "archived") {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-600">Archived batch</p>
        <p className="mt-1 text-xs text-slate-500">
          Live capacity is not available for archived batches.
        </p>
      </div>
    );
  }

  if (!capacity) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
          <ShieldCheck className="h-4 w-4" />
          Capacity unavailable
        </div>
        {capacityError && (
          <p className="mt-1 text-xs text-amber-700/80">{capacityError}</p>
        )}
      </div>
    );
  }

  const utilization = Math.min(
    Math.max(capacity.utilization_percent, 0),
    100
  );

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
            <UsersRound className="h-4 w-4" />
            Capacity
          </div>
          <div className="flex items-end gap-2">
            <p className="text-lg font-semibold text-slate-900">
              {capacity.occupied}
              <span className="mx-1 text-slate-300">/</span>
              {capacity.effective_batch_capacity}
            </p>
            <p className="pb-0.5 text-xs text-slate-500">students</p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                capacity.is_full
                  ? "bg-rose-500"
                  : utilization >= 80
                    ? "bg-amber-500"
                    : "bg-blue-600"
              )}
              style={{ width: `${utilization}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SoftMetaChip
              icon={Users}
              label={`${capacity.available} seats available`}
              tone={capacity.available === 0 ? "warning" : "success"}
            />
            <SoftMetaChip
              icon={Layers3}
              label={`${capacity.selected_shift_count} shift(s)`}
            />
          </div>
        </div>
        <CircularCapacity utilization={utilization} />
      </div>
    </div>
  );
}

function ActionMenu({ batchId }: { batchId: string }) {
  const router = useRouter();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchivePending, startArchiveTransition] = useTransition();

  const [isDuplicatePending, startDuplicateTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTrainingBatch(batchId);
      if (result.success) {
        toast.success("ব্যাচ সফলভাবে ডিলিট করা হয়েছে।");
      } else {
        toast.error(result.error.message || "ব্যাচ ডিলিট করা যায়নি।");
      }
      setIsDeleteDialogOpen(false);
    });
  };

  const handleArchive = () => {
    startArchiveTransition(async () => {
      const result = await archiveTrainingBatch(batchId);
      if (result.success) {
        toast.success("ব্যাচ সফলভাবে আর্কাইভ করা হয়েছে।");
      } else {
        toast.error(result.error.message || "ব্যাচ আর্কাইভ করা যায়নি।");
      }
      setIsArchiveDialogOpen(false);
    });
  };

  const handleDuplicate = () => {
    startDuplicateTransition(async () => {
      const result = await duplicateTrainingBatch(batchId);
      if (result.success) {
        toast.success("ব্যাচ সফলভাবে ডুপ্লিকেট করা হয়েছে।");
        router.push(`/admin/training/batches/${result.data}`);
      } else {
        toast.error(result.error.message || "ব্যাচ ডুপ্লিকেট করা যায়নি।");
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="border-[#E5E7EB] bg-white hover:bg-slate-50"
            aria-label="Open batch quick actions"
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 min-w-56 rounded-xl border-[#E5E7EB]"
        >
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/training/batches/${batchId}`}>
              <ArrowRight className="h-4 w-4" />
              View batch
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/training/batches/${batchId}`}>
              <Users className="h-4 w-4" />
              Students
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/training/batches/${batchId}`}>
              <ClipboardCheck className="h-4 w-4" />
              Edit batch
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <ClipboardCheck className="h-4 w-4" />
            Attendance (Coming Soon)
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Wallet className="h-4 w-4" />
            Payments (Coming Soon)
          </DropdownMenuItem>
          <DropdownMenuItem 
            disabled={isDuplicatePending}
            onClick={handleDuplicate}
          >
            <Copy className="h-4 w-4" />
            {isDuplicatePending ? "Duplicating..." : "Duplicate"}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsArchiveDialogOpen(true)}
          >
            <Building2 className="h-4 w-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem 
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই ব্যাচটি ডিলিট করলে তা চিরতরে মুছে যাবে। আপনি কি নিশ্চিত যে আপনি এই ব্যাচটি ডিলিট করতে চান?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>বাতিল</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isPending ? "ডিলিট হচ্ছে..." : "হ্যাঁ, ডিলিট করুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ব্যাচ আর্কাইভ করবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              আর্কাইভ করা ব্যাচ সাধারণ তালিকায় আর দেখাবে না। তবে এর ডেটা সুরক্ষিত থাকবে। আপনি কি নিশ্চিত?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchivePending}>বাতিল</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleArchive();
              }}
              disabled={isArchivePending}
              className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
            >
              {isArchivePending ? "আর্কাইভ হচ্ছে..." : "হ্যাঁ, আর্কাইভ করুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function BatchGridCard({ item, index }: { item: TrainingBatchListItem; index: number }) {
  const { batch, capacity } = item;
  const primaryShift = batch.shifts?.[0];
  const additionalShiftCount = Math.max((batch.shifts?.length ?? 0) - 1, 0);

  return (
    <m.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.24 }}
      className="group rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={batch.status} />
              {batch.waitlist_enabled && (
                <SoftMetaChip icon={UsersRound} label="Waitlist enabled" />
              )}
              <SoftMetaChip
                icon={CalendarDays}
                label={`Created ${formatDate(batch.created_at)}`}
              />
            </div>
            <div className="space-y-1">
              <Link
                href={`/admin/training/batches/${batch.id}`}
                className="inline-flex items-center gap-2 text-[18px] font-semibold text-slate-950 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
              >
                <BookOpen className="h-4.5 w-4.5 text-slate-500" />
                {batch.name_en}
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
                <span className="font-medium text-slate-700">
                  {batch.course?.name ?? "Course not linked"}
                </span>
                {batch.course?.name_bn && <span>{batch.course.name_bn}</span>}
                {batch.session && (
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <ChevronRight className="h-3.5 w-3.5" />
                    Session {batch.session}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start">
            <Button
              asChild
              className="rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700"
            >
              <Link href={`/admin/training/batches/${batch.id}`}>
                Open workspace
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <ActionMenu batchId={batch.id} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-5 sm:px-6 xl:grid-cols-[1.15fr_1.15fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-slate-50/70 p-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Timeline
            </div>
            <div className="mt-3 space-y-2 text-[13px] text-slate-600">
              <div className="flex items-start justify-between gap-3">
                <span>Start date</span>
                <span className="font-medium text-slate-800">
                  {formatDate(batch.start_date)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>End date</span>
                <span className="font-medium text-slate-800">
                  {formatDate(batch.end_date)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>Admission</span>
                <span className="font-medium text-slate-800">
                  {formatDate(batch.admission_deadline)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>Orientation</span>
                <span className="font-medium text-slate-800">
                  {formatDate(batch.orientation_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-slate-50/70 p-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
              <GraduationCap className="h-4 w-4" />
              Delivery
            </div>
            <div className="mt-3 space-y-2 text-[13px] text-slate-600">
              <div className="flex items-start justify-between gap-3">
                <span>Primary shift</span>
                <span className="font-medium text-slate-800">
                  {primaryShift?.name_en ?? "Not assigned"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>Time</span>
                <span className="font-medium text-slate-800">
                  {primaryShift
                    ? `${formatTime(primaryShift.start_time)} - ${formatTime(primaryShift.end_time)}`
                    : "TBA"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>Lab</span>
                <span className="font-medium text-slate-800">
                  {primaryShift?.lab?.name ?? "Not assigned"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span>Room</span>
                <span className="font-medium text-slate-800">
                  {batch.room ?? primaryShift?.lab?.code ?? "TBA"}
                </span>
              </div>
              {additionalShiftCount > 0 && (
                <p className="pt-1 text-xs font-medium text-blue-600">
                  +{additionalShiftCount} additional shift(s)
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <CapacityPanel item={item} />

          <div className="rounded-2xl border border-[#E5E7EB] bg-slate-50/70 p-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
              <Building2 className="h-4 w-4" />
              Operations
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <SoftMetaChip
                icon={Layers3}
                label={batch.session ? `Session ${batch.session}` : "Session not set"}
              />
              <SoftMetaChip
                icon={Users}
                label={capacity ? `${capacity.occupied} enrolled` : "Enrollment unavailable"}
                tone={capacity && capacity.occupied > 0 ? "success" : "default"}
              />
              <SoftMetaChip
                icon={Clock3}
                label={batch.updated_at ? `Updated ${formatDate(batch.updated_at)}` : "Recently updated"}
              />
              <SoftMetaChip
                icon={ShieldCheck}
                label={batch.waitlist_enabled ? "Waitlist on" : "Waitlist off"}
                tone={batch.waitlist_enabled ? "warning" : "default"}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
            <Award className="h-4 w-4" />
            Operational insights
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl bg-white px-3 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <UsersRound className="h-3.5 w-3.5" />
                Instructor
              </div>
              <p className="mt-1 text-sm font-medium text-slate-700">
                Not linked on this dataset
              </p>
            </div>
            <div className="rounded-xl bg-white px-3 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Wallet className="h-3.5 w-3.5" />
                Revenue
              </div>
              <p className="mt-1 text-sm font-medium text-slate-700">
                Not connected on this view
              </p>
            </div>
            <div className="rounded-xl bg-white px-3 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <ClipboardCheck className="h-3.5 w-3.5" />
                Attendance
              </div>
              <p className="mt-1 text-sm font-medium text-slate-700">
                Managed in batch workspace
              </p>
            </div>
            <div className="rounded-xl bg-white px-3 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Award className="h-3.5 w-3.5" />
                Certificates
              </div>
              <p className="mt-1 text-sm font-medium text-slate-700">
                Not configured here
              </p>
            </div>
          </div>
        </div>
      </div>
    </m.article>
  );
}

function BatchListRow({
  item,
  index,
}: {
  item: TrainingBatchListItem;
  index: number;
}) {
  const { batch, capacity } = item;
  const primaryShift = batch.shifts?.[0];

  return (
    <m.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.24 }}
      className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_32px_rgba(15,23,42,0.07)] sm:px-5"
    >
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[2.2fr_1.1fr_1fr_auto] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/training/batches/${batch.id}`}
              className="truncate text-[15px] font-semibold text-slate-900 hover:text-blue-700"
            >
              {batch.name_en}
            </Link>
            <StatusBadge status={batch.status} />
          </div>
          <p className="mt-1 truncate text-[13px] text-slate-500">
            {batch.course?.name ?? "Course not linked"}
            {batch.session ? ` • Session ${batch.session}` : ""}
            {primaryShift?.name_en ? ` • ${primaryShift.name_en}` : ""}
          </p>
        </div>

        <div className="text-[13px] text-slate-500">
          <p className="font-medium text-slate-700">{formatDate(batch.start_date)}</p>
          <p>{formatDate(batch.end_date)}</p>
        </div>

        <div className="text-[13px] text-slate-500">
          <p className="font-medium text-slate-700">
            {capacity ? `${capacity.occupied}/${capacity.effective_batch_capacity}` : "N/A"}
          </p>
          <p>
            {capacity ? `${capacity.available} seats available` : "Capacity unavailable"}
          </p>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" size="sm" asChild className="border-[#E5E7EB]">
            <Link href={`/admin/training/batches/${batch.id}`}>Open</Link>
          </Button>
          <ActionMenu batchId={batch.id} />
        </div>
      </div>
    </m.article>
  );
}

function EmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Layers3 className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-slate-900">
        {hasFilters ? "No matching batches found" : "No training batches yet"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try adjusting the search or filters to reveal more training batches."
          : "Create your first batch to manage sessions, capacity, schedules, labs, and students from one place."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-xl bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/training/batches/new">
            <Plus className="mr-2 h-4 w-4" />
            New Batch
          </Link>
        </Button>
        {hasFilters && (
          <Button
            variant="outline"
            className="rounded-xl border-[#E5E7EB]"
            onClick={onReset}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

export function TrainingBatchesDashboard({
  items,
}: {
  items: TrainingBatchListItem[];
}) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState<CapacityMode>("all");
  const [sortBy, setSortBy] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const metrics = useMemo(() => {
    const total = items.length;
    const running = items.filter(({ batch }) =>
      ["open", "full", "ongoing"].includes(batch.status)
    ).length;
    const completed = items.filter(
      ({ batch }) => batch.status === "completed"
    ).length;
    const students = items.reduce(
      (sum, { capacity }) => sum + (capacity?.occupied ?? 0),
      0
    );
    const totalUtilization = items.reduce(
      (sum, { capacity }) => sum + (capacity?.utilization_percent ?? 0),
      0
    );
    const capacitySamples = items.filter(({ capacity }) => capacity).length;
    const avgUtilization =
      capacitySamples === 0 ? 0 : Math.round(totalUtilization / capacitySamples);
    const waitlist = items.filter(({ batch }) => batch.waitlist_enabled).length;

    return {
      total,
      running,
      completed,
      students,
      avgUtilization,
      waitlist,
    };
  }, [items]);

  const courseOptions = useMemo(
    () =>
      Array.from(
        new Set(items.map(({ batch }) => batch.course?.name).filter(Boolean))
      ) as string[],
    [items]
  );

  const sessionOptions = useMemo(
    () =>
      Array.from(
        new Set(items.map(({ batch }) => batch.session).filter(Boolean))
      ) as string[],
    [items]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const nextItems = items.filter(({ batch, capacity }) => {
      const searchable = [
        batch.name_en,
        batch.name_bn ?? "",
        batch.course?.name ?? "",
        batch.course?.name_bn ?? "",
        batch.session ?? "",
        batch.room ?? "",
        ...batch.shifts.map((shift) => shift.name_en),
        ...batch.shifts.map((shift) => shift.lab?.name ?? ""),
        ...batch.shifts.map((shift) => shift.lab?.code ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" || batch.status === statusFilter;
      const matchesCourse =
        courseFilter === "all" || batch.course?.name === courseFilter;
      const matchesSession =
        sessionFilter === "all" || batch.session === sessionFilter;

      const utilization = capacity?.utilization_percent ?? -1;
      const matchesCapacity =
        capacityFilter === "all" ||
        (capacityFilter === "full" && capacity?.is_full === true) ||
        (capacityFilter === "available" && (capacity?.available ?? 0) > 0) ||
        (capacityFilter === "nearly-full" &&
          utilization >= 80 &&
          capacity?.is_full !== true) ||
        (capacityFilter === "unavailable" && !capacity);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse &&
        matchesSession &&
        matchesCapacity
      );
    });

    return [...nextItems].sort((left, right) => {
      if (sortBy === "name") {
        return left.batch.name_en.localeCompare(right.batch.name_en);
      }

      if (sortBy === "status") {
        return left.batch.status.localeCompare(right.batch.status);
      }

      if (sortBy === "utilization") {
        return (
          (right.capacity?.utilization_percent ?? -1) -
          (left.capacity?.utilization_percent ?? -1)
        );
      }

      if (sortBy === "available") {
        return (right.capacity?.available ?? -1) - (left.capacity?.available ?? -1);
      }

      const leftTime = new Date(left.batch.created_at).getTime();
      const rightTime = new Date(right.batch.created_at).getTime();

      if (sortBy === "oldest") {
        return leftTime - rightTime;
      }

      return rightTime - leftTime;
    });
  }, [
    capacityFilter,
    courseFilter,
    items,
    searchQuery,
    sessionFilter,
    sortBy,
    statusFilter,
  ]);

  const hasFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    courseFilter !== "all" ||
    sessionFilter !== "all" ||
    capacityFilter !== "all";

  function resetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setCourseFilter("all");
    setSessionFilter("all");
    setCapacityFilter("all");
    setSortBy("newest");
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-full bg-[#F7F8FA]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 sm:p-6 xl:p-8">
          <section className="overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_rgba(15,23,42,0.06)]">
            <div className="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_50%)] lg:block" />
              <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[12px] font-medium text-blue-700">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Training operations
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-[32px] font-bold tracking-tight text-slate-950">
                      Training Batches
                    </h1>
                    <p className="max-w-2xl text-[15px] leading-7 text-slate-500">
                      Manage all training sessions, capacity, schedules, labs,
                      students, and operational status from one premium workspace.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SoftMetaChip
                      icon={Layers3}
                      label={`${metrics.total} total batches`}
                    />
                    <SoftMetaChip
                      icon={CheckCircle2}
                      label={`${metrics.running} running now`}
                      tone="success"
                    />
                    <SoftMetaChip
                      icon={Users}
                      label={`${metrics.students} occupied seats`}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[470px]">
                  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                    <Button
                      asChild
                      className="rounded-xl bg-blue-600 px-4 text-white shadow-sm hover:bg-blue-700"
                    >
                      <Link href="/admin/training/batches/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Batch
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl border-[#E5E7EB] bg-white"
                      disabled
                      title="Import is not wired for this route yet."
                    >
                      <Import className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl border-[#E5E7EB] bg-white"
                      onClick={() => downloadCsv(filteredItems)}
                      disabled={filteredItems.length === 0}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl border-[#E5E7EB] bg-white"
                      onClick={() => router.refresh()}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </div>

                  <div className="relative xl:ml-auto xl:w-[360px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by batch, course, session, shift, or lab"
                      aria-label="Search training batches"
                      className="h-11 rounded-xl border-[#E5E7EB] bg-white pl-9 text-sm shadow-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-label="Training batch metrics"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
            <MetricCard
              title="Total batches"
              value={metrics.total.toLocaleString()}
              subtitle={`${formatRelativeShare(metrics.running, Math.max(metrics.total, 1))} currently active`}
              icon={Layers3}
              accent="bg-blue-600"
            />
            <MetricCard
              title="Running"
              value={metrics.running.toLocaleString()}
              subtitle={`${formatRelativeShare(metrics.running, Math.max(metrics.total, 1))} of all batches`}
              icon={CheckCircle2}
              accent="bg-emerald-500"
            />
            <MetricCard
              title="Completed"
              value={metrics.completed.toLocaleString()}
              subtitle={`${formatRelativeShare(metrics.completed, Math.max(metrics.total, 1))} completed lifecycle`}
              icon={Award}
              accent="bg-violet-500"
            />
            <MetricCard
              title="Students"
              value={metrics.students.toLocaleString()}
              subtitle="Current occupied seats"
              icon={Users}
              accent="bg-amber-500"
            />
            <MetricCard
              title="Avg capacity"
              value={`${metrics.avgUtilization}%`}
              subtitle={`${metrics.waitlist} batch(es) with waitlist`}
              icon={ClipboardCheck}
              accent="bg-slate-900"
            />
          </section>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-[20px] font-semibold text-slate-950">
                      Batch directory
                    </h2>
                    <p className="mt-1 text-[13px] text-slate-500">
                      Explore and manage batches with fast search, focused filters,
                      and action-driven workflows.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start rounded-xl bg-slate-50 p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "rounded-lg",
                        viewMode === "grid" && "bg-slate-900 text-white hover:bg-slate-800"
                      )}
                      onClick={() => setViewMode("grid")}
                      aria-pressed={viewMode === "grid"}
                    >
                      <Grid2X2 className="mr-1.5 h-4 w-4" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "rounded-lg",
                        viewMode === "list" && "bg-slate-900 text-white hover:bg-slate-800"
                      )}
                      onClick={() => setViewMode("list")}
                      aria-pressed={viewMode === "list"}
                    >
                      <LayoutList className="mr-1.5 h-4 w-4" />
                      List
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                  <div className="relative lg:col-span-4">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search batches"
                      aria-label="Search batches"
                      className="h-10 rounded-xl border-[#E5E7EB] bg-white pl-9 shadow-sm"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-10 w-full rounded-xl border-[#E5E7EB] bg-white shadow-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E7EB]">
                        <SelectItem value="all">All statuses</SelectItem>
                        {Object.entries(STATUS_META).map(([value, meta]) => (
                          <SelectItem key={value} value={value}>
                            {meta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-2">
                    <Select value={courseFilter} onValueChange={setCourseFilter}>
                      <SelectTrigger className="h-10 w-full rounded-xl border-[#E5E7EB] bg-white shadow-sm">
                        <SelectValue placeholder="Course" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E7EB]">
                        <SelectItem value="all">All courses</SelectItem>
                        {courseOptions.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-2">
                    <Select value={sessionFilter} onValueChange={setSessionFilter}>
                      <SelectTrigger className="h-10 w-full rounded-xl border-[#E5E7EB] bg-white shadow-sm">
                        <SelectValue placeholder="Session" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E7EB]">
                        <SelectItem value="all">All sessions</SelectItem>
                        {sessionOptions.map((session) => (
                          <SelectItem key={session} value={session}>
                            {session}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-2">
                    <Select
                      value={capacityFilter}
                      onValueChange={(value) =>
                        setCapacityFilter(value as CapacityMode)
                      }
                    >
                      <SelectTrigger className="h-10 w-full rounded-xl border-[#E5E7EB] bg-white shadow-sm">
                        <SelectValue placeholder="Capacity" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E7EB]">
                        <SelectItem value="all">All capacity</SelectItem>
                        <SelectItem value="available">Seats available</SelectItem>
                        <SelectItem value="nearly-full">Nearly full</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                      <Filter className="h-3.5 w-3.5" />
                      {filteredItems.length} result(s)
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                      <ClipboardCheck className="h-3.5 w-3.5" />
                      Client-side search and sort
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                      <UsersRound className="h-3.5 w-3.5" />
                      Instructor filter unavailable in current dataset
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as SortMode)}
                    >
                      <SelectTrigger className="h-10 w-[170px] rounded-xl border-[#E5E7EB] bg-white shadow-sm">
                        <ArrowDownUp className="mr-1 h-4 w-4 text-slate-400" />
                        <SelectValue placeholder="Sort" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E7EB]">
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="name">Batch name</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="utilization">Utilization</SelectItem>
                        <SelectItem value="available">Available seats</SelectItem>
                      </SelectContent>
                    </Select>
                    {hasFilters && (
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl border-[#E5E7EB]"
                        onClick={resetFilters}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {filteredItems.length === 0 ? (
                <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
              ) : (
                <div className="space-y-4">
                  {viewMode === "grid" ? (
                    filteredItems.map((item, index) => (
                      <BatchGridCard
                        key={item.batch.id}
                        item={item}
                        index={index}
                      />
                    ))
                  ) : (
                    filteredItems.map((item, index) => (
                      <BatchListRow
                        key={item.batch.id}
                        item={item}
                        index={index}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </LazyMotion>
  );
}
