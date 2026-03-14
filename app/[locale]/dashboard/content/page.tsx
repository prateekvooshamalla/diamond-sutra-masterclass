// "use client"

// import * as React from "react"
// import { use } from "react"
// import type { Locale } from "@/Services/i18n"
// import { useRouter } from "next/navigation"
// import { useUser } from "@/components/site/useUser"
// import { db } from "@/Services/firebase"
// import { doc, getDoc } from "firebase/firestore"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { cn } from "@/Services/utils"

// type Course = {
//   title: string
//   zoomLink?: string
//   modules?: { title: string; items: string[] }[]
// }

// type EnrollmentStatus = "not_enrolled" | "active"

// type LessonSelection = {
//   moduleTitle: string
//   itemTitle: string
// }

// export default function CourseContentPage({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>
// }) {
//   const { locale } = use(params) // ✅ unwrap params

//   const router = useRouter()
//   const { user, loading } = useUser()

//   const [status, setStatus] = React.useState<EnrollmentStatus>("not_enrolled")
//   const [course, setCourse] = React.useState<Course | null>(null)
//   const [pageLoading, setPageLoading] = React.useState(true)
//   const [pageError, setPageError] = React.useState<string | null>(null)
//   const [selection, setSelection] = React.useState<LessonSelection | null>(null)

//   React.useEffect(() => {
//     if (!loading && !user) router.push(`/${locale}`)
//   }, [loading, user, router, locale])

//   React.useEffect(() => {
//     async function load() {
//       if (!user) return

//       setPageLoading(true)
//       setPageError(null)

//       try {
//         const enrollmentSnap = await getDoc(
//           doc(db, "enrollments", `${user.uid}_diamond-sutra`)
//         )

//         setStatus(
//           enrollmentSnap.exists()
//             ? ((enrollmentSnap.data() as any).status ?? "not_enrolled")
//             : "not_enrolled"
//         )

//         const courseSnap = await getDoc(
//           doc(db, "courses", "diamond-sutra")
//         )

//         const courseData = courseSnap.exists()
//           ? (courseSnap.data() as any)
//           : null

//         setCourse(courseData)

//         if (courseData?.modules?.length && !selection) {
//           const firstModule = courseData.modules[0]
//           const firstItem = firstModule?.items?.[0]
//           if (firstModule?.title && firstItem) {
//             setSelection({
//               moduleTitle: firstModule.title,
//               itemTitle: firstItem,
//             })
//           }
//         }
//       } catch (e: any) {
//         setPageError(e?.message ?? "Failed to load course content")
//       } finally {
//         setPageLoading(false)
//       }
//     }

//     load()
//   }, [user])

//   const canJoin = status === "active" && Boolean(course?.zoomLink)
//   const statusLabel = status === "active" ? "Active" : "Not Enrolled"

//   return (
//     <div className="w-full">
//       <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <p className="text-xs uppercase tracking-wide text-mutedForeground">
//             Course content
//           </p>
//           <h1 className="mt-2 text-lg font-semibold">
//             Diamond Sutra Masterclass
//           </h1>
//           <p className="mt-1 text-sm text-mutedForeground">
//             Browse modules and continue where you left off.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           <Badge className="px-3 py-1 text-xs font-semibold">
//             {statusLabel}
//           </Badge>

//           <Button
//             onClick={() =>
//               course?.zoomLink
//                 ? window.open(course.zoomLink, "_blank")
//                 : null
//             }
//             disabled={!canJoin}
//           >
//             Join Zoom
//           </Button>
//         </div>
//       </div>

//       {pageError ? (
//         <Card className="mb-6 border-red-200/70 bg-red-50/60">
//           <CardContent className="py-4 text-sm text-red-700">
//             {pageError}
//           </CardContent>
//         </Card>
//       ) : null}

