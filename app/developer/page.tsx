import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentDeveloper } from "@/lib/auth/current-developer";
import { getDeveloperGames } from "@/lib/database/queries/developer-games";
import { getDeveloperRevenue } from "@/lib/database/queries/developer-revenue";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(amount: number) {
  return new Intl.NumberFormat("id-ID").format(amount);
}

export default async function DeveloperPage() {
  const developer = await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const games = await getDeveloperGames(developer.id);
  const revenue = await getDeveloperRevenue(developer.id);

  const publishedGames = games.filter(
    (game) => game.isPublished,
  ).length;

  const unpublishedGames =
    games.length - publishedGames;

  const publicationRate =
    games.length > 0
      ? Math.round((publishedGames / games.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#0f141b] text-white selection:bg-blue-500/30">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/[0.035] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-indigo-600/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-emerald-600/[0.02] blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0f141b]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black shadow-lg shadow-blue-950/30">
              P
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
                PlayGame
              </p>

              <h1 className="text-sm font-semibold text-white sm:text-base">
                Developer Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                {developer.studioName}
              </p>

              <div className="mt-0.5 flex items-center justify-end gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <p className="text-xs text-zinc-500">
                  Developer account
                </p>
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold shadow-lg shadow-blue-950/30">
              {developer.studioName
                .slice(0, 1)
                .toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        {/* Hero */}
        <section className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#1b2838] via-[#172231] to-[#111820] shadow-2xl shadow-black/20">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-blue-500/[0.08] blur-[80px] transition-all duration-700 group-hover:bg-blue-500/[0.13]" />
          <div className="pointer-events-none absolute -bottom-40 right-32 h-80 w-80 rounded-full bg-indigo-500/[0.07] blur-[90px]" />

          {/* Grid texture */}
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
                  Developer Dashboard
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Welcome back,
                <span className="block bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  {developer.studioName}.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Manage your game catalog, monitor your sales,
                and prepare your next release for players.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/developer/games/new"
                  className="group/button inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-base">
                    +
                  </span>
                  Create New Game
                  <span className="transition-transform duration-200 group-hover/button:translate-x-0.5">
                    →
                  </span>
                </Link>

                <Link
                  href="#catalog"
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
                >
                  View Catalog
                </Link>
              </div>
            </div>

            {/* Hero summary */}
            <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[390px]">
              <div className="rounded-2xl border border-white/[0.08] bg-black/10 p-4 backdrop-blur-sm">
                <p className="text-xs text-zinc-500">
                  Total Games
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatNumber(games.length)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4 backdrop-blur-sm">
                <p className="text-xs text-zinc-500">
                  Published
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {formatNumber(publishedGames)}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/10 bg-blue-400/[0.025] p-4 backdrop-blur-sm col-span-2 sm:col-span-1">
                <p className="text-xs text-zinc-500">
                  Publish Rate
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {publicationRate}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Overview
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight">
                Studio performance
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Total Games */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#19222d] hover:shadow-xl hover:shadow-blue-500/[0.07]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-500/0 blur-3xl transition-all duration-500 group-hover:bg-blue-500/15" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08] text-blue-400 transition-colors group-hover:bg-blue-500/[0.14]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
                      <path d="M4 5.5V19a2 2 0 0 0 2 2h14" />
                    </svg>
                  </div>

                  <span className="text-xs text-zinc-600 transition-colors group-hover:text-blue-400">
                    Catalog
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Total Games
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {formatNumber(games.length)}
                </p>

                <div className="mt-4 h-px bg-white/[0.05]" />

                <p className="mt-3 text-xs text-zinc-600">
                  Games in your developer catalog
                </p>
              </div>
            </div>

            {/* Published */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#19241f] hover:shadow-xl hover:shadow-emerald-500/[0.07]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/15" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-500/[0.08] text-emerald-400 transition-colors group-hover:bg-emerald-500/[0.14]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </div>

                  <span className="text-xs text-zinc-600 transition-colors group-hover:text-emerald-400">
                    Live
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Published
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-400">
                  {formatNumber(publishedGames)}
                </p>

                <div className="mt-4 h-px bg-white/[0.05]" />

                <p className="mt-3 text-xs text-zinc-600">
                  {publicationRate}% of your catalog is live
                </p>
              </div>
            </div>

            {/* Drafts */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-[#242118] hover:shadow-xl hover:shadow-amber-500/[0.06]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-amber-500/0 blur-3xl transition-all duration-500 group-hover:bg-amber-500/15" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-500/[0.08] text-amber-400 transition-colors group-hover:bg-amber-500/[0.14]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M12 3v18" />
                      <path d="M5 8h14" />
                      <path d="M5 16h14" />
                    </svg>
                  </div>

                  <span className="text-xs text-zinc-600 transition-colors group-hover:text-amber-400">
                    Drafts
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Unpublished
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-amber-400">
                  {formatNumber(unpublishedGames)}
                </p>

                <div className="mt-4 h-px bg-white/[0.05]" />

                <p className="mt-3 text-xs text-zinc-600">
                  Games still in development
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue */}
        <section className="mt-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#171e27]">
            {/* Revenue ambient glow */}
            <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/[0.035] blur-[100px]" />

            <div className="relative p-5 sm:p-6 lg:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                      Revenue
                    </p>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    Game Sales Revenue
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                    Track completed purchases, gross sales,
                    and the revenue earned by your studio.
                  </p>
                </div>

                <div className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-500">
                  Developer share
                  <span className="ml-1.5 font-semibold text-emerald-400">
                    90%
                  </span>
                </div>
              </div>

              {/* Revenue cards */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {/* Sales */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10151c] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/35 hover:bg-[#131b24] hover:shadow-2xl hover:shadow-blue-500/[0.08]">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/0 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08] text-blue-400 transition-all duration-300 group-hover:border-blue-400/20 group-hover:bg-blue-500/[0.14]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-5 w-5"
                        >
                          <path d="M6 4h12v16H6z" />
                          <path d="M9 8h6M9 12h6M9 16h3" />
                        </svg>
                      </div>

                      <span className="rounded-full bg-blue-500/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 opacity-70 transition-opacity group-hover:opacity-100">
                        Sales
                      </span>
                    </div>

                    <p className="mt-6 text-sm text-zinc-400">
                      Game Sales
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      {formatNumber(revenue.salesCount)}
                    </p>

                    <p className="mt-2 text-xs text-zinc-600">
                      Completed purchases
                    </p>
                  </div>
                </div>

                {/* Gross */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10151c] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/35 hover:bg-[#171420] hover:shadow-2xl hover:shadow-violet-500/[0.08]">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/0 blur-3xl transition-all duration-500 group-hover:bg-violet-500/20" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.08] text-violet-400 transition-all duration-300 group-hover:border-violet-400/20 group-hover:bg-violet-500/[0.14]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-5 w-5"
                        >
                          <circle cx="12" cy="12" r="8" />
                          <path d="M12 8v8M9.5 10c0-1 1-1.5 2.5-1.5s2.5.5 2.5 1.5-1 1.5-2.5 1.5-2.5.5-2.5 1.5 1 1.5 2.5 1.5 2.5-.5 2.5-1.5" />
                        </svg>
                      </div>

                      <span className="rounded-full bg-violet-500/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-400 opacity-70 transition-opacity group-hover:opacity-100">
                        Gross
                      </span>
                    </div>

                    <p className="mt-6 text-sm text-zinc-400">
                      Gross Sales
                    </p>

                    <p className="mt-1 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                      {formatCurrency(revenue.grossRevenue)}
                    </p>

                    <p className="mt-2 text-xs text-zinc-600">
                      Total sales before platform share
                    </p>
                  </div>
                </div>

                {/* Developer */}
                <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.035] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/45 hover:bg-emerald-500/[0.07] hover:shadow-2xl hover:shadow-emerald-500/[0.1]">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/20" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-500/[0.1] text-emerald-400 transition-all duration-300 group-hover:border-emerald-400/25 group-hover:bg-emerald-500/[0.16]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          className="h-5 w-5"
                        >
                          <path d="M4 19V5" />
                          <path d="m4 17 5-5 4 3 7-8" />
                          <path d="M17 7h3v3" />
                        </svg>
                      </div>

                      <span className="rounded-full bg-emerald-500/[0.1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        90% Share
                      </span>
                    </div>

                    <p className="mt-6 text-sm text-zinc-400">
                      Your Revenue
                    </p>

                    <p className="mt-1 break-words text-2xl font-bold tracking-tight text-emerald-400 sm:text-3xl">
                      {formatCurrency(
                        revenue.developerRevenue,
                      )}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      Your earnings after platform share
                    </p>
                  </div>
                </div>
              </div>

              {/* Revenue relationship */}
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-black/[0.12] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Your developer revenue is calculated from completed game sales.
                </div>

                <span className="text-xs font-medium text-zinc-600">
                  Platform share: 10%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Games */}
        <section id="catalog" className="mt-10 scroll-mt-24">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400">
                Catalog
              </p>

              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  My Games
                </h2>

                {games.length > 0 && (
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-zinc-500">
                    {games.length}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                Manage your releases and game details.
              </p>
            </div>

            {games.length > 0 && (
              <Link
                href="/developer/games/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:border-blue-400/20 hover:bg-blue-500/[0.07] hover:text-blue-300"
              >
                <span className="text-base">+</span>
                Add game
              </Link>
            )}
          </div>

          {games.length === 0 ? (
            <div className="group relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-[#171e27]/70 px-6 py-20 text-center">
              <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-500/[0.04] blur-3xl transition-all duration-500 group-hover:bg-blue-500/[0.08]" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/[0.07] text-2xl shadow-lg shadow-blue-950/20">
                  🎮
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  Your catalog is empty
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Create your first game and start building
                  your PlayGame catalog.
                </p>

                <Link
                  href="/developer/games/new"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-950/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/20"
                >
                  <span className="text-lg leading-none">
                    +
                  </span>
                  Create Your First Game
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#171e27] shadow-2xl shadow-black/10">
              <div className="divide-y divide-white/[0.06]">
                {games.map((game) => (
                  <article
                    key={game.id}
                    className="group relative flex flex-col gap-5 p-5 transition-all duration-300 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    {/* Hover indicator */}
                    <div
                      className={`absolute bottom-0 left-0 top-0 w-0.5 transition-all duration-300 group-hover:w-1 ${
                        game.isPublished
                          ? "bg-emerald-400"
                          : "bg-amber-400"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            game.isPublished
                              ? "bg-emerald-500/[0.08] text-emerald-400"
                              : "bg-amber-500/[0.08] text-amber-400"
                          }`}
                        >
                          {game.title
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-semibold text-white transition-colors group-hover:text-blue-300">
                              {game.title}
                            </h3>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                game.isPublished
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {game.isPublished
                                ? "Published"
                                : "Draft"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {game.shortDescription && (
                        <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-zinc-500">
                          {game.shortDescription}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600">
                        <span>
                          Price:{" "}
                          <span className="font-medium text-zinc-400">
                            {formatCurrency(
                              game.basePrice,
                            )}
                          </span>
                        </span>

                        <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />

                        <span>
                          {game.isPublished
                            ? "Available to players"
                            : "Not yet published"}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/developer/games/${game.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-blue-400/25 hover:bg-blue-500/[0.08] hover:text-blue-300"
                      >
                        Manage
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/[0.06] py-6">
          <div className="flex flex-col gap-2 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              PlayGame Developer Portal
            </p>

            <p>
              Manage your games. Grow your studio.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
