"use client"

import * as React from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import type { Locale } from "@/Services/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db, storage } from "@/Services/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { addAuditLog } from "@/Services/audit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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

type Recording = {
  id: string
  title: string
  date: string
  videoUrl: string
  videoType: "youtube" | "drive" | "upload" | ""
  duration: number
  description: string
  moduleName: string
}

type Course = {
  id: string
  title: string
  zoomLink?: string
  batchSize?: number
  schedule?: string
  instructorName?: string
  modules: Module[]
  recordings?: Recording[]
  createdBy?: string
  createdByName?: string
}

type UploadState = {
  progress: number
  status: "idle" | "uploading" | "done" | "error"
  error?: string
}

// ─── helpers ──────────────────────────────────────────────────────────────────

// ✅ Stable counter — avoids hydration mismatch from Math.random()
let _uidCounter = 0
function uid() {
  return `uid-${++_uidCounter}`
}

function generateCourseId(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40)
  return `${slug}-${Math.random().toString(36).substring(2, 6)}`
}

function emptyLesson(order: number): Lesson {
  return { id: uid(), order, title: "", description: "", videoUrl: "", videoType: "", duration: 0, isFreePreview: false, resourceLink: "" }
}

function emptyModule(order: number): Module {
  return { id: uid(), order, title: "", description: "", estimatedDuration: "", lessons: [emptyLesson(1)] }
}

function emptyRecording(): Recording {
  return {
    id: uid(),
    title: "",
    date: new Date().toISOString().slice(0, 10),
    videoUrl: "",
    videoType: "",
    duration: 0,
    description: "",
    moduleName: "",
  }
}

function emptyCourse(): Course {
  return { id: "", title: "", zoomLink: "", batchSize: 30, schedule: "", instructorName: "", modules: [], recordings: [] }
}

function detectVideoType(url: string): "youtube" | "drive" | "upload" | "" {
  if (!url) return ""
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("drive.google.com")) return "drive"
  if (url.includes("firebasestorage.googleapis.com")) return "upload"
  return ""
}

// ─── Shared VideoInput ────────────────────────────────────────────────────────

