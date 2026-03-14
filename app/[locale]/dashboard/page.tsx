"use client"

import * as React from "react"
import type { Locale } from "@/Services/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/Services/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Course = {
  title: string
  zoomLink?: string
  recordings?: { title: string; driveEmbedUrl: string }[]
  modules?: { title: string; items: string[] }[]
  schedule?: string
  instructorName?: string
}

type EnrollmentStatus = "not_enrolled" | "active"

export default function Dashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = React.use(params)

  const router = useRouter()
  const { user, profile, loading } = useUser()

  const [status, setStatus] = React.useState<EnrollmentStatus>("not_enrolled")
  const [course, setCourse] = React.useState<Course | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.push(`/${locale}`)
  }, [loading, user])

  React.useEffect(() => {
    async function load() {
      if (!user) return

      const enrollmentSnap = await getDoc(
        doc(db, "enrollments", `${user.uid}_diamond-sutra`)
      )

      setStatus(
        enrollmentSnap.exists()
          ? enrollmentSnap.data().status ?? "not_enrolled"
          : "not_enrolled"
      )

      const courseSnap = await getDoc(doc(db, "courses", "diamond-sutra"))
      if (courseSnap.exists()) setCourse(courseSnap.data() as Course)
    }

    load()
  }, [user])

  async function handleCheckIn() {
    if (!user) return

    await setDoc(
      // doc(db, "enrollments", `diamond-sutra_${user.uid}`),
      doc(db, "enrollments", `${user.uid}_diamond-sutra`),
      {
        uid: user.uid,
        courseId: "diamond-sutra",
        status: "active",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )

    setStatus("active")
  }

  if (!course) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-semibold">
        Welcome, {profile?.name ?? "Student"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <Badge className="w-fit mt-2">
            {status === "active" ? "Active" : "Not Enrolled"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Schedule:</strong> {course.schedule}</p>
          <p><strong>Instructor:</strong> {course.instructorName}</p>

          <div className="flex gap-3">
            {status === "active" ? (
              <Button onClick={() => window.open(course.zoomLink, "_blank")}>
                Join Zoom
              </Button>
            ) : (
              <Button onClick={handleCheckIn}>
                Check-in to Join Batch
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      {course.modules?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {course.modules.map((m, i) => (
              <div key={i} className="mb-4">
                <h3 className="font-semibold">{m.title}</h3>
                <ul className="list-disc ml-6">
                  {m.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {/* Recordings */}
      {course.recordings?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            {course.recordings.map((rec, i) => (
              <div key={i} className="mb-6">
                <h4 className="font-medium">{rec.title}</h4>
                <iframe
                  src={rec.driveEmbedUrl}
                  className="w-full h-64 rounded-lg mt-2"
                  allow="autoplay"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}