"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

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

export default function CourseContentPage({ params }: { params: { locale: Locale } }) {
  const router = useRouter()
  const { user, loading } = useUser()
  const [status, setStatus] = React.useState<EnrollmentStatus>("not_enrolled")
  const [course, setCourse] = React.useState<Course | null>(null)
  const [pageLoading, setPageLoading] = React.useState(true)
  const [pageError, setPageError] = React.useState<string | null>(null)
  const [selection, setSelection] = React.useState<LessonSelection | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.push(`/${params.locale}`)
  }, [loading, user, router, params.locale])

  React.useEffect(() => {
    async function load() {
      if (!user) return
      setPageLoading(true)
      setPageError(null)
      try {
        const enrollmentSnap = await getDoc(doc(db, "enrollments", `${user.uid}_diamond-sutra`))
        setStatus(
          enrollmentSnap.exists()
            ? ((enrollmentSnap.data() as any).status ?? "not_enrolled")
            : "not_enrolled"
        )

        const courseSnap = await getDoc(doc(db, "courses", "diamond-sutra"))
        const courseData = courseSnap.exists() ? (courseSnap.data() as any) : null
        setCourse(courseData)

        if (courseData?.modules?.length && !selection) {
          const firstModule = courseData.modules[0]
          const firstItem = firstModule?.items?.[0]
          if (firstModule?.title && firstItem) {
            setSelection({ moduleTitle: firstModule.title, itemTitle: firstItem })
          }
        }
      } catch (e: any) {
        setPageError(e?.message ?? "Failed to load course content")
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, [user, selection])

  const canJoin = status === "active" && Boolean(course?.zoomLink)
  const statusLabel = status === "active" ? "Active" : "Not Enrolled"

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-mutedForeground">Course content</p>
          <h1 className="mt-2 text-lg font-semibold">Diamond Sutra Masterclass</h1>
          <p className="mt-1 text-sm text-mutedForeground">Browse modules and continue where you left off.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="px-3 py-1 text-xs font-semibold">{statusLabel}</Badge>
          <Button
            onClick={() => (course?.zoomLink ? window.open(course.zoomLink, "_blank") : null)}
            disabled={!canJoin}
          >
            Join Zoom
          </Button>
        </div>
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
          <Card className="border-border bg-card lg:col-span-8">
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Modules</CardDescription>
              <CardTitle className="mt-2 text-lg font-semibold">Course modules</CardTitle>
            </CardHeader>
            <CardContent>
              {course?.modules?.length ? (
                <Accordion type="multiple" className="space-y-2">
                  {course.modules.map((module, moduleIndex) => (
                    <AccordionItem key={`${module.title}-${moduleIndex}`} value={`module-${moduleIndex}`}>
                      <AccordionTrigger>{module.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {module.items.map((item, itemIndex) => {
                            const active = selection?.moduleTitle === module.title && selection?.itemTitle === item
                            return (
                              <button
                                key={`${item}-${itemIndex}`}
                                type="button"
                                onClick={() => setSelection({ moduleTitle: module.title, itemTitle: item })}
                                className={cn(
                                  "flex w-full items-center justify-between rounded-md border border-border/60 bg-white px-3 py-2 text-left text-sm transition",
                                  active ? "bg-muted text-ink" : "text-mutedForeground hover:bg-muted/60"
                                )}
                              >
                                <span>{item}</span>
                                {active ? <span className="text-xs text-ink">Selected</span> : null}
                              </button>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-sm text-mutedForeground">No modules configured yet.</p>
              )}
            </CardContent>
          </Card>

          <div className="lg:sticky lg:top-24 lg:col-span-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Lesson preview</CardDescription>
                <CardTitle className="mt-2 text-lg font-semibold">Selected lesson</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selection ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-mutedForeground">{selection.moduleTitle}</p>
                    <h3 className="mt-2 text-lg font-semibold text-ink">{selection.itemTitle}</h3>
                    <p className="mt-2 text-sm text-mutedForeground">
                      Lesson overview and key takeaways will appear here once content is available.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-mutedForeground">Select a lesson to preview it here.</p>
                )}
                <Separator />
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">Mark as complete</Button>
                  <Button onClick={() => router.push(`/${params.locale}/dashboard`)}>
                    Back to My Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
