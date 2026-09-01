import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/auth/current-admin";

import {
  getAdminGameCatalog,
} from "@/lib/database/queries/admin-games";

import { GAME_STATUS } from "@/lib/database/schema";

function getStatusClasses(status: string) {
  switch (status) {
    case GAME_STATUS.DRAFT:
      return {
        badge:
          "border-zinc-400/15 bg-zinc-400/[0.08] text-zinc-300",
        glow: "bg-zinc-400/0 group-hover:bg-zinc-400/[0.08]",
        icon:
          "border-zinc-400/10 bg-zinc-400/[0.07] text-zinc-400",
        rail: "bg-zinc-400",
      };

    case GAME_STATUS.PENDING_REVIEW:
      return {
        badge:
          "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
        glow: "bg-amber-400/0 group-hover:bg-amber-400/[0.14]",
        icon:
          "border-amber-400/10 bg-amber-400/[0.07] text-amber-400",
        rail: "bg-amber-400",
      };

    case GAME_STATUS.APPROVED:
      return {
        badge:
          "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
        glow: "bg-emerald-400/0 group-hover:bg-emerald-400/[0.14]",
        icon:
          "border-emerald-400/10 bg-emerald-400/[0.07] text-emerald-400",
        rail: "bg-emerald-400",
      };

    case GAME_STATUS.SCHEDULED:
      return {
        badge:
          "border-blue-400/20 bg-blue-400/[0.08] text-blue-300",
        glow: "bg-blue-400/0 group-hover:bg-blue-400/[0.14]",
        icon:
          "border-blue-400/10 bg-blue-400/[0.07] text-blue-400",
        rail: "bg-blue-400",
      };

    case GAME_STATUS.RELEASED:
      return {
        badge:
          "border-green-400/20 bg-green-400/[0.08] text-green-300",
        glow: "bg-green-400/0 group-hover:bg-green-400/[0.14]",
        icon:
          "border-green-400/10 bg-green-400/[0.07] text-green-400",
        rail: "bg-green-400",
      };

    case GAME_STATUS.REJECTED:
      return {
        badge:
          "border-red-400/20 bg-red-400/[0.08] text-red-300",
        glow: "bg-red-400/0 group-hover:bg-red-400/[0.14]",
        icon:
          "border-red-400/10 bg-red-400/[0.07] text-red-400",
        rail: "bg-red-400",
      };

    default:
      return {
        badge:
          "border-white/10 bg-white/[0.04] text-zinc-400",
        glow: "bg-white/0 group-hover:bg-white/[0.06]",
        icon:
          "border-white/10 bg-white/[0.04] text-zinc-400",
        rail: "bg-zinc-500",
      };
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case GAME_STATUS.DRAFT:
      return "Draft";

    case GAME_STATUS.PENDING_REVIEW:
      return "Pending Review";

    case GAME_STATUS.APPROVED:
      return "Approved";

    case GAME_STATUS.SCHEDULED:
      return "Scheduled";

    case GAME_STATUS.RELEASED:
      return "Released";

    case GAME_STATUS.REJECTED:
      return "Rejected";

    default:
      return status;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case GAME_STATUS.DRAFT:
      return "✎";

    case GAME_STATUS.PENDING_REVIEW:
      return "◷";

    case GAME_STATUS.APPROVED:
      return "✓";

    case GAME_STATUS.SCHEDULED:
      return "◫";

    case GAME_STATUS.RELEASED:
      return "●";

    case GAME_STATUS.REJECTED:
      return "×";

    default:
      return "•";
  }
}

