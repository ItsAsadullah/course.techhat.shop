export type AccentTone = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";

export type IconKey =
  | "dashboard"
  | "courses"
  | "play"
  | "assignment"
  | "quiz"
  | "certificate"
  | "download"
  | "keyboard"
  | "offline"
  | "live"
  | "recorded"
  | "project"
  | "attendance"
  | "progress"
  | "achievement"
  | "leaderboard"
  | "calendar"
  | "notes"
  | "bookmark"
  | "wishlist"
  | "message"
  | "community"
  | "discussion"
  | "support"
  | "payment"
  | "invoice"
  | "profile"
  | "settings"
  | "notification"
  | "sparkles"
  | "clock"
  | "target"
  | "trophy"
  | "users"
  | "video"
  | "shield";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: IconKey;
  badge?: string;
}

export interface DashboardNavGroup {
  title: string;
  items: DashboardNavItem[];
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  icon: IconKey;
  tone: AccentTone;
}

export interface DashboardCard {
  title: string;
  description: string;
  meta: string;
  icon: IconKey;
  tone: AccentTone;
  actionLabel?: string;
  actionHref?: string;
}

export interface DashboardTable {
  title: string;
  description: string;
  columns: string[];
  rows: Array<{
    cells: string[];
    status?: string;
    tone?: AccentTone;
  }>;
}

export interface DashboardEmptyState {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ModulePageConfig {
  slug: string;
  badge: string;
  title: string;
  description: string;
  stats: DashboardStat[];
  cards: DashboardCard[];
  table?: DashboardTable;
  emptyState?: DashboardEmptyState;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  meta: string;
  tone: AccentTone;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  summary: string;
  transcript: string[];
  resources: string[];
}

export interface CourseData {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  rating: number;
  thumbnail: string;
  delivery: "Online" | "Offline" | "Hybrid";
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  lastLesson: string;
  estimate: string;
  overview: string;
  youtubeId: string;
  lessons: CourseLesson[];
}

const makeStats = (
  items: Array<[string, string, string, IconKey, AccentTone]>
): DashboardStat[] =>
  items.map(([label, value, change, icon, tone]) => ({
    label,
    value,
    change,
    icon,
    tone,
  }));

const makeCards = (
  items: Array<[string, string, string, IconKey, AccentTone, string?, string?]>
): DashboardCard[] =>
  items.map(([title, description, meta, icon, tone, actionLabel, actionHref]) => ({
    title,
    description,
    meta,
    icon,
    tone,
    actionLabel,
    actionHref,
  }));

const makeModule = (
  slug: string,
  badge: string,
  title: string,
  description: string,
  stats: DashboardStat[],
  cards: DashboardCard[],
  table?: DashboardTable,
  emptyState?: DashboardEmptyState
): ModulePageConfig => ({
  slug,
  badge,
  title,
  description,
  stats,
  cards,
  table,
  emptyState,
});

export const dashboardNavGroups: DashboardNavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { href: "/dashboard/my-courses", label: "My Courses", icon: "courses" },
      { href: "/dashboard/continue-learning", label: "Continue Learning", icon: "play" },
      { href: "/dashboard/notifications", label: "Notifications", icon: "notification", badge: "12" },
    ],
  },
  {
    title: "Learning",
    items: [
      { href: "/dashboard/assignments", label: "Assignments", icon: "assignment", badge: "4" },
      { href: "/dashboard/quizzes", label: "Quizzes", icon: "quiz", badge: "2" },
      { href: "/dashboard/projects", label: "Projects", icon: "project" },
      { href: "/dashboard/typing-practice", label: "Typing Practice", icon: "keyboard" },
      { href: "/dashboard/offline-course", label: "Offline Course", icon: "offline" },
      { href: "/dashboard/live-classes", label: "Live Classes", icon: "live" },
      { href: "/dashboard/recorded-classes", label: "Recorded Classes", icon: "recorded" },
      { href: "/dashboard/downloads", label: "Downloads", icon: "download" },
    ],
  },
  {
    title: "Performance",
    items: [
      { href: "/dashboard/attendance", label: "Attendance", icon: "attendance" },
      { href: "/dashboard/progress", label: "Progress", icon: "progress" },
      { href: "/dashboard/achievements", label: "Achievements", icon: "achievement" },
      { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "leaderboard" },
      { href: "/dashboard/certificates", label: "Certificates", icon: "certificate" },
      { href: "/dashboard/calendar", label: "Calendar", icon: "calendar" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { href: "/dashboard/notes", label: "Notes", icon: "notes" },
      { href: "/dashboard/bookmarks", label: "Bookmarks", icon: "bookmark" },
      { href: "/dashboard/wishlist", label: "Wishlist", icon: "wishlist" },
      { href: "/dashboard/messages", label: "Messages", icon: "message", badge: "3" },
      { href: "/dashboard/community", label: "Community", icon: "community" },
      { href: "/dashboard/discussion", label: "Discussion", icon: "discussion" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/help-center", label: "Help Center", icon: "support" },
      { href: "/dashboard/support-tickets", label: "Support Tickets", icon: "support" },
      { href: "/dashboard/payments", label: "Payments", icon: "payment" },
      { href: "/dashboard/invoices", label: "Invoices", icon: "invoice" },
      { href: "/dashboard/profile", label: "Profile", icon: "profile" },
      { href: "/dashboard/settings", label: "Settings", icon: "settings" },
    ],
  },
];

export const dashboardNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Assignment review is ready",
    body: "Your responsive portfolio project has been reviewed with detailed trainer feedback.",
    meta: "12 min ago",
    tone: "blue",
  },
  {
    id: "notif-2",
    title: "Live class starts tonight",
    body: "UI Engineering Batch A will go live at 8:30 PM. Join room 10 minutes early.",
    meta: "Today, 8:30 PM",
    tone: "violet",
  },
  {
    id: "notif-3",
    title: "Installment due tomorrow",
    body: "Your July installment for the Full Stack Engineering track is due on 11 Jul.",
    meta: "Billing reminder",
    tone: "amber",
  },
  {
    id: "notif-4",
    title: "Certificate is now available",
    body: "Your Typing Master Speed Milestone certificate is ready for download and verification.",
    meta: "New document",
    tone: "emerald",
  },
];

