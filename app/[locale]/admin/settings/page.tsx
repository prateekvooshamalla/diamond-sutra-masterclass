"use client"
import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const settingsLinks = [
  { href: "course", title: "Course", description: "Core program settings." },
  { href: "access", title: "Access", description: "Admin roles and permissions." },
  { href: "audit", title: "Audit", description: "Recent admin activity." },
]

export default function AdminSettingsHome({ params }: { params: { locale: Locale } }) {
  const { loading, isAdmin } = useAdminGuard(params.locale)

  if (loading || !isAdmin) return null

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {settingsLinks.map((item) => (
        <Link key={item.href} href={`/${params.locale}/admin/settings/${item.href}`}>
          <Card className="h-full border-border/70 transition hover:border-palm/30">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs font-medium text-palm">Open</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
