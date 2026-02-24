import type { Locale } from "@/lib/i18n"
import { LmsShell } from "@/components/lms/LmsShell"

export default function DashboardLayout({ params, children }: { params: { locale: Locale }; children: React.ReactNode }) {
  return <LmsShell locale={params.locale}>{children}</LmsShell>
}
