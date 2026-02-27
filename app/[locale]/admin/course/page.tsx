// "use client"

// import * as React from "react"
// import { use } from "react"
// import type { Locale } from "@/lib/i18n"
// import { useAdminGuard } from "@/components/site/useAdminGuard"
// import { db } from "@/lib/firebase"
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
// import { addAuditLog } from "@/lib/audit"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { PageHeader } from "@/components/admin/PageHeader"

// type Module = { title: string; items: string[] }
// type Recording = { title: string; driveEmbedUrl: string }

// type Course = {
//   title: string
//   zoomLink?: string
//   batchSize?: number
//   schedule?: string
//   modules: Module[]
//   recordings: Recording[]
// }

// const defaultCourse: Course = {
//   title: "Diamond Sutra Masterclass",
//   zoomLink: "",
//   batchSize: 30,
//   schedule: "15 days, 6:00–7:00 AM",
//   modules: [],
//   recordings: [],
// }

// export default function AdminCourse({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>
// }) {
//   const { locale } = use(params)
//   const { loading, isAdmin, user, profile } = useAdminGuard(locale)

//   const [course, setCourse] = React.useState<Course>(defaultCourse)
//   const [saving, setSaving] = React.useState(false)
//   const [message, setMessage] = React.useState<string | null>(null)

//   React.useEffect(() => {
//     async function load() {
//       if (!isAdmin) return

//       const snap = await getDoc(doc(db, "courses", "diamond-sutra"))
//       if (!snap.exists()) return

//       const data = snap.data()

//       setCourse({
//         ...defaultCourse,
//         ...data,
//         modules: data.modules ?? [],
//         recordings: data.recordings ?? [],
//       })
//     }

//     if (isAdmin) load()
//   }, [isAdmin])

//   function addModule() {
//     setCourse((prev) => ({
//       ...prev,
//       modules: [...prev.modules, { title: "", items: [""] }],
//     }))
//   }

//   function updateModuleTitle(index: number, value: string) {
//     setCourse((prev) => {
//       const next = [...prev.modules]
//       next[index] = { ...next[index], title: value }
//       return { ...prev, modules: next }
//     })
//   }

//   function updateModuleItem(moduleIndex: number, itemIndex: number, value: string) {
//     setCourse((prev) => {
//       const next = [...prev.modules]
//       const items = [...next[moduleIndex].items]
//       items[itemIndex] = value
//       next[moduleIndex] = { ...next[moduleIndex], items }
//       return { ...prev, modules: next }
//     })
//   }

//   function addModuleItem(index: number) {
//     setCourse((prev) => {
//       const next = [...prev.modules]
//       next[index] = { ...next[index], items: [...next[index].items, ""] }
//       return { ...prev, modules: next }
//     })
//   }

//   function removeModule(index: number) {
//     setCourse((prev) => ({
//       ...prev,
//       modules: prev.modules.filter((_, i) => i !== index),
//     }))
//   }

//   function removeModuleItem(moduleIndex: number, itemIndex: number) {
//     setCourse((prev) => {
//       const next = [...prev.modules]
//       next[moduleIndex] = {
//         ...next[moduleIndex],
//         items: next[moduleIndex].items.filter((_, i) => i !== itemIndex),
//       }
//       return { ...prev, modules: next }
//     })
//   }

//   function addRecording() {
//     setCourse((prev) => ({
//       ...prev,
//       recordings: [...prev.recordings, { title: "", driveEmbedUrl: "" }],
//     }))
//   }

//   function updateRecording(index: number, key: keyof Recording, value: string) {
//     setCourse((prev) => {
//       const next = [...prev.recordings]
//       next[index] = { ...next[index], [key]: value }
//       return { ...prev, recordings: next }
//     })
//   }

//   function removeRecording(index: number) {
//     setCourse((prev) => ({
//       ...prev,
//       recordings: prev.recordings.filter((_, i) => i !== index),
//     }))
//   }

//   async function saveCourse() {
//     setSaving(true)
//     setMessage(null)

//     try {
//       await setDoc(
//         doc(db, "courses", "diamond-sutra"),
//         {
//           ...course,
//           batchSize: Number(course.batchSize || 30),
//           updatedAt: serverTimestamp(),
//         },
//         { merge: true }
//       )

//       if (user) {
//         await addAuditLog(db, {
//           action: "course.updated",
//           actorUid: user.uid,
//           actorName: profile?.name ?? null,
//           target: "courses/diamond-sutra",
//           metadata: { title: course.title },
//         })
//       }

