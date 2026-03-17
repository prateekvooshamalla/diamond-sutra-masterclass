// "use client"

// import * as React from "react"
// import type { Locale } from "@/Services/i18n"
// import { useRouter } from "next/navigation"
// import { useUser } from "@/components/site/useUser"
// import { db } from "@/Services/firebase"
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// type Course = {
//   title: string
//   zoomLink?: string
//   recordings?: { title: string; driveEmbedUrl: string }[]
//   modules?: { title: string; items: string[] }[]
//   schedule?: string
//   instructorName?: string
// }

// type EnrollmentStatus = "not_enrolled" | "active"

// export default function Dashboard({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>
// }) {
//   const { locale } = React.use(params)

//   const router = useRouter()
//   const { user, profile, loading } = useUser()

//   const [status, setStatus] = React.useState<EnrollmentStatus>("not_enrolled")
//   const [course, setCourse] = React.useState<Course | null>(null)

//   React.useEffect(() => {
//     if (!loading && !user) router.push(`/${locale}`)
//   }, [loading, user])

//   React.useEffect(() => {
//     async function load() {
//       if (!user) return

//       const enrollmentSnap = await getDoc(
//         doc(db, "enrollments", `${user.uid}_diamond-sutra`)
//       )

//       setStatus(
//         enrollmentSnap.exists()
//           ? enrollmentSnap.data().status ?? "not_enrolled"
//           : "not_enrolled"
//       )

//       const courseSnap = await getDoc(doc(db, "courses", "diamond-sutra"))
//       if (courseSnap.exists()) setCourse(courseSnap.data() as Course)
//     }

//     load()
//   }, [user])

//   async function handleCheckIn() {
//     if (!user) return

//     await setDoc(
//       // doc(db, "enrollments", `diamond-sutra_${user.uid}`),
//       doc(db, "enrollments", `${user.uid}_diamond-sutra`),
//       {
//         uid: user.uid,
//         courseId: "diamond-sutra",
//         status: "active",
//         updatedAt: serverTimestamp(),
//       },
//       { merge: true }
//     )

//     setStatus("active")
//   }

//   if (!course) return <div className="p-6">Loading...</div>

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-lg font-semibold">
//         Welcome, {profile?.name ?? "Student"}
//       </h1>

//       <Card>
//         <CardHeader>
//           <CardTitle>{course.title}</CardTitle>
//           <Badge className="w-fit mt-2">
//             {status === "active" ? "Active" : "Not Enrolled"}
//           </Badge>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <p><strong>Schedule:</strong> {course.schedule}</p>
//           <p><strong>Instructor:</strong> {course.instructorName}</p>

//           <div className="flex gap-3">
//             {status === "active" ? (
//               <Button onClick={() => window.open(course.zoomLink, "_blank")}>
//                 Join Zoom
//               </Button>
//             ) : (
//               <Button onClick={handleCheckIn}>
//                 Check-in to Join Batch
//               </Button>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Modules */}
//       {course.modules?.length ? (
//         <Card>
//           <CardHeader>
//             <CardTitle>Modules</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {course.modules.map((m, i) => (
//               <div key={i} className="mb-4">
//                 <h3 className="font-semibold">{m.title}</h3>
//                 <ul className="list-disc ml-6">
//                   {m.items.map((item, idx) => (
//                     <li key={idx}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       ) : null}

//       {/* Recordings */}
//       {course.recordings?.length ? (
//         <Card>
//           <CardHeader>
//             <CardTitle>Recordings</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {course.recordings.map((rec, i) => (
//               <div key={i} className="mb-6">
//                 <h4 className="font-medium">{rec.title}</h4>
//                 <iframe
//                   src={rec.driveEmbedUrl}
//                   className="w-full h-64 rounded-lg mt-2"
//                   allow="autoplay"
//                 />
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       ) : null}
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
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ─── types ────────────────────────────────────────────────────────────────────

type Lesson = {
  id: string
  order: number
  title: string
  duration?: number
}

