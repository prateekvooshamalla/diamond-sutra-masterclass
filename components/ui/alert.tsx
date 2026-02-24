import * as React from "react"
import { cn } from "@/lib/utils"

type AlertProps = React.HTMLAttributes<HTMLDivElement>

type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>

type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

export function Alert({ className, ...props }: AlertProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-ink",
        className
      )}
      role="alert"
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return <h5 className={cn("mb-1 font-medium", className)} {...props} />
}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return <p className={cn("text-mutedForeground", className)} {...props} />
}
