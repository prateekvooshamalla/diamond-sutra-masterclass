import * as React from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  label: string
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ label, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <p className="text-xs uppercase tracking-wide text-mutedForeground">{label}</p>
        <h1 className="mt-2 text-lg font-semibold text-ink">{title}</h1>
        {description ? <p className="mt-1 text-sm text-mutedForeground">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
