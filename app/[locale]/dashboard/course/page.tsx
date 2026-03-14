// "use client"

// import * as React from "react"
// import { use } from "react"
// import type { Locale } from "@/Services/i18n"
// import { db } from "@/Services/firebase"
// import { doc, getDoc } from "firebase/firestore"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// type Course = {
//   title: string
//   schedule?: string
//   zoomLink?: string
//   batchSize?: number
// }

// export default function CourseDetails({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>
// }) {
//   const { locale } = use(params) // ✅ unwrap (even if not used yet)

//   const [course, setCourse] = React.useState<Course | null>(null)
//   const [loading, setLoading] = React.useState(true)

//   React.useEffect(() => {
//     async function load() {
//       const snap = await getDoc(doc(db, "courses", "diamond-sutra"))
//       setCourse(snap.exists() ? (snap.data() as any) : null)
//       setLoading(false)
//     }
//     load()
//   }, [])

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Course details</CardTitle>
//         <CardDescription>Core program configuration snapshot.</CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-2 text-sm text-mutedForeground">
//         {loading ? (
//           <p>Loading course...</p>
//         ) : course ? (
//           <>
//             <p>
//               <span className="font-medium text-ink">Title:</span>{" "}
//               {course.title}
//             </p>
//             <p>
//               <span className="font-medium text-ink">Schedule:</span>{" "}
//               {course.schedule ?? "15 days, 6:00–7:00 AM"}
//             </p>
//             <p>
//               <span className="font-medium text-ink">Batch size:</span>{" "}
//               {course.batchSize ?? 30}
//             </p>
//             <p>
//               <span className="font-medium text-ink">Zoom link:</span>{" "}
//               {course.zoomLink ?? "Not set"}
//             </p>
//           </>
//         ) : (
//           <p>No course settings found yet.</p>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { db } from "@/Services/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  schedule?: string
  zoomLink?: string
  batchSize?: number
  instructorName?: string
  modules: Module[]
}

// ─── embed helper ─────────────────────────────────────────────────────────────

function getEmbedUrl(url: string, type: string): string {
  if (!url) return ""
  if (type === "youtube") {
    const match =
      url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/)
    const id = match?.[1]
    return id ? `https://www.youtube.com/embed/${id}` : url
  }
  if (type === "drive") {
    return url.replace("/view", "/preview").replace("/edit", "/preview")
  }
  return url
}

// ─── component ────────────────────────────────────────────────────────────────

