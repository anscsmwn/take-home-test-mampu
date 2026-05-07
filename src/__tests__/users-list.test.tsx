import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useRouter, useSearchParams } from "next/navigation"
import { UsersView } from "@/components/users-view"
import UsersPage from "@/app/(main)/users/page"
import UsersLoading from "@/app/(main)/users/loading"
import type { UserWithStats } from "@/types/user"

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(() => "/users"),
  notFound: jest.fn(),
  redirect: jest.fn(),
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// ─── Fixtures (based on real JSONPlaceholder data) ────────────────────────────

const USERS: UserWithStats[] = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" },
    address: { street: "Kulas Light", suite: "Apt. 556", city: "Gwenborough", zipcode: "92998-3874" },
    totalPosts: 10,
    completedTodos: 11,
    pendingTodos: 9,
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
    company: { name: "Deckow-Crist", catchPhrase: "Proactive didactic contingency" },
    address: { street: "Victor Plains", suite: "Suite 879", city: "Wisokyburgh", zipcode: "90566-7771" },
    totalPosts: 10,
    completedTodos: 8,
    pendingTodos: 12,
  },
  {
    id: 3,
    name: "Clementine Bauch",
    username: "Samantha",
    email: "Nathan@yesenia.net",
    phone: "1-463-123-4447",
    website: "ramiro.info",
    company: { name: "Romaguera-Jacobson", catchPhrase: "Face to face bifurcated interface" },
    address: { street: "Douglas Extension", suite: "Suite 847", city: "McKenziehaven", zipcode: "59590-4157" },
    totalPosts: 10,
    completedTodos: 7,
    pendingTodos: 13,
  },
  {
    id: 4,
    name: "Patricia Lebsack",
    username: "Karianne",
    email: "Julianne.OConner@kory.org",
    phone: "493-170-9623 x156",
    website: "kale.biz",
    company: { name: "Robel-Corkery", catchPhrase: "Multi-tiered zero tolerance productivity" },
    address: { street: "Hoeger Mall", suite: "Apt. 692", city: "South Elvis", zipcode: "53919-4257" },
    totalPosts: 10,
    completedTodos: 6,
    pendingTodos: 14,
  },
  {
    id: 5,
    name: "Chelsey Dietrich",
    username: "Kamren",
    email: "Lucio_Hettinger@annie.ca",
    phone: "(254)954-1289",
    website: "demarco.info",
    company: { name: "Keebler LLC", catchPhrase: "User-centric fault-tolerant solution" },
    address: { street: "Skiles Walks", suite: "Suite 351", city: "Roscoeview", zipcode: "33263" },
    totalPosts: 10,
    completedTodos: 12,
    pendingTodos: 8,
  },
  {
    id: 6,
    name: "Mrs. Dennis Schulist",
    username: "Leopoldo_Corkery",
    email: "Karley_Dach@jasper.info",
    phone: "1-477-935-8478 x6430",
    website: "ola.org",
    company: { name: "Considine-Lockman", catchPhrase: "Synchronised bottom-line interface" },
    address: { street: "Norberto Crossing", suite: "Apt. 950", city: "South Christy", zipcode: "23505-1337" },
    totalPosts: 10,
    completedTodos: 6,
    pendingTodos: 14,
  },
  {
    id: 7,
    name: "Kurtis Weissnat",
    username: "Elwyn.Skiles",
    email: "Telly.Hoeger@billy.biz",
    phone: "210.067.6132",
    website: "elvis.io",
    company: { name: "Johns Group", catchPhrase: "Configurable multimedia task-force" },
    address: { street: "Rex Trail", suite: "Suite 280", city: "Howemouth", zipcode: "58804-1099" },
    totalPosts: 10,
    completedTodos: 9,
    pendingTodos: 11,
  },
  {
    id: 8,
    name: "Nicholas Runolfsdottir V",
    username: "Maxime_Nienow",
    email: "Sherwood@rosamond.me",
    phone: "586.493.6943 x140",
    website: "jacynthe.com",
    company: { name: "Abernathy Group", catchPhrase: "Implemented secondary concept" },
    address: { street: "Ellsworth Summit", suite: "Suite 729", city: "Aliyaview", zipcode: "45169" },
    totalPosts: 10,
    completedTodos: 11,
    pendingTodos: 9,
  },
  {
    id: 9,
    name: "Glenna Reichert",
    username: "Delphine",
    email: "Chaim_McDermott@dana.io",
    phone: "(775)976-6794 x41206",
    website: "conrad.com",
    company: { name: "Yost and Sons", catchPhrase: "Switchable contextually-based project" },
    address: { street: "Dayna Park", suite: "Suite 449", city: "Bartholomebury", zipcode: "76495-3109" },
    totalPosts: 10,
    completedTodos: 8,
    pendingTodos: 12,
  },
  {
    id: 10,
    name: "Clementina DuBuque",
    username: "Moriah.Stanton",
    email: "Rey.Padberg@karina.biz",
    phone: "024-648-3804",
    website: "ambrose.net",
    company: { name: "Hoeger LLC", catchPhrase: "Centralized empowering task-force" },
    address: { street: "Kattie Turnpike", suite: "Suite 198", city: "Lebsackbury", zipcode: "31428-2261" },
    totalPosts: 10,
    completedTodos: 12,
    pendingTodos: 8,
  },
]

