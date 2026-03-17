"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/Services/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecordingPlayerDialog } from "@/components/lms/RecordingPlayerDialog"

// ─── types ────────────────────────────────────────────────────────────────────

type Recording = {
  title: string
  driveEmbedUrl: string
  date?: string
  courseTitle?: string
  moduleName?: string
  duration?: number
}

type Lesson = {
  id: string
  order: number
  title: string
  description?: string
  videoUrl?: string
  videoType?: "youtube" | "drive" | "upload" | ""
  duration?: number
  isFreePreview?: boolean
  resourceLink?: string
  driveEmbedUrl?: string
}

type Module = {
  id: string
  order: number
  title: string
  lessons: Lesson[]
}

type Course = {
  id: string
  title: string
  recordings?: { title: string; driveEmbedUrl: string; date?: string }[]
  modules?: Module[]
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function getEmbedUrl(url: string, type?: string): string {
  if (!url) return ""
  if (
    type === "youtube" ||
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  ) {
    const match =
      url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
    const id = match?.[1]
    return id ? `https://www.youtube.com/embed/${id}` : url
  }
  if (url.includes("firebasestorage.googleapis.com")) return url
  return url.replace("/view", "/preview").replace("/edit", "/preview")
}

function extractRecordings(course: Course): Recording[] {
  const result: Recording[] = []

  // 1. Legacy top-level recordings array
  if (course.recordings?.length) {
    course.recordings.forEach((r) => {
      if (r.driveEmbedUrl || r.title) {
        result.push({
          title: r.title,
          driveEmbedUrl: r.driveEmbedUrl,
          date: r.date,
          courseTitle: course.title,
          moduleName: "Recordings",
        })
      }
    })
  }

  // 2. Lesson videoUrls inside modules
  if (course.modules?.length) {
    course.modules
      .sort((a, b) => a.order - b.order)
      .forEach((module) => {
        ;(module.lessons ?? [])
          .sort((a, b) => a.order - b.order)
          .forEach((lesson) => {
            const videoUrl = lesson.videoUrl || lesson.driveEmbedUrl
            if (videoUrl && lesson.title) {
              result.push({
                title: lesson.title,
                driveEmbedUrl: getEmbedUrl(videoUrl, lesson.videoType),
                courseTitle: course.title,
                moduleName: module.title,
                duration: lesson.duration,
              })
            }
          })
      })
  }

  return result
}

// ─── component ────────────────────────────────────────────────────────────────

export default function RecordingsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const router = useRouter()
  const { user, loading } = useUser()

  const [courses, setCourses] = React.useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null)
  const [pageLoading, setPageLoading] = React.useState(true)
  const [pageError, setPageError] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [activeRecording, setActiveRecording] = React.useState<Recording | null>(null)

  // ── redirect if not logged in ─────────────────────────────────────────────
  React.useEffect(() => {
    if (!loading && !user) router.push(`/${locale}`)
  }, [loading, user, router, locale])

  // ── load courses ──────────────────────────────────────────────────────────
  React.useEffect(() => {
    async function load() {
      if (!user) return

      setPageLoading(true)
      setPageError(null)

      try {
        await user.getIdToken(true)

        // 1. Check once if this user is an LMS admin
        const userDocSnap = await getDoc(doc(db, "users", user.uid))
        const isLmsAdmin =
          userDocSnap.exists() && userDocSnap.data().role === "admin"

        // 2. Fetch all courses
        const coursesSnap = await getDocs(collection(db, "courses"))

        // 3. For each course, check enrollment (skip check for admins)
        const enrollmentChecks = await Promise.all(
          coursesSnap.docs.map(async (courseDoc) => {

            if (!isLmsAdmin) {
              // Regular user — must have active or pending_payment enrollment
              const enrollSnap = await getDoc(
                doc(db, "enrollments", `${user.uid}_${courseDoc.id}`)
              )
              const enrollStatus = enrollSnap.exists()
                ? enrollSnap.data().status
                : null

              if (!enrollStatus || enrollStatus === "not_enrolled") {
                return null
              }
            }

            // Admin bypasses enrollment check — sees all courses
            const data = courseDoc.data()
            return {
              id: courseDoc.id,
              title: data.title,
              recordings: data.recordings ?? [],
              modules: (data.modules ?? []).map((m: any) => ({
                ...m,
                lessons: m.lessons ?? [],
              })),
            } as Course
          })
        )

        // Filter out nulls (not enrolled)
        const enrolledCourses = enrollmentChecks.filter(
          (c): c is Course => c !== null
        )

        // Only keep courses that have recordings or lesson videos
        const withRecordings = enrolledCourses.filter(
          (c) => extractRecordings(c).length > 0
        )

        setCourses(withRecordings)
        if (withRecordings.length > 0) {
          setSelectedCourseId(withRecordings[0].id)
        }
      } catch (e: any) {
        console.error("Recordings load error:", e.code, e.message)
        setPageError(e?.message ?? "Failed to load recordings")
      } finally {
        setPageLoading(false)
      }
    }

    load()
  }, [user])

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null
  const recordings = selectedCourse ? extractRecordings(selectedCourse) : []

  function handleWatch(recording: Recording) {
    setActiveRecording(recording)
    setOpen(true)
  }

  // ── loading skeleton ──────────────────────────────────────────────────────
  if (loading || pageLoading) {
    return (
      <div className="w-full space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-mutedForeground">
            Recordings
          </p>
          <h1 className="mt-2 text-lg font-semibold">Recordings</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-6 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="aspect-video bg-muted rounded-lg" />
                <div className="h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // ── error ─────────────────────────────────────────────────────────────────
  if (pageError) {
    return (
      <div className="w-full space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-mutedForeground">
            Recordings
          </p>
          <h1 className="mt-2 text-lg font-semibold">Recordings</h1>
        </div>
        <Card className="border-red-200/70 bg-red-50/60">
          <CardContent className="py-4 text-sm text-red-700">
            {pageError}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── not enrolled / empty state ────────────────────────────────────────────
  if (courses.length === 0) {
    return (
      <div className="w-full space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-mutedForeground">
            Recordings
          </p>
          <h1 className="mt-2 text-lg font-semibold">Recordings</h1>
        </div>
        <Card className="border-border/70">
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-4">🔒</p>
            <p className="font-semibold">No recordings available</p>
            <p className="text-sm text-mutedForeground mt-1">
              You need to be enrolled in a course to access its recordings.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push(`/${locale}`)}
            >
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── main render ───────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-6">

      {/* ── Page Header ── */}
      <div>
        <p className="text-xs uppercase tracking-wide text-mutedForeground">
          Recordings
        </p>
        <h1 className="mt-2 text-lg font-semibold">
          {selectedCourse?.title ?? "Recordings"}
        </h1>
        <p className="mt-1 text-sm text-mutedForeground">
          Watch past sessions at your own pace.
        </p>
      </div>

      {/* ── Course Tabs ── */}
      {courses.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {courses.map((course) => (
            <Button
              key={course.id}
              size="sm"
              variant={selectedCourseId === course.id ? "default" : "outline"}
              onClick={() => setSelectedCourseId(course.id)}
            >
              {course.title}
              <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0">
                {extractRecordings(course).length}
              </Badge>
            </Button>
          ))}
        </div>
      )}

      {/* ── Count ── */}
      <p className="text-sm text-mutedForeground">
        {recordings.length} recording{recordings.length !== 1 ? "s" : ""} available
      </p>

      {/* ── Recordings Grid ── */}
      {recordings.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-mutedForeground">
            No recordings in this course yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recordings.map((recording, index) => (
            <Card
              key={`${recording.title}-${index}`}
              className="group border-border bg-card transition-all hover:border-palm/40 hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">
                  {recording.moduleName
                    ? `📂 ${recording.moduleName}`
                    : `Recording ${index + 1}`}
                </CardDescription>
                <CardTitle className="mt-1 text-base font-semibold line-clamp-2">
                  {recording.title}
                </CardTitle>
                {recording.duration ? (
                  <p className="text-xs text-mutedForeground">
                    ⏱ {recording.duration} min
                  </p>
                ) : null}
              </CardHeader>

              <CardContent className="space-y-3">
                <div
                  className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/60 bg-muted cursor-pointer"
                  onClick={() => handleWatch(recording)}
                >
                  {recording.driveEmbedUrl ? (
                    <>
                      <iframe
                        src={recording.driveEmbedUrl}
                        className="pointer-events-none h-full w-full scale-110 blur-[1px]"
                        title={recording.title}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                          <span className="ml-1 text-xl">▶️</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-3xl">🎬</span>
                    </div>
                  )}
                </div>

                <Button className="w-full" onClick={() => handleWatch(recording)}>
                  Watch Recording
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Player Dialog ── */}
      <RecordingPlayerDialog
        open={open}
        onOpenChange={setOpen}
        recording={activeRecording}
      />
    </div>
  )
}