export default function CourseDetails({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)

  const [courses, setCourses] = React.useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(null)
  const [loading, setLoading] = React.useState(true)

  // ── load all courses ───────────────────────────────────────────────────────
  React.useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "courses"))
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Course, "id">),
        modules: (d.data().modules ?? []).map((m: any) => ({
          ...m,
          lessons: (m.lessons ?? []).sort(
            (a: Lesson, b: Lesson) => a.order - b.order
          ),
        })).sort((a: Module, b: Module) => a.order - b.order),
      })) as Course[]

      setCourses(list)
      setLoading(false)
    }
    load()
  }, [])

  // ── total lessons count ────────────────────────────────────────────────────
  function totalLessons(course: Course) {
    return course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  }

  // ── total duration ─────────────────────────────────────────────────────────
  function totalDuration(course: Course) {
    const mins = course.modules
      .flatMap((m) => m.lessons)
      .reduce((acc, l) => acc + (l.duration ?? 0), 0)
    if (mins === 0) return null
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  // ── lesson player view ─────────────────────────────────────────────────────
  if (selectedCourse && selectedLesson) {
    return (
      <div className="space-y-4">

        {/* Back nav */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLesson(null)}
          >
            ← Back to {selectedCourse.title}
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

          {/* ── Video Player ── */}
          <div className="space-y-4">
            {selectedLesson.videoUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  key={selectedLesson.id}
                  src={getEmbedUrl(
                    selectedLesson.videoUrl,
                    selectedLesson.videoType
                  )}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
                <div className="text-center space-y-2">
                  <p className="text-3xl">🎬</p>
                  <p className="text-sm text-mutedForeground">
                    No video added for this lesson yet.
                  </p>
                </div>
              </div>
            )}

            {/* Lesson info */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-mutedForeground uppercase tracking-wide">
                      {selectedCourse.modules.find((m) =>
                        m.lessons.some((l) => l.id === selectedLesson.id)
                      )?.title}
                    </p>
                    <CardTitle className="mt-1 text-base">
                      {selectedLesson.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedLesson.duration > 0 && (
                      <Badge variant="outline">
                        {selectedLesson.duration} min
                      </Badge>
                    )}
                    {selectedLesson.isFreePreview && (
                      <Badge className="bg-green-100 text-green-700">
                        Free Preview
                      </Badge>
                    )}
                  </div>
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
                <CardContent className="flex items-center justify-between py-3">
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
          </div>

          {/* ── Sidebar: All Lessons ── */}
          <Card className="h-fit overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Course content</CardTitle>
              <p className="text-xs text-mutedForeground">
                {totalLessons(selectedCourse)} lessons ·{" "}
                {totalDuration(selectedCourse) ?? "—"}
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion
                type="multiple"
                defaultValue={selectedCourse.modules.map((m) => m.id)}
              >
                {selectedCourse.modules.map((module) => (
                  <AccordionItem
                    key={module.id}
                    value={module.id}
                    className="border-t border-border/50"
                  >
                    <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-muted/40">
                      <div className="text-left">
                        <p>Section {module.order}: {module.title}</p>
                        <p className="text-xs font-normal text-mutedForeground">
                          {module.lessons.length} lessons
                          {module.estimatedDuration
                            ? ` · ${module.estimatedDuration}`
                            : ""}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={cn(
                            "w-full border-t border-border/30 px-4 py-3 text-left transition-colors",
                            selectedLesson.id === lesson.id
                              ? "bg-muted"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 text-sm">▶️</span>
                            <div>
                              <p className="text-sm font-medium">
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
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── course detail view (modules list) ─────────────────────────────────────
  if (selectedCourse) {
    return (
      <div className="space-y-4">

        {/* Back nav */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedCourse(null)}
        >
          ← All Courses
        </Button>

        {/* Course header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold">{selectedCourse.title}</h1>
                {selectedCourse.instructorName && (
                  <p className="text-sm text-mutedForeground mt-1">
                    by {selectedCourse.instructorName}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">
                    📚 {selectedCourse.modules.length} sections
                  </Badge>
                  <Badge variant="outline">
                    🎬 {totalLessons(selectedCourse)} lessons
                  </Badge>
                  {totalDuration(selectedCourse) && (
                    <Badge variant="outline">
                      ⏱ {totalDuration(selectedCourse)}
                    </Badge>
                  )}
                  {selectedCourse.schedule && (
                    <Badge variant="outline">
                      🗓 {selectedCourse.schedule}
                    </Badge>
                  )}
                </div>
              </div>
              {selectedCourse.zoomLink && (
                <Button
                  onClick={() =>
                    window.open(selectedCourse.zoomLink, "_blank")
                  }
                >
                  Join Zoom
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modules + Lessons */}
        {selectedCourse.modules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-sm text-mutedForeground">
                No modules added to this course yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base">Course content</CardTitle>
              <p className="text-sm text-mutedForeground">
                {selectedCourse.modules.length} sections ·{" "}
                {totalLessons(selectedCourse)} lessons
                {totalDuration(selectedCourse)
                  ? ` · ${totalDuration(selectedCourse)} total`
                  : ""}
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion
                type="multiple"
                defaultValue={selectedCourse.modules.map((m) => m.id)}
              >
                {selectedCourse.modules.map((module) => (
                  <AccordionItem
                    key={module.id}
                    value={module.id}
                    className="border-t border-border/50"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/40">
                      <div className="text-left">
                        <p className="font-semibold">
                          Section {module.order}: {module.title}
                        </p>
                        <p className="text-xs text-mutedForeground font-normal mt-0.5">
                          {module.lessons.length} lesson
                          {module.lessons.length !== 1 ? "s" : ""}
                          {module.estimatedDuration
                            ? ` · ${module.estimatedDuration}`
                            : ""}
                          {module.description
                            ? ` · ${module.description}`
                            : ""}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      {module.lessons.length === 0 ? (
                        <p className="px-6 py-3 text-sm text-mutedForeground">
                          No lessons in this section yet.
                        </p>
                      ) : (
                        module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className="w-full border-t border-border/30 px-6 py-3 text-left transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <span className="mt-0.5 text-base">▶️</span>
                                <div>
                                  <p className="text-sm font-medium">
                                    {lesson.title || `Lesson ${lesson.order}`}
                                  </p>
                                  {lesson.description && (
                                    <p className="text-xs text-mutedForeground mt-0.5 line-clamp-1">
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {lesson.isFreePreview && (
                                  <Badge className="text-[10px] bg-green-100 text-green-700 px-2">
                                    Preview
                                  </Badge>
                                )}
                                {lesson.duration > 0 && (
                                  <span className="text-xs text-mutedForeground">
                                    {lesson.duration} min
                                  </span>
                                )}
                                {lesson.resourceLink && (
                                  <span className="text-xs text-mutedForeground">
                                    📄
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // ── courses grid (default view) ────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-mutedForeground">
          Course content
        </p>
        <h1 className="mt-1 text-lg font-semibold">All Courses</h1>
        <p className="text-sm text-mutedForeground">
          Click a course to explore its modules and lessons.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-8">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-4">📚</p>
            <p className="font-semibold">No courses yet</p>
            <p className="text-sm text-mutedForeground mt-1">
              Courses added from the admin panel will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-palm/40 group"
              onClick={() => {
                setSelectedCourse(course)
                // auto-select first lesson
                const firstLesson = course.modules[0]?.lessons[0]
                if (firstLesson) setSelectedLesson(firstLesson)
                else setSelectedLesson(null)
              }}
            >
              {/* Course color banner */}
              <div className="h-2 w-full rounded-t-xl bg-gradient-to-r from-palm/70 to-palm/30" />

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base group-hover:text-palm transition-colors">
                    {course.title}
                  </CardTitle>
                </div>
                {course.instructorName && (
                  <p className="text-xs text-mutedForeground">
                    by {course.instructorName}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    📚 {course.modules.length} sections
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    🎬 {totalLessons(course)} lessons
                  </Badge>
                  {totalDuration(course) && (
                    <Badge variant="outline" className="text-xs">
                      ⏱ {totalDuration(course)}
                    </Badge>
                  )}
                </div>

                {course.schedule && (
                  <p className="text-xs text-mutedForeground">
                    🗓 {course.schedule}
                  </p>
                )}

                <div className="pt-1">
                  <span className="text-xs font-semibold text-palm group-hover:underline">
                    View course →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
