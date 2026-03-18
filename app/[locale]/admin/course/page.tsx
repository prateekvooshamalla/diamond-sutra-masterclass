"use client"

import * as React from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import type { Locale } from "@/Services/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/Services/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/admin/PageHeader"

// ─── types ────────────────────────────────────────────────────────────────────

type Lesson = {
  id: string
  order: number
  title: string
  duration: number
  videoUrl: string
  videoType: "youtube" | "drive" | "upload" | ""
  isFreePreview: boolean
  resourceLink: string
  description: string
}

type Module = {
  id: string
  order: number
  title: string
  description: string
  estimatedDuration: string
  lessons: Lesson[]
}

type Course = {
  id: string
  title: string
  zoomLink?: string
  batchSize?: number
  schedule?: string
  instructorName?: string
  modules: Module[]
  createdBy?: string
  createdByName?: string
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function totalLessons(course: Course) {
  return course.modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0)
}

function totalDurationMinutes(course: Course) {
  return course.modules.reduce(
    (acc, m) => acc + (m.lessons ?? []).reduce((a, l) => a + (l.duration ?? 0), 0),
    0
  )
}

function formatDuration(minutes: number) {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// ─── CourseRow ────────────────────────────────────────────────────────────────

function CourseRow({ course, onClick }: { course: Course; onClick: () => void }) {
  const lessons = totalLessons(course)
  const duration = formatDuration(totalDurationMinutes(course))

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-card hover:border-foreground/25 hover:bg-muted/30 cursor-pointer transition-all duration-150"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl select-none">
        🎓
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {course.title || "Untitled Course"}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {course.instructorName && (
            <span className="text-xs text-mutedForeground">by {course.instructorName}</span>
          )}
          {course.schedule && (
            <span className="text-xs text-mutedForeground">· {course.schedule}</span>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <Badge variant="outline" className="text-xs">
          {course.modules.length} module{course.modules.length !== 1 ? "s" : ""}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {lessons} lesson{lessons !== 1 ? "s" : ""}
        </Badge>
        {duration && (
          <Badge variant="outline" className="text-xs">
            ⏱ {duration}
          </Badge>
        )}
        {course.batchSize && (
          <Badge variant="outline" className="text-xs">
            👥 {course.batchSize}
          </Badge>
        )}
      </div>

      {/* Arrow */}
      <span className="flex-shrink-0 text-mutedForeground group-hover:text-foreground group-hover:translate-x-0.5 transition-all text-sm">
        →
      </span>
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function AdminCoursesListPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const { loading, isAdmin } = useAdminGuard(locale)
  const router = useRouter()

  const [courses, setCourses] = React.useState<Course[]>([])
  const [fetching, setFetching] = React.useState(true)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    async function load() {
      if (!isAdmin) return
      const snap = await getDocs(collection(db, "courses"))
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        modules: (d.data().modules ?? []).map((m: any) => ({
          ...m,
          lessons: m.lessons ?? [],
        })) as Module[],
      })) as Course[]
      setCourses(list)
      setFetching(false)
    }
    if (isAdmin) load()
  }, [isAdmin])

  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.instructorName?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return null
  if (!isAdmin) return null

  return (
    <main className="space-y-4">
      <PageHeader
        label="Admin"
        title="Courses"
        description="Manage your course catalogue. Click a course to edit its modules and lessons."
      />

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border py-3 flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses…"
          className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-mutedForeground"
        />
        <Button
          onClick={() => router.push(`/${locale}/admin/course/new`)}
          className="flex-shrink-0 gap-1.5"
        >
          + Add course
        </Button>
      </div>

      {/* ── Course list ── */}
      <div className="space-y-2">
        {fetching ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[72px] rounded-xl border border-border bg-muted/20 animate-pulse"
            />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <span className="text-5xl">📚</span>
            <p className="text-base font-semibold">
              {search ? "No courses match your search" : "No courses yet"}
            </p>
            <p className="text-sm text-mutedForeground max-w-xs">
              {search
                ? "Try a different keyword or clear the search."
                : 'Click "+ Add course" above to create your first course.'}
            </p>
            {!search && (
              <Button
                variant="secondary"
                onClick={() => router.push(`/${locale}/admin/course/new`)}
              >
                + Add course
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-mutedForeground pt-1 pb-2">
              {filtered.length} course{filtered.length !== 1 ? "s" : ""}
              {search && ` matching "${search}"`}
            </p>
            {filtered.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                onClick={() => router.push(`/${locale}/admin/course/${course.id}`)}
              />
            ))}
          </>
        )}
      </div>
    </main>
  )
}