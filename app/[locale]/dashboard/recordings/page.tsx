"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecordingPlayerDialog } from "@/components/lms/RecordingPlayerDialog"

type Recording = {
  title: string
  driveEmbedUrl: string
  date?: string
}

type Course = {
  recordings?: Recording[]
}

export default function RecordingsPage({ params }: { params: { locale: Locale } }) {
  const router = useRouter()
  const { user, loading } = useUser()
  const [course, setCourse] = React.useState<Course | null>(null)
  const [pageLoading, setPageLoading] = React.useState(true)
  const [pageError, setPageError] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [activeRecording, setActiveRecording] = React.useState<Recording | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.push(`/${params.locale}`)
  }, [loading, user, router, params.locale])

  React.useEffect(() => {
    async function load() {
      if (!user) return
      setPageLoading(true)
      setPageError(null)
      try {
        const courseSnap = await getDoc(doc(db, "courses", "diamond-sutra"))
        setCourse(courseSnap.exists() ? (courseSnap.data() as any) : null)
      } catch (e: any) {
        setPageError(e?.message ?? "Failed to load recordings")
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, [user])

  function handleWatch(recording: Recording) {
    setActiveRecording(recording)
    setOpen(true)
  }

  const recordings = course?.recordings ?? []

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-mutedForeground">Recordings</p>
        <h1 className="mt-2 text-lg font-semibold">Diamond Sutra Masterclass</h1>
        <p className="mt-1 text-sm text-mutedForeground">Watch past sessions at your own pace.</p>
      </div>

      {pageError ? (
        <Card className="mb-6 border-red-200/70 bg-red-50/60">
          <CardContent className="py-4 text-sm text-red-700">{pageError}</CardContent>
        </Card>
      ) : null}

      {pageLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-24 w-full rounded bg-muted" />
                <div className="h-9 w-24 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recordings.length ? (
            recordings.map((recording, index) => (
              <Card key={`${recording.title}-${index}`} className="border-border bg-card hover:border-palm/30">
                <CardHeader>
                  <CardDescription className="text-xs uppercase tracking-wide text-mutedForeground">Recording</CardDescription>
                  <CardTitle className="mt-2 text-lg font-semibold">{recording.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg border border-border/60 bg-muted" />
                  <Button onClick={() => handleWatch(recording)}>Watch</Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-border/70 sm:col-span-2 lg:col-span-3">
              <CardContent className="py-6 text-sm text-mutedForeground">No recordings available yet.</CardContent>
            </Card>
          )}
        </div>
      )}

      <RecordingPlayerDialog
        open={open}
        onOpenChange={setOpen}
        recording={activeRecording}
      />
    </div>
  )
}
