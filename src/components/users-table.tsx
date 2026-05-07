"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"

type User = {
  id: number
  name: string
  email: string
  website: string
}

type SortDir = "asc" | "desc"

export function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = React.useState("")
  const [sortDir, setSortDir] = React.useState<SortDir>("asc")

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase()
    return users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
      .sort((a, b) =>
        sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )
  }, [users, query, sortDir])

  const SortIcon = sortDir === "asc" ? ArrowUpIcon : ArrowDownIcon

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search by name or email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 gap-1"
                  onClick={() =>
                    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                  }
                >
                  Name
                  {query || sortDir !== "asc" ? (
                    <SortIcon className="size-3.5" />
                  ) : (
                    <ArrowUpDownIcon className="size-3.5 opacity-50" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Website</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No users match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {user.website}
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-sm text-muted-foreground">
        {filtered.length} of {users.length} users
      </p>
    </div>
  )
}
