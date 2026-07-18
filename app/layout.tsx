import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalLangProvider } from "@/context/GlobalLangContext";
import { cookies } from "next/headers";
import { DisableRightClick } from "@/components/DisableRightClick";
import PwaRegistration from "@/components/PwaRegistration";
import { Toaster } from "sonner";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TechHat | Premium IT Education & Skill Development",
  description: "Join thousands of successful students and transform your career with TechHat's industry-leading premium computer training programs. Learn Web Development, Graphics Design, and Digital Marketing from experts.",
  keywords: ["IT Training", "Web Development Course", "Freelancing Bangladesh", "TechHat", "Skill Development"],
  openGraph: {
    title: "TechHat | Premium IT Education",
    description: "Build your future with TechHat's project-based learning.",
    url: "https://course.techhat.shop",
    siteName: "TechHat",
    images: [
      {
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("techhat-lang")?.value as "en" | "bn" | undefined;
  const initialLang = langCookie || "bn";

  return (
    <html lang={initialLang} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${hindSiliguri.variable} font-sans min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased ${process.env.NODE_ENV === "production" ? "select-none" : ""}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GlobalLangProvider initialLang={initialLang}>
            <PwaRegistration />
            <DisableRightClick />
            {children}
            <Toaster richColors position="top-right" />
          </GlobalLangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
