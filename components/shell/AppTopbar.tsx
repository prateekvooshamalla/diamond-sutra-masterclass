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
import { AppSidebar } from "@/components/shell/AppSidebar"
import { useUser } from "@/components/site/useUser"

function getInitials(name?: string | null) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")
  return initials || "U"
}

export function AppTopbar({ locale }: { locale: string }) {
  const router = useRouter()
  const { profile } = useUser()
  const initials = getInitials(profile?.name)

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
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
                <AppSidebar locale={locale} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Palm Leaf Sutra • SIF</p>
            <p className="text-xs text-mutedForeground">Learning workspace</p>
          </div>
        </div>

        <div className="flex w-full max-w-xl items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-3 py-2 md:w-auto md:flex-1">
          <span className="text-xs text-mutedForeground">Search</span>
          <Separator className="h-4 w-px" />
          <Input
            className="h-7 border-none bg-transparent p-0 text-sm focus-visible:ring-0"
            placeholder="Search"
          />
        </div>

        <div className="flex items-center gap-3">
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
              <DropdownMenuItem onClick={() => router.push(`/${locale}/app/settings/profile`)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/${locale}/app/settings`)}>
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
