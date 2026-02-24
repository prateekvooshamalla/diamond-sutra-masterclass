"use client"
import * as React from "react"
import { AppSidebar } from "@/components/shell/AppSidebar"
import { AppTopbar } from "@/components/shell/AppTopbar"

export function AppShell({ locale, children }: { locale: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-60 shrink-0 border-r border-[var(--border)] bg-[var(--card)] px-4 py-4 lg:flex">
          <AppSidebar locale={locale} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar locale={locale} />
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
