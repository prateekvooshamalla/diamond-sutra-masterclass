"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/Services/firebase"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// ─── types ────────────────────────────────────────────────────────────────────

type EnrolledCourse = {
  id: string
  title: string
  zoomLink?: string
  schedule?: string
  instructorName?: string
  nextSessionAt?: string  // ISO datetime e.g. "2026-03-25T06:00:00"
  modules?: any[]
  enrollStatus: "active" | "pending_payment" | "not_enrolled"
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(new Date(iso))
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(iso))
}

function isLive(iso: string): boolean {
  const t = new Date(iso).getTime()
  const now = Date.now()
  return now >= t - 10 * 60 * 1000 && now <= t + 3 * 60 * 60 * 1000
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function MyLearningDashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const router = useRouter()
  const { user, profile, loading } = useUser()

  const [courses, setCourses] = React.useState<EnrolledCourse[]>([])
  const [pageLoading, setPageLoading] = React.useState(true)
  const [tick, setTick] = React.useState(0)

  // tick every 30s to re-evaluate live status
  React.useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000)
    return () => clearInterval(t)
  }, [])

  React.useEffect(() => {
    if (!loading && !user) router.push(`/${locale}`)
  }, [loading, user, router, locale])

  React.useEffect(() => {
    async function load() {
      if (!user) return
      setPageLoading(true)
      try {
        const snap = await getDocs(collection(db, "courses"))
        const results: EnrolledCourse[] = []

        await Promise.all(
          snap.docs.map(async (courseDoc) => {
            const enrollSnap = await getDoc(
              doc(db, "enrollments", `${user.uid}_${courseDoc.id}`)
            )
            if (!enrollSnap.exists()) return
            const status = enrollSnap.data().status ?? "not_enrolled"
            if (status === "not_enrolled") return

            const d = courseDoc.data()
            results.push({
              id: courseDoc.id,
              title: d.title ?? "Untitled",
              zoomLink: d.zoomLink,
              schedule: d.schedule,
              instructorName: d.instructorName,
              nextSessionAt: d.nextSessionAt ?? null,
              modules: d.modules ?? [],
              enrollStatus: status,
            })
          })
        )

        setCourses(results)
      } catch (e) {
        console.error(e)
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, [user])

  if (loading || pageLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 bg-muted rounded animate-pulse" />
        <div className="h-36 bg-muted rounded-xl animate-pulse" />
        <div className="h-24 bg-muted rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* ── Welcome ── */}
      <div>
        <p className="text-xs uppercase tracking-wide text-mutedForeground">My Learning</p>
        <h1 className="mt-1 text-xl font-semibold">
          Welcome back, {profile?.name?.split(" ")[0] ?? "Student"} 👋
        </h1>
      </div>

      {/* ── Upcoming Sessions ── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Upcoming Sessions</h2>

        {courses.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center space-y-3">
              <p className="text-3xl">📚</p>
              <p className="font-medium text-sm">No courses enrolled yet</p>
              <p className="text-xs text-mutedForeground">
                Enroll in a course to see your upcoming sessions here.
              </p>
              <Button variant="secondary" size="sm" onClick={() => router.push(`/${locale}`)}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => {
            const hasSession = Boolean(course.nextSessionAt)
            const live = hasSession ? isLive(course.nextSessionAt!) : false
            const isActive = course.enrollStatus === "active"
            const isPending = course.enrollStatus === "pending_payment"
            const canJoin = live && isActive && Boolean(course.zoomLink)

            return (
              <Card key={course.id} className="border-border/70">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    {/* ── Left: info ── */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-base truncate">{course.title}</p>
                        {isPending && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs border-0">
                            Pending Payment
                          </Badge>
                        )}
                        {isActive && (
                          <Badge className="bg-green-100 text-green-700 text-xs border-0">
                            Active
                          </Badge>
                        )}
                      </div>

                      {course.instructorName && (
                        <p className="text-xs text-mutedForeground">
                          Instructor: {course.instructorName}
                        </p>
                      )}

                      {/* Session timing box */}
                      {hasSession ? (
                        <div className="mt-1 rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-mutedForeground mb-1">
                            {live ? "🔴 Live right now" : "⏰ Next session"}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(course.nextSessionAt!)}
                          </p>
                          <p className="text-xs text-mutedForeground mt-0.5">
                            {formatTime(course.nextSessionAt!)}
                            {course.schedule ? `  ·  ${course.schedule}` : ""}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-mutedForeground italic">
                          No session scheduled yet.
                          {course.schedule ? `  Schedule: ${course.schedule}` : ""}
                        </p>
                      )}

                      {isPending && (
                        <p className="text-xs text-amber-600">
                          ⚠️ Your payment is under review. You'll get access once confirmed.
                        </p>
                      )}
                    </div>

                    {/* ── Right: Join button ── */}
                    <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-1.5">
                      <button
                        disabled={!canJoin}
                        onClick={() => canJoin && window.open(course.zoomLink, "_blank")}
                        className={[
                          "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 min-w-[110px] text-center",
                          canJoin
                            ? "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-md shadow-orange-200 cursor-pointer"
                            : "bg-muted text-mutedForeground cursor-not-allowed",
                        ].join(" ")}
                      >
                        {live ? "🔴 Join Now" : "Join Now"}
                      </button>

                      {hasSession && !live && (
                        <p className="text-[11px] text-mutedForeground text-right max-w-[130px] leading-tight">
                          Activates 10 min before class
                        </p>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </section>

      {/* ── My Courses ── */}
      {courses.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">My Courses</h2>
          <div className="space-y-2">
            {courses.map((course) => {
              const totalLessons = course.modules?.reduce(
                (acc: number, m: any) => acc + (m.lessons?.length ?? 0), 0
              ) ?? 0

              return (
                <div
                  key={course.id}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                    🎓
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{course.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      {course.instructorName && (
                        <span className="text-xs text-mutedForeground">
                          by {course.instructorName}
                        </span>
                      )}
                      {totalLessons > 0 && (
                        <span className="text-xs text-mutedForeground">
                          · {totalLessons} lessons
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 text-xs border-0">
                      Enrolled
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/${locale}/dashboard/course`)}
                    >
                      Continue →
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

    </div>
  )
}