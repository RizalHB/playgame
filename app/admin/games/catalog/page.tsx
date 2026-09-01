import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/auth/current-admin";

import {
  getAdminGameCatalog,
} from "@/lib/database/queries/admin-games";

import {
  GAME_STATUS,
} from "@/lib/database/schema";

function getStatusClass(status: string) {
  switch (status) {
    case GAME_STATUS.DRAFT:
      return "border-zinc-400/20 bg-zinc-400/10 text-zinc-300";

    case GAME_STATUS.PENDING_REVIEW:
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case GAME_STATUS.APPROVED:
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";

    case GAME_STATUS.SCHEDULED:
      return "border-purple-400/20 bg-purple-400/10 text-purple-300";

    case GAME_STATUS.RELEASED:
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case GAME_STATUS.REJECTED:
      return "border-red-400/20 bg-red-400/10 text-red-300";

    default:
      return "border-white/10 bg-white/5 text-zinc-400";
  }
}

export default async function AdminGameCatalogPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  const games = await getAdminGameCatalog();

  return (
    <main className="min-h-screen bg-[#171a21] text-white">
      <header className="border-b border-white/10 bg-[#171a21]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              PlayGame
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              Administration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/games"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Review Queue
            </Link>

            <Link
              href="/admin"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">
            Game Management
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight">
            Game Catalog
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            View all games registered on the
            PlayGame platform.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-4">
            <h3 className="text-sm font-semibold text-zinc-200">
              All Games
            </h3>

            <p className="mt-1 text-xs text-zinc-600">
              {games.length}{" "}
              {games.length === 1
                ? "game"
                : "games"}{" "}
              registered
            </p>
          </div>

          {games.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-zinc-300">
                No games found
              </h3>

              <p className="mt-2 text-sm text-zinc-600">
                There are currently no games in
                the catalog.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {games.map((game) => (
                <article
                  key={game.id}
                  className="px-6 py-5 transition hover:bg-white/[0.02]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="truncate text-base font-semibold text-zinc-100">
                          {game.title}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                            game.status,
                          )}`}
                        >
                          {game.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-600">
                        <span>
                          Price:{" "}
                          {game.basePrice.toLocaleString(
                            "id-ID",
                          )}{" "}
                          IDR
                        </span>

                        <span>
                          Published:{" "}
                          {game.isPublished
                            ? "Yes"
                            : "No"}
                        </span>

                        {game.releaseDate && (
                          <span>
                            Release:{" "}
                            {game.releaseDate.toLocaleDateString(
                              "id-ID",
                            )}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 break-all font-mono text-[11px] text-zinc-700">
                        Developer:{" "}
                        {game.developerId}
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-700">
                        Updated:{" "}
                        {game.updatedAt.toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>

                    <Link
                      href={`/admin/games/${game.id}`}
                      className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                      View Game
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}