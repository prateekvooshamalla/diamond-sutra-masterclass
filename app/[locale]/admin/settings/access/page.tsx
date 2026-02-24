"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/lib/firebase"
import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { addAuditLog } from "@/lib/audit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type UserRow = {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: "admin" | "user"
  createdAt?: any
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

export default function AdminSettingsAccess({ params }: { params: { locale: Locale } }) {
  const { loading, isAdmin, user, profile } = useAdminGuard(params.locale)
  const [users, setUsers] = React.useState<UserRow[]>([])
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | "admins">("all")
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      if (!isAdmin) return
      setError(null)
      try {
        const snaps = await getDocs(collection(db, "users"))
        setUsers(snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
      } catch (e: any) {
        setError(e?.message ?? "Failed to load users")
      }
    }
    if (isAdmin) load()
  }, [isAdmin])

  async function toggleRole(userRow: UserRow) {
    if (!userRow.id) return
    const nextRole = userRow.role === "admin" ? "user" : "admin"
    setBusyId(userRow.id)
    try {
      await setDoc(
        doc(db, "users", userRow.id),
        { role: nextRole, updatedAt: serverTimestamp() },
        { merge: true }
      )
      if (user) {
        await addAuditLog(db, {
          action: "role.updated",
          actorUid: user.uid,
          actorName: profile?.name ?? null,
          target: `users/${userRow.id}`,
          metadata: { role: nextRole },
        })
      }
      setUsers((prev) => prev.map((u) => (u.id === userRow.id ? { ...u, role: nextRole } : u)))
    } finally {
      setBusyId(null)
    }
  }

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase()
    const matchesQuery =
      !q ||
      (u.name ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q)
    const matchesFilter = filter === "admins" ? u.role === "admin" : true
    return matchesQuery && matchesFilter
  })

  if (loading || !isAdmin) return null

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Access controls</CardTitle>
          <CardDescription>Promote or demote admin roles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="min-w-[220px]"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All users
            </Button>
            <Button
              variant={filter === "admins" ? "default" : "outline"}
              onClick={() => setFilter("admins")}
            >
              Admins only
            </Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="overflow-auto rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-3">{u.name ?? "-"}</td>
                    <td className="p-3">{u.email ?? "-"}</td>
                    <td className="p-3">{u.phone ?? "-"}</td>
                    <td className="p-3">{u.role ?? "user"}</td>
                    <td className="p-3">{formatTimestamp(u.createdAt)}</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === u.id}
                        onClick={() => toggleRole(u)}
                      >
                        {u.role === "admin" ? "Demote" : "Promote"}
                      </Button>
                    </td>
                  </tr>
                ))}
                {!filtered.length ? (
                  <tr>
                    <td className="p-4 text-sm text-mutedForeground" colSpan={6}>
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
