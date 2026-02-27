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
} from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const { locale } = use(params) // ✅ Next 16 safe
  const d = React.useMemo(() => getDictionary(locale), [locale])

  const router = useRouter()
  const [tab, setTab] = React.useState<Tab>("login")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [loginEmail, setLoginEmail] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")

  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace(`/${locale}/dashboard`)
    })
    return () => unsub()
  }, [locale, router])

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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail.trim(),
        loginPassword
      )
      router.replace(`/${locale}/dashboard`)
    } catch (e: any) {
      setError(e?.message ?? "Login failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )

      await ensureUserDoc({
        uid: cred.user.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      })

      router.replace(`/${locale}/dashboard`)
    } catch (e: any) {
      setError(e?.message ?? "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)

      await ensureUserDoc({
        uid: cred.user.uid,
        name: cred.user.displayName ?? "",
        email: cred.user.email ?? "",
      })

      router.replace(`/${locale}/dashboard`)
    } catch (e: any) {
      setError(e?.message ?? "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

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
              }}
            >
              {d.authRegisterTab}
            </Button>
          </div>

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
          <div className="flex items-center gap-3 text-xs text-mutedForeground">
            <span className="h-px flex-1 bg-border" />
            {d.authOr}
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Google Login */}
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