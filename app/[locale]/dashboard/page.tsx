// "use client"

// import * as React from "react"
// import type { Locale } from "@/lib/i18n"
// import { useRouter } from "next/navigation"
// import { useUser } from "@/components/site/useUser"
// import { db } from "@/lib/firebase"
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { getNextClassInfo } from "@/lib/nextClass"

// type Course = {
//   title: string
//   zoomLink?: string
//   recordings?: { title: string; driveEmbedUrl: string }[]
//   modules?: { title: string; items: string[] }[]
//   startDate?: string
//   classTimeStart?: string
//   classTimeEnd?: string
//   timezone?: string
//   instructorName?: string
//   schedule?: string
// }

// type EnrollmentStatus = "not_enrolled" | "active"

// export default function Dashboard({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>
// }) {
//   // ✅ Unwrap params for Next 16
//   const { locale } = React.use(params)

//   const router = useRouter()
//   const { user, profile, loading } = useUser()

//   const [status, setStatus] = React.useState<EnrollmentStatus>("not_enrolled")
//   const [course, setCourse] = React.useState<Course | null>(null)
//   const [checkInLoading, setCheckInLoading] = React.useState(false)
//   const [pageLoading, setPageLoading] = React.useState(true)
//   const [pageError, setPageError] = React.useState<string | null>(null)

//   // Redirect if not logged in
//   React.useEffect(() => {
//     if (!loading && !user) {
//       router.push(`/${locale}`)
//     }
//   }, [loading, user, router, locale])

//   // Load dashboard data
//   React.useEffect(() => {
//     async function load() {
//       if (!user) return
//       setPageLoading(true)
//       setPageError(null)

//       try {
//         const enrollmentSnap = await getDoc(
//           // doc(db, "masterclass", "diamond-sutra", "users", user.uid)
//           doc(db, "enrollments", `${user.uid}_diamond-sutra`)
//         )

//         setStatus(
//           enrollmentSnap.exists()
//             ? ((enrollmentSnap.data() as any).status ?? "not_enrolled")
//             : "not_enrolled"
//         )

//         const courseSnap = await getDoc(doc(db, "courses", "diamond-sutra"))
//         setCourse(courseSnap.exists() ? (courseSnap.data() as any) : null)
//       } catch (e: any) {
//         setPageError(e?.message ?? "Failed to load dashboard")
//       } finally {
//         setPageLoading(false)
//       }
//     }

//     load()
//   }, [user])

//   async function handleCheckIn() {
//     if (!user) return
//     setCheckInLoading(true)

//     try {
//       await setDoc(
//         doc(db, "enrollments", `${user.uid}_diamond-sutra`),
//         {
//           uid: user.uid,
//           courseId: "diamond-sutra",
//           status: "active",
//           checkedInAt: serverTimestamp(),
//           createdAt: serverTimestamp(),
//           updatedAt: serverTimestamp(),
//         },
//         { merge: true }
//       )

//       setStatus("active")
//     } catch (e: any) {
//       setPageError(e?.message ?? "Check-in failed")
//     } finally {
//       setCheckInLoading(false)
//     }
//   }

//   const canJoin = status === "active" && Boolean(course?.zoomLink)
//   const statusLabel = status === "active" ? "Active" : "Not Enrolled"

//   const instructorName = course?.instructorName ?? "Dr. Rajesh Savera"
//   const classTimeStart = course?.classTimeStart ?? "06:00"
//   const classTimeEnd = course?.classTimeEnd ?? "07:00"
//   const timeZone = course?.timezone

//   const nextClass = getNextClassInfo(course?.startDate, classTimeStart, timeZone)

//   const greetingName = profile?.name ?? user?.displayName ?? "Student"

//   const timeLabel = (value: string) => {
//     const [h, m] = value.split(":")
//     const date = new Date()
//     date.setHours(Number(h), Number(m), 0, 0)

//     return new Intl.DateTimeFormat(undefined, {
//       hour: "numeric",
//       minute: "2-digit",
//       ...(timeZone ? { timeZone } : {}),
//     }).format(date)
//   }

//   const timeRangeLabel = `${timeLabel(classTimeStart)}–${timeLabel(classTimeEnd)}`

//   if (pageLoading) {
//     return <div className="p-6">Loading dashboard...</div>
//   }

//   return (
//     <div className="w-full p-6 space-y-6">
//       <div>
//         <p className="text-xs uppercase tracking-wide text-mutedForeground">
//           My Learning
//         </p>
//         <h1 className="mt-2 text-lg font-semibold">
//           Welcome, {greetingName}
//         </h1>
//       </div>

//       {pageError && (
//         <Card className="border-red-200 bg-red-50">
//           <CardContent className="py-4 text-sm text-red-700">
//             {pageError}
//           </CardContent>
//         </Card>
//       )}

//       <Card>
//         <CardHeader>
//           <CardTitle>Upcoming Live Class</CardTitle>
//           <Badge className="w-fit mt-2">{statusLabel}</Badge>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <p><strong>Date:</strong> {nextClass.label}</p>
//           <p><strong>Time:</strong> {timeRangeLabel}</p>
//           <p><strong>Instructor:</strong> {instructorName}</p>

//           <div className="flex gap-3">
//             <Button
//               onClick={
//                 status === "active"
//                   ? () =>
//                       course?.zoomLink &&
//                       window.open(course.zoomLink, "_blank")
//                   : handleCheckIn
//               }
//               disabled={status === "active" ? !canJoin : checkInLoading}
//             >
//               {status === "active"
//                 ? "Join Zoom"
//                 : checkInLoading
//                 ? "Checking in..."
//                 : "Check-in to Join Batch"}
//             </Button>

//             <Button
//               variant="outline"
//               onClick={() =>
//                 router.push(`/${locale}/dashboard/content`)
//               }
//             >
//               View Course Content
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

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
        doc(db, "enrollments", `diamond-sutra_${user.uid}`)
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
      doc(db, "enrollments", `diamond-sutra_${user.uid}`),
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