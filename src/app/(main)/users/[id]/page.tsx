import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowLeftIcon, MailIcon, PhoneIcon, GlobeIcon, BuildingIcon, MapPinIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/types/user"

async function getUser(id: string): Promise<User | null> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    next: { revalidate: 60 },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = await getUser(id)
  if (!user) return { title: "User not found" }
  return {
    title: `${user.name} — Users`,
    description: `${user.name} (${user.username}) · ${user.email} · ${user.company.name}`,
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let user: User | null
  let fetchError = false

  try {
    user = await getUser(id)
  } catch {
    fetchError = true
    user = null
  }

  if (fetchError) {
    return (
      <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-2xl">
        <BackLink />
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Could not load user details. Please try again later.
        </div>
      </div>
    )
  }

  if (!user) notFound()

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-2xl">
      <BackLink />

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Row icon={<MailIcon className="size-3.5" />} label={user.email} />
            <Row icon={<PhoneIcon className="size-3.5" />} label={user.phone} />
            <Row
              icon={<GlobeIcon className="size-3.5" />}
              label={
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {user.website}
                </a>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Company
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Row icon={<BuildingIcon className="size-3.5" />} label={user.company.name} />
            <p className="text-muted-foreground italic text-xs pl-5">
              &ldquo;{user.company.catchPhrase}&rdquo;
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <Row
              icon={<MapPinIcon className="size-3.5" />}
              label={`${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/users"
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit transition-colors"
    >
      <ArrowLeftIcon className="size-4" />
      Back to list
    </Link>
  )
}

function Row({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  )
}
