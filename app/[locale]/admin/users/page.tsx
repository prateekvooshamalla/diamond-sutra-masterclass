"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/lib/firebase"
import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { addAuditLog } from "@/lib/audit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FlatCell, FlatRow, FlatTable } from "@/components/admin/FlatTable"
import { PageHeader } from "@/components/admin/PageHeader"

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

export default function AdminUsers({ params }: { params: { locale: Locale } }) {
  const { loading, isAdmin, user, profile } = useAdminGuard(params.locale)
  const [users, setUsers] = React.useState<UserRow[]>([])
  const [search, setSearch] = React.useState("")
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
    if (!q) return true
    return (
      (u.name ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q)
    )
  })

  if (loading || !isAdmin) return null

  return (
    <div className="space-y-6">
      <PageHeader
        label="Admin"
        title="Users"
        description="Search and manage admin roles."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>

      <FlatTable headers={["Name", "Email", "Phone", "Role", "Created", ""]}>
        {filtered.map((u) => (
          <FlatRow key={u.id}>
            <FlatCell>{u.name ?? "-"}</FlatCell>
            <FlatCell>{u.email ?? "-"}</FlatCell>
            <FlatCell>{u.phone ?? "-"}</FlatCell>
            <FlatCell>{u.role ?? "user"}</FlatCell>
            <FlatCell>{formatTimestamp(u.createdAt)}</FlatCell>
            <FlatCell className="text-right">
              <Button
                size="sm"
                variant="outline"
                disabled={busyId === u.id}
                onClick={() => toggleRole(u)}
              >
                {u.role === "admin" ? "Demote" : "Promote"}
              </Button>
            </FlatCell>
          </FlatRow>
        ))}
        {!filtered.length ? (
          <FlatRow>
            <FlatCell className="text-mutedForeground" colSpan={6}>
              No users found.
            </FlatCell>
          </FlatRow>
        ) : null}
      </FlatTable>
    </div>
  )
}
