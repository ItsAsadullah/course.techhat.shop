"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Search,
  Plus,
  Wallet,
  Users,
  UserCheck,
  UserMinus,
  Filter,
  FileText,
  CreditCard,
  Banknote,
  Smartphone
} from "lucide-react";
import { m, LazyMotion, domAnimation } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePayment } from "@/lib/admin/actions/payments";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types/admin";

interface Metrics {
  totalEnrollments: number;
  totalPaidStudents: number;
  totalDueStudents: number;
}

interface PaymentsDashboardProps {
  payments: Payment[];
  metrics: Metrics;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  colorTone,
  iconBg,
  delay
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  colorTone: string;
  iconBg: string;
  delay: number;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
    >
      <div className={cn("absolute inset-x-0 top-0 h-1.5 opacity-90", accent)} />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5">
          <p className="text-[14px] font-medium text-slate-500 tracking-tight">{title}</p>
          <div className={cn("text-4xl font-bold tracking-tight", colorTone)}>
            {value}
          </div>
          <p className="text-xs text-slate-500 font-medium line-clamp-1">{subtitle}</p>
        </div>
        <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", iconBg)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </m.div>
  );
}

export function PaymentsDashboard({ payments, metrics }: PaymentsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState("All");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        searchQuery === "" ||
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.student?.phone?.includes(searchQuery) ||
        payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMethod =
        filterMethod === "All" || payment.payment_method === filterMethod;

      return matchesSearch && matchesMethod;
    });
  }, [payments, searchQuery, filterMethod]);

  const methodIcon = (method: string) => {
    if (method.includes("Cash")) return <Banknote className="h-3.5 w-3.5 mr-1" />;
    if (method.includes("Card")) return <CreditCard className="h-3.5 w-3.5 mr-1" />;
    if (method.includes("Mobile")) return <Smartphone className="h-3.5 w-3.5 mr-1" />;
    return <Wallet className="h-3.5 w-3.5 mr-1" />;
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments</h1>
            <p className="text-slate-500 mt-1">Track and manage all transactions</p>
          </div>
          <Button asChild className="rounded-xl shadow-sm bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/payments/new">
              <Plus className="h-4 w-4 mr-2" />
              Receive Payment
            </Link>
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            title="Total Enrolled"
            value={metrics.totalEnrollments}
            subtitle="Active students in courses"
            icon={Users}
            accent="bg-blue-500"
            colorTone="text-slate-900"
            iconBg="bg-blue-50 text-blue-600"
            delay={0.1}
          />
          <MetricCard
            title="Fully Paid"
            value={metrics.totalPaidStudents}
            subtitle="Students with 0 due"
            icon={UserCheck}
            accent="bg-emerald-500"
            colorTone="text-emerald-700"
            iconBg="bg-emerald-50 text-emerald-600"
            delay={0.2}
          />
          <MetricCard
            title="Payment Due"
            value={metrics.totalDueStudents}
            subtitle="Students with pending fees"
            icon={UserMinus}
            accent="bg-rose-500"
            colorTone="text-rose-700"
            iconBg="bg-rose-50 text-rose-600"
            delay={0.3}
          />
        </div>

        {/* Filters and Search */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by student, phone, or receipt ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 rounded-xl border-slate-200 bg-white shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="h-11 pl-9 pr-8 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="All">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Mobile Banking">Mobile Banking</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
        </m.div>

        {/* Payments Table */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 font-semibold text-slate-600">Receipt #</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-600">Date</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-600">Student</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-600">Course</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-600">Method</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-600">Remarks</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-600 text-right">Amount</TableHead>
                  <TableHead className="py-4 font-semibold text-slate-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FileText className="h-12 w-12 mb-3 text-slate-300" />
                        <p className="text-base font-medium text-slate-600">No payments found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-mono text-xs font-medium text-slate-500">
                        {payment.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-700">
                        {format(new Date(payment.payment_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{payment.student?.name || "N/A"}</p>
                          {payment.student?.phone && (
                            <p className="text-xs text-slate-500">{payment.student.phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                          {(() => {
                            const translations = (payment.enrollment as any)?.course?.course_translations || [];
                            return translations.find((item: any) => item.lang === "en")?.name || translations.find((item: any) => item.lang === "bn")?.name || "Unassigned";
                          })()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center text-sm font-medium text-slate-600">
                          {methodIcon(payment.payment_method)}
                          {payment.payment_method}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        <span className="line-clamp-1 max-w-[150px]">{payment.remarks || "-"}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-end rounded-xl bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">
                          ৳{Number(payment.amount).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Link href={`/admin/payments/receipt/${payment.id}`}>Receipt</Link>
                          </Button>
                          <DeleteButton
                            id={payment.id}
                            action={deletePayment}
                            label=""
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