//       setMessage("Saved course settings.")
//     } catch (e: any) {
//       setMessage(e?.message ?? "Save failed")
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) return null
//   if (!isAdmin) return null

//   return (
//     <main className="space-y-6">
//       <PageHeader
//         label="Admin"
//         title="Course"
//         description="Update the course structure and learning content."
//       />

//       {/* Core Settings */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Core settings</CardTitle>
//           <CardDescription>Title, schedule, and access.</CardDescription>
//         </CardHeader>
//         <CardContent className="grid gap-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <Label>Title</Label>
//             <Input
//               value={course.title}
//               onChange={(e) =>
//                 setCourse((c) => ({ ...c, title: e.target.value }))
//               }
//             />
//           </div>

//           <div className="space-y-2">
//             <Label>Zoom link</Label>
//             <Input
//               value={course.zoomLink ?? ""}
//               onChange={(e) =>
//                 setCourse((c) => ({ ...c, zoomLink: e.target.value }))
//               }
//             />
//           </div>

//           <div className="space-y-2">
//             <Label>Batch size</Label>
//             <Input
//               type="number"
//               value={course.batchSize ?? 30}
//               onChange={(e) =>
//                 setCourse((c) => ({
//                   ...c,
//                   batchSize: Number(e.target.value),
//                 }))
//               }
//             />
//           </div>

//           <div className="space-y-2">
//             <Label>Schedule</Label>
//             <Input
//               value={course.schedule ?? ""}
//               onChange={(e) =>
//                 setCourse((c) => ({ ...c, schedule: e.target.value }))
//               }
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Modules */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Modules</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Accordion type="multiple">
//             {course.modules.map((module, index) => (
//               <AccordionItem key={index} value={`module-${index}`}>
//                 <AccordionTrigger>
//                   {module.title || `Module ${index + 1}`}
//                 </AccordionTrigger>
//                 <AccordionContent className="space-y-3">
//                   <Input
//                     value={module.title}
//                     placeholder="Module title"
//                     onChange={(e) =>
//                       updateModuleTitle(index, e.target.value)
//                     }
//                   />

//                   {module.items.map((item, itemIndex) => (
//                     <div key={itemIndex} className="flex gap-2">
//                       <Input
//                         value={item}
//                         onChange={(e) =>
//                           updateModuleItem(
//                             index,
//                             itemIndex,
//                             e.target.value
//                           )
//                         }
//                       />
//                       <Button
//                         variant="outline"
//                         onClick={() =>
//                           removeModuleItem(index, itemIndex)
//                         }
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   ))}

//                   <Button
//                     variant="outline"
//                     onClick={() => addModuleItem(index)}
//                   >
//                     Add item
//                   </Button>

//                   <Button
//                     variant="destructive"
//                     onClick={() => removeModule(index)}
//                   >
//                     Remove module
//                   </Button>
//                 </AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>

//           <Button variant="outline" onClick={addModule}>
//             Add module
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Recordings */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recordings</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {course.recordings.map((recording, index) => (
//             <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
//               <Input
//                 value={recording.title}
//                 placeholder="Recording title"
//                 onChange={(e) =>
//                   updateRecording(index, "title", e.target.value)
//                 }
//               />
//               <Input
//                 value={recording.driveEmbedUrl}
//                 placeholder="Google Drive embed URL"
//                 onChange={(e) =>
//                   updateRecording(
//                     index,
//                     "driveEmbedUrl",
//                     e.target.value
//                   )
//                 }
//               />
//               <Button
//                 variant="outline"
//                 onClick={() => removeRecording(index)}
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}

//           <Button variant="outline" onClick={addRecording}>
//             Add recording
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Save */}
//       <div className="flex items-center gap-3">
//         <Button onClick={saveCourse} disabled={saving}>
//           {saving ? "Saving..." : "Save settings"}
//         </Button>
//         {message && (
//           <p className="text-sm text-mutedForeground">{message}</p>
//         )}
//       </div>
//     </main>
//   )
// }

"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/Services/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { addAuditLog } from "@/Services/audit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PageHeader } from "@/components/admin/PageHeader"

type Module = { title: string; items: string[] }
type Recording = { title: string; driveEmbedUrl: string }

type Course = {
  title: string
  zoomLink?: string
  batchSize?: number
  schedule?: string
  modules: Module[]
  recordings: Recording[]
}

const defaultCourse: Course = {
  title: "Diamond Sutra Masterclass",
  zoomLink: "",
  batchSize: 30,
  schedule: "15 days, 6:00–7:00 AM",
  modules: [],
  recordings: [],
}

