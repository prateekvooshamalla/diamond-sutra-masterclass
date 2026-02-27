import type { Locale } from "@/Services/i18n"
import { LmsShell } from "@/components/lms/LmsShell"

export default async function DashboardLayout({
  params,
  children,
}: {
  params: Promise<{ locale: Locale }>
  children: React.ReactNode
}) {
  const { locale } = await params // ✅ unwrap params

  return <LmsShell locale={locale}>{children}</LmsShell>
}