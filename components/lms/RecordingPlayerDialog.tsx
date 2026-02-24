"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Recording = {
  title: string
  driveEmbedUrl: string
  date?: string
}

export function RecordingPlayerDialog({
  open,
  onOpenChange,
  recording,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  recording: Recording | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{recording?.title ?? "Recording"}</DialogTitle>
          <DialogDescription>Watch the session recording.</DialogDescription>
        </DialogHeader>
        {recording ? (
          <div className="aspect-video overflow-hidden rounded-lg border border-border bg-muted">
            <iframe
              src={recording.driveEmbedUrl}
              className="h-full w-full"
              allow="autoplay"
              title={recording.title}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