export default async function AdminGamesPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  const games = await getAdminGameCatalog();

  const draftGames = games.filter(
    (game) => game.status === GAME_STATUS.DRAFT,
  ).length;

  const pendingGames = games.filter(
    (game) =>
      game.status === GAME_STATUS.PENDING_REVIEW,
  ).length;

  const releasedGames = games.filter(
    (game) =>
      game.status === GAME_STATUS.RELEASED,
  ).length;

  const rejectedGames = games.filter(
    (game) =>
      game.status === GAME_STATUS.REJECTED,
  ).length;

  return (
    <main className="min-h-screen bg-[#0f141b] text-white selection:bg-blue-500/30">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/[0.035] blur-[120px]" />

        <div className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-indigo-600/[0.025] blur-[120px]" />

        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-emerald-600/[0.02] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0f141b]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black shadow-lg shadow-blue-950/30">
              P
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
                PlayGame
              </p>

              <h1 className="text-sm font-semibold sm:text-base">
                Administration
              </h1>
            </div>
          </div>

          {/* Navigation */}
<nav className="flex items-center gap-2">
  <Link
    href="/admin"
    className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-zinc-400 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:px-4 sm:text-sm"
  >
    Dashboard
  </Link>

  <Link
    href="/admin/games"
    className="rounded-xl border border-blue-400/15 bg-blue-500/[0.08] px-3 py-2 text-xs font-semibold text-blue-300 transition-all hover:border-blue-400/25 hover:bg-blue-500/[0.12] hover:text-blue-200 sm:px-4 sm:text-sm"
  >
    Game Review
  </Link>

  <Link
    href="/admin/users"
    className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-zinc-400 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:px-4 sm:text-sm"
  >
    Users
  </Link>

  <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08] text-xs font-bold text-blue-400">
    A
  </div>
