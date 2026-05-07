"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowRightIcon,
  FileTextIcon,
  CircleCheckIcon,
  ClockIcon,
} from "lucide-react"
import type { UserWithStats } from "@/types/user"

type SortField = "name" | "pending" | "posts"
type SortDir = "asc" | "desc"
type FilterKey = "all" | "hasPending" | "noCompleted"

const DEFAULTS: Record<string, string> = {
  sort: "name",
  dir: "asc",
  filter: "all",
}

export function UsersView({ users }: { users: UserWithStats[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get("q") ?? ""
  const sort = (searchParams.get("sort") ?? "name") as SortField
  const dir = (searchParams.get("dir") ?? "asc") as SortDir
  const filter = (searchParams.get("filter") ?? "all") as FilterKey

  function updateParams(updates: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v && v !== DEFAULTS[k]) next.set(k, v)
      else next.delete(k)
    }
    router.push(`?${next.toString()}`, { scroll: false })
  }

  function handleSort(field: SortField) {
    if (sort === field) {
      updateParams({ dir: dir === "asc" ? "desc" : "asc" })
    } else {
      updateParams({ sort: field, dir: "asc" })
    }
  }

  const filtered = React.useMemo(() => {
    const lq = q.toLowerCase()
    return users
      .filter((u) => {
        if (filter === "hasPending") return u.pendingTodos > 0
        if (filter === "noCompleted") return u.completedTodos === 0
        return true
      })
      .filter((u) => {
        if (!lq) return true
        return (
          u.name.toLowerCase().includes(lq) ||
          u.email.toLowerCase().includes(lq)
        )
      })
      .sort((a, b) => {
        let cmp = 0
        if (sort === "name") cmp = a.name.localeCompare(b.name)
        else if (sort === "pending") cmp = a.pendingTodos - b.pendingTodos
        else if (sort === "posts") cmp = a.totalPosts - b.totalPosts
        return dir === "asc" ? cmp : -cmp
      })
  }, [users, q, sort, dir, filter])

  function userHref(id: number) {
    const listSearch = searchParams.toString()
    const back = "/users" + (listSearch ? `?${listSearch}` : "")
    return `/users/${id}?back=${encodeURIComponent(back)}`
  }

  const DirIcon = dir === "asc" ? ArrowUpIcon : ArrowDownIcon

  return (
    <div className="flex flex-col gap-4">
      {/* Controls — filters left, search right */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => handleSort(v as SortField)}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="pending">Pending Todos</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => updateParams({ dir: dir === "asc" ? "desc" : "asc" })}
            title={dir === "asc" ? "Sort ascending" : "Sort descending"}
          >
            <DirIcon className="size-4" />
          </Button>
          <Select value={filter} onValueChange={(v) => updateParams({ filter: v })}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="hasPending">Has Pending</SelectItem>
              <SelectItem value="noCompleted">No Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search by name or email…"
          value={q}
          onChange={(e) => updateParams({ q: e.target.value })}
          className="h-9 w-full sm:w-56 sm:ml-auto"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} of {users.length} users
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-md border px-4 py-12 text-center text-sm text-muted-foreground">
          No users match the current filters.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton active={sort === "name"} dir={dir} onClick={() => handleSort("name")}>
                      Name
                    </SortButton>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="w-[100px] text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                      <SortButton active={sort === "posts"} dir={dir} onClick={() => handleSort("posts")} noOffset>
                        Posts
                      </SortButton>
                    </div>
                  </TableHead>
                  <TableHead className="w-[90px] text-right">
                    <div className="flex items-center justify-end gap-1.5 pr-3 h-8 text-sm font-medium text-muted-foreground">
                      <span className="size-2 rounded-full bg-green-500 shrink-0" />
                      Done
                    </div>
                  </TableHead>
                  <TableHead className="w-[110px] text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                      <SortButton active={sort === "pending"} dir={dir} onClick={() => handleSort("pending")} noOffset>
                        Pending
                      </SortButton>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={userHref(user.id)}
                        className="hover:underline underline-offset-4"
                      >
                        {user.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
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
                    <TableCell className="w-[100px] text-right tabular-nums">
                      {user.totalPosts}
                    </TableCell>
                    <TableCell className="w-[90px] text-right tabular-nums">
                      {user.completedTodos}
                    </TableCell>
                    <TableCell className="w-[110px] text-right tabular-nums">
                      {user.pendingTodos}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-2">
            {filtered.map((user) => (
              <Link
                key={user.id}
                href={userHref(user.id)}
                className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium leading-snug">{user.name}</p>
                  <ArrowRightIcon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                <div className="flex items-center gap-4 text-xs pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-muted-foreground">{user.totalPosts} posts</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-muted-foreground">{user.completedTodos} done</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-muted-foreground">{user.pendingTodos} pending</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function SortButton({
  children,
  active,
  dir,
  onClick,
  noOffset = false,
}: {
  children: React.ReactNode
  active: boolean
  dir: SortDir
  onClick: () => void
  noOffset?: boolean
}) {
  const Icon = active
    ? dir === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon
    : ArrowUpDownIcon
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 gap-1", !noOffset && "-ml-3")}
      onClick={onClick}
    >
      {children}
      <Icon className={cn("size-3.5", !active && "opacity-50")} />
    </Button>
  )
}
