"use client";

import Link from "next/link";
import { Search, Bell, MessageSquare, Plus, CreditCard, History, ChevronRight, Settings, Users, BookOpen, MonitorCog, Layers, Clock, MonitorPlay } from "lucide-react";
import { UserNav } from "./user-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/admin/utils";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface TopBarProps {
  email: string | undefined;
}

const SEARCH_DATA = [
  { label: 'Appearance Settings', href: '/admin/settings/appearance', category: 'Settings', icon: Settings },
  { label: 'General Settings', href: '/admin/settings', category: 'Settings', icon: Settings },
  { label: 'All Students', href: '/admin/students', category: 'Students', icon: Users },
  { label: 'Add New Student', href: '/admin/students/new', category: 'Students', icon: Users },
  { label: 'Pending Payments', href: '/admin/payments?status=pending', category: 'Payments', icon: CreditCard },
  { label: 'Receive Payment', href: '/admin/payments/new', category: 'Payments', icon: CreditCard },
  { label: 'Graphic Design Batch 1', href: '/admin/batches', category: 'Batches', icon: BookOpen },
];

const RECENT_SEARCHES = [
  { label: 'Graphic Design Batch 1', href: '/admin/batches' },
  { label: 'Pending Payments', href: '/admin/payments?status=pending' },
  { label: 'Add New Student', href: '/admin/students/new' }
];

export function TopBar({ email }: TopBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Basic mapping of paths to titles
  const getPageInfo = () => {
    switch (pathname) {
      case "/admin":
        return { title: "Dashboard", subtitle: "Overview of your LMS platform" };
      case "/admin/admissions":
        return { title: "Pending Admissions", subtitle: "Verify manual payments and approve student admissions" };
      case "/admin/students":
        return { title: "Students", subtitle: "Manage all registered students" };
      case "/admin/students/new":
        return { title: "Add New Student", subtitle: "Register a new student into the system" };
      case "/admin/courses":
        return { title: "Courses", subtitle: "Manage your educational programs" };
      case "/admin/enrollments":
        return { title: "Course Enrollments", subtitle: "Direct, admission, and public course access records" };
      case "/admin/payments":
        return { title: "Payments", subtitle: "Track and manage all transactions" };
      case "/admin/payments/new":
        return { title: "Receive Payment", subtitle: "Record a new manual payment" };
      case "/admin/orders":
        return { title: "Orders & Enrollments", subtitle: "View recent online orders" };
      case "/admin/settings/appearance":
        return { title: "Appearance & Theming", subtitle: "Customize the look and feel of the admin panel" };
      case "/admin/settings/general":
        return { title: "General Settings", subtitle: "Configure basic platform information" };
      case "/admin/settings/integrations":
        return { title: "Integrations & API", subtitle: "Manage third-party connections" };
      case "/admin/settings/payments":
        return { title: "Payment Settings", subtitle: "Configure payment gateways" };
    }

    if (pathname.startsWith("/admin/training")) {
      return { title: "Training Operations", subtitle: "Manage batches, shifts, and physical computer labs." };
    }

    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts.length > 1) {
      const title = pathParts[1];
      return { title: title.charAt(0).toUpperCase() + title.slice(1), subtitle: "" };
    }
    return { title: "Admin Portal", subtitle: "" };
  };

  const { title, subtitle } = getPageInfo();

  const filteredResults = searchQuery.length > 0
    ? SEARCH_DATA.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelect = (href: string) => {
    setIsFocused(false);
    setSearchQuery("");
    router.push(href);
  };

  const isTrainingRoute = pathname.startsWith("/admin/training");

  const trainingNavItems = [
    { name: "Overview", href: "/admin/training", icon: MonitorCog },
    { name: "Batches", href: "/admin/training/batches", icon: Layers },
    { name: "Shifts", href: "/admin/training/shifts", icon: Clock },
    { name: "Labs", href: "/admin/training/labs", icon: MonitorPlay },
  ];

  return (
    <div className="sticky top-0 z-40 bg-admin-background/95 backdrop-blur-md rounded-tl-[40px] border-b border-slate-100/50 transition-all flex flex-col">
      <div className="px-8 py-5 flex items-center justify-between w-full">
      
      {/* Left: Page Title & Subtitle */}
      <div className="flex flex-col gap-0.5 min-w-[250px] w-auto whitespace-nowrap">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-medium tracking-wide">
            {subtitle}
          </p>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center max-w-2xl px-4" ref={searchContainerRef}>
        <div className="relative w-full max-w-lg">
          <div 
            className={cn(
              "relative flex items-center w-full bg-white rounded-full transition-all duration-300 border z-50",
              isFocused ? "border-indigo-500 shadow-md shadow-indigo-100" : "border-slate-200 shadow-sm hover:border-slate-300"
            )}
          >
            <div className="pl-5 text-slate-400">
              <Search className="h-[18px] w-[18px]" />
            </div>
            <input 
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-slate-400 h-12 px-3 text-sm font-medium w-full text-slate-800"
              style={{ outline: 'none', boxShadow: 'none' }}
              onFocus={() => setIsFocused(true)}
            />
            <div className="pr-3 flex items-center">
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border bg-slate-50 px-2 py-1 font-mono text-[10px] font-bold text-slate-500">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          {/* Search Dropdown Popup */}
          {isFocused && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-40 flex flex-col max-h-[400px]">
              <div className="overflow-y-auto custom-scrollbar p-3">
                {searchQuery.length === 0 ? (
                  // Recent Searches View
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">Recent Searches</h3>
                    <div className="flex flex-col gap-1">
                      {RECENT_SEARCHES.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelect(item.href)}
                          className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <History className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-950">{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Search Results View
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">Search Results</h3>
                    {filteredResults.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {filteredResults.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelect(item.href)}
                              className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-950">{item.label}</span>
                                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.category}</span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm font-medium text-slate-500 flex flex-col items-center gap-2">
                        <Search className="h-6 w-6 text-slate-300 mb-2" />
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center justify-end gap-5 w-auto">
        <div className="hidden xl:flex items-center gap-2 mr-2">
          <Button asChild variant="outline" className="rounded-full border-slate-200 text-slate-600 font-bold h-10 px-4 shadow-sm hover:bg-slate-50 transition-all text-xs">
            <Link href="/admin/payments/new">
              <CreditCard className="h-3.5 w-3.5 mr-1.5" />
              Receive
            </Link>
          </Button>
          <Button asChild className="rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold h-10 px-4 shadow-md shadow-indigo-200 transition-all text-white text-xs">
            <Link href="/admin/students/new">
              <Plus className="h-4 w-4 mr-1" />
              Add Student
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="relative rounded-full h-11 w-11 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            <MessageSquare className="h-[22px] w-[22px]" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </Button>
          <Button variant="ghost" size="icon" className="relative rounded-full h-11 w-11 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            <Bell className="h-[22px] w-[22px]" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </Button>
        </div>
        
        <UserNav email={email} />
      </div>
      </div>

      {isTrainingRoute && (
        <div className="px-8 -mt-2">
          <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {trainingNavItems.map((item) => {
              const isActive =
                item.href === "/admin/training"
                  ? pathname === "/admin/training"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
                    "whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium flex items-center gap-2"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className={cn(
                    isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-500",
                    "h-4 w-4"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
