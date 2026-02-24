import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["en", "hi", "ml", "kn", "zh"] as const
const defaultLocale = "en"

function getLocale(request: NextRequest) {
  const accept = request.headers.get("accept-language") || ""
  // very small negotiator: prefer exact match prefix
  const lower = accept.toLowerCase()
  for (const loc of locales) {
    if (lower.includes(loc)) return loc
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) return NextResponse.next()

  // If already has locale prefix, continue
  const hasLocale = locales.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`))
  if (hasLocale) return NextResponse.next()

  const locale = getLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next|api|.*\..*).*)"],
}
