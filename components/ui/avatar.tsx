import * as React from "react"
import { cn } from "@/Services/utils"

type AvatarProps = React.HTMLAttributes<HTMLDivElement>

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>

type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted", className)}
      {...props}
    />
  )
}

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return <img className={cn("h-full w-full object-cover", className)} {...props} />
}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <span
      className={cn("flex h-full w-full items-center justify-center text-sm font-semibold text-ink", className)}
      {...props}
    />
  )
}
