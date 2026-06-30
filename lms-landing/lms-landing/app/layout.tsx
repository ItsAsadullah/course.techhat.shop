import type { Metadata } from "next"
import { Hind_Siliguri } from "next/font/google"
import "./globals.css"

// Bengali-compatible Google Font
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "EduCore IT Training Center",
    template: "%s | EduCore IT",
  },
  description: "বাংলাদেশের শীর্ষ কম্পিউটার প্রশিক্ষণ কেন্দ্র",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className={`${hindSiliguri.className} antialiased bg-white text-slate-900`}>
        {children}
      </body>
    </html>
  )
}
