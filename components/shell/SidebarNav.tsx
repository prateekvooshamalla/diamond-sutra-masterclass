"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const sections = [
  {
    title: "Overview",
    items: [{ href: "", label: "Dashboard" }],
  },
  {
    title: "Course",
    items: [{ href: "course", label: "Course Details" }],
  },
  {
    title: "Settings",
    items: [
      { href: "settings/profile", label: "Profile" },
      { href: "settings/security", label: "Security" },
      { href: "settings/notifications", label: "Notifications" },
    ],
  },
]

export function SidebarNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  const prefix = `/${locale}/dashboard`
  const activePath = pathname.replace(prefix, "").replace(/^\//, "")

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-mutedForeground">Workspace</p>
        <p className="mt-2 font-serif text-lg">Palm Leaf Sutra</p>
      </div>
      <Separator />
      <nav className="flex flex-col gap-5">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-mutedForeground">{section.title}</p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const href = item.href ? `/${locale}/dashboard/${item.href}` : `/${locale}/dashboard`
                const isActive = activePath === item.href
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition",
                      isActive ? "bg-muted text-ink" : "text-mutedForeground hover:text-ink"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
