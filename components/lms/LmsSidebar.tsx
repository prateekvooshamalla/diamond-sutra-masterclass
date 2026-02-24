"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { label: "My Learning", href: "", match: "" },
  { label: "Course Content", href: "course", match: "course" },
  { label: "Recordings", href: "", match: "", hash: "#recordings" },
  { label: "Announcements", href: "", match: "", hash: "#announcements" },
  { label: "Settings", href: "settings", match: "settings" },
]

export function LmsSidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const prefix = `/${locale}/dashboard`
  const activePath = pathname.replace(prefix, "").replace(/^\//, "")
  const [hash, setHash] = React.useState("")

  React.useEffect(() => {
    setHash(window.location.hash)
    const handleHashChange = () => setHash(window.location.hash)
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-mutedForeground">My Learning</p>
        <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Palm Leaf Sutra</p>
      </div>
      <Separator />
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const href = item.href ? `${prefix}/${item.href}` : prefix
          const fullHref = item.hash ? `${href}${item.hash}` : href
          const isHashActive = Boolean(item.hash) && activePath === "" && hash === item.hash
          const isActive = item.match
            ? activePath.startsWith(item.match)
            : activePath === "" && (!item.hash || isHashActive)

          return (
            <Link
              key={item.label}
              href={fullHref}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center rounded-md border-l-2 px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "border-transparent text-mutedForeground hover:bg-[var(--muted)] hover:text-[var(--text-primary)]"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
