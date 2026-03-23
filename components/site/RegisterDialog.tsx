

"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Locale } from "@/Services/i18n"
import { getDictionary } from "@/Services/i18n"
import { auth, db } from "@/Services/firebase"
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  reload,
} from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

type Props = { locale: Locale; open: boolean; onOpenChange: (v: boolean) => void }

// ── Reusable welcome email helper ──────────────────────────────────────────
async function sendWelcomeEmail(email: string, name: string) {
  try {
    await fetch("/api/send-welcome-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    })
  } catch (err) {
    // Non-fatal — don't block registration if email fails
    console.error("Welcome email failed:", err)
  }
}

export function RegisterDialog({ locale, open, onOpenChange }: Props) {
  const d = getDictionary(locale)
  const router = useRouter()
  const [mode, setMode] = React.useState<"email" | "google">("email")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)
  const [registered, setRegistered] = React.useState(false)
  const [resending, setResending] = React.useState(false)
  const [resendTimer, setResendTimer] = React.useState(0)
  const [resendMsg, setResendMsg] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  // ── Email registration ─────────────────────────────────────────────────────
  async function handleEmailRegister(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password)

      // 1. Save user profile
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email: normalizedEmail,
        phone,
        role: "user",
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })

      // 2. Send Firebase email verification
      await sendEmailVerification(cred.user)

      // 3. Send welcome email via SES ✅ correctly inside the function
      await sendWelcomeEmail(normalizedEmail, name)

      setResendTimer(60)
      setRegistered(true)
    } catch (e: any) {
      setErr(e?.message ?? "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  // ── Resend verification ────────────────────────────────────────────────────
  async function handleResend() {
    if (resendTimer > 0) return
    setResending(true)
    setResendMsg(null)
    try {
      const user = auth.currentUser
      if (!user) throw new Error("No user found")
      await reload(user)
      if (user.emailVerified) {
        setResendMsg("Email already verified! Click Go to Login.")
        return
      }
      await sendEmailVerification(user)
      setResendMsg("Verification email resent!")
      setResendTimer(60)
    } catch (e: any) {
      setResendMsg("Failed to resend. Please try again.")
    } finally {
      setResending(false)
    }
  }

  // ── Google registration ────────────────────────────────────────────────────
  async function handleGoogle() {
    setErr(null)
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)

      const userName = cred.user.displayName || name
      const userEmail = cred.user.email || email

      // 1. Save user profile
      await setDoc(doc(db, "users", cred.user.uid), {
        name: userName,
        email: userEmail,
        phone,
        role: "user",
        emailVerified: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })

      // 2. Send welcome email via SES ✅ correctly inside the function
      await sendWelcomeEmail(userEmail, userName)

      router.push(`/${locale}/dashboard`)
    } catch (e: any) {
      setErr(e?.message ?? "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v) {
        setRegistered(false)
        setErr(null)
        setResendMsg(null)
        setResendTimer(0)
        setName("")
        setEmail("")
        setPhone("")
        setPassword("")
      }
      onOpenChange(v)
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{d.modalTitle}</DialogTitle>
          <DialogDescription>{d.modalDescription}</DialogDescription>
        </DialogHeader>

        {/* ── Post-registration: awaiting verification ── */}
        {registered ? (
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-2">
              <p className="text-sm font-medium text-green-800">📧 Check your inbox!</p>
              <p className="text-sm text-green-700">
                We sent a verification link to{" "}
                <span className="font-semibold">{email}</span>.
                Click the link in the email to activate your account.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                <span className="h-2 w-2 animate-ping rounded-full bg-green-500 inline-block" />
                Awaiting verification
              </div>
              <p className="text-xs text-gray-400 text-center">
                Open the link in your email to continue
              </p>
            </div>

            {resendMsg && (
              <p className="text-xs text-center text-green-700">{resendMsg}</p>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={resending || resendTimer > 0}
              onClick={handleResend}
            >
              {resending
                ? "Sending..."
                : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend verification email"}
            </Button>

            <Button
              type="button"
              className="w-full"
              onClick={() => {
                setRegistered(false)
                setErr(null)
                setResendMsg(null)
                setResendTimer(0)
                onOpenChange(false)
              }}
            >
              Go to Login
            </Button>
          </div>

        ) : (
          <>
            {/* ── Mode toggle ── */}
            <div className="mb-4 flex gap-2">
              <Button
                type="button"
                variant={mode === "email" ? "default" : "outline"}
                onClick={() => setMode("email")}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={mode === "google" ? "default" : "outline"}
                onClick={() => setMode("google")}
              >
                Google
              </Button>
            </div>

            {/* ── Email form ── */}
            {mode === "email" ? (
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{d.fullName}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{d.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{d.phone}</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {err && <p className="text-sm text-red-700">{err}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : d.continue}
                </Button>
              </form>

            ) : (
              /* ── Google sign-in ── */
              <div className="space-y-3">
                <p className="text-sm text-mutedForeground">
                  Sign in with Google to create your account and continue.
                </p>
                {err && <p className="text-sm text-red-700">{err}</p>}
                <Button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Continue with Google"}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}