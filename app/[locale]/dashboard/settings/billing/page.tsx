import type { Locale } from "@/lib/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BillingSettings({ params }: { params: { locale: Locale } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Manage billing details and invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-mutedForeground">Disabled — payments removed</p>
      </CardContent>
    </Card>
  )
}
