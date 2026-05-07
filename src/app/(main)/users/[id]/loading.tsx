import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeftIcon } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 max-w-2xl">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ArrowLeftIcon className="size-4" />
        <span>Back to list</span>
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <div className="rounded-lg border p-4 flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="rounded-lg border p-4 flex flex-col gap-3 sm:col-span-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3.5 w-full" />
        </div>
      </div>

      {/* Activity skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-16" />
        <div className="flex gap-1">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <div className="flex flex-col divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-3.5 flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