// Raw API shape (without stats) — used for fetch mocks
const RAW_USERS = USERS.map(({ totalPosts, completedTodos, pendingTodos, ...u }) => u)

function makeFetch(ok = true) {
  return jest.fn().mockImplementation((url: string) => {
    if (!ok) return Promise.resolve({ ok: false, json: async () => [] })
    if (url.includes("/posts")) return Promise.resolve({ ok: true, json: async () =>
      USERS.flatMap((u) => Array.from({ length: u.totalPosts }, (_, i) => ({ id: i, userId: u.id, title: `Post`, body: "" })))
    })
    if (url.includes("/todos")) return Promise.resolve({ ok: true, json: async () =>
      USERS.flatMap((u) => [
        ...Array.from({ length: u.completedTodos }, (_, i) => ({ id: i, userId: u.id, title: `Done`, completed: true })),
        ...Array.from({ length: u.pendingTodos }, (_, i) => ({ id: i + 100, userId: u.id, title: `Pending`, completed: false })),
      ])
    })
    if (url.includes("/users")) return Promise.resolve({ ok: true, json: async () => RAW_USERS })
    return Promise.resolve({ ok: false, json: async () => [] })
  })
}

// ─── UsersLoading ─────────────────────────────────────────────────────────────

describe("UsersLoading", () => {
  it("renders skeleton without crashing", () => {
    render(<UsersLoading />)
    expect(document.body).toBeTruthy()
  })
})

// ─── UsersView ────────────────────────────────────────────────────────────────

