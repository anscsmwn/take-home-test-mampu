import { Suspense } from "react"
import type { User, UserWithStats } from "@/types/user"
import type { Post } from "@/types/post"
import type { Todo } from "@/types/todo"
import { UsersView } from "@/components/users-view"

async function safeFetch<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    return res.ok ? res.json() : []
  } catch {
    return []
  }
}

async function getData(): Promise<UserWithStats[]> {
  const [users, posts, todos] = await Promise.all([
    safeFetch<User>("https://jsonplaceholder.typicode.com/users"),
    safeFetch<Post>("https://jsonplaceholder.typicode.com/posts"),
    safeFetch<Todo>("https://jsonplaceholder.typicode.com/todos"),
  ])

  if (users.length === 0) throw new Error("Failed to fetch users")

  return users.map((user) => {
    const userTodos = todos.filter((t) => t.userId === user.id)
    return {
      ...user,
      totalPosts: posts.filter((p) => p.userId === user.id).length,
      completedTodos: userTodos.filter((t) => t.completed).length,
      pendingTodos: userTodos.filter((t) => !t.completed).length,
    }
  })
}

export default async function UsersPage() {
  let users: UserWithStats[]
  let error: string | null = null

  try {
    users = await getData()
  } catch {
    users = []
    error = "Could not load users. Please try again later."
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage and browse all users.
        </p>
      </div>
      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <Suspense>
          <UsersView users={users} />
        </Suspense>
      )}
    </div>
  )
}
