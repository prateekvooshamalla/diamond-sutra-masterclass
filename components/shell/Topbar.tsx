"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/Services/firebase"
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher"
import { cn } from "@/Services/utils"
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
import { SidebarNav } from "@/components/shell/SidebarNav"
import { useUser } from "@/components/site/useUser"

function getInitials(name?: string | null) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")
  return initials || "U"
}

function buildBreadcrumbs(pathname: string, locale: string) {
  const prefix = `/${locale}/dashboard`
  const activePath = pathname.replace(prefix, "").replace(/^\//, "")
  const segments = activePath ? activePath.split("/") : []
  const entries = [
    { label: "Dashboard", href: `/${locale}/dashboard` },
    ...segments.map((segment, index) => {
      const href = `/${locale}/dashboard/${segments.slice(0, index + 1).join("/")}`
      const label = segment.replace(/\b\w/g, (s) => s.toUpperCase())
      return { label, href }
    }),
  ]
  return entries
}

export function Topbar({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { profile } = useUser()
  const breadcrumbs = buildBreadcrumbs(pathname, locale)
  const initials = getInitials(profile?.name)

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
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
              <SidebarNav locale={locale} />
            </div>
          </SheetContent>
        </Sheet>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-mutedForeground">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              <Link
                href={crumb.href}
                className={cn("hover:text-ink", index === breadcrumbs.length - 1 && "text-ink")}
              >
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 ? <span className="text-mutedForeground">/</span> : null}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 md:flex">
          <span className="text-xs text-mutedForeground">Search</span>
          <Separator className="h-4 w-px" />
          <Input
            className="h-7 border-none bg-transparent p-0 text-sm focus-visible:ring-0"
            placeholder="Search"
          />
        </div>
        <LanguageSwitcher locale={locale} />
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
    </header>
  )
}