//       {pageLoading ? (
//         <p className="text-sm text-mutedForeground">
//           Loading course content...
//         </p>
//       ) : (
//         <div className="flex gap-3">
//           <Button
//             variant="outline"
//             onClick={() => router.push(`/${locale}/dashboard`)}
//           >
//             Back to My Learning
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }


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
  serverTimestamp,
  setDoc,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/Services/utils"

// ─── types ────────────────────────────────────────────────────────────────────

type Lesson = {
  id: string
  order: number
  title: string
  description: string
  videoUrl: string
  videoType: "youtube" | "drive" | ""
  duration: number
  isFreePreview: boolean
  resourceLink: string
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
  schedule?: string
  instructorName?: string
  modules: Module[]
}

type EnrolledCourse = Course & { status: "not_enrolled" | "active" }

// ─── video embed helper ───────────────────────────────────────────────────────

function getEmbedUrl(url: string, type: string): string {
  if (!url) return ""
  if (type === "youtube") {
    // handle both youtube.com/watch?v=ID and youtu.be/ID
    const match =
      url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
    const id = match?.[1]
    return id ? `https://www.youtube.com/embed/${id}` : url
  }
  if (type === "drive") {
    // convert /view or /preview links to embed
    return url.replace("/view", "/preview").replace("/edit", "/preview")
  }
  return url
}

// ─── component ────────────────────────────────────────────────────────────────