export const dashboardCourses: CourseData[] = [
  {
    id: "web-bootcamp",
    slug: "full-stack-web-development",
    title: "Full Stack Web Development",
    instructor: "Sharmin Akter",
    rating: 4.9,
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    delivery: "Hybrid",
    level: "Intermediate",
    progress: 72,
    lastLesson: "API Route Design and Validation",
    estimate: "42 min left this week",
    overview:
      "Build scalable full stack products with React, Next.js, API design, database modeling, and deployment workflows.",
    youtubeId: "mK1fS2w5b4M",
    lessons: [
      {
        id: "lesson-1",
        title: "Product Architecture Foundations",
        duration: "18 min",
        completed: true,
        summary: "Understand routing, layout composition, and modular LMS system design.",
        transcript: [
          "Today we map platform capabilities into maintainable feature boundaries.",
          "The goal is to avoid shipping isolated pages that cannot scale with the institute.",
          "We define which parts belong to the shell, page modules, and analytics layer.",
        ],
        resources: ["Architecture worksheet.pdf", "Component checklist.md"],
      },
      {
        id: "lesson-2",
        title: "Dashboard Information Density",
        duration: "24 min",
        completed: true,
        summary: "Design premium dashboards that stay calm while showing a lot of context.",
        transcript: [
          "Large whitespace does not mean wasting space.",
          "We balance metrics, urgency, and quick actions using visual hierarchy.",
          "A student should always know what to do next without scanning every card.",
        ],
        resources: ["Dashboard references.fig", "Accessibility notes.pdf"],
      },
      {
        id: "lesson-3",
        title: "API Route Design and Validation",
        duration: "31 min",
        completed: false,
        summary: "Use route handlers, validation, and authorization boundaries for LMS flows.",
        transcript: [
          "Every mutation should cross a typed validation boundary before touching data.",
          "Quizzes, assignments, and payments all need different access semantics.",
          "A clear service layer reduces regression risk when features expand.",
        ],
        resources: ["Zod contract examples.ts", "API review checklist.pdf"],
      },
      {
        id: "lesson-4",
        title: "Attendance and Progress Analytics",
        duration: "22 min",
        completed: false,
        summary: "Convert raw activity into student-facing analytics and coaching nudges.",
        transcript: [
          "Progress needs context: hours alone are not enough.",
          "Attendance, streak, and performance together paint a better story.",
          "Good analytics should guide behavior, not just report history.",
        ],
        resources: ["Analytics event map.csv"],
      },
    ],
  },
  {
    id: "ui-mastery",
    slug: "ui-ux-mastery",
    title: "UI/UX Product Design Mastery",
    instructor: "Mahadi Hasan",
    rating: 4.8,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    delivery: "Online",
    level: "Beginner",
    progress: 48,
    lastLesson: "Typography Systems for SaaS Products",
    estimate: "58 min left this week",
    overview:
      "Master hierarchy, systems thinking, accessibility, motion, and design communication for production interfaces.",
    youtubeId: "ysz5S6PUM-U",
    lessons: [
      {
        id: "lesson-5",
        title: "Product Thinking for Learning Platforms",
        duration: "19 min",
        completed: true,
        summary: "Translate business outcomes into interface decisions and student actions.",
        transcript: [
          "A beautiful dashboard still fails if it does not improve completion and clarity.",
          "Product design begins with user behavior and operational constraints.",
        ],
        resources: ["Outcome mapping template.pdf"],
      },
      {
        id: "lesson-6",
        title: "Typography Systems for SaaS Products",
        duration: "26 min",
        completed: false,
        summary: "Create scalable type hierarchies for dense, premium dashboards.",
        transcript: [
          "Type systems create calm. Random sizes create friction.",
          "Use contrast strategically around urgency, progress, and support actions.",
        ],
        resources: ["Type scale tokens.json", "Reading rhythm guide.pdf"],
      },
    ],
  },
  {
    id: "typing-pro",
    slug: "typing-master-pro",
    title: "Typing Master Pro",
    instructor: "Lab Mentor Team",
    rating: 4.7,
    thumbnail:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    delivery: "Offline",
    level: "Advanced",
    progress: 91,
    lastLesson: "Bangla Unicode Accuracy Sprint",
    estimate: "15 min to certification",
    overview:
      "Improve English and Bangla typing speed with coached drills, benchmark tests, leaderboard competition, and certification.",
    youtubeId: "aqz-KE-bpKQ",
    lessons: [
      {
        id: "lesson-7",
        title: "Bangla Unicode Accuracy Sprint",
        duration: "14 min",
        completed: false,
        summary: "Build speed without losing rhythm in high-frequency Bangla passages.",
        transcript: [
          "Accuracy is the multiplier behind real typing performance.",
          "Small posture and finger corrections often unlock instant improvement.",
        ],
        resources: ["Unicode practice sheet.pdf", "Accuracy tracker.csv"],
      },
    ],
  },
];

export const dashboardHomeStats = makeStats([
  ["Courses Enrolled", "6", "+1 this month", "courses", "blue"],
  ["Completed Courses", "3", "50% completion", "certificate", "emerald"],
  ["Certificates Earned", "4", "1 ready to download", "certificate", "violet"],
  ["Assignments Pending", "4", "2 due this week", "assignment", "amber"],
  ["Attendance", "92%", "+4% vs last month", "attendance", "emerald"],
  ["Typing Speed", "54 WPM", "+8 WPM improvement", "keyboard", "blue"],
  ["Learning Hours", "128h", "11h this week", "clock", "slate"],
  ["XP Points", "4,280", "Ranked #12 institute-wide", "achievement", "violet"],
]);

