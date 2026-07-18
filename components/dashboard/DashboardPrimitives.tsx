"use client";

import Link from "next/link";
import {
  Award,
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  Clock3,
  CreditCard,
  FileQuestion,
  FolderKanban,
  GraduationCap,
  Headphones,
  Keyboard,
  LayoutDashboard,
  MessageSquareMore,
  MessagesSquare,
  NotebookText,
  PlayCircle,
  Receipt,
  Sparkles,
  Target,
  Trophy,
  Tv,
  UserCircle2,
  Users,
  Video,
  WalletCards,
  WifiOff,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AccentTone, DashboardCard, DashboardStat, DashboardTable, IconKey } from "@/lib/dashboard/data";

const toneMap: Record<AccentTone, string> = {
  blue: "from-blue-500/15 to-cyan-500/10 text-blue-600 dark:text-blue-300",
  violet: "from-violet-500/15 to-fuchsia-500/10 text-violet-600 dark:text-violet-300",
  emerald: "from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-300",
  amber: "from-amber-500/15 to-orange-500/10 text-amber-600 dark:text-amber-300",
  rose: "from-rose-500/15 to-pink-500/10 text-rose-600 dark:text-rose-300",
  slate: "from-slate-500/15 to-slate-400/10 text-slate-600 dark:text-slate-300",
};

const badgeToneMap: Record<AccentTone, string> = {
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  slate: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

const iconMap: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  courses: BookOpen,
  play: PlayCircle,
  assignment: NotebookText,
  quiz: FileQuestion,
  certificate: Award,
  download: GraduationCap,
  keyboard: Keyboard,
  offline: WifiOff,
  live: Video,
  recorded: Tv,
  project: FolderKanban,
  attendance: Users,
  progress: TrendingUp,
  achievement: Trophy,
  leaderboard: Trophy,
  calendar: CalendarDays,
  notes: NotebookText,
  bookmark: Bookmark,
  wishlist: Sparkles,
  message: MessageSquareMore,
  community: MessagesSquare,
  discussion: MessagesSquare,
  support: Headphones,
  payment: WalletCards,
  invoice: Receipt,
  profile: UserCircle2,
  settings: ShieldCheck,
  notification: Bell,
  sparkles: Sparkles,
  clock: Clock3,
  target: Target,
  trophy: Trophy,
  users: Users,
  video: Video,
  shield: ShieldCheck,
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <Badge variant="outline" className="rounded-full border-white/60 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.28em] dark:bg-slate-900/60">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function StatGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        return (
          <Card
            key={stat.label}
            className="overflow-hidden rounded-[28px] border-white/70 bg-white/85 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60"
          >
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div className={cn("rounded-2xl bg-gradient-to-br p-3", toneMap[stat.tone])}>
                  <Icon className="h-5 w-5" />
                </div>
                <Badge className={cn("rounded-full border-0 px-2.5", badgeToneMap[stat.tone])}>{stat.change}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function InsightCard({ card }: { card: DashboardCard }) {
  const Icon = iconMap[card.icon];

  return (
    <Card className="rounded-[28px] border-white/70 bg-white/85 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <CardHeader className="space-y-4">
        <div className={cn("w-fit rounded-2xl bg-gradient-to-br p-3", toneMap[card.tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <CardTitle>{card.title}</CardTitle>
          <CardDescription className="leading-6">{card.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 pb-6">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{card.meta}</span>
        {card.actionLabel && card.actionHref ? (
          <Button asChild variant="outline" className="rounded-full px-4">
            <Link href={card.actionHref}>{card.actionLabel}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function InsightGrid({ cards }: { cards: DashboardCard[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {cards.map((card) => (
        <InsightCard key={`${card.title}-${card.meta}`} card={card} />
      ))}
    </div>
  );
}

export function DataTableCard({ table }: { table: DashboardTable }) {
  return (
    <Card className="rounded-[28px] border-white/70 bg-white/85 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <CardHeader>
        <CardTitle>{table.title}</CardTitle>
        <CardDescription>{table.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row, index) => (
              <TableRow key={`${row.cells[0]}-${index}`}>
                {row.cells.map((cell, cellIndex) => (
                  <TableCell key={`${cell}-${cellIndex}`} className="text-slate-600 dark:text-slate-300">
                    {cellIndex === row.cells.length - 1 ? (
                      <Badge className={cn("rounded-full border-0 px-2.5", badgeToneMap[row.tone ?? "slate"])}>{cell}</Badge>
                    ) : (
                      cell
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function EmptyStateCard({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <Card className="rounded-[28px] border-dashed border-white/70 bg-white/75 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="rounded-3xl bg-slate-100 p-4 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h3>
          <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        <Button asChild className="rounded-full px-5">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