describe("UsersView", () => {
  let mockPush: jest.Mock
  let mockSearchParams: URLSearchParams

  beforeEach(() => {
    mockPush = jest.fn()
    mockSearchParams = new URLSearchParams()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
  })

  it("renders all 10 user names", () => {
    render(<UsersView users={USERS} />)
    // getAllByText handles desktop+mobile duplicate renders
    expect(screen.getAllByText("Leanne Graham").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Ervin Howell").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Clementine Bauch").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Patricia Lebsack").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Chelsey Dietrich").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Mrs. Dennis Schulist").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Kurtis Weissnat").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Nicholas Runolfsdottir V").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Glenna Reichert").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Clementina DuBuque").length).toBeGreaterThanOrEqual(1)
  })

  it("renders user emails", () => {
    render(<UsersView users={USERS} />)
    expect(screen.getAllByText("Sincere@april.biz").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Shanna@melissa.tv").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Lucio_Hettinger@annie.ca").length).toBeGreaterThanOrEqual(1)
  })

  it("shows total user count", () => {
    render(<UsersView users={USERS} />)
    expect(screen.getByText("10 of 10 users")).toBeInTheDocument()
  })

  it("user name is a link pointing to /users/[id]", () => {
    render(<UsersView users={USERS} />)
    const links = screen.getAllByRole("link", { name: "Leanne Graham" })
    expect(links[0]).toHaveAttribute("href", expect.stringContaining("/users/1"))
  })

  // ── Search filtering ──────────────────────────────────────────────────────

  it("filters by name — Leanne Graham only", () => {
    mockSearchParams.set("q", "leanne")
    render(<UsersView users={USERS} />)
    expect(screen.getAllByText("Leanne Graham").length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText("Ervin Howell")).not.toBeInTheDocument()
    expect(screen.queryByText("Chelsey Dietrich")).not.toBeInTheDocument()
  })

  it("filters by email — Nathan@yesenia.net finds Clementine Bauch", () => {
    mockSearchParams.set("q", "Nathan@yesenia")
    render(<UsersView users={USERS} />)
    expect(screen.getAllByText("Clementine Bauch").length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument()
  })

  it("shows empty state when search matches nobody", () => {
    mockSearchParams.set("q", "zzznomatch")
    render(<UsersView users={USERS} />)
    expect(screen.getByText("No users match the current filters.")).toBeInTheDocument()
    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument()
  })

  it("shows filtered count after search", () => {
    mockSearchParams.set("q", "clementine")
    render(<UsersView users={USERS} />)
    expect(screen.getByText("1 of 10 users")).toBeInTheDocument()
  })

  // ── Status filters ────────────────────────────────────────────────────────

  it("hasPending filter — all 10 users have pending todos", () => {
    mockSearchParams.set("filter", "hasPending")
    render(<UsersView users={USERS} />)
    expect(screen.getByText("10 of 10 users")).toBeInTheDocument()
  })

  it("noCompleted filter — shows only users with zero completed todos (none here)", () => {
    mockSearchParams.set("filter", "noCompleted")
    render(<UsersView users={USERS} />)
    expect(screen.getByText("0 of 10 users")).toBeInTheDocument()
    expect(screen.getByText("No users match the current filters.")).toBeInTheDocument()
  })

  // ── Sorting ───────────────────────────────────────────────────────────────

  it("sorts by pending desc — Patricia Lebsack (14) or Mrs. Dennis Schulist (14) first", () => {
    mockSearchParams.set("sort", "pending")
    mockSearchParams.set("dir", "desc")
    render(<UsersView users={USERS} />)
    const links = screen
      .getAllByRole("link")
      .filter((l) => USERS.map((u) => u.name).includes(l.textContent ?? ""))
    // top 2 should be the users with 14 pending
    const top2 = links.slice(0, 2).map((l) => l.textContent)
    expect(top2).toContain("Patricia Lebsack")
    expect(top2).toContain("Mrs. Dennis Schulist")
  })

  it("sorts by name asc — Chelsey Dietrich is first alphabetically", () => {
    mockSearchParams.set("sort", "name")
    mockSearchParams.set("dir", "asc")
    render(<UsersView users={USERS} />)
    const links = screen
      .getAllByRole("link")
      .filter((l) => USERS.map((u) => u.name).includes(l.textContent ?? ""))
    expect(links[0]).toHaveTextContent("Chelsey Dietrich")
  })

  // ── URL state interaction ─────────────────────────────────────────────────

  it("calls router.push when typing in search box", async () => {
    const user = userEvent.setup()
    render(<UsersView users={USERS} />)
    const input = screen.getByPlaceholderText("Search by name or email…")
    await user.type(input, "l")
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("q=l"),
      expect.objectContaining({ scroll: false })
    )
  })

  it("encodes list state into user detail link for back-navigation", () => {
    mockSearchParams.set("q", "leanne")
    render(<UsersView users={USERS} />)
    const links = screen.getAllByRole("link", { name: "Leanne Graham" })
    expect(links[0].getAttribute("href")).toContain("back=")
    expect(decodeURIComponent(links[0].getAttribute("href") ?? "")).toContain("q=leanne")
  })
})

// ─── UsersPage (server component) ────────────────────────────────────────────

describe("UsersPage", () => {
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders page heading when fetch succeeds", async () => {
    global.fetch = makeFetch()
    render(await UsersPage())
    expect(screen.getByText("Users")).toBeInTheDocument()
    expect(screen.getByText("Manage and browse all users.")).toBeInTheDocument()
  })

  it("renders all 10 users from fetched data", async () => {
    global.fetch = makeFetch()
    render(await UsersPage())
    expect(screen.getAllByText("Leanne Graham").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Clementina DuBuque").length).toBeGreaterThanOrEqual(1)
  })

  it("shows error banner when fetch fails", async () => {
    global.fetch = makeFetch(false)
    render(await UsersPage())
    expect(screen.getByText("Could not load users. Please try again later.")).toBeInTheDocument()
  })
})
