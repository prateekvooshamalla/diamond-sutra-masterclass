"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { getDictionary } from "@/Services/i18n"
import { useRouter } from "next/navigation"
import { auth, db } from "@/Services/firebase"
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  reload,
} from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Tab = "login" | "register"

type UserProfileInput = {
  uid: string
  name?: string
  email?: string
  phone?: string
}

export default function AuthPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const d = React.useMemo(() => getDictionary(locale), [locale])

  const router = useRouter()
  const [tab, setTab] = React.useState<Tab>("login")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)

  // Login fields
  const [loginEmail, setLoginEmail] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")

  // Register fields
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  // Resend state
  const [resendTimer, setResendTimer] = React.useState(0)
  const [resending, setResending] = React.useState(false)
  const [showResend, setShowResend] = React.useState(false)

  React.useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await reload(user)
        if (user.emailVerified) {
          router.replace(`/${locale}/dashboard`)
        }
      }
    })
    return () => unsub()
  }, [locale, router])

  // ── helpers ──────────────────────────────────────────────────────────────

  async function ensureUserDoc(input: UserProfileInput) {
    const ref = doc(db, "users", input.uid)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      await setDoc(ref, {
        name: input.name ?? "",
        email: input.email ?? "",
        phone: input.phone ?? "",
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return
    }

    await setDoc(
      ref,
      {
        name: input.name ?? snap.data().name ?? "",
        email: input.email ?? snap.data().email ?? "",
        phone: input.phone ?? snap.data().phone ?? "",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }

  // ── Creates a pending_payment enrollment for every course ─────────────────
  async function createEnrollments(uid: string) {
    try {
      const snap = await getDocs(collection(db, "courses"))
      await Promise.all(
        snap.docs.map((courseDoc) =>
          setDoc(
            doc(db, "enrollments", `${uid}_${courseDoc.id}`),
            {
              uid,
              courseId: courseDoc.id,
              status: "pending_payment",  // ← NOT "not_enrolled"
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }  // safe to call again — won't overwrite active status
          )
        )
      )
    } catch (_) {
      // non-fatal — enrollment can be created manually by admin
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    setSuccessMsg(null)
    setShowResend(false)

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        loginEmail.trim(),
        loginPassword
      )

      await reload(cred.user)

      if (!cred.user.emailVerified) {
        await auth.signOut()
        setError("Please verify your email before logging in. Check your inbox.")
        setShowResend(true)
        return
      }

      router.replace(`/${locale}/dashboard`)
    } catch (e: any) {
      setError(e?.message ?? "Login failed")
    } finally {
      setLoading(false)
    }
  }

  // ── Register ──────────────────────────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const normalizedEmail = email.trim().toLowerCase()

      // 1. Create Firebase Auth user
      const cred = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      )

      // 2. Save user doc to /users
      await ensureUserDoc({
        uid: cred.user.uid,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
      })

      // 3. Create pending_payment enrollment for all courses ← THIS WAS MISSING
      await createEnrollments(cred.user.uid)

      // 4. Send verification email
      await sendEmailVerification(cred.user)

      // 5. Switch to login tab and show success
      setTab("login")
      setSuccessMsg(
        `Verification email sent to ${normalizedEmail}. Please verify your email then log in.`
      )
      setResendTimer(60)
      setShowResend(true)

      // Clear register fields
      setName("")
      setPhone("")
      setEmail("")
      setPassword("")
    } catch (e: any) {
      setError(e?.message ?? "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  // ── Resend verification ───────────────────────────────────────────────────
  async function handleResend() {
    if (resendTimer > 0 || resending) return
    setResending(true)
    setError(null)
    try {
      const user = auth.currentUser
      if (!user) {
        setError("Please try logging in again to resend verification email.")
        return
      }
      await reload(user)
      if (user.emailVerified) {
        setSuccessMsg("Email already verified! You can now log in.")
        setShowResend(false)
        return
      }
      await sendEmailVerification(user)
      setSuccessMsg("Verification email resent! Check your inbox.")
      setResendTimer(60)
    } catch (e: any) {
      setError("Failed to resend. Please try again.")
    } finally {
      setResending(false)
    }
  }

  // ── Google ────────────────────────────────────────────────────────────────
  async function handleGoogle() {
    if (loading) return
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)

      // Check if this is a brand new Google user
      const isNewUser =
        cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime

      await ensureUserDoc({
        uid: cred.user.uid,
        name: cred.user.displayName ?? "",
        email: cred.user.email ?? "",
      })

      // Only create enrollments for new Google signups
      if (isNewUser) {
        await createEnrollments(cred.user.uid)
      }

      router.replace(`/${locale}/dashboard`)
    } catch (e: any) {
      setError(e?.message ?? "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center px-4 py-12">
      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">{d.authTitle}</CardTitle>
          <CardDescription>{d.authSubtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={tab === "login" ? "default" : "outline"}
              onClick={() => {
                setTab("login")
                setError(null)
                setSuccessMsg(null)
              }}
            >
              {d.authLoginTab}
            </Button>
            <Button
              type="button"
              variant={tab === "register" ? "default" : "outline"}
              onClick={() => {
                setTab("register")
                setError(null)
                setSuccessMsg(null)
                setShowResend(false)
              }}
            >
              {d.authRegisterTab}
            </Button>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}

          {/* Resend button */}
          {showResend && tab === "login" && (
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
                ? `Resend verification email in ${resendTimer}s`
                : "Resend verification email"}
            </Button>
          )}

          {/* Login Form */}
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{d.authEmail}</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">{d.authPassword}</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-700">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : d.authLoginCta}
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">{d.authName}</Label>
                <Input
                  id="register-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-phone">{d.authPhone}</Label>
                <Input
                  id="register-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">{d.authEmail}</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">{d.authPassword}</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-700">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : d.authRegisterCta}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {d.authOr}
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={loading}
          >
            {loading ? "Please wait..." : d.authGoogleCta}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}