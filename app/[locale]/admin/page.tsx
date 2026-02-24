"use client"
import * as React from "react"
import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/admin/PageHeader"

const actions = [
  { href: "course", title: "Edit Course", description: "Update schedule, modules, and recordings." },
  { href: "users", title: "Manage Users", description: "Review profiles and manage roles." },
  { href: "enrollments", title: "Enrollments", description: "Activate or deactivate enrollments." },
]

export default function AdminOverview({ params }: { params: { locale: Locale } }) {
  const { loading, isAdmin } = useAdminGuard(params.locale)
  const [courseMeta, setCourseMeta] = React.useState<{ zoomLink?: string; recordingsCount: number } | null>(null)

  React.useEffect(() => {
    async function load() {
      if (!isAdmin) return
      const snap = await getDoc(doc(db, "courses", "diamond-sutra"))
      const data = snap.exists() ? (snap.data() as any) : {}
      setCourseMeta({
        zoomLink: data.zoomLink,
        recordingsCount: data.recordings?.length ?? 0,
      })
    }
    load()
  }, [isAdmin])

  if (loading || !isAdmin) return null

  return (
    <div className="space-y-6">
      <PageHeader
        label="Admin"
        title="Overview"
        description="Quick actions to manage the program."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={`/${params.locale}/admin/${action.href}`}>
            <Card className="h-full border-border bg-card transition hover:border-palm/30">
              <CardHeader>
                <CardTitle className="text-base font-semibold">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs font-medium text-palm">Open</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">System status</CardTitle>
          <CardDescription>Live course signals and content readiness.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-mutedForeground">
          <div className="flex items-center justify-between">
            <span>Zoom link</span>
            <span className="text-ink">{courseMeta?.zoomLink ? "Connected" : "Missing"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Recordings</span>
            <span className="text-ink">{courseMeta?.recordingsCount ?? 0}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
