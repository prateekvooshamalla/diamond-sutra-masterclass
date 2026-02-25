import "@/app/globals.css"
import type { Metadata } from "next"
import { locales, type Locale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Diamond Sutra Masterclass | SIF (Palm Leaf Sutra)",
  description: "15-day live Diamond Sutra masterclass by Dr. Rajesh Savera. Offer price ₹99 (original ₹5000). Live on Zoom.",
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  return (
    <html lang={locale}>
      <body>
        <div className="texture-overlay" />
        {children}
      </body>
    </html>
  )
}