</nav>

        </div>
      </header>

      {/* Main */}
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Page hero */}
        <section className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#1b2838] via-[#172231] to-[#111820] shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-blue-500/[0.07] blur-[90px] transition-all duration-700 group-hover:bg-blue-500/[0.11]" />

          <div className="pointer-events-none absolute -bottom-40 right-24 h-80 w-80 rounded-full bg-indigo-500/[0.05] blur-[90px]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 flex flex-col justify-between gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:p-10">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]" />

                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                  Game Management
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Game Catalog
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Review games, monitor their lifecycle,
                and manage the publishing pipeline across
                the PlayGame platform.
              </p>
            </div>

            {/* Catalog total */}
            <div className="shrink-0 rounded-2xl border border-white/[0.08] bg-black/10 p-5 backdrop-blur-sm lg:min-w-[190px]">
              <p className="text-xs text-zinc-500">
                Total Catalog
              </p>

              <p className="mt-2 text-4xl font-bold tracking-tight">
                {games.length}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

                <span className="text-xs text-zinc-500">
                  Games on platform
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Status overview */}
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Overview
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Catalog status
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Draft */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-400/25 hover:bg-[#1a2028] hover:shadow-xl hover:shadow-zinc-500/[0.04]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-zinc-400/0 blur-3xl transition-all duration-500 group-hover:bg-zinc-400/[0.1]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-400/10 bg-zinc-400/[0.06] text-zinc-400">
                    ✎
                  </div>

                  <span className="text-xs text-zinc-600">
                    Draft
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Draft Games
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {draftGames}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Still being prepared
                </p>
              </div>
            </div>

            {/* Pending */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-[#211f19] hover:shadow-xl hover:shadow-amber-500/[0.06]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-amber-400/0 blur-3xl transition-all duration-500 group-hover:bg-amber-400/[0.14]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/[0.07] text-amber-400">
                    ◷
                  </div>

                  <span className="text-xs text-zinc-600">
                    Review
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Pending Review
                </p>

                <p className="mt-1 text-3xl font-bold text-amber-400">
                  {pendingGames}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Awaiting admin action
                </p>
              </div>
            </div>

            {/* Released */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#19231f] hover:shadow-xl hover:shadow-emerald-500/[0.06]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-emerald-400/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-400/[0.14]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.07] text-emerald-400">
                    ✓
                  </div>

                  <span className="text-xs text-zinc-600">
                    Live
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Released
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-400">
                  {releasedGames}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Currently available
                </p>
              </div>
            </div>

            {/* Rejected */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-400/30 hover:bg-[#241a1d] hover:shadow-xl hover:shadow-red-500/[0.05]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-red-400/0 blur-3xl transition-all duration-500 group-hover:bg-red-400/[0.12]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.07] text-red-400">
                    ×
                  </div>

                  <span className="text-xs text-zinc-600">
                    Action
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Rejected
                </p>

                <p className="mt-1 text-3xl font-bold text-red-400">
                  {rejectedGames}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Require developer changes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400">
                Platform
              </p>

              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  All Games
                </h2>

                <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-zinc-500">
                  {games.length}
                </span>
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                Manage the complete game publishing lifecycle.
              </p>
            </div>
          </div>

          {games.length === 0 ? (
            <div className="group relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-[#171e27]/70 px-6 py-20 text-center">
              <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-500/[0.04] blur-3xl transition-all duration-500 group-hover:bg-blue-500/[0.08]" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/[0.07] text-2xl shadow-lg shadow-blue-950/20">
                  🎮
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No games found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  There are currently no games in the
                  PlayGame platform catalog.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#171e27] shadow-2xl shadow-black/10">
              {/* Catalog header */}
              <div className="border-b border-white/[0.06] bg-white/[0.015] px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200">
                      Platform Games
                    </h3>

                    <p className="mt-1 text-xs text-zinc-600">
                      Review and manage game lifecycle status.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/10 bg-amber-400/[0.05] px-2.5 py-1 text-[10px] font-semibold text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      {pendingGames} pending
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {releasedGames} live
                    </span>
                  </div>
                </div>
              </div>

              {/* Games */}
              <div className="divide-y divide-white/[0.06]">
                {games.map((game) => {
                  const statusClasses =
                    getStatusClasses(game.status);

                  return (
                    <article
                      key={game.id}
                      className="group relative flex flex-col gap-5 p-5 transition-all duration-300 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      {/* Status rail */}
                      <div
                        className={`absolute bottom-0 left-0 top-0 w-0.5 opacity-60 transition-all duration-300 group-hover:w-1 group-hover:opacity-100 ${statusClasses.rail}`}
                      />

                      {/* Hover glow */}
                      <div
                        className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl transition-all duration-500 ${statusClasses.glow}`}
                      />

                      <div className="relative min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          {/* Game icon */}
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300 ${statusClasses.icon}`}
                          >
                            {game.title
                              .slice(0, 1)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            {/* Title + status */}
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="truncate text-base font-semibold text-zinc-100 transition-colors group-hover:text-blue-300">
                                {game.title}
                              </h3>

                              <span
                                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClasses.badge}`}
                              >
                                <span>
                                  {getStatusIcon(
                                    game.status,
                                  )}
                                </span>

                                {getStatusLabel(
                                  game.status,
                                )}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-500">
                              {game.shortDescription ||
                                "No short description provided."}
                            </p>

                            {/* Metadata */}
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600">
                              <span>
                                Price{" "}
                                <span className="font-medium text-zinc-400">
                                  {game.basePrice.toLocaleString(
                                    "id-ID",
                                  )}{" "}
                                  IDR
                                </span>
                              </span>

                              <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />

                              {game.releaseDate ? (
                                <span>
                                  Release{" "}
                                  <span className="font-medium text-zinc-400">
                                    {game.releaseDate.toLocaleDateString(
                                      "id-ID",
                                    )}
                                  </span>
                                </span>
                              ) : (
                                <span>
                                  Release date{" "}
                                  <span className="text-zinc-500">
                                    Not scheduled
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="relative flex shrink-0 sm:pl-4">
                        <Link
                          href={`/admin/games/${game.id}`}
                          className="group/action inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-blue-400/25 hover:bg-blue-500/[0.08] hover:text-blue-300 sm:w-auto"
                        >
                          View Game

                          <span className="transition-transform duration-200 group-hover/action:translate-x-0.5">
                            →
                          </span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/[0.06] py-6">
          <div className="flex flex-col gap-2 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>PlayGame Administration</p>

            <p>Game catalog management</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
