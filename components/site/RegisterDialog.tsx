"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Locale } from "@/Services/i18n"
import { getDictionary } from "@/Services/i18n"
import { auth, db } from "@/Services/firebase"
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"
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
  const [ok, setOk] = React.useState<string | null>(null)
  const [err, setErr] = React.useState<string | null>(null)

  // ── Write user to top-level users collection (same as useUser reads from) ──
  async function ensureUserDoc(uid: string, overrideName?: string, overrideEmail?: string) {
    await setDoc(
      doc(db, "users", uid),
      {
        name: overrideName ?? name,
        email: overrideEmail ?? email,
        phone,
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }

  // ── Create enrollments for ALL existing courses ──
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
      // non-fatal — enrollment can be created later
    }
  }

  async function handleEmailRegister(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setOk(null)
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await ensureUserDoc(cred.user.uid)
      await createEnrollments(cred.user.uid)
      setOk(d.success)
      setTimeout(() => router.push(`/${locale}/dashboard`), 700)
    } catch (e: any) {
      setErr(e?.message ?? "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setErr(null)
    setOk(null)
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const resolvedName = cred.user.displayName || name
      const resolvedEmail = cred.user.email || email
      await ensureUserDoc(cred.user.uid, resolvedName, resolvedEmail)
      await createEnrollments(cred.user.uid)
      setOk(d.success)
      setTimeout(() => router.push(`/${locale}/dashboard`), 700)
    } catch (e: any) {
      setErr(e?.message ?? "Google sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{d.modalTitle}</DialogTitle>
          <DialogDescription>{d.modalDescription}</DialogDescription>
        </DialogHeader>

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
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {err ? <p className="text-sm text-red-700">{err}</p> : null}
            {ok ? <p className="text-sm text-palm">{ok}</p> : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {d.continue}
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-mutedForeground">
              Sign in with Google to create your account and continue.
            </p>
            {err ? <p className="text-sm text-red-700">{err}</p> : null}
            {ok ? <p className="text-sm text-palm">{ok}</p> : null}
            <Button type="button" onClick={handleGoogle} className="w-full" disabled={loading}>
              Continue with Google
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}