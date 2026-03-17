"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db, storage } from "@/Services/firebase"
import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { addAuditLog } from "@/Services/audit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PageHeader } from "@/components/admin/PageHeader"

// ─── types ────────────────────────────────────────────────────────────────────

type Lesson = {
  id: string
  order: number
  title: string
  description: string
  videoUrl: string
  videoType: "youtube" | "drive" | "upload" | ""
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
  batchSize?: number
  schedule?: string
  instructorName?: string
  modules: Module[]
  createdBy?: string
  createdByName?: string
}

type UploadState = {
  progress: number
  status: "idle" | "uploading" | "done" | "error"
  error?: string
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).substring(2, 10)
}

function generateCourseId(title: string) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40)
  return `${slug}-${Math.random().toString(36).substring(2, 6)}`
}

function emptyLesson(order: number): Lesson {
  return {
    id: uid(),
    order,
    title: "",
    description: "",
    videoUrl: "",
    videoType: "",
    duration: 0,
    isFreePreview: false,
    resourceLink: "",
  }
}

function emptyModule(order: number): Module {
  return {
    id: uid(),
    order,
    title: "",
    description: "",
    estimatedDuration: "",
    lessons: [emptyLesson(1)],
  }
}

function emptyCourse(): Course {
  return {
    id: "",
    title: "",
    zoomLink: "",
    batchSize: 30,
    schedule: "",
    instructorName: "",
    modules: [],
  }
}

function detectVideoType(url: string): "youtube" | "drive" | "upload" | "" {
  if (!url) return ""
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("drive.google.com")) return "drive"
  if (url.includes("firebasestorage.googleapis.com")) return "upload"
  return ""
}

// ─── RecordingInput component ──────────────────────────────────────────────