function VideoInput({
  videoUrl,
  videoType,
  courseId,
  itemId,
  onUpdate,
}: {
  videoUrl: string
  videoType: string
  courseId: string
  itemId: string
  onUpdate: (url: string, type: "youtube" | "drive" | "upload" | "") => void
}) {
  const [tab, setTab] = React.useState<"url" | "upload">(videoType === "upload" ? "upload" : "url")
  const [upload, setUpload] = React.useState<UploadState>({ progress: 0, status: "idle" })
  const [fileName, setFileName] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    onUpdate(val, detectVideoType(val))
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const path = `recordings/${courseId || "draft"}/${itemId}/${Date.now()}_${file.name}`
    const storageRef = ref(storage, path)
    const task = uploadBytesResumable(storageRef, file)
    setUpload({ progress: 0, status: "uploading" })
    task.on(
      "state_changed",
      (s) => setUpload({ progress: Math.round((s.bytesTransferred / s.totalBytes) * 100), status: "uploading" }),
      (err) => setUpload({ progress: 0, status: "error", error: err.message }),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        onUpdate(url, "upload")
        setUpload({ progress: 100, status: "done" })
      }
    )
  }

  async function removeUpload() {
    if (videoUrl) { try { await deleteObject(ref(storage, videoUrl)) } catch (_) {} }
    onUpdate("", "")
    setUpload({ progress: 0, status: "idle" })
    setFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-3">
      <div className="flex rounded-lg border border-border overflow-hidden w-fit text-sm">
        <button type="button" onClick={() => setTab("url")}
          className={`px-4 py-1.5 transition-colors ${tab === "url" ? "bg-foreground text-background font-medium" : "bg-background text-mutedForeground hover:bg-muted"}`}>
          🔗 Paste URL
        </button>
        <button type="button" onClick={() => setTab("upload")}
          className={`px-4 py-1.5 transition-colors ${tab === "upload" ? "bg-foreground text-background font-medium" : "bg-background text-mutedForeground hover:bg-muted"}`}>
          📁 Upload file
        </button>
      </div>

      {tab === "url" && (
        <div className="space-y-1.5">
          <Input value={videoType !== "upload" ? videoUrl : ""} placeholder="https://youtube.com/... or https://drive.google.com/..." onChange={handleUrlChange} />
          {videoUrl && videoType !== "upload" && (
            <p className="text-xs text-green-600">✅ {videoType === "youtube" ? "🎬 YouTube" : "🎥 Google Drive"} link added</p>
          )}
        </div>
      )}

      {tab === "upload" && (
        <div className="space-y-2">
          {videoType === "upload" && videoUrl ? (
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <p className="text-sm font-medium text-green-800">Video uploaded</p>
                  <p className="text-xs text-green-600 truncate max-w-[260px]">{fileName || "Stored in Firebase Storage"}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 text-xs" onClick={removeUpload}>Remove</Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-8 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}>
                <span className="text-3xl mb-2">🎥</span>
                <p className="text-sm font-medium">Click to select a recording</p>
                <p className="text-xs text-mutedForeground mt-1">MP4, MOV, WebM, AVI — any video file</p>
                <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
              </div>
              {upload.status === "uploading" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-mutedForeground">
                    <span>Uploading {fileName}…</span><span>{upload.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300 rounded-full" style={{ width: `${upload.progress}%` }} />
                  </div>
                </div>
              )}
              {upload.status === "error" && <p className="text-xs text-red-600">❌ Upload failed: {upload.error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── RecordingsSection ────────────────────────────────────────────────────────

function RecordingsSection({
  recordings,
  courseId,
  onChange,
}: {
  recordings: Recording[]
  courseId: string
  onChange: (recordings: Recording[]) => void
}) {
  function addRecording() { onChange([...recordings, emptyRecording()]) }
  function removeRecording(id: string) { onChange(recordings.filter((r) => r.id !== id)) }
  function updateRecording(id: string, key: keyof Recording, value: any) {
    onChange(recordings.map((r) => r.id === id ? { ...r, [key]: value } : r))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              🎬 Session Recordings
              {recordings.length > 0 && (
                <Badge variant="outline" className="text-xs font-mono">{recordings.length}</Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Add past live session recordings. Enrolled students will see these in their <strong>Recordings</strong> tab on the dashboard.
            </CardDescription>
          </div>
          <Button variant="secondary" size="sm" onClick={addRecording}>+ Add recording</Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {recordings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-12 text-center gap-2">
            <span className="text-4xl">🎞️</span>
            <p className="font-medium text-sm">No recordings yet</p>
            <p className="text-xs text-mutedForeground max-w-sm">
              Add past session recordings here. Students enrolled in this course will see them in their Recordings tab.
            </p>
            <Button variant="outline" size="sm" onClick={addRecording} className="mt-2">+ Add recording</Button>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {recordings.map((rec, index) => (
              <React.Fragment key={rec.id}>
                <AccordionItem value={rec.id} className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-wrap">
                      <Badge variant="outline" className="text-xs font-mono flex-shrink-0">#{index + 1}</Badge>
                      <span className="font-medium text-sm truncate">
                        {rec.title || `Untitled recording ${index + 1}`}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                        {rec.date && <span className="text-xs text-mutedForeground">📅 {rec.date}</span>}
                        {rec.moduleName && <span className="text-xs text-mutedForeground">· {rec.moduleName}</span>}
                        {rec.videoType === "youtube" && <Badge className="bg-red-100 text-red-700 text-xs">🎬 YouTube</Badge>}
                        {rec.videoType === "drive" && <Badge className="bg-blue-100 text-blue-700 text-xs">🎥 Drive</Badge>}
                        {rec.videoType === "upload" && <Badge className="bg-purple-100 text-purple-700 text-xs">📁 Uploaded</Badge>}
                        {rec.videoUrl && <Badge className="bg-emerald-100 text-emerald-700 text-xs">✅ Ready</Badge>}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Recording title *</Label>
                        <Input value={rec.title} placeholder="e.g. Session 1 — Introduction"
                          onChange={(e) => updateRecording(rec.id, "title", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Session date</Label>
                        <Input type="date" value={rec.date}
                          onChange={(e) => updateRecording(rec.id, "date", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (minutes)</Label>
                        <Input type="number" value={rec.duration || ""} placeholder="e.g. 60"
                          onChange={(e) => updateRecording(rec.id, "duration", Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Module / Session label{" "}
                          <span className="text-xs text-mutedForeground font-normal">(shown to students)</span>
                        </Label>
                        <Input value={rec.moduleName} placeholder="e.g. Week 1, Day 2"
                          onChange={(e) => updateRecording(rec.id, "moduleName", e.target.value)} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description (optional)</Label>
                        <Textarea value={rec.description} placeholder="What was covered in this session?" rows={2}
                          onChange={(e) => updateRecording(rec.id, "description", e.target.value)} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Video</Label>
                        <VideoInput
                          videoUrl={rec.videoUrl}
                          videoType={rec.videoType}
                          courseId={courseId}
                          itemId={rec.id}
                          onUpdate={(url, type) => {
                            updateRecording(rec.id, "videoUrl", url)
                            updateRecording(rec.id, "videoType", type)
                          }}
                        />
                      </div>
                    </div>
                    <div className="pt-1">
                      <Button variant="destructive" size="sm" onClick={() => removeRecording(rec.id)}>
                        Remove recording
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </React.Fragment>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; courseId: string }>
}) {
  const resolvedParams = use(params)
  const locale = resolvedParams.locale
  const courseId = resolvedParams.courseId

  const { loading, isAdmin, user, profile } = useAdminGuard(locale)
  const router = useRouter()

  const isNew = courseId === "new"

  const [course, setCourse] = React.useState<Course>(emptyCourse())
  const [fetching, setFetching] = React.useState(!isNew)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  // Reset uid counter on mount to keep SSR/client IDs stable
  React.useEffect(() => { _uidCounter = 0 }, [])

  // ── Load existing course ──
  React.useEffect(() => {
    if (!isAdmin || isNew) { setFetching(false); return }
    async function load() {
      const snap = await getDoc(doc(db, "courses", courseId))
      if (snap.exists()) {
        setCourse({
          id: snap.id,
          ...snap.data(),
          modules: (snap.data().modules ?? []).map((m: any) => ({ ...m, lessons: m.lessons ?? [] })) as Module[],
          recordings: (snap.data().recordings ?? []) as Recording[],
        } as Course)
      }
      setFetching(false)
    }
    load()
  }, [isAdmin, courseId, isNew])

  // ── Module helpers ──
  function addModule() {
    setCourse((prev) => ({ ...prev, modules: [...prev.modules, emptyModule(prev.modules.length + 1)] }))
  }
  function removeModule(moduleId: string) {
    setCourse((prev) => ({ ...prev, modules: prev.modules.filter((m) => m.id !== moduleId).map((m, i) => ({ ...m, order: i + 1 })) }))
  }
  function updateModule(moduleId: string, key: keyof Omit<Module, "lessons" | "id">, value: any) {
    setCourse((prev) => ({ ...prev, modules: prev.modules.map((m) => m.id === moduleId ? { ...m, [key]: value } : m) }))
  }
  function addLesson(moduleId: string) {
    setCourse((prev) => ({ ...prev, modules: prev.modules.map((m) => m.id === moduleId ? { ...m, lessons: [...m.lessons, emptyLesson(m.lessons.length + 1)] } : m) }))
  }
  function removeLesson(moduleId: string, lessonId: string) {
    setCourse((prev) => ({ ...prev, modules: prev.modules.map((m) => m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId).map((l, i) => ({ ...l, order: i + 1 })) } : m) }))
  }
  function updateLesson(moduleId: string, lessonId: string, key: keyof Lesson, value: any) {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map((l) => {
          if (l.id !== lessonId) return l
          const updated = { ...l, [key]: value }
          if (key === "videoUrl" && typeof value === "string") updated.videoType = detectVideoType(value)
          return updated
        }),
      } : m),
    }))
  }

  // ── Save ──
  async function saveCourse() {
    if (!course.title.trim()) { setMessage("Course title is required."); return }
    setSaving(true)
    setMessage(null)

    // ✅ finalId outside try — no scope error
    const finalId: string = isNew ? generateCourseId(course.title) : courseId

    try {
      const courseData = {
        ...course,
        id: finalId,
        batchSize: Number(course.batchSize ?? 30),
        recordings: course.recordings ?? [],
        createdBy: isNew ? (user?.uid ?? null) : course.createdBy ?? null,
        createdByName: isNew ? (profile?.name ?? user?.email ?? null) : course.createdByName ?? null,
        lastUpdatedBy: user?.uid ?? null,
        lastUpdatedByName: profile?.name ?? user?.email ?? null,
        updatedAt: serverTimestamp(),
        ...(isNew ? { createdAt: serverTimestamp() } : {}),
      }
      await setDoc(doc(db, "courses", finalId), courseData, { merge: true })
      if (user) {
        await addAuditLog(db, {
          action: isNew ? "course.created" : "course.updated",
          actorUid: user.uid,
          actorName: profile?.name ?? null,
          target: `courses/${finalId}`,
          metadata: { title: course.title, courseId: finalId },
        })
      }
      if (isNew) {
        setMessage("✅ Course created!")
        router.replace(`/${locale}/admin/course/${finalId}`)
      } else {
        setMessage("✅ Saved successfully.")
      }
    } catch (e: any) {
      setMessage(`❌ ${e?.message ?? "Save failed"}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading || fetching) return null
  if (!isAdmin) return null

  return (
    <main className="space-y-6">
      {/* ── Back + Header ── */}
      <div>
        <button onClick={() => router.push(`/${locale}/admin/course`)}
          className="text-sm text-mutedForeground hover:text-foreground flex items-center gap-1.5 mb-4 transition-colors">
          ← Back to courses
        </button>
        <PageHeader
          label="Admin › Courses"
          title={isNew ? "New Course" : course.title || "Edit Course"}
          description={isNew ? "Fill in the details below, then add modules and lessons." : `Editing · ID: ${courseId}`}
        />
      </div>

      {/* ── Core Settings ── */}
      <Card>
        <CardHeader>
          <CardTitle>Core settings</CardTitle>
          <CardDescription>Basic course information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={course.title} placeholder="e.g. Diamond Sutra Masterclass"
              onChange={(e) => setCourse((c) => ({ ...c, title: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Instructor name</Label>
            <Input value={course.instructorName ?? ""} onChange={(e) => setCourse((c) => ({ ...c, instructorName: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Zoom link</Label>
            <Input value={course.zoomLink ?? ""} onChange={(e) => setCourse((c) => ({ ...c, zoomLink: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Batch size</Label>
            <Input type="number" value={course.batchSize ?? 30} onChange={(e) => setCourse((c) => ({ ...c, batchSize: Number(e.target.value) }))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Schedule</Label>
            <Input value={course.schedule ?? ""} placeholder="e.g. 15 days, 6:00–7:00 AM"
              onChange={(e) => setCourse((c) => ({ ...c, schedule: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      {/* ── Modules & Lessons ── */}
      <Card>
        <CardHeader>
          <CardTitle>Modules & Lessons</CardTitle>
          <CardDescription>Add sections and lessons. Each lesson can have a video — paste a URL or upload directly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.modules.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-12 text-center gap-2">
              <span className="text-4xl">🗂️</span>
              <p className="font-medium text-sm">No modules yet</p>
              <p className="text-xs text-mutedForeground max-w-xs">Click "Add module" below to start building your course structure.</p>
            </div>
          )}

          <Accordion type="multiple" className="space-y-3">
            {course.modules.map((module) => (
              <React.Fragment key={module.id}>
                <AccordionItem value={module.id} className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs font-mono">§{module.order}</Badge>
                      <span className="font-semibold text-sm">{module.title || `Untitled module ${module.order}`}</span>
                      <span className="text-xs text-mutedForeground">
                        {(module.lessons ?? []).length} lesson{(module.lessons ?? []).length !== 1 ? "s" : ""}
                        {module.estimatedDuration ? ` · ${module.estimatedDuration}` : ""}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                    <div className="grid gap-3 rounded-lg border border-border/60 bg-background p-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Module title</Label>
                        <Input value={module.title} placeholder="e.g. Getting Started"
                          onChange={(e) => updateModule(module.id, "title", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated duration</Label>
                        <Input value={module.estimatedDuration} placeholder="e.g. 1h 20m"
                          onChange={(e) => updateModule(module.id, "estimatedDuration", e.target.value)} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Module description</Label>
                        <Textarea value={module.description} placeholder="What will students learn in this section?" rows={2}
                          onChange={(e) => updateModule(module.id, "description", e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-mutedForeground">Lessons</p>
                      {(module.lessons ?? []).map((lesson) => (
                        <div key={lesson.id} className="rounded-lg border border-border/60 bg-background p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs font-mono">L{lesson.order}</Badge>
                              {lesson.isFreePreview && <Badge className="bg-green-100 text-green-700 text-xs">Free Preview</Badge>}
                              {lesson.videoType === "youtube" && <Badge className="bg-red-100 text-red-700 text-xs">🎬 YouTube</Badge>}
                              {lesson.videoType === "drive" && <Badge className="bg-blue-100 text-blue-700 text-xs">🎥 Drive</Badge>}
                              {lesson.videoType === "upload" && <Badge className="bg-purple-100 text-purple-700 text-xs">📁 Uploaded</Badge>}
                              {lesson.videoUrl && <Badge className="bg-emerald-100 text-emerald-700 text-xs">📹 Ready</Badge>}
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 text-xs"
                              onClick={() => removeLesson(module.id, lesson.id)}>
                              Remove lesson
                            </Button>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Lesson title</Label>
                              <Input value={lesson.title} placeholder="e.g. Introduction to the Sutra"
                                onChange={(e) => updateLesson(module.id, lesson.id, "title", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label>Duration (minutes)</Label>
                              <Input type="number" value={lesson.duration || ""} placeholder="e.g. 12"
                                onChange={(e) => updateLesson(module.id, lesson.id, "duration", Number(e.target.value))} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Course Video</Label>
                              <VideoInput
                                videoUrl={lesson.videoUrl || ""}
                                videoType={lesson.videoType || ""}
                                courseId={isNew ? "draft" : courseId}
                                itemId={lesson.id}
                                onUpdate={(url, type) => {
                                  updateLesson(module.id, lesson.id, "videoUrl", url)
                                  updateLesson(module.id, lesson.id, "videoType", type)
                                }}
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Description</Label>
                              <Textarea value={lesson.description} placeholder="What will students learn in this lesson?" rows={2}
                                onChange={(e) => updateLesson(module.id, lesson.id, "description", e.target.value)} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Downloadable resource link <span className="text-xs text-mutedForeground font-normal">(optional)</span></Label>
                              <Input value={lesson.resourceLink} placeholder="https://drive.google.com/file/..."
                                onChange={(e) => updateLesson(module.id, lesson.id, "resourceLink", e.target.value)} />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/30 px-3 py-2">
                            <Switch checked={lesson.isFreePreview}
                              onCheckedChange={(v) => updateLesson(module.id, lesson.id, "isFreePreview", v)} />
                            <div>
                              <p className="text-sm font-medium">Free preview</p>
                              <p className="text-xs text-mutedForeground">Non-enrolled users can watch this lesson</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addLesson(module.id)}>+ Add lesson</Button>
                    </div>

                    <div className="pt-1">
                      <Button variant="destructive" size="sm" onClick={() => removeModule(module.id)}>Remove module</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </React.Fragment>
            ))}
          </Accordion>

          <Button variant="secondary" onClick={addModule}>+ Add module</Button>
        </CardContent>
      </Card>

      {/* ── 🎬 Session Recordings ── */}
      <RecordingsSection
        recordings={course.recordings ?? []}
        courseId={isNew ? "draft" : courseId}
        onChange={(recordings) => setCourse((c) => ({ ...c, recordings }))}
      />

      {/* ── Sticky Save bar ── */}
      <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur border-t border-border py-4 flex items-center gap-3">
        <Button onClick={saveCourse} disabled={saving} size="lg">
          {saving ? "Saving…" : isNew ? "Create course" : "Save settings"}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => router.push(`/${locale}/admin/course`)}>
          Cancel
        </Button>
        {message && <p className="text-sm text-mutedForeground ml-1">{message}</p>}
      </div>
    </main>
  )
}