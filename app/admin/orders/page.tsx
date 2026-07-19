import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  RefreshCw,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAdminOrders,
  getOrderStats,
  type OrderStatus,
} from "@/lib/admin/actions/orders";
import { OrderApproveActions } from "@/components/admin/OrderApproveActions";

function formatMoney(minor: number) {
  return (minor / 100).toFixed(2);
}

type PageProps = {
  searchParams: Promise<{ status?: string; search?: string }>;
};

const STATUS_TABS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "সব অর্ডার", icon: <ShoppingCart className="h-3.5 w-3.5" /> },
  { key: "PENDING_MANUAL_REVIEW", label: "Pending Review", icon: <AlertCircle className="h-3.5 w-3.5" /> },
  { key: "PENDING_PAYMENT", label: "Awaiting Payment", icon: <Clock className="h-3.5 w-3.5" /> },
  { key: "PAID", label: "Approved", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { key: "REJECTED", label: "Rejected", icon: <XCircle className="h-3.5 w-3.5" /> },
];

function StatusBadge({ orderStatus, reviewStatus }: { orderStatus: string; reviewStatus?: string }) {
  if (reviewStatus === "PENDING" || orderStatus === "PENDING_MANUAL_REVIEW") {
    return (
      <Badge className="bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-900/50 gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-50 dark:bg-amber-900/100 inline-block animate-pulse" />
        Pending Review
      </Badge>
    );
  }
  if (orderStatus === "PAID" || reviewStatus === "APPROVED") {
    return (
      <Badge className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-900/50 gap-1.5">
        <CheckCircle2 className="h-3 w-3" />
        Approved
      </Badge>
    );
  }
  if (reviewStatus === "REJECTED") {
    return (
      <Badge className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-900/50 gap-1.5">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    );
  }
  if (orderStatus === "PENDING_PAYMENT") {
    return (
      <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 gap-1.5">
        <Clock className="h-3 w-3" />
        Awaiting Payment
      </Badge>
    );
  }
  return <Badge variant="outline">{orderStatus}</Badge>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeStatus = (params.status || "all") as OrderStatus;
  const search = (params.search || "").toLowerCase();

  const [orders, stats] = await Promise.all([
    getAdminOrders(activeStatus),
    getOrderStats(),
  ]);

  const filtered = search
    ? orders.filter((o) => {
        const name = (o.student?.full_name_en || "").toLowerCase();
        const mobile = (o.student?.mobile || "").toLowerCase();
        const trxId = (o.review?.trxId || "").toLowerCase();
        const orderNum = (o.orderNumber || "").toLowerCase();
        return (
          name.includes(search) ||
          mobile.includes(search) ||
          trxId.includes(search) ||
          orderNum.includes(search)
        );
      })
    : orders;

  const pendingReviewOrders = filtered.filter(
    (o) => o.review?.status === "PENDING" || o.orderStatus === "PENDING_MANUAL_REVIEW"
  );

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Orders & Enrollments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            স্টুডেন্টদের কোর্স অর্ডার ম্যানেজ করুন এবং পেমেন্ট অ্যাপ্রুভ করুন।
          </p>
        </div>
        <Button variant="outline" asChild size="sm" className="gap-2 self-start sm:self-auto">
          <Link href="/admin/orders">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <ShoppingCart className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">মোট অর্ডার</p>
              <p className="text-xl font-black text-slate-900 dark:text-slate-50">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-amber-700 dark:text-amber-500 font-medium">Pending Review</p>
              <p className="text-xl font-black text-amber-800 dark:text-amber-400">{stats.pendingReview}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-emerald-700 dark:text-emerald-500 font-medium">আজকের Revenue</p>
              <p className="text-xl font-black text-emerald-800 dark:text-emerald-400">৳{stats.todayRevenue}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Users className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">এই পেজে দেখাচ্ছে</p>
              <p className="text-xl font-black text-slate-900 dark:text-slate-50">{filtered.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Review Alert */}
      {pendingReviewOrders.length > 0 && activeStatus === "all" && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 p-4 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
          <p className="text-amber-800 dark:text-amber-400 font-medium">
            <strong>{pendingReviewOrders.length}টি</strong> পেমেন্ট রিভিউ অপেক্ষায় আছে।{" "}
            <Link href="/admin/orders?status=PENDING_MANUAL_REVIEW" className="underline font-bold">
              এখনই দেখুন →
            </Link>
          </p>
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.key;
            return (
              <Link
                key={tab.key}
                href={`/admin/orders?status=${tab.key}${search ? `&search=${search}` : ""}`}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <form className="sm:ml-auto" action="/admin/orders" method="get">
          {activeStatus !== "all" && <input type="hidden" name="status" value={activeStatus} />}
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="নাম / মোবাইল / TrxID খুঁজুন..."
            className="h-9 w-64 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50">
              <TableHead className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Order</TableHead>
              <TableHead className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">স্টুডেন্ট</TableHead>
              <TableHead className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">কোর্স</TableHead>
              <TableHead className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">পরিমাণ</TableHead>
              <TableHead className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">TrxID</TableHead>
              <TableHead className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Status</TableHead>
              <TableHead className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <ShoppingCart className="mx-auto h-10 w-10 text-slate-200 mb-3" />
                  <p className="text-sm font-medium text-slate-400">কোনো অর্ডার পাওয়া যায়নি।</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const hasPendingReview = order.review?.status === "PENDING";
                return (
                  <TableRow
                    key={order.id}
                    className={hasPendingReview ? "bg-amber-50 dark:bg-amber-900/10/40 hover:bg-amber-50 dark:bg-amber-900/10/60" : "hover:bg-slate-50/60"}
                  >
                    <TableCell>
                      <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
                        {order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="font-semibold text-slate-900 dark:text-slate-50 text-sm leading-tight">
                        {order.student?.full_name_en || "—"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {order.student?.mobile || order.student?.email || "—"}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium line-clamp-1 max-w-[160px]">
                        {(order.course as Record<string, unknown>)?.title as string || "—"}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="font-bold text-slate-900 dark:text-slate-50 text-sm">
                        ৳{formatMoney(order.session?.payableAmountMinor ?? order.totalMinor)}
                      </p>
                      {order.discountMinor > 0 && (
                        <p className="text-[10px] text-slate-400">
                          ছাড়: ৳{formatMoney(order.discountMinor)}
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      {order.review?.trxId ? (
                        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded px-2 py-0.5">
                          {order.review.trxId}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        orderStatus={order.orderStatus}
                        reviewStatus={order.review?.status}
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasPendingReview && (
                          <OrderApproveActions
                            reviewId={order.review!.id}
                            studentName={order.student?.full_name_en || "Student"}
                            trxId={order.review?.trxId}
                            amountStr={formatMoney(order.session?.payableAmountMinor ?? order.totalMinor)}
                          />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="h-8 text-xs gap-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:text-blue-400"
                        >
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            Details
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