type Module = {
  id: string
  order: number
  title: string
  lessons?: Lesson[]   // new structure
  items?: string[]     // legacy structure — kept for safety
}

type Course = {
  title: string
  zoomLink?: string
  schedule?: string
  instructorName?: string
  modules?: Module[]
}

type EnrollmentStatus = "not_enrolled" | "pending_payment" | "active"

// ─── component ────────────────────────────────────────────────────────────────

export default function Dashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const router = useRouter()
  const { user, profile, loading } = useUser()

  const [status, setStatus] = React.useState<EnrollmentStatus>("not_enrolled")
  const [course, setCourse] = React.useState<Course | null>(null)
  const [pageLoading, setPageLoading] = React.useState(true)

  React.useEffect(() => {
    if (!loading && !user) router.push(`/${locale}`)
  }, [loading, user, router, locale])

  React.useEffect(() => {
    async function load() {
      if (!user) return

      try {
        const enrollmentSnap = await getDoc(
          doc(db, "enrollments", `${user.uid}_diamond-sutra`)
        )

        setStatus(
          enrollmentSnap.exists()
            ? (enrollmentSnap.data().status as EnrollmentStatus) ?? "not_enrolled"
            : "not_enrolled"
        )

        const courseSnap = await getDoc(doc(db, "courses", "diamond-sutra"))
        if (courseSnap.exists()) setCourse(courseSnap.data() as Course)
      } finally {
        setPageLoading(false)
      }
    }

    load()
  }, [user])

  if (loading || pageLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  }

  if (!course) {
    return <div className="p-6 text-sm text-muted-foreground">Course not found.</div>
  }

  const isEnrolled = status === "active" || status === "pending_payment"

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-semibold">
        Welcome, {profile?.name ?? "Student"}
      </h1>

      {/* ── Enrollment status card ── */}
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <Badge
            className={`w-fit mt-2 ${
              status === "active"
                ? "bg-green-100 text-green-700"
                : status === "pending_payment"
                ? "bg-amber-100 text-amber-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {status === "active"
              ? "Active"
              : status === "pending_payment"
              ? "Pending Payment"
              : "Not Enrolled"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {course.schedule && (
            <p className="text-sm">
              <strong>Schedule:</strong> {course.schedule}
            </p>
          )}
          {course.instructorName && (
            <p className="text-sm">
              <strong>Instructor:</strong> {course.instructorName}
            </p>
          )}

          {/* ── Action area based on status ── */}
          <div className="mt-2">
            {status === "active" && course.zoomLink ? (
              <Button onClick={() => window.open(course.zoomLink, "_blank")}>
                Join Zoom
              </Button>
            ) : status === "pending_payment" ? (
              <div className="rounded-lg border border-amber-200/70 bg-amber-50/60 px-4 py-3">
                <p className="text-sm font-medium text-amber-700">
                  Payment under review
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Your enrollment is being verified. You'll get access once confirmed.
                </p>
              </div>
            ) : (
              <Button onClick={() => router.push(`/${locale}`)}>
                Enroll Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Modules — only show if enrolled ── */}
      {isEnrolled && course.modules?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.modules
              .sort((a, b) => a.order - b.order)
              .map((m, i) => (
                <div key={m.id ?? i}>
                  <h3 className="font-semibold text-sm">{m.title}</h3>

                  {/* New structure: lessons array */}
                  {m.lessons?.length ? (
                    <ul className="mt-1 space-y-1">
                      {m.lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex items-center gap-2 text-sm text-muted-foreground pl-3"
                          >
                            <span className="text-xs">▶️</span>
                            {lesson.title}
                            {lesson.duration ? (
                              <span className="text-xs text-muted-foreground/60">
                                · {lesson.duration} min
                              </span>
                            ) : null}
                          </li>
                        ))}
                    </ul>
                  ) : m.items?.length ? (
                    /* Legacy structure: items array */
                    <ul className="list-disc ml-6 mt-1">
                      {m.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground pl-3 mt-1">
                      No lessons yet.
                    </p>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}