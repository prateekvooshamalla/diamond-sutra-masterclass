"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useUser } from "@/components/site/useUser"
import { auth } from "@/lib/firebase"
import { sendPasswordResetEmail, signOut } from "firebase/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SecuritySettings({ params }: { params: { locale: Locale } }) {
  const { user, profile } = useUser()
  const [status, setStatus] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [signingOut, setSigningOut] = React.useState(false)

  const providerIds = user?.providerData?.map((p) => p.providerId) ?? []
  const hasPassword = providerIds.includes("password")
  const hasGoogle = providerIds.includes("google.com")

  async function handleReset() {
    if (!user?.email) return
    setLoading(true)
    setStatus(null)
    try {
      await sendPasswordResetEmail(auth, user.email)
      setStatus("Password reset email sent.")
    } catch (e: any) {
      setStatus(e?.message ?? "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOutEverywhere() {
    setSigningOut(true)
    await signOut(auth)
    setSigningOut(false)
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected sign-in methods</CardTitle>
          <CardDescription>Review which providers are linked to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Alert>
            <AlertTitle>Password</AlertTitle>
            <AlertDescription>{hasPassword ? "Connected" : "Not connected"}</AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Google</AlertTitle>
            <AlertDescription>{hasGoogle ? "Connected" : "Not connected"}</AlertDescription>
          </Alert>
          {!profile?.email ? (
            <p className="text-xs text-mutedForeground">No email on file yet.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Send a secure reset link to your email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleReset} disabled={loading || !user?.email}>
            {loading ? "Sending..." : "Send password reset email"}
          </Button>
          {status ? <p className="text-sm text-mutedForeground">{status}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>Sign out of all devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOutEverywhere} disabled={signingOut}>
            {signingOut ? "Signing out..." : "Logout everywhere"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200/70 bg-red-50/50">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Restricted actions for administrators only.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button variant="outline" disabled>
            Delete account
          </Button>
          <p className="text-sm text-mutedForeground">Admin-only / Coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
