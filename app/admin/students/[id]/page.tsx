import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Banknote,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  IdCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Printer,
  ReceiptText,
  ShieldCheck,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  getStudentById,
  deleteStudent,
} from "@/lib/admin/actions/students";

import { DeleteButton } from "@/components/admin/delete-button";

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

type Tone =
  | "blue"
  | "green"
  | "red"
  | "amber"
  | "purple"
  | "slate";

function formatMoney(value?: number | null) {
  return (value ?? 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(
  date?: string | null,
  includeTime = false,
) {
  if (!date) {
    return "—";
  }

  try {
    return format(
      new Date(date),
      includeTime
        ? "dd MMM yyyy, hh:mm a"
        : "dd MMM yyyy",
    );
  } catch {
    return "—";
  }
}

function displayValue(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return String(value);
}

function titleCase(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getInitials(name?: string | null) {
  if (!name) {
    return "ST";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""
    }`.toUpperCase();
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
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-950">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {action ? (
        <div className="shrink-0">{action}</div>
      ) : null}
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
  const hasValue =
    value !== null &&
    value !== undefined &&
    value !== "";

  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div
        className={[
          "mt-1.5 min-w-0 break-words text-sm font-medium",
          hasValue
            ? "text-slate-800"
            : "text-slate-400",
          mono ? "font-mono" : "",
          valueClassName,
        ].join(" ")}
      >
        {hasValue ? value : "—"}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon,
  tone = "slate",
}: {
  label: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  tone?: Tone;
}) {
  const toneClasses: Record<
    Tone,
    {
      icon: string;
      value: string;
    }
  > = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      value: "text-blue-700",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-600",
      value: "text-emerald-700",
    },
    red: {
      icon: "bg-rose-50 text-rose-600",
      value: "text-rose-700",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      value: "text-amber-700",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600",
      value: "text-purple-700",
    },
    slate: {
      icon: "bg-slate-100 text-slate-600",
      value: "text-slate-950",
    },
  };

  return (
    <div className="flex min-w-0 items-center gap-4 px-5 py-5 sm:px-6">
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          toneClasses[tone].icon,
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={[
            "mt-1 truncate font-mono text-xl font-bold tracking-tight",
            toneClasses[tone].value,
          ].join(" ")}
        >
          {value}
        </p>

        {description ? (
          <p className="mt-1 truncate text-[11px] text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ProgressBar({
  value,
}: {
  value: number;
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, value),
  );

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all"
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;

  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  const rawStudent = student.raw_data as any;

  const documents =
    rawStudent?.student_documents ?? [];

  const addresses =
    rawStudent?.student_addresses ?? [];

  const educationList =
    rawStudent?.student_education ?? [];

  const guardiansList =
    rawStudent?.guardians ?? [];

  const payments = student.payments ?? [];
  const enrollments = student.enrollments ?? [];
  const activeEnrollment = enrollments.find((e: any) => e.status === "active") || enrollments[0];

  const photoDocument = documents.find(
    (document: any) =>
      document.document_type === "photo",
  );

  const photoUrl = photoDocument?.file_url;

  const presentAddress = addresses.find(
    (address: any) =>
      address.address_type === "present",
  );

  const permanentAddress = addresses.find(
    (address: any) =>
      address.address_type === "permanent",
  );

  const totalCourseFee =
    Number(student.total_course_fee ?? 0);

  const totalPaid =
    Number(student.total_paid ?? 0);

  const currentDue =
    Number(student.current_due ?? 0);

  const isDue = currentDue > 0;

  const paymentProgress =
    totalCourseFee > 0
      ? Math.min(
        100,
        Math.max(
          0,
          (totalPaid / totalCourseFee) * 100,
        ),
      )
      : 0;

  const studentCode =
    student.student_code ||
    rawStudent?.admission_no ||
    `STU-${id.slice(0, 8).toUpperCase()}`;

  const primaryMobile =
    rawStudent?.mobile ||
    student.phone ||
    "";

  const primaryEmail =
    rawStudent?.email || "";

  const courseName =
    enrollments.length > 0
      ? `${enrollments.length} course${enrollments.length === 1 ? "" : "s"} assigned`
      : "No course assigned";

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-12">
      {/* Profile Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-32 overflow-hidden" style={{ background: "var(--admin-sidebar-bg, linear-gradient(to right, #2563eb, #4f46e5, #9333ea))" }}>
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute left-1/3 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="absolute left-4 top-4 h-9 gap-2 text-slate-300 hover:bg-white/10 hover:text-white sm:left-6"
          >
            <Link href="/admin/students">
              <ArrowLeft className="h-4 w-4" />
              Students
            </Link>
          </Button>

          <div className="absolute right-5 top-5 hidden items-center gap-2 sm:flex">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/10 text-white"
            >
              Student 360° Profile
            </Badge>
          </div>
        </div>

        <div className="relative px-5 pb-6 sm:px-8">
          <div className="-mt-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between sm:-mt-20">
            <div className="flex min-w-0 flex-col items-center gap-5 sm:flex-row sm:items-stretch">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-lg sm:h-32 sm:w-32">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={student.name || "Student"}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <span className="text-3xl font-bold text-slate-400">
                    {getInitials(student.name)}
                  </span>
                )}

                <div className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="min-w-0 flex w-full flex-col justify-between pb-1 text-center sm:text-left sm:pt-2">
                <div>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl sm:text-white sm:drop-shadow-sm">
                      {student.name}
                    </h1>

                    <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 sm:border-0 sm:bg-white/20 sm:text-white sm:shadow-sm sm:backdrop-blur-md sm:hover:bg-white/30">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  </div>

                  {rawStudent?.full_name_bn ? (
                    <p className="mt-1 text-base font-medium text-slate-500 sm:text-white/90 sm:drop-shadow-sm">
                      {rawStudent.full_name_bn}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500 sm:mt-auto sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 font-mono font-medium text-slate-700">
                    <IdCard className="h-3.5 w-3.5" />
                    {studentCode}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {courseName}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Admitted{" "}
                    {formatDate(student.admission_date)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
              <Button
                variant="outline"
                asChild
                className="gap-2"
              >
                <Link
                  href={`/admin/students/${id}/edit`}
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>

              <Button
                asChild
                className="gap-2 bg-blue-600 shadow-sm hover:bg-blue-700"
              >
                <Link
                  href={`/admin/students/${id}/enrollments/new`}
                >
                  <GraduationCap className="h-4 w-4" />
                  Assign Course
                </Link>
              </Button>

              <DeleteButton
                id={id}
                action={deleteStudent}
                redirectTo="/admin/students"
              />
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid border-t border-slate-100 bg-slate-50/50 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border-b border-slate-100 sm:border-r xl:border-b-0">
            <MetricCard
              label="Total Enrollment Fees"
              value={`৳${formatMoney(totalCourseFee)}`}
              description={`${enrollments.length} enrollment${enrollments.length === 1 ? "" : "s"}`}
              icon={<CircleDollarSign className="h-5 w-5" />}
              tone="blue"
            />
          </div>

          <div className="border-b border-slate-100 xl:border-b-0 xl:border-r">
            <MetricCard
              label="Total Paid"
              value={`৳${formatMoney(totalPaid)}`}
              description={`${paymentProgress.toFixed(
                1,
              )}% fee collected`}
              icon={<WalletCards className="h-5 w-5" />}
              tone="green"
            />
          </div>

          <div className="border-b border-slate-100 sm:border-b-0 sm:border-r">
            <MetricCard
              label="Current Due"
              value={`৳${formatMoney(currentDue)}`}
              description={
                isDue
                  ? "Outstanding balance"
                  : "No outstanding balance"
              }
              icon={<AlertCircle className="h-5 w-5" />}
              tone={isDue ? "red" : "green"}
            />
          </div>

          <MetricCard
            label="Payment Progress"
            value={`${paymentProgress.toFixed(1)}%`}
            description={`${enrollments.filter((enrollment: any) => enrollment.status === "active").length} active course${enrollments.filter((enrollment: any) => enrollment.status === "active").length === 1 ? "" : "s"}`}
            icon={<Activity className="h-5 w-5" />}
            tone="purple"
          />
        </div>
      </section>

      {/* Main CRM Workspace */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* Main Student Record */}
        <main className="space-y-6">
          {/* Admission Overview */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<FileCheck2 className="h-4 w-4" />}
              title="Admission overview"
              description="Student admission and institutional record."
              action={
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  Admission Record
                </Badge>
              }
            />

            <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              <DataField
                label="Student ID"
                value={studentCode}
                mono
              />

              <DataField
                label="Admission Date"
                value={formatDate(
                  student.admission_date,
                )}
              />

              <DataField
                label="Enrolled Course"
                value={courseName}
                valueClassName="text-blue-700"
              />

              <DataField
                label="Admission Status"
                value={
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    Active
                  </Badge>
                }
              />

              <DataField
                label="Student Type"
                value={titleCase(
                  activeEnrollment?.course?.course_type ||
                  rawStudent?.student_type,
                )}
              />

              <DataField
                label="Admission Session"
                value={
                  activeEnrollment?.batch?.session ||
                  rawStudent?.admission_session ||
                  rawStudent?.session ||
                  "—"
                }
              />

              <DataField
                label="Batch"
                value={
                  activeEnrollment?.batch_name ||
                  rawStudent?.batch_name ||
                  rawStudent?.batch ||
                  "—"
                }
              />

              <DataField
                label="Shift"
                value={titleCase(
                  activeEnrollment?.shift?.name_en ||
                  rawStudent?.shift
                )}
              />

              <DataField
                label="Registration No."
                value={
                  activeEnrollment?.enrollment_code ||
                  rawStudent?.registration_no || "—"
                }
                mono
              />
            </div>
          </section>

          {/* Personal Information */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<UserRound className="h-4 w-4" />}
              title="Personal information"
              description="Personal and identity information submitted during admission."
            />

            <div className="grid gap-x-8 gap-y-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              <DataField
                label="Full Name (English)"
                value={student.name}
              />

              <DataField
                label="Full Name (Bangla)"
                value={rawStudent?.full_name_bn}
              />

              <DataField
                label="Date of Birth"
                value={formatDate(rawStudent?.dob)}
              />

              <DataField
                label="Father's Name"
                value={rawStudent?.father_name}
              />

              <DataField
                label="Mother's Name"
                value={rawStudent?.mother_name}
              />

              <DataField
                label="Gender"
                value={titleCase(rawStudent?.gender)}
              />

              <DataField
                label="Religion"
                value={titleCase(rawStudent?.religion)}
              />

              <DataField
                label="Marital Status"
                value={titleCase(
                  rawStudent?.marital_status,
                )}
              />

              <DataField
                label="Nationality"
                value={rawStudent?.nationality}
              />

              <DataField
                label="Blood Group"
                value={
                  rawStudent?.blood_group ? (
                    <Badge
                      variant="outline"
                      className="border-red-200 bg-red-50 text-red-700"
                    >
                      <HeartPulse className="mr-1 h-3 w-3" />
                      {rawStudent.blood_group}
                    </Badge>
                  ) : (
                    "—"
                  )
                }
              />

              <DataField
                label="National ID"
                value={rawStudent?.nid}
                mono
              />

              <DataField
                label="Birth Certificate No."
                value={rawStudent?.birth_cert_no}
                mono
              />
            </div>
          </section>

          {/* Contact */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<Phone className="h-4 w-4" />}
              title="Contact information"
              description="Primary student and emergency contact details."
            />

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              <a
                href={
                  primaryMobile
                    ? `tel:${primaryMobile}`
                    : undefined
                }
                className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Phone className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Student Mobile
                    </p>

                    <p className="mt-1 truncate font-mono text-sm font-semibold text-slate-800">
                      {displayValue(primaryMobile)}
                    </p>
                  </div>
                </div>
              </a>

              <a
                href={
                  primaryEmail
                    ? `mailto:${primaryEmail}`
                    : undefined
                }
                className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Mail className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email Address
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                      {displayValue(primaryEmail)}
                    </p>
                  </div>
                </div>
              </a>

              <a
                href={
                  rawStudent?.guardian_mobile
                    ? `tel:${rawStudent.guardian_mobile}`
                    : undefined
                }
                className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <UsersRound className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Guardian Mobile
                    </p>

                    <p className="mt-1 truncate font-mono text-sm font-semibold text-slate-800">
                      {displayValue(
                        rawStudent?.guardian_mobile,
                      )}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* Address Information */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<MapPin className="h-4 w-4" />}
              title="Address information"
              description="Present and permanent address from the admission record."
            />
            {addresses.length > 0 ? (
              <div className="p-5 sm:p-6">
                {[
                  {
                    title: "Present Address",
                    address: presentAddress,
                    icon: (
                      <MapPin className="h-4 w-4" />
                    ),
                  }
                ].map((item) => (
                  <div
                    key={item.title}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                        {item.icon}
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </h3>
                    </div>

                    <div className="grid gap-5 p-4 sm:grid-cols-2">
                      <DataField
                        label="Village / Road / Area"
                        value={
                          item.address?.village ||
                          item.address?.village_road ||
                          item.address?.address_line
                        }
                      />

                      <DataField
                        label="Post Office"
                        value={
                          item.address?.post_office
                        }
                      />

                      <DataField
                        label="Postcode"
                        value={item.address?.post_code}
                        mono
                      />

                      <DataField
                        label="Union / Municipality"
                        value={
                          item.address
                            ?.union_municipality
                        }
                      />

                      <DataField
                        label="Upazila"
                        value={item.address?.upazila}
                      />

                      <DataField
                        label="District"
                        value={item.address?.district}
                      />

                      <DataField
                        label="Division"
                        value={item.address?.division}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MapPin className="h-6 w-6" />}
                title="No address information"
                description="No structured address record was found for this student."
              />
            )}
          </section>

          {/* Guardian Information */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<UsersRound className="h-4 w-4" />}
              title="Guardian information"
              description="Parent, guardian and emergency contact records."
              action={
                guardiansList.length > 0 ? (
                  <Badge variant="outline">
                    {guardiansList.length} Record
                    {guardiansList.length > 1
                      ? "s"
                      : ""}
                  </Badge>
                ) : null
              }
            />

            {guardiansList.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {guardiansList.map(
                  (guardian: any, index: number) => (
                    <div
                      key={
                        guardian.id ??
                        `${guardian.name}-${index}`
                      }
                      className="p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-950">
                              {displayValue(
                                guardian.name,
                              )}
                            </h3>

                            {guardian.guardian_type ? (
                              <Badge
                                variant="outline"
                                className="border-teal-200 bg-teal-50 text-teal-700"
                              >
                                {titleCase(
                                  guardian.guardian_type,
                                )}
                              </Badge>
                            ) : null}
                          </div>

                          <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                            <DataField
                              label="Relationship"
                              value={titleCase(
                                guardian.relationship,
                              )}
                            />

                            <DataField
                              label="Mobile"
                              value={
                                guardian.mobile ? (
                                  <a
                                    href={`tel:${guardian.mobile}`}
                                    className="inline-flex items-center gap-1.5 hover:text-blue-600"
                                  >
                                    <Phone className="h-3.5 w-3.5 text-slate-400" />

                                    <span className="font-mono">
                                      {guardian.mobile}
                                    </span>
                                  </a>
                                ) : (
                                  "—"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptyState
                icon={
                  <UsersRound className="h-6 w-6" />
                }
                title="No guardian record"
                description="Guardian information has not been added to this student profile."
              />
            )}
          </section>

          {/* Educational Qualification */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<GraduationCap className="h-4 w-4" />}
              title="Educational qualifications"
              description="Academic history submitted during admission."
              action={
                educationList.length > 0 ? (
                  <Badge variant="outline">
                    {educationList.length} Qualification
                    {educationList.length > 1
                      ? "s"
                      : ""}
                  </Badge>
                ) : null
              }
            />

            {educationList.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {educationList.map(
                  (education: any, index: number) => (
                    <div
                      key={
                        education.id ??
                        `${education.exam_name}-${index}`
                      }
                      className="p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                          <BookOpen className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold text-slate-950">
                                {displayValue(
                                  education.exam_name,
                                )}
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                {displayValue(
                                  education.board,
                                )}
                              </p>
                            </div>

                            {education.passing_year ? (
                              <Badge
                                variant="outline"
                                className="border-purple-200 bg-purple-50 text-purple-700"
                              >
                                Passing Year:{" "}
                                {education.passing_year}
                              </Badge>
                            ) : null}
                          </div>

                          <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                            <DataField
                              label="Group / Subject"
                              value={
                                education.group_subject
                              }
                            />

                            <DataField
                              label="Result"
                              value={
                                education.result_value
                                  ? `${education.result_value}${education.result_type
                                    ? ` (${education.result_type})`
                                    : ""
                                  }`
                                  : "—"
                              }
                            />

                            <DataField
                              label="Roll Number"
                              value={education.roll_no}
                              mono
                            />

                            <DataField
                              label="Registration No."
                              value={
                                education.registration_no
                              }
                              mono
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptyState
                icon={
                  <GraduationCap className="h-6 w-6" />
                }
                title="No educational qualification"
                description="No academic qualification record was found for this student."
              />
            )}
          </section>

          {/* Documents */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<FileText className="h-4 w-4" />}
              title="Student documents"
              description="Admission documents and uploaded files."
              action={
                documents.length > 0 ? (
                  <Badge variant="outline">
                    {documents.length} File
                    {documents.length > 1 ? "s" : ""}
                  </Badge>
                ) : null
              }
            />

            {documents.length > 0 ? (
              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                {documents.map(
                  (document: any, index: number) => (
                    <a
                      key={
                        document.id ??
                        `${document.document_type}-${index}`
                      }
                      href={document.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600">
                        <FileText className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {titleCase(
                            document.document_type,
                          )}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          View document
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                    </a>
                  ),
                )}
              </div>
            ) : (
              <EmptyState
                icon={<FileText className="h-6 w-6" />}
                title="No documents uploaded"
                description="Admission documents have not been uploaded for this student."
              />
            )}
          </section>
        </main>

        {/* ERP Right Sidebar */}
        <aside className="space-y-6">
          {/* Financial Account */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-6">
            <SectionHeader
              icon={<WalletCards className="h-4 w-4" />}
              title="Financial account"
              description="Student fee and payment position."
              action={
                isDue ? (
                  <Badge
                    variant="outline"
                    className="border-rose-200 bg-rose-50 text-rose-700"
                  >
                    Due
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    Paid
                  </Badge>
                )
              }
            />

            <div className="p-5 sm:p-6">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Outstanding Balance
                    </p>

                    <p
                      className={[
                        "mt-2 font-mono text-3xl font-bold tracking-tight",
                        isDue
                          ? "text-rose-300"
                          : "text-emerald-300",
                      ].join(" ")}
                    >
                      ৳{formatMoney(currentDue)}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <Banknote className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Payment progress
                    </span>

                    <span className="font-mono font-semibold text-white">
                      {paymentProgress.toFixed(1)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{
                        width: `${paymentProgress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Course Fee
                  </span>

                  <span className="font-mono text-sm font-semibold text-slate-900">
                    ৳{formatMoney(totalCourseFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Total Paid
                  </span>

                  <span className="font-mono text-sm font-semibold text-emerald-600">
                    ৳{formatMoney(totalPaid)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-800">
                      Current Due
                    </span>

                    <span
                      className={[
                        "font-mono text-base font-bold",
                        isDue
                          ? "text-rose-600"
                          : "text-emerald-600",
                      ].join(" ")}
                    >
                      ৳{formatMoney(currentDue)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="mt-6 w-full gap-2 bg-blue-600 shadow-sm hover:bg-blue-700"
              >
                <Link
                  href={`/admin/payments/new?student_id=${id}`}
                >
                  <CreditCard className="h-4 w-4" />
                  Receive Payment
                </Link>
              </Button>
            </div>
          </section>

          {/* Enrollment */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<GraduationCap className="h-4 w-4" />}
              title="Course enrollments"
              description="Authoritative course access and fee positions."
              action={<Button size="sm" asChild className="gap-2 bg-blue-600 hover:bg-blue-700"><Link href={`/admin/students/${id}/enrollments/new`}><GraduationCap className="h-4 w-4" />Assign Course</Link></Button>}
            />

            <div className="p-5 sm:p-6">
              {enrollments.length > 0 ? <div className="space-y-3">{enrollments.map((enrollment: any) => <div key={enrollment.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-bold text-slate-950">{enrollment.course_name}</p><p className="mt-1 text-xs text-slate-500">{enrollment.batch_name || "No batch"} · {titleCase(enrollment.status)}</p></div><Badge variant="outline" className="capitalize">{enrollment.status}</Badge></div><div className="mt-3 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs"><span className="text-slate-500">Final fee <strong className="block font-mono text-slate-900">৳{formatMoney(enrollment.final_fee)}</strong></span><span className="text-slate-500">Paid <strong className="block font-mono text-emerald-700">৳{formatMoney(enrollment.total_paid)}</strong></span><span className="text-slate-500">Due <strong className="block font-mono text-rose-700">৳{formatMoney(enrollment.current_due)}</strong></span></div><div className="mt-3 flex justify-end"><Button size="sm" variant="outline" asChild><Link href={`/admin/payments/new?student_id=${id}&enrollment_id=${enrollment.id}`}>Receive Payment</Link></Button></div></div>)}</div> : <div className="rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">No course has been assigned yet.</div>}
            </div>
          </section>

          {/* Payment History */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<ReceiptText className="h-4 w-4" />}
              title="Payment history"
              description={`${payments.length} recorded transaction${payments.length === 1 ? "" : "s"
                }`}
              action={
                payments.length > 0 ? (
                  <Badge variant="outline">
                    {payments.length}
                  </Badge>
                ) : null
              }
            />

            {payments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="group flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50/70"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <CreditCard className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-bold text-emerald-700">
                        ৳{formatMoney(payment.amount)}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                        <span>
                          {formatDate(
                            payment.payment_date,
                          )}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                        <span>
                          {titleCase(
                            payment.payment_method,
                          )}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-9 w-9 shrink-0 text-slate-400 hover:text-blue-600"
                    >
                      <Link
                        href={`/admin/payments/receipt/${payment.id}`}
                      >
                        <Printer className="h-4 w-4" />

                        <span className="sr-only">
                          Print receipt
                        </span>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={
                  <ReceiptText className="h-6 w-6" />
                }
                title="No payments yet"
                description="No payment transaction has been recorded for this student."
              />
            )}
          </section>

          {/* Account Status */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Student account"
              description="Profile and account status."
            />

            <div className="p-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Student Status
                  </span>

                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Fee Status
                  </span>

                  {isDue ? (
                    <Badge
                      variant="outline"
                      className="border-rose-200 bg-rose-50 text-rose-700"
                    >
                      Outstanding
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      Clear
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Admission Record
                  </span>

                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700"
                  >
                    Available
                  </Badge>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
