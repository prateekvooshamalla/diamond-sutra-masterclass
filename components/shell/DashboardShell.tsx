"use client"
import * as React from "react"
import { SidebarNav } from "@/components/shell/SidebarNav"
import { Topbar } from "@/components/shell/Topbar"

export function DashboardShell({ locale, children }: { locale: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-8 px-4 py-6">
        <aside className="hidden w-60 shrink-0 flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 lg:flex">
          <SidebarNav locale={locale} />
        </aside>
        <div className="flex flex-1 flex-col gap-6">
          <Topbar locale={locale} />
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </div>
  )
}
