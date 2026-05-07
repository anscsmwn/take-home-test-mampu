import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-44" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-56" />
        <div className="flex gap-2 sm:ml-auto">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      <Skeleton className="h-4 w-24" />

      {/* desktop table skeleton */}
      <div className="hidden md:block rounded-md border overflow-hidden">
        <div className="border-b px-4 py-3 grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-3.5 grid grid-cols-6 gap-4 border-b last:border-0"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-6 ml-auto" />
            <Skeleton className="h-4 w-6 ml-auto" />
            <Skeleton className="h-5 w-8 ml-auto rounded-full" />
          </div>
        ))}
      </div>

      {/* mobile card skeleton */}
      <div className="md:hidden flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-48" />
            <div className="flex gap-4 pt-1">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
