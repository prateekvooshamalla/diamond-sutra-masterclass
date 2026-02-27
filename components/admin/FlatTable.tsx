import * as React from "react"
import { cn } from "@/Services/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type FlatTableProps = {
  headers: string[]
  children: React.ReactNode
  className?: string
}

export function FlatTable({ headers, children, className }: FlatTableProps) {
  return (
    <div className={cn("overflow-auto rounded-lg border border-border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  )
}

export function FlatRow({ children }: { children: React.ReactNode }) {
  return <TableRow>{children}</TableRow>
}

export function FlatCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <TableCell className={className}>{children}</TableCell>
}
