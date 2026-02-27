"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/Services/utils"
import { useUser } from "@/components/site/useUser"
import { BookOpen, Home, Settings, Users, Video, LayoutGrid } from "lucide-react"

const userNav = [
  { label: "Home", href: "", icon: Home },
  { label: "Content", href: "content", icon: BookOpen },
  { label: "Recordings", href: "recordings", icon: Video },
  { label: "Settings", href: "settings", icon: Settings },
]

const adminNav = [
  { label: "Admin Home", href: "", icon: LayoutGrid },
  { label: "Course", href: "course", icon: BookOpen },
  { label: "Users", href: "users", icon: Users },
  { label: "Enrollments", href: "enrollments", icon: Settings },
]

export function AppSidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const { profile } = useUser()
  const userBase = `/${locale}/app`
  const adminBase = `/${locale}/admin`

  function isActive(href: string, base: string) {
    const full = href ? `${base}/${href}` : base
    return pathname === full || pathname.startsWith(`${full}/`)
  }

  function navItem(item: { label: string; href: string; icon: React.ElementType }, base: string) {
    const href = item.href ? `${base}/${item.href}` : base
    const active = isActive(item.href, base)
    const Icon = item.icon
    return (
      <Link
        key={`${base}-${item.label}`}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition",
          active
            ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
            : "border-transparent text-mutedForeground hover:bg-[var(--muted)] hover:text-[var(--text-primary)]"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-mutedForeground">Navigation</p>
        <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Palm Leaf Sutra</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-mutedForeground">User</p>
        <nav className="space-y-1">
          {userNav.map((item) => navItem(item, userBase))}
        </nav>
      </div>

      {profile?.role === "admin" ? (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-mutedForeground">Admin</p>
          <nav className="space-y-1">
            {adminNav.map((item) => navItem(item, adminBase))}
          </nav>
        </div>
      ) : null}
    </div>
  )
}
