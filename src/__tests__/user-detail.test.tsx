import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  notFound: jest.fn(),
  redirect: jest.fn(),
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

import { notFound } from "next/navigation"
import UserDetailPage from "@/app/(main)/users/[id]/page"
import { UserActivity } from "@/components/user-activity"
import DetailLoading from "@/app/(main)/users/[id]/loading"
import type { Post } from "@/types/post"
import type { Todo } from "@/types/todo"

// ─── Fixtures (real JSONPlaceholder user #1) ──────────────────────────────────

const MOCK_USER = {
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
  },
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
  },
}

const MOCK_POSTS: Post[] = [
  { id: 1, userId: 1, title: "sunt aut facere repellat provident", body: "quia et suscipit suscipit recusandae" },
  { id: 2, userId: 1, title: "qui est esse", body: "est rerum tempore vitae sequi" },
  { id: 3, userId: 1, title: "ea molestias quasi exercitationem", body: "et iusto sed quo iure" },
]

const MOCK_TODOS: Todo[] = [
  { id: 1, userId: 1, title: "delectus aut autem", completed: false },
  { id: 2, userId: 1, title: "quis ut nam facilis et officia qui", completed: true },
  { id: 3, userId: 1, title: "fugiat veniam minus", completed: false },
  { id: 4, userId: 1, title: "et porro tempora", completed: true },
  { id: 5, userId: 1, title: "laboriosam mollitia et enim quasi", completed: false },
]

function mockFetch({
  userStatus = 200,
  user = MOCK_USER as unknown,
  posts = MOCK_POSTS as unknown[],
  todos = MOCK_TODOS as unknown[],
  networkError = false,
} = {}) {
  if (networkError) {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"))
    return
  }
  global.fetch = jest.fn().mockImplementation((url: string) => {
    if (url.includes("/posts"))
      return Promise.resolve({ ok: true, status: 200, json: async () => posts })
    if (url.includes("/todos"))
      return Promise.resolve({ ok: true, status: 200, json: async () => todos })
    return Promise.resolve({ ok: userStatus === 200, status: userStatus, json: async () => user })
  })
}

const DEFAULT_PARAMS = {
  params: Promise.resolve({ id: "1" }),
  searchParams: Promise.resolve({}),
}

// ─── UserDetailPage ───────────────────────────────────────────────────────────

describe("UserDetailPage", () => {
  beforeEach(() => {
    jest.mocked(notFound).mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND")
    })
    mockFetch()
  })

  it("renders user name and username", async () => {
    render(await UserDetailPage(DEFAULT_PARAMS))
    expect(screen.getByText("Leanne Graham")).toBeInTheDocument()
    expect(screen.getByText("@Bret")).toBeInTheDocument()
  })

  it("renders email, phone and website", async () => {
    render(await UserDetailPage(DEFAULT_PARAMS))
    expect(screen.getByText("Sincere@april.biz")).toBeInTheDocument()
    expect(screen.getByText("1-770-736-8031 x56442")).toBeInTheDocument()
    expect(screen.getByText("hildegard.org")).toBeInTheDocument()
  })

  it("renders company name and catchphrase", async () => {
    render(await UserDetailPage(DEFAULT_PARAMS))
    expect(screen.getByText("Romaguera-Crona")).toBeInTheDocument()
    expect(screen.getByText(/Multi-layered client-server neural-net/)).toBeInTheDocument()
  })

  it("renders address", async () => {
    render(await UserDetailPage(DEFAULT_PARAMS))
    expect(screen.getByText(/Kulas Light.*Gwenborough/)).toBeInTheDocument()
  })

  it("renders Posts and Todos tabs", async () => {
    render(await UserDetailPage(DEFAULT_PARAMS))
    expect(screen.getByRole("tab", { name: /posts/i })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /todos/i })).toBeInTheDocument()
  })

  it("shows post titles in Posts tab by default", async () => {
    render(await UserDetailPage(DEFAULT_PARAMS))
    expect(screen.getByText("sunt aut facere repellat provident")).toBeInTheDocument()
    expect(screen.getByText("qui est esse")).toBeInTheDocument()
    expect(screen.getByText("ea molestias quasi exercitationem")).toBeInTheDocument()
  })

  it("shows error banner when network throws", async () => {
    mockFetch({ networkError: true })
    render(await UserDetailPage(DEFAULT_PARAMS))
    expect(screen.getByText(/could not load user details/i)).toBeInTheDocument()
  })

  it("calls notFound for unknown user (404)", async () => {
    mockFetch({ userStatus: 404, user: {} })
    await expect(UserDetailPage(DEFAULT_PARAMS)).rejects.toThrow("NEXT_NOT_FOUND")
    expect(notFound).toHaveBeenCalled()
  })

  it("back link defaults to /users", async () => {
    render(await UserDetailPage(DEFAULT_PARAMS))
    expect(screen.getByRole("link", { name: /back to list/i })).toHaveAttribute("href", "/users")
  })

  it("back link restores list URL from ?back param", async () => {
    const params = {
      params: Promise.resolve({ id: "1" }),
      searchParams: Promise.resolve({ back: "/users?q=leanne&filter=hasPending" }),
    }
    render(await UserDetailPage(params))
    expect(screen.getByRole("link", { name: /back to list/i })).toHaveAttribute(
      "href",
      "/users?q=leanne&filter=hasPending"
    )
  })
})

// ─── UserActivity ─────────────────────────────────────────────────────────────

describe("UserActivity", () => {
  it("shows post titles in Posts tab (default)", () => {
    render(<UserActivity posts={MOCK_POSTS} todos={MOCK_TODOS} />)
    expect(screen.getByText("sunt aut facere repellat provident")).toBeInTheDocument()
    expect(screen.getByText("qui est esse")).toBeInTheDocument()
  })

  it("shows no-posts message when posts array is empty", () => {
    render(<UserActivity posts={[]} todos={MOCK_TODOS} />)
    expect(screen.getByText("No posts yet.")).toBeInTheDocument()
  })

  it("switches to Todos tab and shows pending and completed sections", async () => {
    const user = userEvent.setup()
    render(<UserActivity posts={MOCK_POSTS} todos={MOCK_TODOS} />)
    await user.click(screen.getByRole("tab", { name: /todos/i }))
    expect(screen.getByText(/pending/i)).toBeInTheDocument()
    expect(screen.getByText(/completed/i)).toBeInTheDocument()
    // pending todos
    expect(screen.getByText("delectus aut autem")).toBeInTheDocument()
    expect(screen.getByText("fugiat veniam minus")).toBeInTheDocument()
    // completed todos
    expect(screen.getByText("quis ut nam facilis et officia qui")).toBeInTheDocument()
    expect(screen.getByText("et porro tempora")).toBeInTheDocument()
  })

  it("pending badge shows correct count on Todos tab", () => {
    // MOCK_TODOS has 3 pending (ids 1, 3, 5)
    render(<UserActivity posts={MOCK_POSTS} todos={MOCK_TODOS} />)
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("shows no-todos message when todos array is empty", async () => {
    const user = userEvent.setup()
    render(<UserActivity posts={MOCK_POSTS} todos={[]} />)
    await user.click(screen.getByRole("tab", { name: /todos/i }))
    expect(screen.getByText("No todos yet.")).toBeInTheDocument()
  })
})

// ─── DetailLoading skeleton ───────────────────────────────────────────────────

describe("DetailLoading", () => {
  it("renders skeleton without crashing", () => {
    const { container } = render(<DetailLoading />)
    expect(container).toBeTruthy()
  })
})
