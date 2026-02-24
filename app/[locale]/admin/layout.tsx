import type { Locale } from "@/lib/i18n"
import { AppShell } from "@/components/shell/AppShell"

export default function AdminLayout({ params, children }: { params: { locale: Locale }; children: React.ReactNode }) {
  return <AppShell locale={params.locale}>{children}</AppShell>
}
