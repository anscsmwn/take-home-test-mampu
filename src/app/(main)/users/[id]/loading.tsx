import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeftIcon } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeftIcon className="size-4" />
        <span>Back to list</span>
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
