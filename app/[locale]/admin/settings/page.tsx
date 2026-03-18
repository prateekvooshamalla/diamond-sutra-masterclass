"use client"

import * as React from "react"
import { use } from "react"
import Link from "next/link"
import type { Locale } from "@/Services/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/admin/PageHeader"

export default function AdminSettingsHome({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const { loading, isAdmin } = useAdminGuard(locale)

  const settingsLinks = [
    { href: `/${locale}/admin/course`, title: "Course", description: "Core program settings." },
    { href: `/${locale}/admin/settings/access`, title: "Access", description: "Admin roles and permissions." },
    { href: `/${locale}/admin/settings/audit`, title: "Audit", description: "Recent admin activity." },
    { href: `/${locale}/admin/settings/profile`, title: "Profile", description: "Your admin account details." },
  ]

  if (loading) return null
  if (!isAdmin) return null

  return (
    <main className="space-y-6">
      <PageHeader
        label="Admin"
        title="Settings"
        description="Manage your course, access controls, audit logs, and profile."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {settingsLinks.map((item) => (
          <Link key={item.href} href={item.href}>
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
    </main>
  )
}