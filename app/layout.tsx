import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalLangProvider } from "@/context/GlobalLangContext";
import { cookies } from "next/headers";
import { DisableRightClick } from "@/components/DisableRightClick";
import PwaRegistration from "@/components/PwaRegistration";
import { Toaster } from "sonner";
import { getSettingsByGroup } from "@/lib/actions/settings.actions";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const generalGroup = await getSettingsByGroup('general');
  const getSetting = (key: string, defaultVal: string = '') => {
    return generalGroup?.settings.find(s => s.key === key)?.value || defaultVal;
  };

  const orgName = getSetting('org_name', 'TechHat');
  const orgShortName = getSetting('org_short_name', 'TechHat');
  const siteDomain = getSetting('site_domain', 'course.techhat.shop');
  const siteLogo = getSetting('site_logo', '/logo.png');
  const siteFavicon = getSetting('site_favicon', '/favicon.ico');
  const siteOgImage = getSetting('site_og_image', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop');

  return {
    title: `${orgName} | Premium IT Education & Skill Development`,
    description: `Join thousands of successful students and transform your career with ${orgName}'s industry-leading premium computer training programs.`,
    keywords: ["IT Training", "Web Development Course", "Freelancing Bangladesh", orgName, orgShortName, "Skill Development"],
    icons: {
      icon: siteFavicon,
      apple: siteFavicon,
    },
    openGraph: {
      title: `${orgName} | Premium IT Education`,
      description: `Build your future with ${orgName}'s project-based learning.`,
      url: `https://${siteDomain}`,
      siteName: orgName,
      images: [
        {
          url: siteOgImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("techhat-lang")?.value as "en" | "bn" | undefined;
  const initialLang = langCookie || "bn";

  // Fetch settings for global client provider
  const generalGroup = await getSettingsByGroup('general');
  const getSetting = (key: string, defaultVal: string = '') => {
    return generalGroup?.settings.find(s => s.key === key)?.value || defaultVal;
  };

  const siteSettings = {
    siteLogo: getSetting('site_logo', '/logo.png'),
    siteFavicon: getSetting('site_favicon', '/favicon.ico'),
    siteOgImage: getSetting('site_og_image', '/logo.png'),
    orgName: getSetting('org_name', 'TechHat'),
    orgShortName: getSetting('org_short_name', 'TechHat'),
  };

  return (
    <html lang={initialLang} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${hindSiliguri.variable} font-sans min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased ${process.env.NODE_ENV === "production" ? "select-none" : ""}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GlobalLangProvider initialLang={initialLang}>
            <SiteSettingsProvider settings={siteSettings}>
              <PwaRegistration />
              <DisableRightClick />
              {children}
              <Toaster richColors position="top-right" />
            </SiteSettingsProvider>
          </GlobalLangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
