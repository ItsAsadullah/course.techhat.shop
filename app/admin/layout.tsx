import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppSidebar } from "@/components/admin/app-sidebar";
import { MobileNav } from "@/components/admin/mobile-nav";
import { TopBar } from "@/components/admin/top-bar";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/admin/supabase/server";
import { AdminThemeProvider, AdminThemeInit } from "@/components/admin/admin-theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechHat Computer Training Center",
  description: "Student Management & Accounting System",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-admin-background min-h-screen`}
    >
      <AdminThemeInit />
      <AdminThemeProvider>
        {/* Login page has its own centered layout */}
        {!user ? (
          <>{children}</>
        ) : (
          <>
            <MobileNav />
            <div 
              className="flex h-screen overflow-hidden" 
              style={{ 
                background: 'var(--admin-sidebar-bg)',
                backgroundSize: '320px 100%',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#0f172a' // Fallback color behind main if needed
              }}
            >
              <AppSidebar />
              <main className="flex-1 h-full overflow-y-auto relative bg-admin-background rounded-l-[40px] flex flex-col shadow-2xl">
                <TopBar email={user.email} />
                <div className="px-6 md:px-8 pb-8 pt-4 flex-1">
                  {children}
                </div>
              </main>
            </div>
          </>
        )}
      </AdminThemeProvider>
    </div>
  );
}
