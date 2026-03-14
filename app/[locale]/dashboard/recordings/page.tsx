"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/Services/firebase"
import { collection, getDocs } from "firebase/firestore"
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
  // Firebase Storage — direct URL, no conversion needed
  if (url.includes("firebasestorage.googleapis.com")) return url
  // Google Drive
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

  // 2. Lesson videoUrls inside modules (new structure)
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

  // ── load all courses ──────────────────────────────────────────────────────
  React.useEffect(() => {
    async function load() {
      if (!user) return

      setPageLoading(true)
      setPageError(null)

      try {
        // Force fresh auth token so Firestore rules evaluate correctly
        await user.getIdToken(true)

        const snap = await getDocs(collection(db, "courses"))
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Course, "id">),
          modules: (d.data().modules ?? []).map((m: any) => ({
            ...m,
            lessons: m.lessons ?? [],
          })),
          recordings: d.data().recordings ?? [],
        })) as Course[]

        // only keep courses that have at least one recording/lesson video
        const withRecordings = list.filter(
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

  // ── empty state ───────────────────────────────────────────────────────────
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
            <p className="text-4xl mb-4">🎬</p>
            <p className="font-semibold">No recordings yet</p>
            <p className="text-sm text-mutedForeground mt-1">
              Add recording URLs to lessons in the admin panel — they will appear here.
            </p>
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
                {/* Thumbnail with play overlay */}
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