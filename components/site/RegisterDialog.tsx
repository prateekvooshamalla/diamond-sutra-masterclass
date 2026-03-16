"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Locale } from "@/Services/i18n"
import { getDictionary } from "@/Services/i18n"
import { auth, db } from "@/Services/firebase"
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from "firebase/auth"
import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

type Props = { locale: Locale; open: boolean; onOpenChange: (v: boolean) => void }

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
              status: "not_enrolled",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          )
        )
      )
    } catch (_) {
      // non-fatal
    }
  }

async function handleEmailRegister(e: React.FormEvent) {
  e.preventDefault()
  setErr(null)
  setLoading(true)

  try {
    const normalizedEmail = email.trim().toLowerCase()
    const cred = await createUserWithEmailAndPassword(auth, email, password)

    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      phone,
      role: "user",
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true })

    await createEnrollments(cred.user.uid)
    console.log("Sending verification email to:", cred.user.email)

    // Send verification email
    await sendEmailVerification(cred.user)

    console.log("Verification email request sent")

   
    await auth.signOut()

    setRegistered(true)

  } catch (e: any) {
    setErr(e?.message ?? "Registration failed")
  } finally {
    setLoading(false)
  }
}

  async function handleGoogle() {
    setErr(null)
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      await setDoc(doc(db, "users", cred.user.uid), {
        name: cred.user.displayName || name,
        email: cred.user.email || email,
        phone,
        role: "user",
        emailVerified: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })
      await createEnrollments(cred.user.uid)
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
      }
      onOpenChange(v)
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{d.modalTitle}</DialogTitle>
          <DialogDescription>{d.modalDescription}</DialogDescription>
        </DialogHeader>

        {registered ? (
          // ✅ Verification screen — stays on auth page
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-2">
              <p className="text-sm font-medium text-green-800">📧 Verification email sent!</p>
              <p className="text-sm text-green-700">
                We sent a verification link to{" "}
                <span className="font-semibold">{email}</span>.
                Please check your inbox and click the link to activate your account.
              </p>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Did not receive it? Check your spam/junk folder.
            </p>
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                setRegistered(false)
                setErr(null)
                onOpenChange(false)
              }}
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <>
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

            {mode === "email" ? (
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{d.fullName}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{d.email}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{d.phone}</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
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
              <div className="space-y-3">
                <p className="text-sm text-mutedForeground">
                  Sign in with Google to create your account and continue.
                </p>
                {err && <p className="text-sm text-red-700">{err}</p>}
                <Button type="button" onClick={handleGoogle} className="w-full" disabled={loading}>
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