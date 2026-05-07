"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Post } from "@/types/post"
import type { Todo } from "@/types/todo"

export function UserActivity({ posts, todos }: { posts: Post[]; todos: Todo[] }) {
  const pending = todos.filter((t) => !t.completed)
  const completed = todos.filter((t) => t.completed)

  return (
    <Tabs defaultValue="posts">
      <TabsList>
        <TabsTrigger value="posts" className="gap-1.5">
          Posts
          <span className="text-xs text-muted-foreground">({posts.length})</span>
        </TabsTrigger>
        <TabsTrigger value="todos" className="gap-1.5">
          Todos
          {pending.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {pending.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-4">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No posts yet.</p>
        ) : (
          <div className="flex flex-col divide-y">
            {posts.map((post) => (
              <div key={post.id} className="py-3.5">
                <p className="text-sm font-medium capitalize leading-snug">
                  {post.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {post.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="todos" className="mt-4">
        {todos.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No todos yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {pending.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Pending — {pending.length}
                </p>
                <div className="flex flex-col gap-2">
                  {pending.map((todo) => (
                    <div key={todo.id} className="flex items-start gap-2.5">
                      <Checkbox checked={false} disabled className="mt-0.5 shrink-0" />
                      <span className="text-sm">{todo.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {completed.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Completed — {completed.length}
                </p>
                <div className="flex flex-col gap-2">
                  {completed.map((todo) => (
                    <div key={todo.id} className="flex items-start gap-2.5">
                      <Checkbox checked disabled className="mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground line-through">
                        {todo.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
