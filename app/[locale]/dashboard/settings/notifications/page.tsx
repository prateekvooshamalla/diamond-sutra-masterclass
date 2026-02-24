"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/lib/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type Prefs = {
  emailUpdates: boolean
  classReminders: boolean
  whatsappReminders: boolean
}

const defaultPrefs: Prefs = {
  emailUpdates: true,
  classReminders: true,
  whatsappReminders: false,
}

export default function NotificationSettings({ params }: { params: { locale: Locale } }) {
  const router = useRouter()
  const { user, loading } = useUser()
  const [prefs, setPrefs] = React.useState<Prefs>(defaultPrefs)
  const [status, setStatus] = React.useState<string>("")
  const saveTimeout = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (!loading && !user) {
      router.push(`/${params.locale}/auth`)
    }
  }, [loading, user, router, params.locale])

  React.useEffect(() => {
    async function load() {
      if (!user) return
      const snap = await getDoc(doc(db, "users", user.uid))
      const data = snap.exists() ? (snap.data() as any) : {}
      setPrefs({
        ...defaultPrefs,
        ...(data.prefs ?? {}),
      })
    }
    load()
  }, [user])

  React.useEffect(() => {
    if (!user) return
    setStatus("Saving...")
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      await setDoc(
        doc(db, "users", user.uid),
        {
          prefs,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      setStatus("Saved")
    }, 500)
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [prefs, user])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose the signals that matter.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div>
            <p className="text-sm font-medium text-ink">Email updates</p>
            <p className="text-xs text-mutedForeground">Session reminders and course updates.</p>
          </div>
          <Switch
            checked={prefs.emailUpdates}
            onCheckedChange={(value) => setPrefs((prev) => ({ ...prev, emailUpdates: value }))}
          />
        </div>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div>
            <p className="text-sm font-medium text-ink">Class reminders</p>
            <p className="text-xs text-mutedForeground">Quick nudges before live sessions.</p>
          </div>
          <Switch
            checked={prefs.classReminders}
            onCheckedChange={(value) => setPrefs((prev) => ({ ...prev, classReminders: value }))}
          />
        </div>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div>
            <p className="text-sm font-medium text-ink">WhatsApp reminders</p>
            <p className="text-xs text-mutedForeground">Optional WhatsApp alerts (if enabled).</p>
          </div>
          <Switch
            checked={prefs.whatsappReminders}
            onCheckedChange={(value) => setPrefs((prev) => ({ ...prev, whatsappReminders: value }))}
          />
        </div>
        {status ? <p className="text-xs text-mutedForeground">{status}</p> : null}
      </CardContent>
    </Card>
  )
}