export default function CourseContentPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const router = useRouter()
  const { user, loading } = useUser()

  const [enrolledCourses, setEnrolledCourses] = React.useState<EnrolledCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(null)
  // completedLessons: { [courseId]: Set of lessonIds }
  const [completedLessons, setCompletedLessons] = React.useState<Record<string, Set<string>>>({})
  const [pageLoading, setPageLoading] = React.useState(true)
  const [pageError, setPageError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.push(`/${locale}`)
  }, [loading, user, router, locale])

  // ── load courses + completions ────────────────────────────────────────────
  React.useEffect(() => {
    async function load() {
      if (!user) return
      setPageLoading(true)
      setPageError(null)

      try {
        const coursesSnap = await getDocs(collection(db, "courses"))
        const allCourses = coursesSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Course, "id">),
          modules: (d.data().modules ?? []) as Module[],
        })) as Course[]

        const enrolled: EnrolledCourse[] = []
        const completions: Record<string, Set<string>> = {}

        await Promise.all(
          allCourses.map(async (course) => {
            const enrollSnap = await getDoc(
              doc(db, "enrollments", `${user.uid}_${course.id}`)
            )
            if (!enrollSnap.exists()) return

            enrolled.push({
              ...course,
              status: enrollSnap.data().status ?? "not_enrolled",
            })

            // load completed lessons for this course
            const progressSnap = await getDoc(
              doc(db, "progress", `${user.uid}_${course.id}`)
            )
            if (progressSnap.exists()) {
              const data = progressSnap.data()
              completions[course.id] = new Set(data.completedLessons ?? [])
            } else {
              completions[course.id] = new Set()
            }
          })
        )

        setEnrolledCourses(enrolled)
        setCompletedLessons(completions)

        if (enrolled.length > 0) {
          const first = enrolled[0]
          setSelectedCourseId(first.id)
          const firstLesson = first.modules?.[0]?.lessons?.[0]
          if (firstLesson) setSelectedLesson(firstLesson)
        }
      } catch (e: any) {
        setPageError(e?.message ?? "Failed to load courses")
      } finally {
        setPageLoading(false)
      }
    }

    load()
  }, [user])

  const selectedCourse = enrolledCourses.find((c) => c.id === selectedCourseId)
  const isEnrolled = selectedCourse?.status === "active"

  // ── progress calculation ──────────────────────────────────────────────────
  function getCourseProgress(course: Course): number {
    const allLessons = course.modules.flatMap((m) => m.lessons)
    if (allLessons.length === 0) return 0
    const done = completedLessons[course.id]?.size ?? 0
    return Math.round((done / allLessons.length) * 100)
  }

  // ── lesson lock logic ─────────────────────────────────────────────────────
  function isLessonLocked(course: Course, lesson: Lesson): boolean {
    if (!isEnrolled && !lesson.isFreePreview) return true
    if (lesson.order === 1) return false // first lesson always unlocked

    // find all lessons in order across all modules
    const allLessons = course.modules
      .sort((a, b) => a.order - b.order)
      .flatMap((m) => m.lessons.sort((a, b) => a.order - b.order))

    const idx = allLessons.findIndex((l) => l.id === lesson.id)
    if (idx <= 0) return false

    const prevLesson = allLessons[idx - 1]
    return !completedLessons[course.id]?.has(prevLesson.id)
  }

  // ── mark lesson complete ──────────────────────────────────────────────────
  async function markComplete(lesson: Lesson) {
    if (!user || !selectedCourseId) return

    const updated = new Set(completedLessons[selectedCourseId] ?? [])
    updated.add(lesson.id)

    setCompletedLessons((prev) => ({ ...prev, [selectedCourseId]: updated }))

    await setDoc(
      doc(db, "progress", `${user.uid}_${selectedCourseId}`),
      {
        uid: user.uid,
        courseId: selectedCourseId,
        completedLessons: Array.from(updated),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )

    // auto-advance to next lesson
    if (selectedCourse) {
      const allLessons = selectedCourse.modules
        .sort((a, b) => a.order - b.order)
        .flatMap((m) => m.lessons.sort((a, b) => a.order - b.order))
      const idx = allLessons.findIndex((l) => l.id === lesson.id)
      if (idx >= 0 && idx < allLessons.length - 1) {
        setSelectedLesson(allLessons[idx + 1])
      }
    }
  }

  // ── guards ────────────────────────────────────────────────────────────────
  if (loading || pageLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-mutedForeground">Loading your courses...</p>
      </div>
    )
  }

  if (pageError) {
    return (
      <Card className="border-red-200/70 bg-red-50/60">
        <CardContent className="py-4 text-sm text-red-700">{pageError}</CardContent>
      </Card>
    )
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl">📚</p>
        <p className="text-lg font-semibold">No courses yet</p>
        <p className="text-sm text-mutedForeground">You are not enrolled in any courses.</p>
        <Button onClick={() => router.push(`/${locale}`)}>Browse Courses</Button>
      </div>
    )
  }

  const progress = selectedCourse ? getCourseProgress(selectedCourse) : 0

  return (
    <div className="w-full space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-mutedForeground">
            Now learning
          </p>
          <h1 className="mt-1 text-lg font-semibold">
            {selectedCourse?.title ?? "My Courses"}
          </h1>
          {selectedCourse?.instructorName && (
            <p className="text-sm text-mutedForeground">
              by {selectedCourse.instructorName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge>{isEnrolled ? "Active" : "Not Enrolled"}</Badge>
          {selectedCourse?.zoomLink && isEnrolled && (
            <Button
              size="sm"
              onClick={() => window.open(selectedCourse.zoomLink, "_blank")}
            >
              Join Zoom
            </Button>
          )}
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {selectedCourse && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-mutedForeground">
            <span>Course progress</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* ── Course Tabs ── */}
      {enrolledCourses.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {enrolledCourses.map((c) => (
            <Button
              key={c.id}
              variant={selectedCourseId === c.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCourseId(c.id)
                const first = c.modules?.[0]?.lessons?.[0]
                if (first) setSelectedLesson(first)
              }}
            >
              {c.title}
            </Button>
          ))}
        </div>
      )}

      {/* ── Main Layout ── */}
      {selectedCourse && (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">

          {/* ── Left Sidebar: Modules + Lessons ── */}
          <div className="space-y-2">
            <Card className="overflow-hidden">
              <Accordion type="multiple" defaultValue={selectedCourse.modules.map((m) => m.id)}>
                {selectedCourse.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module) => {
                    const moduleLessons = module.lessons.sort((a, b) => a.order - b.order)
                    const doneCount = moduleLessons.filter((l) =>
                      completedLessons[selectedCourse.id]?.has(l.id)
                    ).length

                    return (
                      <AccordionItem key={module.id} value={module.id} className="border-b border-border/50">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/40">
                          <div className="text-left">
                            <p className="text-sm font-semibold">
                              Section {module.order}: {module.title}
                            </p>
                            <p className="text-xs text-mutedForeground">
                              {doneCount}/{moduleLessons.length} ·{" "}
                              {module.estimatedDuration || ""}
                            </p>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="p-0">
                          {moduleLessons.map((lesson) => {
                            const locked = isLessonLocked(selectedCourse, lesson)
                            const done = completedLessons[selectedCourse.id]?.has(lesson.id)
                            const isActive = selectedLesson?.id === lesson.id

                            return (
                              <button
                                key={lesson.id}
                                disabled={locked}
                                onClick={() => !locked && setSelectedLesson(lesson)}
                                className={cn(
                                  "w-full px-4 py-3 text-left transition-colors border-t border-border/30",
                                  isActive && "bg-muted",
                                  !isActive && !locked && "hover:bg-muted/50",
                                  locked && "opacity-40 cursor-not-allowed"
                                )}
                              >
                                <div className="flex items-start gap-2">
                                  {/* status icon */}
                                  <span className="mt-0.5 text-sm">
                                    {done ? "✅" : locked ? "🔒" : "▶️"}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {lesson.title || `Lesson ${lesson.order}`}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {lesson.duration > 0 && (
                                        <span className="text-xs text-mutedForeground">
                                          {lesson.duration} min
                                        </span>
                                      )}
                                      {lesson.isFreePreview && (
                                        <Badge className="text-[10px] px-1 py-0 bg-green-100 text-green-700">
                                          Preview
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
              </Accordion>
            </Card>
          </div>

          {/* ── Right: Lesson Player ── */}
          <div className="space-y-4">
            {selectedLesson ? (
              <>
                {/* Video Player */}
                {selectedLesson.videoUrl ? (
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                    <iframe
                      key={selectedLesson.id}
                      src={getEmbedUrl(selectedLesson.videoUrl, selectedLesson.videoType)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
                    <p className="text-sm text-mutedForeground">No video for this lesson.</p>
                  </div>
                )}

                {/* Lesson Info */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-mutedForeground">
                          {selectedCourse.modules.find((m) =>
                            m.lessons.some((l) => l.id === selectedLesson.id)
                          )?.title}
                        </p>
                        <CardTitle className="mt-1 text-base">
                          {selectedLesson.title}
                        </CardTitle>
                      </div>

                      {/* Mark complete button */}
                      {isEnrolled && (
                        <Button
                          size="sm"
                          variant={
                            completedLessons[selectedCourse.id]?.has(selectedLesson.id)
                              ? "outline"
                              : "default"
                          }
                          onClick={() => markComplete(selectedLesson)}
                          disabled={completedLessons[selectedCourse.id]?.has(selectedLesson.id)}
                        >
                          {completedLessons[selectedCourse.id]?.has(selectedLesson.id)
                            ? "✅ Completed"
                            : "Mark as complete"}
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {selectedLesson.description && (
                    <CardContent>
                      <p className="text-sm text-mutedForeground">
                        {selectedLesson.description}
                      </p>
                    </CardContent>
                  )}
                </Card>

                {/* Resource download */}
                {selectedLesson.resourceLink && (
                  <Card>
                    <CardContent className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <p className="text-sm font-medium">Lesson resource</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(selectedLesson.resourceLink, "_blank")
                        }
                      >
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="flex min-h-[300px] items-center justify-center">
                  <p className="text-sm text-mutedForeground">
                    Select a lesson from the sidebar to begin.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard`)}>
        ← Back to My Learning
      </Button>
    </div>
  )
}
