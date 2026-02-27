"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/Services/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/Services/utils"

type Course = {
  title: string
  zoomLink?: string
  modules?: { title: string; items: string[] }[]
}

type EnrollmentStatus = "not_enrolled" | "active"

type LessonSelection = {
  moduleTitle: string
  itemTitle: string
}

export default function CourseContentPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params) // ✅ unwrap params

  const router = useRouter()
  const { user, loading } = useUser()

  const [status, setStatus] = React.useState<EnrollmentStatus>("not_enrolled")
  const [course, setCourse] = React.useState<Course | null>(null)
  const [pageLoading, setPageLoading] = React.useState(true)
  const [pageError, setPageError] = React.useState<string | null>(null)
  const [selection, setSelection] = React.useState<LessonSelection | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.push(`/${locale}`)
  }, [loading, user, router, locale])

  React.useEffect(() => {
    async function load() {
      if (!user) return

      setPageLoading(true)
      setPageError(null)

      try {
        const enrollmentSnap = await getDoc(
          doc(db, "enrollments", `${user.uid}_diamond-sutra`)
        )

        setStatus(
          enrollmentSnap.exists()
            ? ((enrollmentSnap.data() as any).status ?? "not_enrolled")
            : "not_enrolled"
        )

        const courseSnap = await getDoc(
          doc(db, "courses", "diamond-sutra")
        )

        const courseData = courseSnap.exists()
          ? (courseSnap.data() as any)
          : null

        setCourse(courseData)

        if (courseData?.modules?.length && !selection) {
          const firstModule = courseData.modules[0]
          const firstItem = firstModule?.items?.[0]
          if (firstModule?.title && firstItem) {
            setSelection({
              moduleTitle: firstModule.title,
              itemTitle: firstItem,
            })
          }
        }
      } catch (e: any) {
        setPageError(e?.message ?? "Failed to load course content")
      } finally {
        setPageLoading(false)
      }
    }

    load()
  }, [user])

  const canJoin = status === "active" && Boolean(course?.zoomLink)
  const statusLabel = status === "active" ? "Active" : "Not Enrolled"

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-mutedForeground">
            Course content
          </p>
          <h1 className="mt-2 text-lg font-semibold">
            Diamond Sutra Masterclass
          </h1>
          <p className="mt-1 text-sm text-mutedForeground">
            Browse modules and continue where you left off.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="px-3 py-1 text-xs font-semibold">
            {statusLabel}
          </Badge>

          <Button
            onClick={() =>
              course?.zoomLink
                ? window.open(course.zoomLink, "_blank")
                : null
            }
            disabled={!canJoin}
          >
            Join Zoom
          </Button>
        </div>
      </div>

      {pageError ? (
        <Card className="mb-6 border-red-200/70 bg-red-50/60">
          <CardContent className="py-4 text-sm text-red-700">
            {pageError}
          </CardContent>
        </Card>
      ) : null}

      {pageLoading ? (
        <p className="text-sm text-mutedForeground">
          Loading course content...
        </p>
      ) : (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/dashboard`)}
          >
            Back to My Learning
          </Button>
        </div>
      )}
    </div>
  )
}