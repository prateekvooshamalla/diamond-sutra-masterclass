"use client"
import * as React from "react"
import { cn } from "@/Services/utils"

export type FilterOption = {
  label: string
  value: string
}

export function FilterChips({
  options,
  value,
  onChange,
  className,
}: {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              active
                ? "border-palm text-ink"
                : "border-border text-mutedForeground hover:bg-muted/40"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
