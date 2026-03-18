// import Link from "next/link"
// import type { Locale } from "@/Services/i18n"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// const settingsLinks = [
//   { href: "profile", title: "Profile", description: "Update your identity and contact details." },
//   { href: "security", title: "Security", description: "Manage password and session controls." },
//   { href: "notifications", title: "Notifications", description: "Tune alerts for updates and reminders." },
//   { href: "billing", title: "Billing", description: "View billing status and payment settings." },
// ]

// export default async function SettingsHome({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>
// }) {
//   const { locale } = await params // ✅ unwrap here

//   return (
//     <div className="grid gap-6 md:grid-cols-2">
//       {settingsLinks.map((item) => (
//         <Link
//           key={item.href}
//           href={`/${locale}/dashboard/settings/${item.href}`} // ✅ use locale
//         >
//           <Card className="h-full border-border/70 transition hover:border-palm/30">
//             <CardHeader>
//               <CardTitle>{item.title}</CardTitle>
//               <CardDescription>{item.description}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <span className="text-xs font-medium text-palm">Open</span>
//             </CardContent>
//           </Card>
//         </Link>
//       ))}
//     </div>
//   )
// }


"use client"

import * as React from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import type { Locale } from "@/Services/i18n"
import { useUser } from "@/components/site/useUser"

// Redirect settings root straight to profile
export default function SettingsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const router = useRouter()
  const { loading } = useUser()

  React.useEffect(() => {
    if (!loading) {
      router.replace(`/${locale}/dashboard/settings/profile`)
    }
  }, [loading, locale, router])

  return null
}