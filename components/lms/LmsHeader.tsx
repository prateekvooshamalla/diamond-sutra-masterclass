"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/Services/firebase"
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LmsSidebar } from "@/components/lms/LmsSidebar"
import { useUser } from "@/components/site/useUser"

function getInitials(name?: string | null) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U"
}

export function LmsHeader({ locale }: { locale: string }) {
  const router = useRouter()
  const { profile } = useUser()
  const initials = getInitials(profile?.name)

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">Menu</Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <LmsSidebar locale={locale} />
              </div>
            </SheetContent>
          </Sheet>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mutedForeground">My Learning</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Dashboard</p>
          </div>
        </div>

        <div className="flex w-full max-w-xl items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 md:w-auto md:flex-1">
          <span className="text-xs text-mutedForeground">Search</span>
          <Separator className="h-4 w-px" />
          <Input
            suppressHydrationWarning
            className="h-7 border-none bg-transparent p-0 text-sm focus-visible:ring-0"
            placeholder="Search courses and lessons"
          />
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />

          {/* ── Bell icon ── */}
          <button
            onClick={() => router.push(`/${locale}/dashboard/settings/notifications`)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-mutedForeground transition hover:bg-[var(--muted)] hover:text-[var(--text-primary)]"
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* ── Avatar dropdown ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-10 rounded-full p-0">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/settings/profile`)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/settings`)}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut(auth)
                  router.push(`/${locale}`)
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}