export default function AdminCourse({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const { loading, isAdmin, user, profile } = useAdminGuard(locale)

  const [course, setCourse] = React.useState<Course>(defaultCourse)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      if (!isAdmin) return

      const snap = await getDoc(doc(db, "courses", "diamond-sutra"))
      if (!snap.exists()) return

      const data = snap.data()

      setCourse({
        ...defaultCourse,
        ...data,
        modules: data.modules ?? [],
        recordings: data.recordings ?? [],
      })
    }

    if (isAdmin) load()
  }, [isAdmin])

  function addModule() {
    setCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: "", items: [""] }],
    }))
  }

  function updateModuleTitle(index: number, value: string) {
    setCourse((prev) => {
      const next = [...prev.modules]
      next[index] = { ...next[index], title: value }
      return { ...prev, modules: next }
    })
  }

  function updateModuleItem(moduleIndex: number, itemIndex: number, value: string) {
    setCourse((prev) => {
      const next = [...prev.modules]
      const items = [...next[moduleIndex].items]
      items[itemIndex] = value
      next[moduleIndex] = { ...next[moduleIndex], items }
      return { ...prev, modules: next }
    })
  }

  function addModuleItem(index: number) {
    setCourse((prev) => {
      const next = [...prev.modules]
      next[index] = { ...next[index], items: [...next[index].items, ""] }
      return { ...prev, modules: next }
    })
  }

  function removeModule(index: number) {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }))
  }

  function removeModuleItem(moduleIndex: number, itemIndex: number) {
    setCourse((prev) => {
      const next = [...prev.modules]
      next[moduleIndex] = {
        ...next[moduleIndex],
        items: next[moduleIndex].items.filter((_, i) => i !== itemIndex),
      }
      return { ...prev, modules: next }
    })
  }

  function addRecording() {
    setCourse((prev) => ({
      ...prev,
      recordings: [...prev.recordings, { title: "", driveEmbedUrl: "" }],
    }))
  }

  function updateRecording(index: number, key: keyof Recording, value: string) {
    setCourse((prev) => {
      const next = [...prev.recordings]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, recordings: next }
    })
  }

  function removeRecording(index: number) {
    setCourse((prev) => ({
      ...prev,
      recordings: prev.recordings.filter((_, i) => i !== index),
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
    <main className="space-y-6">
      <PageHeader
        label="Admin"
        title="Course"
        description="Update the course structure and learning content."
      />
      {/* Core Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Core settings</CardTitle>
          <CardDescription>Title, schedule, and access.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={course.title}
              onChange={(e) =>
                setCourse((c) => ({ ...c, title: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Zoom link</Label>
            <Input
              value={course.zoomLink ?? ""}
              onChange={(e) =>
                setCourse((c) => ({ ...c, zoomLink: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Batch size</Label>
            <Input
              type="number"
              value={course.batchSize ?? 30}
              onChange={(e) =>
                setCourse((c) => ({
                  ...c,
                  batchSize: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Input
              value={course.schedule ?? ""}
              onChange={(e) =>
                setCourse((c) => ({ ...c, schedule: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="multiple">
            {course.modules.map((module, index) => (
              <AccordionItem key={index} value={`module-${index}`}>
                <AccordionTrigger>
                  {module.title || `Module ${index + 1}`}
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <Input
                    value={module.title}
                    placeholder="Module title"
                    onChange={(e) =>
                      updateModuleTitle(index, e.target.value)
                    }
                  />
                  {module.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          updateModuleItem(index, itemIndex, e.target.value)
                        }
                      />
                      <Button
                        variant="outline"
                        onClick={() => removeModuleItem(index, itemIndex)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => addModuleItem(index)}>
                    Add item
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => removeModule(index)}
                  >
                    Remove module
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button variant="outline" onClick={addModule}>
            Add module
          </Button>
        </CardContent>
      </Card>

      {/* Recordings */}
      <Card>
        <CardHeader>
          <CardTitle>Recordings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.recordings.map((recording, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <Input
                value={recording.title}
                placeholder="Recording title"
                onChange={(e) =>
                  updateRecording(index, "title", e.target.value)
                }
              />
              <Input
                value={recording.driveEmbedUrl}
                placeholder="Google Drive embed URL"
                onChange={(e) =>
                  updateRecording(index, "driveEmbedUrl", e.target.value)
                }
              />
              <Button variant="outline" onClick={() => removeRecording(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addRecording}>
            Add recording
          </Button>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button onClick={saveCourse} disabled={saving}>
          {saving ? "Saving..." : "Save settings"}
        </Button>
        {message && (
          <p className="text-sm text-mutedForeground">{message}</p>
        )}
      </div>
    </main>
  )
}