function RecordingInput({
  lesson,
  moduleId,
  courseId,
  onUpdate,
}: {
  lesson: Lesson
  moduleId: string
  courseId: string
  onUpdate: (moduleId: string, lessonId: string, key: keyof Lesson, value: any) => void
}) {
  const [tab, setTab] = React.useState<"url" | "upload">(
    lesson.videoType === "upload" ? "upload" : "url"
  )
  const [upload, setUpload] = React.useState<UploadState>({ progress: 0, status: "idle" })
  const [fileName, setFileName] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    onUpdate(moduleId, lesson.id, "videoUrl", val)
    onUpdate(moduleId, lesson.id, "videoType", detectVideoType(val))
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    uploadFile(file)
  }

  function uploadFile(file: File) {
    const path = `recordings/${courseId || "draft"}/${lesson.id}/${Date.now()}_${file.name}`
    const storageRef = ref(storage, path)
    const task = uploadBytesResumable(storageRef, file)

    setUpload({ progress: 0, status: "uploading" })

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setUpload({ progress: pct, status: "uploading" })
      },
      (error) => {
        setUpload({ progress: 0, status: "error", error: error.message })
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        onUpdate(moduleId, lesson.id, "videoUrl", url)
        onUpdate(moduleId, lesson.id, "videoType", "upload")
        setUpload({ progress: 100, status: "done" })
      }
    )
  }

  async function removeUpload() {
    if (lesson.videoUrl) {
      try {
        await deleteObject(ref(storage, lesson.videoUrl))
      } catch (_) {}
    }
    onUpdate(moduleId, lesson.id, "videoUrl", "")
    onUpdate(moduleId, lesson.id, "videoType", "")
    setUpload({ progress: 0, status: "idle" })
    setFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <Label>
        Course Video{" "}
       
      </Label>

      {/* Tab switcher */}
      <div className="flex rounded-lg border border-border overflow-hidden w-fit text-sm">
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`px-4 py-1.5 transition-colors ${
            tab === "url"
              ? "bg-foreground text-background font-medium"
              : "bg-background text-mutedForeground hover:bg-muted"
          }`}
        >
          🔗 Paste URL
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`px-4 py-1.5 transition-colors ${
            tab === "upload"
              ? "bg-foreground text-background font-medium"
              : "bg-background text-mutedForeground hover:bg-muted"
          }`}
        >
          📁 Upload file
        </button>
      </div>

      {/* URL tab */}
      {tab === "url" && (
        <div className="space-y-1.5">
          <Input
            value={lesson.videoType !== "upload" ? lesson.videoUrl : ""}
            placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/..."
            onChange={handleUrlChange}
          />
          {lesson.videoUrl && lesson.videoType !== "upload" && (
            <p className="text-xs text-green-600">
              ✅ {lesson.videoType === "youtube" ? "🎬 YouTube" : "🎥 Google Drive"} link is added
            </p>
          )}
        </div>
      )}

      {/* Upload tab */}
      {tab === "upload" && (
        <div className="space-y-2">
          {lesson.videoType === "upload" && lesson.videoUrl ? (
            /* Already uploaded */
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <p className="text-sm font-medium text-green-800">course video uploaded</p>
                  <p className="text-xs text-green-600 truncate max-w-[260px]">
                    {fileName || "Stored in Firebase Storage"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 text-xs"
                onClick={removeUpload}
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              {/* Drop zone */}
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-8 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-3xl mb-2">🎥</span>
                <p className="text-sm font-medium">Click to select a recording</p>
                <p className="text-xs text-mutedForeground mt-1">MP4, MOV, WebM, AVI — any video file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Progress bar */}
              {upload.status === "uploading" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-mutedForeground">
                    <span>Uploading {fileName}…</span>
                    <span>{upload.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {upload.status === "error" && (
                <p className="text-xs text-red-600">❌ Upload failed: {upload.error}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── main component ────────────────────────────────────────────────────────────

export default function AdminCourse({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const { loading, isAdmin, user, profile } = useAdminGuard(locale)

  const [courses, setCourses] = React.useState<Course[]>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [course, setCourse] = React.useState<Course>(emptyCourse())
  const [isCreating, setIsCreating] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

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
      if (list.length > 0) {
        setSelectedId(list[0].id)
        setCourse(list[0])
      } else {
        setIsCreating(true)
      }
    }
    if (isAdmin) load()
  }, [isAdmin])

  function selectCourse(id: string) {
    const found = courses.find((c) => c.id === id)
    if (!found) return
    setSelectedId(id)
    setCourse(found)
    setIsCreating(false)
    setMessage(null)
  }

  function addModule() {
    setCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, emptyModule(prev.modules.length + 1)],
    }))
  }

  function removeModule(moduleId: string) {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules
        .filter((m) => m.id !== moduleId)
        .map((m, i) => ({ ...m, order: i + 1 })),
    }))
  }

  function updateModule(moduleId: string, key: keyof Omit<Module, "lessons" | "id">, value: any) {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? { ...m, [key]: value } : m
      ),
    }))
  }

  function addLesson(moduleId: string) {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, emptyLesson(m.lessons.length + 1)] }
          : m
      ),
    }))
  }

  function removeLesson(moduleId: string, lessonId: string) {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons
                .filter((l) => l.id !== lessonId)
                .map((l, i) => ({ ...l, order: i + 1 })),
            }
          : m
      ),
    }))
  }

  function updateLesson(moduleId: string, lessonId: string, key: keyof Lesson, value: any) {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) => {
                if (l.id !== lessonId) return l
                const updated = { ...l, [key]: value }
                if (key === "videoUrl" && typeof value === "string") {
                  updated.videoType = detectVideoType(value)
                }
                return updated
              }),
            }
          : m
      ),
    }))
  }

  async function saveCourse() {
    if (!course.title.trim()) {
      setMessage("Course title is required.")
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const courseId = isCreating ? generateCourseId(course.title) : selectedId!
      const courseData = {
        ...course,
        id: courseId,
        batchSize: Number(course.batchSize ?? 30),
        createdBy: isCreating ? (user?.uid ?? null) : course.createdBy ?? null,
        createdByName: isCreating ? (profile?.name ?? user?.email ?? null) : course.createdByName ?? null,
        lastUpdatedBy: user?.uid ?? null,
        lastUpdatedByName: profile?.name ?? user?.email ?? null,
        updatedAt: serverTimestamp(),
        ...(isCreating ? { createdAt: serverTimestamp() } : {}),
      }
      await setDoc(doc(db, "courses", courseId), courseData, { merge: true })
      if (user) {
        await addAuditLog(db, {
          action: isCreating ? "course.created" : "course.updated",
          actorUid: user.uid,
          actorName: profile?.name ?? null,
          target: `courses/${courseId}`,
          metadata: { title: course.title, courseId },
        })
      }
      if (isCreating) {
        const newCourse = { ...courseData } as Course
        setCourses((prev) => [...prev, newCourse])
        setSelectedId(courseId)
        setCourse(newCourse)
        setIsCreating(false)
        setMessage(`✅ Course created! ID: ${courseId}`)
      } else {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? ({ ...courseData } as Course) : c))
        )
        setMessage("✅ Course saved successfully.")
      }
    } catch (e: any) {
      setMessage(`❌ ${e?.message ?? "Save failed"}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null
  if (!isAdmin) return null

  return (
    <main className="space-y-6">
      <PageHeader
        label="Admin"
        title="Courses"
        description="Build your course structure with modules and lessons."
      />

      {/* ── Course Selector ── */}
      <Card>
        <CardHeader>
          <CardTitle>Select course</CardTitle>
          <CardDescription>Edit an existing course or create a new one.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {courses.map((c) => (
            <Button
              key={c.id}
              variant={selectedId === c.id && !isCreating ? "default" : "outline"}
              onClick={() => selectCourse(c.id)}
            >
              {c.title || c.id}
            </Button>
          ))}
          <Button
            variant={isCreating ? "default" : "secondary"}
            onClick={() => {
              setCourse(emptyCourse())
              setSelectedId(null)
              setIsCreating(true)
              setMessage(null)
            }}
          >
            + New course
          </Button>
        </CardContent>
      </Card>

      {/* ── Course ID badge ── */}
      {(selectedId || isCreating) && (
        <div className="rounded-md border border-border bg-muted px-4 py-2 text-sm text-mutedForeground">
          {isCreating ? "⚡ New course — ID auto-generated on save" : "📋 Course ID: "}
          {!isCreating && (
            <span className="font-mono font-medium text-ink">{selectedId}</span>
          )}
        </div>
      )}

      {/* ── Core Settings ── */}
      <Card>
        <CardHeader>
          <CardTitle>Core settings</CardTitle>
          <CardDescription>Basic course information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={course.title}
              placeholder="e.g. Diamond Sutra Masterclass"
              onChange={(e) => setCourse((c) => ({ ...c, title: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Instructor name</Label>
            <Input
              value={course.instructorName ?? ""}
              onChange={(e) => setCourse((c) => ({ ...c, instructorName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Zoom link</Label>
            <Input
              value={course.zoomLink ?? ""}
              onChange={(e) => setCourse((c) => ({ ...c, zoomLink: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Batch size</Label>
            <Input
              type="number"
              value={course.batchSize ?? 30}
              onChange={(e) => setCourse((c) => ({ ...c, batchSize: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Schedule</Label>
            <Input
              value={course.schedule ?? ""}
              placeholder="e.g. 15 days, 6:00–7:00 AM"
              onChange={(e) => setCourse((c) => ({ ...c, schedule: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Modules & Lessons ── */}
      <Card>
        <CardHeader>
          <CardTitle>Modules & Lessons</CardTitle>
          <CardDescription>
            Add sections and lessons. Each lesson can have a recording — paste a URL or upload directly from your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.modules.length === 0 && (
            <p className="text-sm text-mutedForeground">
              No modules yet. Click "Add module" to start building your course.
            </p>
          )}

          <Accordion type="multiple" className="space-y-3">
            {/* ✅ FIX: key moved to React.Fragment so React can track it before
                Radix UI's Primitive.div consumes the AccordionItem children */}
            {course.modules.map((module) => (
              <React.Fragment key={module.id}>
                <AccordionItem
                  value={module.id}
                  className="rounded-lg border border-border bg-muted/20"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">Section {module.order}</Badge>
                      <span className="font-medium">
                        {module.title || `Untitled module ${module.order}`}
                      </span>
                      <span className="text-xs text-mutedForeground">
                        {(module.lessons ?? []).length} lesson
                        {(module.lessons ?? []).length !== 1 ? "s" : ""}
                        {module.estimatedDuration ? ` · ${module.estimatedDuration}` : ""}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 space-y-4">
                    {/* Module Fields */}
                    <div className="grid gap-3 rounded-lg border border-border/60 bg-background p-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Module title</Label>
                        <Input
                          value={module.title}
                          placeholder="e.g. Getting Started"
                          onChange={(e) => updateModule(module.id, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated duration</Label>
                        <Input
                          value={module.estimatedDuration}
                          placeholder="e.g. 1h 20m"
                          onChange={(e) => updateModule(module.id, "estimatedDuration", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Module description</Label>
                        <Textarea
                          value={module.description}
                          placeholder="What will students learn in this section?"
                          rows={2}
                          onChange={(e) => updateModule(module.id, "description", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-mutedForeground">
                        Lessons
                      </p>

                      {(module.lessons ?? []).map((lesson) => (
                        <div
                          key={lesson.id}
                          className="rounded-lg border border-border/60 bg-background p-4 space-y-3"
                        >
                          {/* Lesson top row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">Lesson {lesson.order}</Badge>
                              {lesson.isFreePreview && (
                                <Badge className="bg-green-100 text-green-700 text-xs">Free Preview</Badge>
                              )}
                              {lesson.videoType === "youtube" && (
                                <Badge className="bg-red-100 text-red-700 text-xs">🎬 YouTube</Badge>
                              )}
                              {lesson.videoType === "drive" && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs">🎥 Drive</Badge>
                              )}
                              {lesson.videoType === "upload" && (
                                <Badge className="bg-purple-100 text-purple-700 text-xs">📁 Uploaded</Badge>
                              )}
                              {lesson.videoUrl && (
                                <Badge className="bg-emerald-100 text-emerald-700 text-xs">📹 Recording ready</Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeLesson(module.id, lesson.id)}
                            >
                              Remove lesson
                            </Button>
                          </div>

                          {/* Lesson fields */}
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Lesson title</Label>
                              <Input
                                value={lesson.title}
                                placeholder="e.g. Introduction to the Sutra"
                                onChange={(e) =>
                                  updateLesson(module.id, lesson.id, "title", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Duration (minutes)</Label>
                              <Input
                                type="number"
                                value={lesson.duration || ""}
                                placeholder="e.g. 12"
                                onChange={(e) =>
                                  updateLesson(module.id, lesson.id, "duration", Number(e.target.value))
                                }
                              />
                            </div>

                            {/* ── Recording (URL or Upload) ── */}
                            <RecordingInput
                              lesson={lesson}
                              moduleId={module.id}
                              courseId={selectedId ?? ""}
                              onUpdate={updateLesson}
                            />

                            <div className="space-y-2 md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={lesson.description}
                                placeholder="What will students learn in this lesson?"
                                rows={2}
                                onChange={(e) =>
                                  updateLesson(module.id, lesson.id, "description", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>
                                Downloadable resource link{" "}
                                <span className="text-xs text-mutedForeground font-normal">
                                  (optional PDF, notes, etc.)
                                </span>
                              </Label>
                              <Input
                                value={lesson.resourceLink}
                                placeholder="https://drive.google.com/file/..."
                                onChange={(e) =>
                                  updateLesson(module.id, lesson.id, "resourceLink", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          {/* Free Preview toggle */}
                          <div className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/30 px-3 py-2">
                            <Switch
                              checked={lesson.isFreePreview}
                              onCheckedChange={(v) =>
                                updateLesson(module.id, lesson.id, "isFreePreview", v)
                              }
                            />
                            <div>
                              <p className="text-sm font-medium">Free preview</p>
                              <p className="text-xs text-mutedForeground">
                                Non-enrolled users can watch this lesson
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button variant="outline" size="sm" onClick={() => addLesson(module.id)}>
                        + Add lesson
                      </Button>
                    </div>

                    <div className="pt-2">
                      <Button variant="destructive" size="sm" onClick={() => removeModule(module.id)}>
                        Remove module
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </React.Fragment>
            ))}
          </Accordion>

          <Button variant="secondary" onClick={addModule}>
            + Add module
          </Button>
        </CardContent>
      </Card>

      {/* ── Save ── */}
      <div className="flex items-center gap-3">
        <Button onClick={saveCourse} disabled={saving}>
          {saving ? "Saving..." : isCreating ? "Create course" : "Save settings"}
        </Button>
        {message && <p className="text-sm text-mutedForeground">{message}</p>}
      </div>
    </main>
  )
}