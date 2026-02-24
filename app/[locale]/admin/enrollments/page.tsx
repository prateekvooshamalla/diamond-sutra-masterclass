"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/lib/firebase"
import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { FilterChips } from "@/components/admin/FilterChips"
import { FlatCell, FlatRow, FlatTable } from "@/components/admin/FlatTable"
import { PageHeader } from "@/components/admin/PageHeader"

type EnrollmentRow = {
  id: string
  uid?: string
  status?: "not_enrolled" | "active"
  checkedInAt?: any
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

export default function AdminEnrollments({ params }: { params: { locale: Locale } }) {
  const { loading, isAdmin } = useAdminGuard(params.locale)
  const [enrollments, setEnrollments] = React.useState<EnrollmentRow[]>([])
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState("all")

  React.useEffect(() => {
    async function load() {
      if (!isAdmin) return
      setError(null)
      try {
        const snaps = await getDocs(collection(db, "enrollments"))
        setEnrollments(snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
      } catch (e: any) {
        setError(e?.message ?? "Failed to load enrollments")
      }
    }
    if (isAdmin) load()
  }, [isAdmin])

  async function updateStatus(row: EnrollmentRow, nextStatus: "active" | "not_enrolled") {
    if (!row.id) return
    setBusyId(row.id)
    try {
      await setDoc(
        doc(db, "enrollments", row.id),
        {
          status: nextStatus,
          checkedInAt: nextStatus === "active" ? serverTimestamp() : null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === row.id
            ? {
                ...e,
                status: nextStatus,
                checkedInAt: nextStatus === "active" ? new Date() : null,
              }
            : e
        )
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading || !isAdmin) return null

  const filtered = enrollments.filter((row) => {
    if (filter === "active") return row.status === "active"
    if (filter === "not_enrolled") return row.status !== "active"
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        label="Admin"
        title="Enrollments"
        description="Activate or deactivate access."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Not Enrolled", value: "not_enrolled" },
          ]}
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>

      <FlatTable headers={["User", "Status", "Checked In", ""]}>
        {filtered.map((enrollment) => (
          <FlatRow key={enrollment.id}>
            <FlatCell>{enrollment.uid ?? enrollment.id}</FlatCell>
            <FlatCell>{enrollment.status ?? "not_enrolled"}</FlatCell>
            <FlatCell>{formatTimestamp(enrollment.checkedInAt)}</FlatCell>
            <FlatCell className="text-right">
              {enrollment.status === "active" ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === enrollment.id}
                  onClick={() => updateStatus(enrollment, "not_enrolled")}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={busyId === enrollment.id}
                  onClick={() => updateStatus(enrollment, "active")}
                >
                  Activate
                </Button>
              )}
            </FlatCell>
          </FlatRow>
        ))}
        {!filtered.length ? (
          <FlatRow>
            <FlatCell className="text-mutedForeground" colSpan={4}>
              No enrollments found.
            </FlatCell>
          </FlatRow>
        ) : null}
      </FlatTable>
    </div>
  )
}
