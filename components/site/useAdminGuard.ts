"use client"
import * as React from "react"
import type { Locale } from "@/Services/i18n"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/site/useUser"

export function useAdminGuard(locale: Locale) {
  const router = useRouter()
  const { user, profile, loading } = useUser()
  const isAdmin = Boolean(user && profile?.role === "admin")

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      router.push(`/${locale}/dashboard`)
    }
  }, [loading, isAdmin, router, locale])

  return { user, profile, loading, isAdmin }
}