export const quickActionCards = makeCards([
  [
    "Resume last lesson",
    "Jump back into API Route Design and Validation exactly where you paused.",
    "Saved at 17m 42s",
    "play",
    "blue",
    "Continue now",
    "/dashboard/courses/web-bootcamp/player/lesson-3",
  ],
  [
    "Upcoming live class",
    "UI Engineering Live Critique with mentor review and feedback slots.",
    "Tonight at 8:30 PM",
    "live",
    "violet",
    "Open class room",
    "/dashboard/live-classes",
  ],
  [
    "Daily goal",
    "Complete one lesson, one quiz, and 15 minutes of typing practice to keep the streak alive.",
    "4 day streak active",
    "target",
    "emerald",
    "See my plan",
    "/dashboard/progress",
  ],
]);

export const genericModuleConfigs: Record<string, ModulePageConfig> = {
  "my-courses": makeModule(
    "my-courses",
    "Learning hub",
    "My Courses",
    "Browse every active, completed, and saved program with progress visibility, filters, and next-action clarity.",
    makeStats([
      ["Active Tracks", "4", "2 hybrid, 1 online, 1 offline", "courses", "blue"],
      ["Average Progress", "63%", "+6% over 14 days", "progress", "emerald"],
      ["Saved for Later", "3", "Wishlist synced", "wishlist", "violet"],
      ["High Priority", "2", "Need attention this week", "target", "amber"],
    ]),
    makeCards([
      [
        "Career track focus",
        "Your strongest momentum is in Full Stack Web Development. Keep this as your anchor track.",
        "Best streak: 11 sessions",
        "sparkles",
        "blue",
        "Open roadmap",
        "/dashboard/continue-learning",
      ],
      [
        "Offline lab reminder",
        "Typing Master practical lab is scheduled for Friday afternoon in the institute lab.",
        "Lab room 3",
        "offline",
        "emerald",
        "View routine",
        "/dashboard/offline-course",
      ],
      [
        "Recommended next course",
        "After UI/UX Product Design Mastery, enroll in Advanced Design Systems to deepen system thinking.",
        "AI recommendation",
        "sparkles",
        "violet",
        "Add to wishlist",
        "/dashboard/wishlist",
      ],
    ]),
    {
      title: "Course portfolio",
      description: "Track delivery mode, progress, and the most important next step for each enrolled path.",
      columns: ["Course", "Delivery", "Progress", "Next Step", "Priority"],
      rows: [
        { cells: ["Full Stack Web Development", "Hybrid", "72%", "Resume lesson 3", "High"], tone: "blue" },
        { cells: ["UI/UX Product Design Mastery", "Online", "48%", "Submit design critique", "Medium"], tone: "violet" },
        { cells: ["Typing Master Pro", "Offline", "91%", "Take certificate test", "High"], tone: "emerald" },
      ],
    }
  ),
  "continue-learning": makeModule(
    "continue-learning",
    "Momentum",
    "Continue Learning",
    "Pick up exactly where you left off across courses, recordings, practices, and revision flows.",
    makeStats([
      ["Lessons in Queue", "5", "Sorted by urgency and momentum", "play", "blue"],
      ["Revision Targets", "2", "Marked by quiz performance", "quiz", "amber"],
      ["Bookmarks Ready", "7", "Key moments saved", "bookmark", "violet"],
      ["Weekly Goal", "82%", "Almost on track", "target", "emerald"],
    ]),
    quickActionCards,
    {
      title: "Learning queue",
      description: "Your queue is ranked by deadline, recent activity, and estimated completion time.",
      columns: ["Content", "Course", "ETA", "Last Seen", "Status"],
      rows: [
        { cells: ["API Route Design and Validation", "Full Stack Web Development", "31 min", "Yesterday", "Resume"], tone: "blue" },
        { cells: ["Typography Systems for SaaS Products", "UI/UX Product Design Mastery", "26 min", "2 days ago", "Warm"], tone: "violet" },
        { cells: ["Bangla Unicode Accuracy Sprint", "Typing Master Pro", "14 min", "Today", "Quick win"], tone: "emerald" },
      ],
    }
  ),
  assignments: makeModule(
    "assignments",
    "Academic workflow",
    "Assignments",
    "Manage pending, submitted, and reviewed work with deadlines, marks, and trainer feedback.",
    makeStats([
      ["Pending", "4", "2 due in 48 hours", "assignment", "amber"],
      ["Submitted", "12", "4 awaiting review", "play", "blue"],
      ["Reviewed", "18", "Average score 87%", "certificate", "emerald"],
      ["Need Revision", "1", "Trainer asked for resubmission", "support", "rose"],
    ]),
    makeCards([
      ["Next due item", "Design a bilingual dashboard settings form with validation and accessibility support.", "Due tomorrow, 10:00 PM", "clock", "amber", "Open task", "/dashboard/assignments"],
      ["Top feedback theme", "Your trainers consistently praise hierarchy and clarity but want tighter spacing systems.", "Last 3 reviews", "sparkles", "blue"],
      ["Submission readiness", "All required files for your next project are already available in Downloads.", "Resources synced", "download", "emerald", "Open resources", "/dashboard/downloads"],
    ]),
    {
      title: "Assignment tracker",
      description: "Every assignment shows deadline, review state, and clear next action.",
      columns: ["Assignment", "Course", "Deadline", "Marks", "Status"],
      rows: [
        { cells: ["Dashboard shell architecture", "Full Stack Web Development", "11 Jul", "Pending", "Due soon"], tone: "amber" },
        { cells: ["Typography hierarchy audit", "UI/UX Product Design Mastery", "14 Jul", "91/100", "Reviewed"], tone: "emerald" },
        { cells: ["Bangla typing sprint log", "Typing Master Pro", "Submitted", "Awaiting", "In review"], tone: "blue" },
      ],
    }
  ),
  quizzes: makeModule(
    "quizzes",
    "Assessment engine",
    "Quizzes",
    "Practice timed assessments, review explanations, and compare performance trends over time.",
    makeStats([
      ["Available Now", "2", "1 timed challenge open", "quiz", "blue"],
      ["Average Score", "84%", "+9% from last month", "progress", "emerald"],
      ["Best Rank", "#5", "Batch leaderboard", "leaderboard", "violet"],
      ["Weak Topics", "2", "Validation and accessibility", "support", "amber"],
    ]),
    makeCards([
      ["Recommended attempt", "Take the accessibility fundamentals quiz while the concepts are fresh from last class.", "Estimated 12 min", "play", "blue", "Start quiz", "/dashboard/quizzes"],
      ["Instant review", "Your last quiz explanations are still available with answer rationale and improvement notes.", "Saved review", "notes", "violet"],
      ["Confidence booster", "You have answered all layout hierarchy questions correctly in the last three assessments.", "Strong area", "trophy", "emerald"],
    ]),
    {
      title: "Quiz lineup",
      description: "Availability windows, result history, and leaderboard impact are shown in one place.",
      columns: ["Quiz", "Mode", "Attempts", "Best Score", "State"],
      rows: [
        { cells: ["Accessibility fundamentals", "Timed MCQ", "1/2", "88%", "Open"], tone: "blue" },
        { cells: ["Validation and schema logic", "Timed MCQ", "0/1", "-", "Starts today"], tone: "amber" },
        { cells: ["Design systems recap", "Instant result", "2/3", "94%", "Review ready"], tone: "emerald" },
      ],
    }
  ),
  certificates: makeModule(
    "certificates",
    "Documents",
    "Certificates",
    "Download official certificates, verify authenticity, and track every award history entry.",
    makeStats([
      ["Issued", "4", "1 newly generated", "certificate", "emerald"],
      ["Verification Hits", "19", "Public page views", "shield", "blue"],
      ["Download Ready", "2", "PDF signed", "download", "violet"],
      ["Milestones Left", "1", "Typing certificate pending", "target", "amber"],
    ]),
    makeCards([
      ["Newest certificate", "UI Foundations Completion Certificate is ready with verification QR and unique code.", "Issued today", "certificate", "emerald", "View certificate", "/dashboard/certificates"],
      ["Verification profile", "Your public certificate checks mostly come from potential employers and portfolio reviews.", "Career signal", "shield", "blue"],
      ["Next unlock", "Complete the final typing assessment above 50 WPM and 95% accuracy to unlock the next certificate.", "Performance gate", "target", "amber"],
    ]),
    {
      title: "Certificate history",
      description: "Each certificate keeps traceable issue metadata and verification status.",
      columns: ["Certificate", "Issued", "Verification URL", "Format", "Status"],
      rows: [
        { cells: ["UI Foundations", "10 Jul 2026", "/certificate/verify/UIF-1024", "PDF + QR", "Ready"], tone: "emerald" },
        { cells: ["Frontend Sprint", "26 Jun 2026", "/certificate/verify/FES-0914", "PDF", "Ready"], tone: "blue" },
        { cells: ["Typing Master Speed Milestone", "Pending", "-", "-", "Locked"], tone: "amber" },
      ],
    }
  ),
  downloads: makeModule(
    "downloads",
    "Resource library",
    "Downloads",
    "Access slides, code, PDFs, project files, and trainer resources organized by course and recency.",
    makeStats([
      ["Files Available", "42", "Across 3 active courses", "download", "blue"],
      ["Downloaded This Week", "9", "Synced across devices", "recorded", "emerald"],
      ["Offline Packs", "3", "For low-bandwidth study", "offline", "violet"],
      ["Critical Resources", "2", "Required before next class", "target", "amber"],
    ]),
    makeCards([
      ["Best offline pack", "Full Stack Web Development week-4 pack contains lessons, references, and assignment assets.", "Updated 2 hours ago", "offline", "blue"],
      ["Project starter", "Your trainer uploaded a fresh design-system starter repository for the next project cycle.", "Git-ready files", "project", "emerald"],
      ["Bandwidth saver", "Recorded classes are available in lighter-resolution downloads for mobile study.", "Adaptive assets", "recorded", "violet"],
    ]),
    {
      title: "Recent files",
      description: "Your most useful materials stay pinned at the top for fast retrieval.",
      columns: ["File", "Course", "Type", "Size", "Priority"],
      rows: [
        { cells: ["Week-4 API starter kit.zip", "Full Stack Web Development", "Code", "18 MB", "Required"], tone: "amber" },
        { cells: ["Typography systems deck.pdf", "UI/UX Product Design Mastery", "Slides", "6 MB", "Recommended"], tone: "blue" },
        { cells: ["Unicode sprint sheet.pdf", "Typing Master Pro", "Practice", "2 MB", "Quick download"], tone: "emerald" },
      ],
    }
  ),
  "typing-practice": makeModule(
    "typing-practice",
    "Performance lab",
    "Typing Practice",
    "Train English, Bangla Bijoy, and Bangla Unicode speed with accuracy tracking and leaderboard competition.",
    makeStats([
      ["Current Speed", "54 WPM", "+8 this month", "keyboard", "blue"],
      ["Accuracy", "96.2%", "Personal best", "target", "emerald"],
      ["Practice Days", "21", "Strong consistency", "calendar", "violet"],
      ["Institute Rank", "#3", "Typing leaderboard", "leaderboard", "amber"],
    ]),
    makeCards([
      ["English sprint", "Take a 3-minute English accuracy test to solidify your pace before the final certificate.", "Recommended today", "play", "blue", "Start test", "/dashboard/typing-practice"],
      ["Bangla Unicode mode", "Your weakest cluster remains punctuation accuracy in Bangla Unicode paragraphs.", "Coach insight", "notes", "amber"],
      ["Typing certificate", "You need one more certified pass above 50 WPM and 95% accuracy for the next badge.", "1 attempt left", "certificate", "emerald"],
    ]),
    {
      title: "Practice history",
      description: "Typing performance is tracked across language modes and time windows.",
      columns: ["Session", "Mode", "Speed", "Accuracy", "Result"],
      rows: [
        { cells: ["10 Jul, 7:12 PM", "English", "58 WPM", "97%", "Passed"], tone: "emerald" },
        { cells: ["9 Jul, 6:45 PM", "Bangla Unicode", "49 WPM", "94%", "Close"], tone: "amber" },
        { cells: ["8 Jul, 8:20 PM", "Bangla Bijoy", "53 WPM", "96%", "Passed"], tone: "blue" },
      ],
    }
  ),
  "offline-course": makeModule(
    "offline-course",
    "Institute operations",
    "Offline Course",
    "Stay aligned with your physical batch schedule, lab sessions, notices, trainer updates, and exam planning.",
    makeStats([
      ["Current Batch", "Batch A-24", "Evening shift", "users", "blue"],
      ["Attendance", "94%", "2 absences this month", "attendance", "emerald"],
      ["Practical Labs", "3", "1 tomorrow", "offline", "violet"],
      ["Exam Window", "17 Jul", "Final assessment week", "calendar", "amber"],
    ]),
    makeCards([
      ["Lab schedule", "Practical lab on Friday covers typing certification and desktop workflow drills.", "Lab 3, 4:00 PM", "offline", "emerald"],
      ["Notice board", "Trainers announced an extra support session for students preparing for the assessment week.", "Institute notice", "notification", "blue"],
      ["Material pickup", "Printed attendance sheet and practice booklet are available from the front desk.", "Office hours 10 AM - 6 PM", "support", "amber"],
    ]),
    {
      title: "Batch schedule",
      description: "See your trainer, room, lab plan, and milestone checkpoints in one operational view.",
      columns: ["Event", "Trainer", "Time", "Room", "State"],
      rows: [
        { cells: ["Evening class", "Sharmin Akter", "Mon, Wed, Fri - 7:00 PM", "Room 2", "Active"], tone: "blue" },
        { cells: ["Typing lab", "Lab Mentor Team", "Fri - 4:00 PM", "Lab 3", "Upcoming"], tone: "emerald" },
        { cells: ["Final exam", "Institute Board", "17 Jul - 10:00 AM", "Hall A", "Scheduled"], tone: "amber" },
      ],
    }
  ),
  "live-classes": makeModule(
    "live-classes",
    "Schedules",
    "Live Classes",
    "Join real-time classes, review agenda, and prepare questions before session start.",
    makeStats([
      ["This Week", "3", "2 online, 1 hybrid", "live", "blue"],
      ["Joined On Time", "91%", "Strong punctuality", "clock", "emerald"],
      ["Questions Logged", "6", "Ready for next class", "message", "violet"],
      ["Missed Sessions", "1", "Recording available", "recorded", "amber"],
    ]),
    makeCards([
      ["Tonight's class", "UI Engineering Live Critique includes assignment feedback and office-hour Q&A.", "8:30 PM", "live", "violet", "Join class", "/dashboard/live-classes"],
      ["Prep notes", "You already saved three questions related to reusable dashboard architecture.", "Ready to ask", "notes", "blue"],
      ["Backup recording", "If the network drops, the class recording will appear automatically in Recorded Classes.", "No progress loss", "recorded", "emerald"],
    ]),
    {
      title: "Upcoming live sessions",
      description: "Your class timeline includes reminders, join links, and fallback recordings.",
      columns: ["Class", "Format", "Starts", "Topic", "Status"],
      rows: [
        { cells: ["UI Engineering Live Critique", "Google Meet", "10 Jul, 8:30 PM", "Dashboard reviews", "Next"], tone: "violet" },
        { cells: ["API Office Hour", "Zoom", "12 Jul, 9:00 PM", "Validation Q&A", "Scheduled"], tone: "blue" },
        { cells: ["Typing Speed Clinic", "Lab + Stream", "13 Jul, 6:00 PM", "Accuracy drills", "Scheduled"], tone: "emerald" },
      ],
    }
  ),
  "recorded-classes": makeModule(
    "recorded-classes",
    "Replay",
    "Recorded Classes",
    "Catch up on missed sessions with searchable recordings, notes, and chapter markers.",
    makeStats([
      ["Saved Recordings", "18", "Across 4 modules", "recorded", "blue"],
      ["Catch-up Queue", "2", "Under 45 minutes total", "play", "emerald"],
      ["Watched This Week", "5", "Strong follow-through", "clock", "violet"],
      ["Searchable Chapters", "41", "With note anchors", "bookmark", "amber"],
    ]),
    makeCards([
      ["Fastest catch-up", "The last UI critique recording has chapter markers for only the 12 minutes relevant to your project.", "Targeted replay", "recorded", "blue"],
      ["Trainer recap", "A summary note was attached to the API office-hour recording to make revision easier.", "Ready to review", "notes", "emerald"],
      ["Offline option", "Most recordings can be downloaded in compressed quality for travel and low data use.", "Bandwidth friendly", "download", "violet"],
    ])
  ),
  projects: makeModule(
    "projects",
    "Portfolio building",
    "Projects",
    "Track assigned projects, review milestones, and manage GitHub plus live demo submissions.",
    makeStats([
      ["Assigned", "5", "2 currently active", "project", "blue"],
      ["Completed", "3", "Latest score 93%", "trophy", "emerald"],
      ["Need Review", "1", "Trainer review pending", "support", "amber"],
      ["Portfolio Ready", "2", "Showcase candidates", "sparkles", "violet"],
    ]),
    makeCards([
      ["Current build", "TechHat student dashboard redesign is your flagship portfolio project this sprint.", "Primary capstone", "project", "blue"],
      ["Submission assets", "Your GitHub repository and demo checklist are ready for the next review cycle.", "Delivery ready", "download", "emerald"],
      ["Mentor note", "Focus next on accessibility states and empty-state clarity to raise project polish further.", "Feedback trend", "notes", "amber"],
    ]),
    {
      title: "Project tracker",
      description: "Project readiness stays visible across delivery, review, and publishing.",
      columns: ["Project", "Repository", "Demo", "Review", "State"],
      rows: [
        { cells: ["Student dashboard redesign", "GitHub linked", "Preview ready", "Pending", "In review"], tone: "blue" },
        { cells: ["Responsive portfolio", "GitHub linked", "Live", "93/100", "Completed"], tone: "emerald" },
        { cells: ["Typing analytics mini tool", "Draft repo", "-", "Not submitted", "Active"], tone: "amber" },
      ],
    }
  ),
  attendance: makeModule(
    "attendance",
    "Consistency",
    "Attendance",
    "Review present, absent, late, and recovery trends across the current month and batch schedule.",
    makeStats([
      ["Monthly Rate", "92%", "+4% vs last month", "attendance", "emerald"],
      ["Present Days", "23", "Consistent rhythm", "calendar", "blue"],
      ["Late Marks", "2", "Improved punctuality", "clock", "amber"],
      ["Support Flags", "0", "No escalation needed", "shield", "violet"],
    ]),
    makeCards([
      ["Best week", "You attended every planned class last week including the optional mentor support session.", "Perfect attendance", "trophy", "emerald"],
      ["Risk monitor", "Another late mark this week may affect batch leaderboard positioning.", "Keep momentum", "leaderboard", "amber"],
      ["Recovery path", "Missed sessions automatically surface in Recorded Classes and trainer notes.", "Catch-up ready", "recorded", "blue"],
    ])
  ),
  progress: makeModule(
    "progress",
    "Analytics",
    "Progress",
    "Analyze course completion, study hours, quiz confidence, and goal completion in a single coaching view.",
    makeStats([
      ["Overall Completion", "68%", "+7% this month", "progress", "blue"],
      ["Study Hours", "128h", "11h this week", "clock", "emerald"],
      ["Weekly Goal", "82%", "Need one more focused session", "target", "amber"],
      ["Strongest Track", "Typing Master", "91% complete", "trophy", "violet"],
    ]),
    makeCards([
      ["Learning graph insight", "Your progress climbs fastest on days when assignments and lesson review happen back to back.", "Behavior pattern", "sparkles", "blue"],
      ["Confidence area", "Typing and design critique performance are both above cohort average.", "Positive signal", "leaderboard", "emerald"],
      ["Recommended focus", "Allocate your next two study blocks to API validation and accessibility to balance course mastery.", "Coach recommendation", "target", "amber"],
    ])
  ),
  achievements: makeModule(
    "achievements",
    "Gamification",
    "Achievements",
    "Track badges, milestones, XP, coins, and level-based learning rewards.",
    makeStats([
      ["XP", "4,280", "+320 this week", "achievement", "violet"],
      ["Coins", "1,160", "Redeemable perks soon", "payment", "emerald"],
      ["Badges", "9", "2 near unlock", "certificate", "blue"],
      ["Level", "12", "Top 15% of batch", "leaderboard", "amber"],
    ]),
    makeCards([
      ["Nearest badge", "Consistency Champion unlocks after one more full week without a missed goal.", "Almost there", "trophy", "emerald"],
      ["XP accelerator", "Finish the pending accessibility quiz and submit your dashboard project feedback form.", "High-value tasks", "sparkles", "violet"],
      ["Reward path", "Coins can soon unlock mentor portfolio reviews and institute swag perks.", "Upcoming benefit", "payment", "blue"],
    ])
  ),
  leaderboard: makeModule(
    "leaderboard",
    "Competition",
    "Leaderboard",
    "Compare your institute, batch, typing, quiz, and XP rankings with transparent score context.",
    makeStats([
      ["Institute Rank", "#12", "Up 5 places", "leaderboard", "blue"],
      ["Batch Rank", "#4", "Close to podium", "trophy", "emerald"],
      ["Typing Rank", "#3", "Strong accuracy edge", "keyboard", "violet"],
      ["Quiz Rank", "#8", "Can improve quickly", "quiz", "amber"],
    ]),
    makeCards([
      ["Biggest mover", "Your typing streak created the biggest weekly climb across all ranking boards.", "Momentum signal", "sparkles", "emerald"],
      ["Next target", "A strong score in validation and schema logic can likely move you into the batch top three.", "Reachable goal", "target", "amber"],
      ["Healthy competition", "Leaderboards now balance XP, attendance, and completion to reward consistent learners.", "Fair scoring", "shield", "blue"],
    ])
  ),
  calendar: makeModule(
    "calendar",
    "Planning",
    "Calendar",
    "View classes, exams, deadlines, reminders, and review blocks in one synchronized schedule.",
    makeStats([
      ["Scheduled Events", "14", "This month", "calendar", "blue"],
      ["Deadlines", "4", "2 high urgency", "assignment", "amber"],
      ["Live Sessions", "3", "Already planned", "live", "violet"],
      ["Reminders Active", "9", "Mobile + web", "notification", "emerald"],
    ]),
    makeCards([
      ["Tomorrow", "Dashboard shell assignment due at 10:00 PM after the live critique session.", "High priority", "assignment", "amber"],
      ["Friday", "Typing Master lab and optional mentor hour are both scheduled in the institute lab block.", "Packed day", "offline", "blue"],
      ["Exam week", "Final assessment preparation begins next Thursday with a lighter content load earlier that week.", "Plan early", "target", "emerald"],
    ])
  ),
  notes: makeModule(
    "notes",
    "Study workspace",
    "Notes",
    "Capture lesson summaries, revision cues, and trainer insights in a searchable study notebook.",
    makeStats([
      ["Saved Notes", "26", "Across 9 lessons", "notes", "blue"],
      ["Pinned", "4", "High-value revision cards", "bookmark", "violet"],
      ["Recently Edited", "7", "This week", "clock", "emerald"],
      ["Ready to Export", "2", "Course-end summaries", "download", "amber"],
    ]),
    makeCards([
      ["Latest note", "Validation boundaries should stay close to route handlers to prevent drift in business rules.", "From lesson 3", "notes", "blue"],
      ["Pinned insight", "Hierarchy should guide action priority before it communicates total system breadth.", "Design principle", "sparkles", "violet"],
      ["Revision pack", "You can consolidate the current course notes into a printable revision brief before the exam.", "Export supported", "download", "emerald"],
    ])
  ),
  bookmarks: makeModule(
    "bookmarks",
    "Saved context",
    "Bookmarks",
    "Keep timestamps, lesson moments, resource links, and discussion points within easy reach.",
    makeStats([
      ["Saved Moments", "18", "Across lessons and recordings", "bookmark", "blue"],
      ["Resource Pins", "6", "Quick reference pack", "download", "emerald"],
      ["Discussion Saves", "3", "Worth revisiting", "discussion", "violet"],
      ["Watch Later", "2", "Short queue", "play", "amber"],
    ]),
    makeCards([
      ["Most useful save", "The 17:42 marker in API validation explains how to avoid brittle mutation logic.", "Lesson bookmark", "bookmark", "blue"],
      ["Resource pin", "Dashboard architecture worksheet is pinned because it overlaps your current project.", "High relevance", "download", "emerald"],
      ["Discussion highlight", "A trainer answer about empty-state UX got bookmarked for your portfolio build.", "Community signal", "discussion", "violet"],
    ])
  ),
  wishlist: makeModule(
    "wishlist",
    "Future growth",
    "Wishlist",
    "Collect the next courses and specializations you want to enroll in after your current roadmap.",
    makeStats([
      ["Saved Courses", "3", "Aligned to your path", "wishlist", "violet"],
      ["Ready Soon", "1", "Eligible next month", "courses", "blue"],
      ["Career Match", "92%", "Strong relevance", "sparkles", "emerald"],
      ["Offer Alerts", "2", "Price windows active", "notification", "amber"],
    ]),
    makeCards([
      ["Top pick", "Advanced Design Systems fits naturally after UI/UX Product Design Mastery and portfolio work.", "Best fit", "sparkles", "violet"],
      ["Hybrid option", "Practical Frontend Engineering has both online theory and offline lab support.", "Flexible delivery", "offline", "blue"],
      ["Scholarship note", "Consistent leaderboard performance may unlock discounted enrollment for the next advanced track.", "Performance benefit", "trophy", "emerald"],
    ])
  ),
  messages: makeModule(
    "messages",
    "Communication",
    "Messages",
    "Keep teacher chats, support threads, and institute announcements organized in one inbox.",
    makeStats([
      ["Unread", "3", "2 from mentors", "message", "blue"],
      ["Active Threads", "5", "Support and trainers", "users", "emerald"],
      ["Avg Response", "18 min", "Support SLA healthy", "clock", "violet"],
      ["Announcements", "2", "Important this week", "notification", "amber"],
    ]),
    makeCards([
      ["Mentor thread", "Sharmin Akter replied to your question about route handlers and service-layer boundaries.", "7 minutes ago", "message", "blue"],
      ["Support update", "Your invoice clarification request has been acknowledged and moved to finance review.", "Ticket linked", "support", "emerald"],
      ["Announcement", "The institute shared an updated exam-week schedule for hybrid tracks.", "Operational update", "notification", "amber"],
    ])
  ),
  community: makeModule(
    "community",
    "Peer learning",
    "Community",
    "Explore institute-wide discussion, student wins, collaborative Q&A, and peer encouragement.",
    makeStats([
      ["New Posts", "14", "This week", "community", "blue"],
      ["Replies Received", "9", "On your topics", "discussion", "emerald"],
      ["Helpful Votes", "28", "Your contributions matter", "trophy", "violet"],
      ["Shared Resources", "5", "Community-curated", "download", "amber"],
    ]),
    makeCards([
      ["Popular thread", "Students are comparing dashboard shell patterns and mobile navigation strategies.", "Good learning thread", "community", "blue"],
      ["Peer support", "Your explanation of progress card hierarchy was marked helpful by multiple learners.", "Knowledge signal", "trophy", "emerald"],
      ["Share moment", "Posting your portfolio update now would likely get timely critique before submission.", "Good timing", "sparkles", "violet"],
    ])
  ),
  discussion: makeModule(
    "discussion",
    "Course threads",
    "Discussion",
    "Follow course-specific Q&A, trainer explanations, and structured peer responses tied to lessons.",
    makeStats([
      ["Open Threads", "8", "Across current courses", "discussion", "blue"],
      ["Marked Answers", "11", "Great knowledge base", "shield", "emerald"],
      ["Your Questions", "4", "2 answered", "message", "violet"],
      ["Need Follow-up", "1", "Trainer review pending", "support", "amber"],
    ]),
    makeCards([
      ["Best answer", "A trainer clarified when to prefer server actions over route handlers for LMS mutations.", "Worth bookmarking", "discussion", "blue"],
      ["Your pending thread", "You asked how to structure dashboard route-level error states without repeating layouts.", "Awaiting response", "message", "amber"],
      ["Study shortcut", "Several explanations from discussion are perfect additions to your course notes.", "Cross-link to notes", "notes", "emerald"],
    ])
  ),
  "help-center": makeModule(
    "help-center",
    "Support resources",
    "Help Center",
    "Find answers fast through curated FAQs, how-to guides, payment help, and support escalation paths.",
    makeStats([
      ["Guides", "24", "Student-facing articles", "support", "blue"],
      ["Resolved via Help", "78%", "Before ticket creation", "shield", "emerald"],
      ["Popular Topics", "3", "Payments, player, attendance", "notification", "violet"],
      ["Escalation Paths", "4", "Clear routing", "users", "amber"],
    ]),
    makeCards([
      ["Most visited article", "How to recover missed classes and keep progress synchronized across recordings and notes.", "Saved many tickets", "support", "blue"],
      ["Billing FAQ", "Installment dates, receipt downloads, and invoice disputes now have a clearer guide path.", "Finance support", "payment", "emerald"],
      ["Learning help", "There is a dedicated guide for using bookmarks, notes, and AI summaries together.", "Study workflow", "sparkles", "violet"],
    ])
  ),
  "support-tickets": makeModule(
    "support-tickets",
    "Issue tracking",
    "Support Tickets",
    "Report academic, technical, billing, or account issues and track replies with clear status visibility.",
    makeStats([
      ["Open Tickets", "1", "Finance clarification", "support", "amber"],
      ["Resolved", "6", "This quarter", "shield", "emerald"],
      ["Avg Resolution", "7h", "Fast turnaround", "clock", "blue"],
      ["Attachments", "4", "Securely logged", "download", "violet"],
    ]),
    makeCards([
      ["Current issue", "Invoice amount confirmation for July installment is under finance review.", "Status: waiting for update", "support", "amber"],
      ["Best practice", "Attach receipts and explain the expected result in one sentence for faster first response.", "Support tip", "sparkles", "blue"],
      ["Escalation path", "Technical issues affecting live classes are prioritized automatically during class windows.", "High severity rule", "shield", "emerald"],
    ]),
    undefined,
    {
      title: "No active blockers",
      description: "When things are going smoothly, your support center stays focused on knowledge articles and fast self-service.",
      ctaLabel: "Open a new ticket",
      ctaHref: "/dashboard/support-tickets",
    }
  ),
  payments: makeModule(
    "payments",
    "Billing",
    "Payments",
    "Track total fees, installments, due dates, payment history, and preferred payment channels in one secure place.",
    makeStats([
      ["Total Course Fee", "৳48,000", "Across active tracks", "payment", "blue"],
      ["Paid", "৳36,000", "75% settled", "progress", "emerald"],
      ["Due", "৳12,000", "Next due tomorrow", "invoice", "amber"],
      ["Receipts", "6", "Download anytime", "download", "violet"],
    ]),
    makeCards([
      ["Next installment", "Full Stack Engineering installment is due on 11 Jul via bKash, Nagad, card, or cash at office.", "Finance reminder", "payment", "amber"],
      ["Payment hygiene", "Every successful payment instantly appears in your invoice center with receipt metadata.", "Transparent records", "shield", "emerald"],
      ["Support link", "If a transaction is delayed, open a ticket with the receipt number for priority review.", "Fast dispute path", "support", "blue"],
    ]),
    {
      title: "Payment ledger",
      description: "A clean ledger reduces confusion around installments and verification.",
      columns: ["Date", "Method", "Reference", "Amount", "State"],
      rows: [
        { cells: ["05 Jul 2026", "bKash", "TXN-784123", "৳6,000", "Verified"], tone: "emerald" },
        { cells: ["06 Jun 2026", "Cash", "RCPT-2026-114", "৳6,000", "Verified"], tone: "blue" },
        { cells: ["11 Jul 2026", "Pending", "-", "৳6,000", "Due tomorrow"], tone: "amber" },
      ],
    }
  ),
  invoices: makeModule(
    "invoices",
    "Finance documents",
    "Invoices",
    "Review invoice history, due periods, and downloadable billing documents for personal record keeping.",
    makeStats([
      ["Invoices", "7", "Chronological history", "invoice", "blue"],
      ["Paid", "6", "Fully receipted", "shield", "emerald"],
      ["Open", "1", "Awaiting payment", "payment", "amber"],
      ["Downloads", "14", "PDF and receipt copies", "download", "violet"],
    ]),
    makeCards([
      ["Open invoice", "Invoice INV-2026-07-11 covers the July installment and late-lab resource fee waiver.", "Due tomorrow", "invoice", "amber"],
      ["Best practice", "Download and archive each invoice after payment verification for scholarship or employer reimbursement cases.", "Document hygiene", "shield", "blue"],
      ["Need help", "Invoice discrepancies can be disputed directly from the linked support ticket flow.", "Connected support", "support", "emerald"],
    ]),
    {
      title: "Invoice archive",
      description: "Each invoice retains status, issued date, and download access.",
      columns: ["Invoice", "Issued", "Period", "Amount", "Status"],
      rows: [
        { cells: ["INV-2026-07-11", "10 Jul 2026", "July", "৳6,000", "Open"], tone: "amber" },
        { cells: ["INV-2026-06-09", "09 Jun 2026", "June", "৳6,000", "Paid"], tone: "emerald" },
        { cells: ["INV-2026-05-10", "10 May 2026", "May", "৳6,000", "Paid"], tone: "blue" },
      ],
    }
  ),
};
