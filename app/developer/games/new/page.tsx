import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentDeveloper } from "@/lib/auth/current-developer";
import { CreateGameForm } from "./create-game-form";

export default async function NewDeveloperGamePage() {
  const developer = await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#171a21] text-white">
      {/* Developer Portal Header */}
      <header className="border-b border-white/10 bg-[#171a21]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              PlayGame
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              Developer Portal
            </h1>
          </div>

          <Link
            href="/developer"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm"
        >
          <Link
            href="/developer"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            Developer
          </Link>

          <span className="text-zinc-700">
            /
          </span>

          <span className="text-zinc-300">
            New Game
          </span>
        </nav>

        {/* Heading */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">
                Game Management
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Create New Game
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Create a draft for{" "}
                <span className="font-medium text-zinc-300">
                  {developer.studioName}
                </span>
                . You can add media, system
                requirements, and other details later.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-3 sm:block">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Status
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />

                <span className="text-sm font-medium text-zinc-300">
                  Draft
                </span>
              </div>
            </div>
          </div>
        </div>

        <CreateGameForm
          studioName={developer.studioName}
        />
      </div>
    </main>
  );
}