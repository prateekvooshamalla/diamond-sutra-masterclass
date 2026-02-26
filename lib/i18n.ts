import en from "@/messages/en.json"
import hi from "@/messages/hi.json"
import ml from "@/messages/ml.json"
import kn from "@/messages/kn.json"
import zh from "@/messages/zh.json"
import te from "@/messages/te.json"

export const locales = ["en", "hi", "te", "kn", "ml", "zh"] as const
export type Locale = (typeof locales)[number]

const dict = { en, hi, te, kn, ml, zh } as const

export function t(locale: Locale, key: keyof typeof en): string {
 
  return dict[locale]?.[key] ?? en[key]
}

export function getDictionary(locale: Locale) {
 
  return dict[locale] ?? en
}