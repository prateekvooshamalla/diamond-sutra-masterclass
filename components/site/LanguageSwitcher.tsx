"use client"
import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Locale } from "@/lib/i18n"

const label: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  zh: "中文",
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(nextLocale: Locale) {
    const parts = pathname.split("/")
    parts[1] = nextLocale
    router.push(parts.join("/"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Select language"
          className="inline-flex items-center gap-1.5 border border-white/15 bg-transparent px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37] focus:outline-none"
        >
          <Globe className="h-3.5 w-3.5" />
          {label[locale]}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] border border-white/10 bg-[#0D0E1C] p-1 shadow-xl"
      >
        {(Object.keys(label) as Locale[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => switchTo(l)}
            className={`cursor-pointer px-3 py-2 text-xs transition-colors focus:bg-[#D4AF37]/10 focus:text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] ${
              l === locale ? "text-[#D4AF37]" : "text-white/50"
            }`}
          >
            {label[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}