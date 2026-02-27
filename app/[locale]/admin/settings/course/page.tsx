"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/Services/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { addAuditLog } from "@/Services/audit"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Module = { title: string; items: string[] }
type Recording = { title: string; driveEmbedUrl: string }

type Course = {
  title: string
  zoomLink?: string
  batchSize?: number
  schedule?: string
  startDate?: string
  classTimeStart?: string
  classTimeEnd?: string
  timezone?: string
  instructorName?: string
  modules: Module[]
  recordings: Recording[]
}

const defaultCourse: Course = {
  title: "Diamond Sutra Masterclass",
  zoomLink: "",
  batchSize: 30,
  schedule: "15 days, 6:00–7:00 AM",
  startDate: "",
  classTimeStart: "06:00",
  classTimeEnd: "07:00",
  timezone: "Asia/Kolkata",
  instructorName: "Dr. Rajesh Savera",
  modules: [],
  recordings: [],
}

export default function AdminSettingsCourse({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params) // ✅ Next 16 safe
  const { loading, isAdmin, user, profile } = useAdminGuard(locale)

  const [course, setCourse] =
    React.useState<Course>(defaultCourse)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] =
    React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      if (!isAdmin) return

      const snap = await getDoc(
        doc(db, "courses", "diamond-sutra")
      )

      if (!snap.exists()) return

      const data = snap.data() as any

      setCourse({
        ...defaultCourse,
        ...data,
        modules: data.modules ?? [],
        recordings: data.recordings ?? [],
      })
    }

    if (isAdmin) load()
  }, [isAdmin])

  function updateModuleTitle(index: number, value: string) {
    setCourse((prev) => {
      const next = [...prev.modules]
      next[index] = { ...next[index], title: value }
      return { ...prev, modules: next }
    })
  }

  function updateModuleItem(
    moduleIndex: number,
    itemIndex: number,
    value: string
  ) {
    setCourse((prev) => {
      const next = [...prev.modules]
      const items = [...next[moduleIndex].items]
      items[itemIndex] = value
      next[moduleIndex] = { ...next[moduleIndex], items }
      return { ...prev, modules: next }
    })
  }

  function addModule() {
    setCourse((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        { title: "", items: [""] },
      ],
    }))
  }

  function removeModule(index: number) {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter(
        (_, i) => i !== index
      ),
    }))
  }

  function addModuleItem(index: number) {
    setCourse((prev) => {
      const next = [...prev.modules]
      next[index] = {
        ...next[index],
        items: [...next[index].items, ""],
      }
      return { ...prev, modules: next }
    })
  }

  function removeModuleItem(
    moduleIndex: number,
    itemIndex: number
  ) {
    setCourse((prev) => {
      const next = [...prev.modules]
      next[moduleIndex] = {
        ...next[moduleIndex],
        items: next[moduleIndex].items.filter(
          (_, i) => i !== itemIndex
        ),
      }
      return { ...prev, modules: next }
    })
  }

  function addRecording() {
    setCourse((prev) => ({
      ...prev,
      recordings: [
        ...prev.recordings,
        { title: "", driveEmbedUrl: "" },
      ],
    }))
  }

  function updateRecording(
    index: number,
    key: keyof Recording,
    value: string
  ) {
    setCourse((prev) => {
      const next = [...prev.recordings]
      next[index] = {
        ...next[index],
        [key]: value,
      }
      return { ...prev, recordings: next }
    })
  }

  function removeRecording(index: number) {
    setCourse((prev) => ({
      ...prev,
      recordings: prev.recordings.filter(
        (_, i) => i !== index
      ),
    }))
  }

  async function saveCourse() {
    setSaving(true)
    setMessage(null)

    try {
      await setDoc(
        doc(db, "courses", "diamond-sutra"),
        {
          ...course,
          batchSize: Number(course.batchSize || 30),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      if (user) {
        await addAuditLog(db, {
          action: "course.updated",
          actorUid: user.uid,
          actorName: profile?.name ?? null,
          target: "courses/diamond-sutra",
          metadata: { title: course.title },
        })
      }

      setMessage("Saved course settings.")
    } catch (e: any) {
      setMessage(e?.message ?? "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null
  if (!isAdmin) return null

  return (
   <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Core settings</CardTitle>
          <CardDescription>Update the course details used in dashboards.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={course.title} onChange={(e) => setCourse((c) => ({ ...c, title: e.target.value }))} />
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
            <Input value={course.zoomLink ?? ""} onChange={(e) => setCourse((c) => ({ ...c, zoomLink: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Batch size</Label>
            <Input
              type="number"
              value={course.batchSize ?? 30}
              onChange={(e) => setCourse((c) => ({ ...c, batchSize: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Start date</Label>
            <Input
              type="date"
              value={course.startDate ?? ""}
              onChange={(e) => setCourse((c) => ({ ...c, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Class time start</Label>
            <Input
              type="time"
              value={course.classTimeStart ?? "06:00"}
              onChange={(e) => setCourse((c) => ({ ...c, classTimeStart: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Class time end</Label>
            <Input
              type="time"
              value={course.classTimeEnd ?? "07:00"}
              onChange={(e) => setCourse((c) => ({ ...c, classTimeEnd: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Input
              value={course.timezone ?? "Asia/Kolkata"}
              onChange={(e) => setCourse((c) => ({ ...c, timezone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Schedule text</Label>
            <Input value={course.schedule ?? ""} onChange={(e) => setCourse((c) => ({ ...c, schedule: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
          <CardDescription>Add, remove, and reorder modules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.modules.map((module, index) => (
            <div key={index} className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={module.title}
                  placeholder={`Module ${index + 1} title`}
                  onChange={(e) => updateModuleTitle(index, e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={() => removeModule(index)}>
                  Remove module
                </Button>
              </div>
              <div className="mt-3 space-y-2">
                {module.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <Input
                      value={item}
                      placeholder="Module item"
                      onChange={(e) => updateModuleItem(index, itemIndex, e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeModuleItem(index, itemIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={() => addModuleItem(index)}>
                  Add item
                </Button>
              </div>
            </div>
          ))}
          <Button variant="secondary" onClick={addModule}>
            Add module
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recordings</CardTitle>
          <CardDescription>Embed Google Drive preview links.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.recordings.map((recording, index) => (
            <div key={index} className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <Input
                  value={recording.title}
                  placeholder="Recording title"
                  onChange={(e) => updateRecording(index, "title", e.target.value)}
                />
                <Input
                  value={recording.driveEmbedUrl}
                  placeholder="https://drive.google.com/file/d/.../preview"
                  onChange={(e) => updateRecording(index, "driveEmbedUrl", e.target.value)}
                />
                <Button variant="outline" onClick={() => removeRecording(index)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button variant="secondary" onClick={addRecording}>
            Add recording
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={saveCourse} disabled={saving}>
          {saving ? "Saving..." : "Save settings"}
        </Button>
        {message ? <p className="text-sm text-mutedForeground">{message}</p> : null}
      </div>
    </div>
  )
}



