import { UsersTable } from "@/components/users-table"

type User = {
  id: number
  name: string
  email: string
  website: string
}

async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}

export default async function UsersPage() {
  let users: User[]
  let error: string | null = null

  try {
    users = await getUsers()
  } catch {
    users = []
    error = "Could not load users. Please try again later."
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
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
        <UsersTable users={users} />
      )}
    </div>
  )
}
