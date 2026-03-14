
// dashboard/settings/profile/page.tsx
"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"
import { db } from "@/Services/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ProfileData = {
  name?: string
  phone?: string
  email?: string
  preferredLanguage?: Locale
  timezone?: string
  photoUrl?: string
  role?: "admin" | "user"
  createdAt?: any
}

const languageOptions: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ml", label: "Malayalam" },
  { value: "kn", label: "Kannada" },
  { value: "zh", label: "Chinese" },
]

const timezoneOptions = [
  "Asia/Kolkata",
  "Asia/Singapore",
  "Europe/London",
  "America/New_York",
]

function getInitials(name?: string | null) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U"
}

function formatTimestamp(value: any) {
  if (!value) return "-"
  const date = value.toDate ? value.toDate() : new Date(value)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)
}

export default function ProfileSettings({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params) // ✅ unwrap params

  const router = useRouter()
  const { user, profile, loading } = useUser()

  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [preferredLanguage, setPreferredLanguage] =
    React.useState<Locale>(locale)
  const [timezone, setTimezone] = React.useState("Asia/Kolkata")
  const [photoUrl, setPhotoUrl] = React.useState("")
  const [role, setRole] = React.useState<"admin" | "user">("user")
  const [createdAt, setCreatedAt] = React.useState<any>(null)

  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/auth`)
    }
  }, [loading, user, router, locale])

  React.useEffect(() => {
    async function loadProfile() {
      if (!user) return

      const snap = await getDoc(doc(db, "users", user.uid))
      const data = (snap.exists() ? snap.data() : {}) as ProfileData

      setName(data.name ?? profile?.name ?? "")
      setPhone(data.phone ?? "")
      setEmail(user.email ?? data.email ?? "")
      setPreferredLanguage(data.preferredLanguage ?? locale)
      setTimezone(data.timezone ?? "Asia/Kolkata")
      setPhotoUrl(data.photoUrl ?? "")
      setRole((data.role as "admin" | "user") ?? "user")
      setCreatedAt(data.createdAt ?? null)
    }

    loadProfile()
  }, [user, profile?.name, locale])

  async function saveProfile() {
    if (!user) return

    setError(null)
    setSaving(true)
    setMessage(null)

    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()

    if (!trimmedName) {
      setSaving(false)
      setError("Name is required.")
      return
    }

    if (trimmedPhone.length < 7) {
      setSaving(false)
      setError("Phone number looks too short.")
      return
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: trimmedName,
          phone: trimmedPhone,
          email,
          preferredLanguage,
          timezone,
          photoUrl,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      setMessage("Profile updated.")

      if (preferredLanguage !== locale) {
        router.push(`/${preferredLanguage}/dashboard/settings/profile`)
      }
    } catch (e: any) {
      setError(e?.message ?? "Update failed")
    } finally {
      setSaving(false)
    }
  }

  const initials = getInitials(name || profile?.name)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>
            Update your contact and localization preferences.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              {photoUrl ? <AvatarImage src={photoUrl} alt={name} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Profile photo</p>
              <p className="text-xs text-mutedForeground">
                Optional URL or initials placeholder.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>

            <div className="space-y-2">
              <Label>Preferred language</Label>
              <select
                className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm"
                value={preferredLanguage}
                onChange={(e) =>
                  setPreferredLanguage(e.target.value as Locale)
                }
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <select
                className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {timezoneOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Photo URL (optional)</Label>
              <Input
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={saveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>

            {message && (
              <p className="text-sm text-emerald-700">{message}</p>
            )}

            {error && (
              <p className="text-sm text-red-700">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account summary</CardTitle>
          <CardDescription>
            Security and access snapshot.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-mutedForeground">
          <div className="flex justify-between">
            <span>Name</span>
            <span className="font-medium">
              {name || profile?.name || user?.displayName || "Student"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Email</span>
            <span className="font-medium">
              {email || user?.email || "-"}
            </span>
          </div>

          {role === "admin" && (
            <div className="flex justify-between">
              <span>Role</span>
              <span className="font-medium">Admin</span>
            </div>
          )}

          {createdAt && (
            <div className="flex justify-between">
              <span>Created</span>
              <span className="font-medium">
                {formatTimestamp(createdAt)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}