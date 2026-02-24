"use client"
import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Locale } from "@/lib/i18n"

const label: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  ml: "മലയാളം",
  kn: "ಕನ್ನಡ",
  zh: "中文",
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(nextLocale: Locale) {
    // Replace first segment (locale)
    const parts = pathname.split("/")
    parts[1] = nextLocale
    router.push(parts.join("/"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Select language" className="gap-2">
          <Globe className="h-4 w-4" />
          {label[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(label) as Locale[]).map((l) => (
          <DropdownMenuItem key={l} onClick={() => switchTo(l)}>
            {label[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
