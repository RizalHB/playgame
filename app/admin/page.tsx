import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/auth/current-admin";
import { getAdminDashboardStats } from "@/lib/database/queries/admin-dashboard";
import { getPlatformRevenue } from "@/lib/database/queries/platform-revenue";

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(amount: number) {
  return new Intl.NumberFormat("id-ID").format(amount);
}

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  const [stats, revenue] = await Promise.all([
    getAdminDashboardStats(),
    getPlatformRevenue(),
  ]);

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
              className="rounded-xl border border-blue-400/15 bg-blue-500/[0.08] px-3 py-2 text-xs font-semibold text-blue-300 transition-all hover:border-blue-400/25 hover:bg-blue-500/[0.12] hover:text-blue-200 sm:px-4 sm:text-sm"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/games"
              className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-zinc-400 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:px-4 sm:text-sm"
            >
              Game Review
            </Link>

            <Link
              href="/admin/users"
              className="hidden rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-sm font-semibold text-zinc-400 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:block"
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
        {/* Hero */}
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
                  Administration
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Platform
                <span className="block bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  command center.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Monitor the PlayGame ecosystem, review developer
                submissions, and keep the platform running smoothly.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/admin/games"
                  className="group/button inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
                    ✓
                  </span>

                  Review Games

                  <span className="transition-transform duration-200 group-hover/button:translate-x-0.5">
                    →
                  </span>
                </Link>

                <Link
                  href="/admin/users"
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
                >
                  Manage Users
                </Link>
              </div>
            </div>

            {/* Platform snapshot */}
            <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[390px]">
              <div className="rounded-2xl border border-white/[0.08] bg-black/10 p-4 backdrop-blur-sm">
                <p className="text-xs text-zinc-500">
                  Gamers
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatNumber(stats.gamers)}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/10 bg-blue-400/[0.025] p-4 backdrop-blur-sm">
                <p className="text-xs text-zinc-500">
                  Developers
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {formatNumber(stats.developers)}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4 backdrop-blur-sm sm:col-span-1">
                <p className="text-xs text-zinc-500">
                  Games
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {formatNumber(stats.games)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue */}
        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                Financial
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight">
                Platform Revenue
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Financial performance from completed game sales.
              </p>
            </div>

            <div className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5 text-xs text-zinc-500">
              Platform share
              <span className="ml-1.5 font-semibold text-emerald-400">
                10%
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Platform Revenue */}
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.035] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-500/[0.065] hover:shadow-2xl hover:shadow-emerald-500/[0.08]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/20" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-500/[0.1] text-emerald-400">
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
                    Revenue
                  </span>
                </div>

                <p className="mt-6 text-sm text-zinc-400">
                  PlayGame Revenue
                </p>

                <p className="mt-1 break-words text-2xl font-bold tracking-tight text-emerald-300 sm:text-3xl">
                  {formatIDR(revenue.platformRevenue)}
                </p>

                <div className="mt-5 h-px bg-emerald-400/[0.08]" />

                <p className="mt-3 text-xs text-zinc-500">
                  Revenue retained from the 10% platform share.
                </p>
              </div>
            </div>

            {/* Completed Sales */}
            <div className="group relative overflow-hidden rounded-2xl border border-blue-400/15 bg-blue-500/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/35 hover:bg-blue-500/[0.055] hover:shadow-2xl hover:shadow-blue-500/[0.07]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/0 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08] text-blue-400">
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

                  <span className="rounded-full bg-blue-500/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Sales
                  </span>
                </div>

                <p className="mt-6 text-sm text-zinc-400">
                  Completed Sales
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-blue-300">
                  {formatNumber(revenue.salesCount)}
                </p>

                <div className="mt-5 h-px bg-blue-400/[0.08]" />

                <p className="mt-3 text-xs text-zinc-500">
                  Game line items successfully sold.
                </p>
              </div>
            </div>

            {/* Revenue Model */}
            <div className="group relative overflow-hidden rounded-2xl border border-violet-400/10 bg-violet-500/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-violet-500/[0.045] hover:shadow-2xl hover:shadow-violet-500/[0.06]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/0 blur-3xl transition-all duration-500 group-hover:bg-violet-500/15" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.07] text-violet-400">
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

                  <span className="rounded-full bg-violet-500/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                    Model
                  </span>
                </div>

                <p className="mt-6 text-sm text-zinc-400">
                  Platform Share
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-violet-300">
                  10%
                </p>

                <div className="mt-5 h-px bg-violet-400/[0.08]" />

                <p className="mt-3 text-xs text-zinc-500">
                  PlayGame retains 10% of completed game sales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="mt-10">
          <div className="mb-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Platform
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Platform Overview
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Key platform entities and administrative workload.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Gamers */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#19222d] hover:shadow-xl hover:shadow-blue-500/[0.06]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-blue-500/0 blur-3xl transition-all duration-500 group-hover:bg-blue-500/[0.14]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.07] text-blue-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="8" r="3" />
                      <path d="M5 20a7 7 0 0 1 14 0" />
                    </svg>
                  </div>

                  <span className="text-xs text-zinc-600">
                    Players
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Gamers
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {formatNumber(stats.gamers)}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Registered player accounts
                </p>
              </div>
            </div>

            {/* Developers */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-[#1b1b2a] hover:shadow-xl hover:shadow-indigo-500/[0.06]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-indigo-500/0 blur-3xl transition-all duration-500 group-hover:bg-indigo-500/[0.14]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/[0.07] text-indigo-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-5 w-5"
                    >
                      <path d="M4 7h16M4 12h16M4 17h10" />
                    </svg>
                  </div>

                  <span className="text-xs text-zinc-600">
                    Studios
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Developers
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {formatNumber(stats.developers)}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Developer accounts
                </p>
              </div>
            </div>

            {/* Games */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#19231f] hover:shadow-xl hover:shadow-emerald-500/[0.06]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-emerald-500/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/[0.14]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-500/[0.07] text-emerald-400">
                    🎮
                  </div>

                  <span className="text-xs text-zinc-600">
                    Catalog
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Games
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-400">
                  {formatNumber(stats.games)}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Games submitted to platform
                </p>
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="group relative overflow-hidden rounded-2xl border border-amber-400/15 bg-amber-500/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/35 hover:bg-amber-500/[0.055] hover:shadow-xl hover:shadow-amber-500/[0.07]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-amber-500/0 blur-3xl transition-all duration-500 group-hover:bg-amber-500/[0.16]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-500/[0.07] text-amber-400">
                    ◷
                  </div>

                  <span className="text-xs text-amber-500/70">
                    Attention
                  </span>
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                  Pending Reviews
                </p>

                <p className="mt-1 text-3xl font-bold text-amber-400">
                  {formatNumber(stats.pendingReviews)}
                </p>

                <p className="mt-2 text-xs text-zinc-600">
                  Games awaiting review
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Operations
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Jump directly into the areas that need your attention.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Game Review */}
            <Link
              href="/admin/games"
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#19222d] hover:shadow-2xl hover:shadow-blue-500/[0.07]"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/0 blur-3xl transition-all duration-500 group-hover:bg-blue-500/[0.14]" />

              <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.07] text-blue-400 transition-colors group-hover:bg-blue-500/[0.12]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-6 w-6"
                    >
                      <path d="M6 4h12v16H6z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-zinc-100 transition-colors group-hover:text-blue-300">
                        Review Games
                      </h3>

                      {stats.pendingReviews > 0 && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400">
                          {stats.pendingReviews} pending
                        </span>
                      )}
                    </div>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">
                      Review developer submissions and approve,
                      reject, or manage games in the publishing pipeline.
                    </p>
                  </div>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-500 transition-all group-hover:border-blue-400/20 group-hover:bg-blue-500/[0.08] group-hover:text-blue-300">
                  →
                </span>
              </div>
            </Link>

            {/* User Management */}
            <Link
              href="/admin/users"
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-[#1b1b2a] hover:shadow-2xl hover:shadow-indigo-500/[0.07]"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/0 blur-3xl transition-all duration-500 group-hover:bg-indigo-500/[0.14]" />

              <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/[0.07] text-indigo-400 transition-colors group-hover:bg-indigo-500/[0.12]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-6 w-6"
                    >
                      <circle cx="9" cy="8" r="3" />
                      <path d="M3 20a6 6 0 0 1 12 0" />
                      <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 4 5" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 transition-colors group-hover:text-indigo-300">
                      User Management
                    </h3>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">
                      Manage gamer and developer accounts,
                      review account activity, and perform administrative actions.
                    </p>
                  </div>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-500 transition-all group-hover:border-indigo-400/20 group-hover:bg-indigo-500/[0.08] group-hover:text-indigo-300">
                  →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/[0.06] py-6">
          <div className="flex flex-col gap-2 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>PlayGame Administration</p>

            <p>Platform command center</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
