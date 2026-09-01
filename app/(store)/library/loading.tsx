import { LibrarySidebar } from "@/components/library/LibrarySidebar";
import { LibrarySkeleton } from "@/components/library/LibrarySkeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        Library
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">

        <LibrarySidebar />

        <section className="space-y-6">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

            <div className="h-11 w-full animate-pulse rounded-lg bg-zinc-800 md:w-80" />

            <div className="mt-5 h-4 w-40 animate-pulse rounded bg-zinc-800" />

          </div>

          <LibrarySkeleton />

        </section>

      </div>

    </main>
  );
}