"use client"

import * as React from "react"
import { use } from "react"
import type { Locale } from "@/Services/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/Services/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { FilterChips } from "@/components/admin/FilterChips"
import {
  FlatCell,
  FlatRow,
  FlatTable,
} from "@/components/admin/FlatTable"
import { PageHeader } from "@/components/admin/PageHeader"

// ─── types ────────────────────────────────────────────────────────────────────

type EnrollmentStatus = "not_enrolled" | "pending_payment" | "active"

type UserEnrollmentRow = {
  uid: string
  userName: string
  userEmail: string
  userPhone?: string
  enrollmentId?: string
  courseId?: string
  status: EnrollmentStatus
  checkedInAt?: any
  createdAt?: any
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(value: any) {
  if (!value) return "-"
  const date = value?.toDate ? value.toDate() : new Date(value)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)
}

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Active
      </span>
    )
  }
  if (status === "pending_payment") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Pending Payment
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-border" />
      Not Enrolled
    </span>
  )
}

// ─── component ────────────────────────────────────────────────────────────────

export default function AdminEnrollments({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const { loading, isAdmin } = useAdminGuard(locale)

  const [rows, setRows] = React.useState<UserEnrollmentRow[]>([])
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState("all")
  const [pageLoading, setPageLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      if (!isAdmin) return
      setError(null)

      try {
        // 1. Fetch ALL users from /users
        const usersSnap = await getDocs(collection(db, "users"))

        // 2. For each user, look up their enrollment doc
        const enriched = await Promise.all(
          usersSnap.docs.map(async (userDoc) => {
            const uid = userDoc.id
            const userData = userDoc.data()

            // Skip admin users
            if (userData.role === "admin") return null

            const enrollmentId = `${uid}_diamond-sutra`

            try {
              const enrollSnap = await getDoc(
                doc(db, "enrollments", enrollmentId)
              )

              if (enrollSnap.exists()) {
                const e = enrollSnap.data()
                return {
                  uid,
                  userName: userData.name ?? userData.displayName ?? "Unknown",
                  userEmail: userData.email ?? "-",
                  userPhone: userData.phone ?? undefined,
                  enrollmentId,
                  courseId: e.courseId ?? "diamond-sutra",
                  status: (e.status as EnrollmentStatus) ?? "not_enrolled",
                  checkedInAt: e.checkedInAt ?? null,
                  createdAt: e.createdAt ?? userData.createdAt ?? null,
                } satisfies UserEnrollmentRow
              }

              // User exists but no enrollment doc yet
              return {
                uid,
                userName: userData.name ?? userData.displayName ?? "Unknown",
                userEmail: userData.email ?? "-",
                userPhone: userData.phone ?? undefined,
                enrollmentId: undefined,
                courseId: undefined,
                status: "not_enrolled" as EnrollmentStatus,
                createdAt: userData.createdAt ?? null,
              } satisfies UserEnrollmentRow

            } catch (_) {
              return {
                uid,
                userName: userData.name ?? userData.displayName ?? "Unknown",
                userEmail: userData.email ?? "-",
                userPhone: userData.phone ?? undefined,
                status: "not_enrolled" as EnrollmentStatus,
              } satisfies UserEnrollmentRow
            }
          })
        )

        // Remove nulls (admins), sort: active → pending → not enrolled
        const statusOrder: Record<EnrollmentStatus, number> = {
          active: 0,
          pending_payment: 1,
          not_enrolled: 2,
        }

        const sorted = enriched
          .filter((r): r is UserEnrollmentRow => r !== null)
          .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

        setRows(sorted)
      } catch (e: any) {
        setError(e?.message ?? "Failed to load users")
      } finally {
        setPageLoading(false)
      }
    }

    if (isAdmin) load()
  }, [isAdmin])

  async function updateStatus(
    row: UserEnrollmentRow,
    nextStatus: "active" | "not_enrolled"
  ) {
    setBusyId(row.uid)
    const enrollmentId = row.enrollmentId ?? `${row.uid}_diamond-sutra`

    try {
      await setDoc(
        doc(db, "enrollments", enrollmentId),
        {
          uid: row.uid,
          courseId: row.courseId ?? "diamond-sutra",
          status: nextStatus,
          checkedInAt: nextStatus === "active" ? serverTimestamp() : null,
          updatedAt: serverTimestamp(),
          // only set createdAt if this is a brand new enrollment doc
          ...(row.enrollmentId ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true }
      )

      setRows((prev) =>
        prev.map((r) =>
          r.uid === row.uid
            ? {
                ...r,
                status: nextStatus,
                enrollmentId,
                checkedInAt: nextStatus === "active" ? new Date() : null,
              }
            : r
        )
      )
    } catch (e: any) {
      setError(e?.message ?? "Update failed")
    } finally {
      setBusyId(null)
    }
  }

  if (loading || !isAdmin) return null

  // ── counts for filter chips ───────────────────────────────────────────────
  const counts = {
    all: rows.length,
    active: rows.filter((r) => r.status === "active").length,
    pending_payment: rows.filter((r) => r.status === "pending_payment").length,
    not_enrolled: rows.filter((r) => r.status === "not_enrolled").length,
  }

  const filtered = rows.filter((row) => {
    if (filter === "active") return row.status === "active"
    if (filter === "pending_payment") return row.status === "pending_payment"
    if (filter === "not_enrolled") return row.status === "not_enrolled"
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        label="Admin"
        title="Enrollments"
        description="Manage access for all registered users."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { label: `All (${counts.all})`, value: "all" },
            { label: `Active (${counts.active})`, value: "active" },
            { label: `Pending (${counts.pending_payment})`, value: "pending_payment" },
            { label: `Not Enrolled (${counts.not_enrolled})`, value: "not_enrolled" },
          ]}
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
      </div>

      {pageLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading users...
        </div>
      ) : (
        <FlatTable headers={["User", "Course", "Status", "Date", ""]}>
          {filtered.map((row) => (
            <FlatRow key={row.uid}>

              {/* ── User ── */}
              <FlatCell>
                <div>
                  <p className="font-medium text-sm">{row.userName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {row.userEmail}
                  </p>
                  {row.userPhone && (
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      {row.userPhone}
                    </p>
                  )}
               
                </div>
              </FlatCell>

              {/* ── Course ── */}
              <FlatCell>
                <span className="text-sm text-muted-foreground">
                  {row.courseId ?? "—"}
                </span>
              </FlatCell>

              {/* ── Status ── */}
              <FlatCell>
                <StatusBadge status={row.status} />
              </FlatCell>

              {/* ── Date ── */}
              <FlatCell>
                <span className="text-sm">
                  {formatTimestamp(row.checkedInAt ?? row.createdAt)}
                </span>
              </FlatCell>

              {/* ── Action ── */}
              <FlatCell className="text-right">
                {row.status === "active" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === row.uid}
                    onClick={() => updateStatus(row, "not_enrolled")}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={busyId === row.uid}
                    onClick={() => updateStatus(row, "active")}
                  >
                    Activate
                  </Button>
                )}
              </FlatCell>
            </FlatRow>
          ))}

          {!filtered.length && (
            <FlatRow>
              <FlatCell className="text-muted-foreground" colSpan={5}>
                No users found.
              </FlatCell>
            </FlatRow>
          )}
        </FlatTable>
      )}
    </div>
  )
}