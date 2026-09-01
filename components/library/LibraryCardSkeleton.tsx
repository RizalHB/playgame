export function LibraryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">

      <div className="aspect-video animate-pulse bg-zinc-800" />

      <div className="space-y-4 p-5">

        <div className="space-y-2">
          <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-800" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-800" />
        </div>

        <div className="border-t border-zinc-800 pt-4 space-y-3">

          <div className="flex justify-between">
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-12 animate-pulse rounded bg-zinc-800" />
          </div>

          <div className="flex justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
          </div>

        </div>

        <div className="h-11 animate-pulse rounded-xl bg-zinc-800" />

      </div>

    </div>
  );
}