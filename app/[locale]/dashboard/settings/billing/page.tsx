import type { Locale } from "@/Services/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function BillingSettings({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params // ✅ unwrap (even if unused)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Manage billing details and invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-mutedForeground">
          Disabled — payments removed
        </p>
      </CardContent>
    </Card>
  )
}