import type { Locale } from "@/Services/i18n"
import { AppShell } from "@/components/shell/AppShell"

export default async function AppLayout({
  params,
  children,
}: {
  params: Promise<{ locale: Locale }>
  children: React.ReactNode
}) {
  const { locale } = await params

  return <AppShell locale={locale}>{children}</AppShell>
}