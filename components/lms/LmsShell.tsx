"use client"
import * as React from "react"
import { LmsHeader } from "@/components/lms/LmsHeader"
import { LmsSidebar } from "@/components/lms/LmsSidebar"

export function LmsShell({ locale, children }: { locale: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--card)] px-5 py-6 lg:flex">
          <LmsSidebar locale={locale} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <LmsHeader locale={locale} />
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
