"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/lib/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getNextClassInfo } from "@/lib/nextClass"

type Course = {
  title: string
  zoomLink?: string
  recordings?: { title: string; driveEmbedUrl: string }[]
  modules?: { title: string; items: string[] }[]
  startDate?: string
  classTimeStart?: string
  classTimeEnd?: string
  timezone?: string
  instructorName?: string
   schedule?: string 
}

type EnrollmentStatus = "not_enrolled" | "active"

export default function Dashboard({ params }: { params: { locale: Locale } }) {
  const router = useRouter()
  const { user, profile, loading } = useUser()
  const [status, setStatus] = React.useState<EnrollmentStatus>("not_enrolled")
  const [course, setCourse] = React.useState<Course | null>(null)
  const [checkInLoading, setCheckInLoading] = React.useState(false)
  const [pageLoading, setPageLoading] = React.useState(true)
  const [pageError, setPageError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.push(`/${params.locale}`)
  }, [loading, user, router, params.locale])

  React.useEffect(() => {
    async function load() {
      if (!user) return
      setPageLoading(true)
      setPageError(null)
      try {
        const enrollmentSnap = await getDoc(doc(db, "masterclass", "diamond-sutra", "users", user.uid))
        setStatus(
          enrollmentSnap.exists()
            ? ((enrollmentSnap.data() as any).status ?? "not_enrolled")
            : "not_enrolled"
        )

        const courseSnap = await getDoc(doc(db, "courses", "diamond-sutra"))
        setCourse(courseSnap.exists() ? (courseSnap.data() as any) : null)
      } catch (e: any) {
        setPageError(e?.message ?? "Failed to load dashboard")
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, [user])

  async function handleCheckIn() {
    if (!user) return
    setCheckInLoading(true)
    try {
      await setDoc(
        doc(db, "enrollments", `${user.uid}_diamond-sutra`),
        {
          uid: user.uid,
          courseId: "diamond-sutra",
          status: "active",
          checkedInAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      setStatus("active")
    } catch (e: any) {
      setPageError(e?.message ?? "Check-in failed")
    } finally {
      setCheckInLoading(false)
    }
  }

  const canJoin = status === "active" && Boolean(course?.zoomLink)
  const statusLabel = status === "active" ? "Active" : "Not Enrolled"
  const instructorName = course?.instructorName ?? "Dr. Rajesh Savera"
  const classTimeStart = course?.classTimeStart ?? "06:00"
  const classTimeEnd = course?.classTimeEnd ?? "07:00"
  const timeZone = course?.timezone
  const scheduleText = course?.schedule ?? "15 days • 6:00–7:00 AM • Live Zoom"
  const moduleCount = course?.modules?.length ?? 0
  const recordingCount = course?.recordings?.length ?? 0
  const daysCompleted = course?.startDate
    ? Math.max(0, Math.min(15, Math.ceil((Date.now() - new Date(course.startDate).getTime()) / 86400000)))
    : 3
  const previewModules = course?.modules?.slice(0, 2) ?? []
  const previewRecordings = course?.recordings?.slice(0, 2) ?? []
  const nextClass = getNextClassInfo(course?.startDate, classTimeStart, timeZone)
  const greetingName = profile?.name ?? user?.displayName ?? "Student"
  const timeLabel = (value: string) => {
    const [hourPart, minutePart] = value.split(":")
    const hour = Number(hourPart)
    const minute = Number(minutePart)
    if (Number.isNaN(hour) || Number.isNaN(minute)) return value
    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      ...(timeZone ? { timeZone } : {}),
    }).format(date)
  }
  const timeRangeLabel = `${timeLabel(classTimeStart)}–${timeLabel(classTimeEnd)}`

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-mutedForeground">My Learning</p>
        <h1 className="mt-2 text-lg font-semibold">Welcome, {greetingName}</h1>
      </div>

      {pageError ? (
        <Card className="mb-6 border-red-200/70 bg-red-50/60">
          <CardContent className="py-4 text-sm text-red-700">{pageError}</CardContent>
        </Card>
      ) : null}

      {pageLoading ? (
        <div className="grid gap-3 lg:grid-cols-12">
          {[0, 1].map((i) => (
            <Card key={i} className="animate-pulse lg:col-span-6">
              <CardHeader>
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-10 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="h-3 w-3/5 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Upcoming class</CardDescription>
                  <CardTitle className="mt-2 text-lg font-semibold">Upcoming Live Class</CardTitle>
                </div>
                <Badge className="w-fit px-3 py-1 text-xs font-semibold">{statusLabel}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm text-mutedForeground md:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-mutedForeground">Date & time</p>
                    <p className="mt-1 text-sm font-medium text-ink">{nextClass.label}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-mutedForeground">Duration</p>
                    <p className="mt-1 text-sm font-medium text-ink">{timeRangeLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-mutedForeground">Instructor</p>
                    <p className="mt-1 text-sm font-medium text-ink">{instructorName}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={status === "active" ? () => (course?.zoomLink ? window.open(course.zoomLink, "_blank") : null) : handleCheckIn}
                    disabled={status === "active" ? !canJoin : checkInLoading}
                  >
                    {status === "active" ? "Join Zoom" : checkInLoading ? "Checking in..." : "Check-in to Join Batch"}
                  </Button>
                  <Button variant="outline" onClick={() => router.push(`/${params.locale}/dashboard/content`)}>
                    View Course Content
                  </Button>
                </div>
                {!course?.zoomLink ? (
                  <p className="text-xs text-mutedForeground">Zoom link will be updated by admin.</p>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Continue learning</CardDescription>
                  <CardTitle className="mt-2 text-lg font-semibold">Diamond Sutra Masterclass</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 lg:grid-cols-[minmax(0,1fr),200px]">
                <div className="space-y-4">
                  <div className="space-y-1 text-sm text-mutedForeground">
                    <p><span className="font-medium text-ink">Instructor:</span> {instructorName}</p>
                    <div className="flex flex-wrap gap-2 pt-2 text-xs uppercase tracking-[0.2em] text-mutedForeground">
                      <span className="rounded-full border border-border bg-muted/40 px-3 py-1">15 days</span>
                      <span className="rounded-full border border-border bg-muted/40 px-3 py-1">Live Zoom</span>
                      <span className="rounded-full border border-border bg-muted/40 px-3 py-1">Morning {timeRangeLabel}</span>
                    </div>
                    <p className="pt-2 text-sm text-mutedForeground">{scheduleText}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={status === "active" ? () => (course?.zoomLink ? window.open(course.zoomLink, "_blank") : null) : handleCheckIn}
                      disabled={status === "active" ? !canJoin : checkInLoading}
                    >
                      {status === "active" ? "Join Live Zoom" : checkInLoading ? "Checking in..." : "Check-in to Join Batch"}
                    </Button>
                    <Button variant="outline" onClick={() => router.push(`/${params.locale}/dashboard/content`)}>
                      View Course Content
                    </Button>
                  </div>
                  {status === "active" && !canJoin ? (
                    <p className="text-xs text-mutedForeground">Zoom link will be updated by admin.</p>
                  ) : null}
                </div>
                <div className="overflow-hidden rounded-lg border border-border/60 bg-white">
                  <img
                    src="https://placehold.co/260x180?text=Course+Preview"
                    alt="Course preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Days completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-ink">{daysCompleted}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Total modules</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-ink">{moduleCount}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Recordings available</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-ink">{recordingCount}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Course content</CardDescription>
                <CardTitle className="mt-2 text-lg font-semibold">Course content preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {previewModules.length ? (
                  previewModules.map((module, idx) => (
                    <div key={idx} className="rounded-lg border border-border/60 bg-muted/40 p-4">
                      <p className="font-medium text-ink">{module.title}</p>
                      <ul className="mt-2 ml-5 list-disc text-sm text-mutedForeground">
                        {module.items.slice(0, 4).map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-mutedForeground">No modules configured yet.</p>
                )}
                <Button variant="outline" onClick={() => router.push(`/${params.locale}/dashboard/content`)}>
                  Go to Course Content
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Recordings</CardDescription>
                <CardTitle className="mt-2 text-lg font-semibold">Recordings preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {previewRecordings.length ? (
                  previewRecordings.map((recording, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-sm font-medium text-ink">{recording.title}</p>
                      <div className="aspect-video overflow-hidden rounded-lg border border-border/60 bg-muted">
                        <iframe
                          src={recording.driveEmbedUrl}
                          className="h-full w-full"
                          allow="autoplay"
                          title={recording.title}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-mutedForeground">No recordings added yet.</p>
                )}
                <Button variant="outline" onClick={() => router.push(`/${params.locale}/dashboard/recordings`)}>
                  Go to Recordings
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="hidden space-y-6 lg:col-span-4 lg:block">
            <Card>
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Quick links</CardDescription>
                <CardTitle className="mt-2 text-lg font-semibold">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <button
                  type="button"
                  className="w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-left text-ink transition hover:bg-muted"
                  onClick={() => (course?.zoomLink ? window.open(course.zoomLink, "_blank") : null)}
                  disabled={!canJoin}
                >
                  Zoom classroom
                </button>
                <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-mutedForeground">
                  WhatsApp group (coming soon)
                </div>
                <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-mutedForeground">
                  Support: support@sifmind.com
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Announcements</CardDescription>
                <CardTitle className="mt-2 text-lg font-semibold">Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-mutedForeground">No announcements yet.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
