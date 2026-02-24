"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Course = {
  title: string
  schedule?: string
  zoomLink?: string
  batchSize?: number
}

export default function CourseDetails({ params }: { params: { locale: Locale } }) {
  const [course, setCourse] = React.useState<Course | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "courses", "diamond-sutra"))
      setCourse(snap.exists() ? (snap.data() as any) : null)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course details</CardTitle>
        <CardDescription>Core program configuration snapshot.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-mutedForeground">
        {loading ? (
          <p>Loading course...</p>
        ) : course ? (
          <>
            <p><span className="font-medium text-ink">Title:</span> {course.title}</p>
            <p><span className="font-medium text-ink">Schedule:</span> {course.schedule ?? "15 days, 6:00–7:00 AM"}</p>
            <p><span className="font-medium text-ink">Batch size:</span> {course.batchSize ?? 30}</p>
            <p><span className="font-medium text-ink">Zoom link:</span> {course.zoomLink ?? "Not set"}</p>
          </>
        ) : (
          <p>No course settings found yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
