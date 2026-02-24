"use client"
import * as React from "react"
import type { Locale } from "@/lib/i18n"
import { useAdminGuard } from "@/components/site/useAdminGuard"
import { db } from "@/lib/firebase"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AuditLog = {
  id: string
  action?: string
  actorUid?: string
  actorName?: string
  target?: string
  metadata?: Record<string, unknown>
  createdAt?: any
}

function formatTimestamp(value: any) {
  if (!value) return "-"
  const date = value.toDate ? value.toDate() : new Date(value)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function AdminSettingsAudit({ params }: { params: { locale: Locale } }) {
  const { loading, isAdmin } = useAdminGuard(params.locale)
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      if (!isAdmin) return
      setError(null)
      try {
        const q = query(collection(db, "auditLogs"), orderBy("createdAt", "desc"), limit(50))
        const snaps = await getDocs(q)
        setLogs(snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
      } catch (e: any) {
        setError(e?.message ?? "Failed to load audit logs")
      }
    }
    if (isAdmin) load()
  }, [isAdmin])

  if (loading || !isAdmin) return null

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit log</CardTitle>
          <CardDescription>Latest 50 admin actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="overflow-auto rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">When</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-border">
                    <td className="p-3">{log.action ?? "-"}</td>
                    <td className="p-3">{log.actorName ?? log.actorUid ?? "-"}</td>
                    <td className="p-3">{log.target ?? "-"}</td>
                    <td className="p-3">{formatTimestamp(log.createdAt)}</td>
                  </tr>
                ))}
                {!logs.length ? (
                  <tr>
                    <td className="p-4 text-sm text-mutedForeground" colSpan={4}>
                      No audit events yet.
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
