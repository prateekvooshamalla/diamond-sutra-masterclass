"use client"
import * as React from "react"
import { onAuthStateChanged, reload, type User } from "firebase/auth"
import { auth, db } from "@/Services/firebase"
import { doc, getDoc } from "firebase/firestore"

export type AppUser = {
  uid: string
  email?: string | null
  name?: string | null
  role?: "admin" | "user"
}

export function useUser() {
  const [user, setUser] = React.useState<User | null>(null)
  const [profile, setProfile] = React.useState<AppUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {

      // No user logged in
      if (!u) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      // Refresh Firebase user to get latest verification state
      await reload(u)

      // If email not verified
      if (!u.emailVerified) {
        setUser(u)
        setProfile(null)
        setLoading(false)
        return
      }

      // Verified user
      setUser(u)

      try {
        const snap = await getDoc(doc(db, "users", u.uid))
        const data = snap.exists() ? snap.data() : {}

        setProfile({
          uid: u.uid,
          email: u.email,
          name: (data as any).name ?? u.displayName ?? null,
          role: (data as any).role ?? "user",
        })

      } catch (e) {
        setProfile({
          uid: u.uid,
          email: u.email,
          name: u.displayName ?? null,
          role: "user",
        })
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [])

  return { user, profile, loading }
}