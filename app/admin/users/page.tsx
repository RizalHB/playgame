import Link from "next/link";
import { redirect } from "next/navigation";

import { UserStatusButton } from "./user-status-button";

import { getCurrentAdmin } from "@/lib/auth/current-admin";
import { getAdminUsers } from "@/lib/database/queries/admin-users";

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  const { gamers, developers } = await getAdminUsers();

  const totalUsers = gamers.length + developers.length;

  return (
    <main className="min-h-screen bg-[#0f141b] text-white selection:bg-blue-500/30">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/[0.035] blur-[120px]" />

        <div className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-indigo-600/[0.025] blur-[120px]" />

        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/[0.02] blur-[120px]" />
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
              className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-zinc-400 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:px-4 sm:text-sm"
            >
              Game Review
            </Link>

            <Link
              href="/admin/users"
              className="rounded-xl border border-blue-400/15 bg-blue-500/[0.08] px-3 py-2 text-xs font-semibold text-blue-300 transition-all hover:border-blue-400/25 hover:bg-blue-500/[0.12] hover:text-blue-200 sm:px-4 sm:text-sm"
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
          <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-[90px] transition-all duration-700 group-hover:bg-blue-500/[0.1]" />

          <div className="pointer-events-none absolute -bottom-40 right-24 h-80 w-80 rounded-full bg-indigo-500/[0.045] blur-[90px]" />

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
                User
                <span className="block bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  management.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Manage PlayGame accounts, monitor access, and keep
                gamer and developer accounts under control.
              </p>
            </div>

            {/* User snapshot */}
            <div className="grid shrink-0 grid-cols-3 gap-3 lg:w-[390px]">
              <div className="rounded-2xl border border-white/[0.08] bg-black/10 p-4 backdrop-blur-sm">
                <p className="text-xs text-zinc-500">
                  Total
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {totalUsers}
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  Accounts
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/10 bg-blue-400/[0.025] p-4 backdrop-blur-sm">
                <p className="text-xs text-zinc-500">
                  Gamers
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {gamers.length}
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  Players
                </p>
              </div>

              <div className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.025] p-4 backdrop-blur-sm">
                <p className="text-xs text-zinc-500">
                  Developers
                </p>

                <p className="mt-2 text-2xl font-bold text-violet-400">
                  {developers.length}
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  Studios
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Account sections */}
        <div className="mt-10 space-y-8">
          {/* Gamers */}
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.07] text-blue-400">
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

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400">
                      Player Accounts
                    </p>

                    <h2 className="mt-0.5 text-xl font-bold tracking-tight">
                      Gamers
                    </h2>
                  </div>
                </div>
              </div>

              <span className="w-fit rounded-full border border-blue-400/10 bg-blue-500/[0.05] px-3 py-1.5 text-xs text-zinc-500">
                <span className="font-semibold text-blue-400">
                  {gamers.length}
                </span>{" "}
                {gamers.length === 1 ? "account" : "accounts"}
              </span>
            </div>

            {gamers.length === 0 ? (
              <EmptyState
                title="No Gamer accounts"
                description="There are currently no Gamer accounts registered on the platform."
                accent="blue"
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] shadow-xl shadow-black/10">
                <div className="divide-y divide-white/[0.06]">
                  {gamers.map((user) => (
                    <div
                      key={user.id}
                      className="group relative overflow-hidden px-5 py-5 transition-all duration-300 hover:bg-blue-500/[0.025] sm:px-6"
                    >
                      {/* Hover glow */}
                      <div className="pointer-events-none absolute -left-24 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-blue-500/0 blur-3xl transition-all duration-500 group-hover:bg-blue-500/[0.09]" />

                      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* User info */}
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.07] text-sm font-bold text-blue-400 transition-all duration-300 group-hover:border-blue-400/20 group-hover:bg-blue-500/[0.11]">
                            {user.username
                              .slice(0, 1)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-semibold text-zinc-100 transition-colors group-hover:text-blue-300">
                                {user.username}
                              </p>

                              <span className="rounded-full border border-blue-400/10 bg-blue-500/[0.05] px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                                Gamer
                              </span>
                            </div>

                            <p className="mt-1 truncate text-sm text-zinc-500">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <UserStatusButton
                            userId={user.id}
                            status={user.status}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Developers */}
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.07] text-violet-400">
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

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400">
                      Studio Accounts
                    </p>

                    <h2 className="mt-0.5 text-xl font-bold tracking-tight">
                      Developers
                    </h2>
                  </div>
                </div>
              </div>

              <span className="w-fit rounded-full border border-violet-400/10 bg-violet-500/[0.05] px-3 py-1.5 text-xs text-zinc-500">
                <span className="font-semibold text-violet-400">
                  {developers.length}
                </span>{" "}
                {developers.length === 1
                  ? "account"
                  : "accounts"}
              </span>
            </div>

            {developers.length === 0 ? (
              <EmptyState
                title="No Developer accounts"
                description="There are currently no Developer accounts registered on the platform."
                accent="violet"
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171e27] shadow-xl shadow-black/10">
                <div className="divide-y divide-white/[0.06]">
                  {developers.map((user) => (
                    <div
                      key={user.id}
                      className="group relative overflow-hidden px-5 py-5 transition-all duration-300 hover:bg-violet-500/[0.025] sm:px-6"
                    >
                      {/* Hover glow */}
                      <div className="pointer-events-none absolute -left-24 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-violet-500/0 blur-3xl transition-all duration-500 group-hover:bg-violet-500/[0.09]" />

                      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* User info */}
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.07] text-sm font-bold text-violet-400 transition-all duration-300 group-hover:border-violet-400/20 group-hover:bg-violet-500/[0.11]">
                            {(
                              user.studioName ||
                              user.username
                            )
                              .slice(0, 1)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-semibold text-zinc-100 transition-colors group-hover:text-violet-300">
                                {user.studioName ||
                                  user.username}
                              </p>

                              <span className="rounded-full border border-violet-400/10 bg-violet-500/[0.05] px-2 py-0.5 text-[10px] font-semibold text-violet-400">
                                Developer
                              </span>
                            </div>

                            <p className="mt-1 truncate text-sm text-zinc-500">
                              {user.username}{" "}
                              <span className="mx-1 text-zinc-700">
                                ·
                              </span>{" "}
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <UserStatusButton
                            userId={user.id}
                            status={user.status}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/[0.06] py-6">
          <div className="flex flex-col gap-2 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>PlayGame Administration</p>

            <p>User Management</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  title,
  description,
  accent,
}: {
  title: string;
  description: string;
  accent: "blue" | "violet";
}) {
  const isBlue = accent === "blue";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-dashed bg-white/[0.015] px-6 py-14 text-center transition-all duration-300 ${
        isBlue
          ? "border-blue-400/10 hover:border-blue-400/20 hover:bg-blue-500/[0.015]"
          : "border-violet-400/10 hover:border-violet-400/20 hover:bg-violet-500/[0.015]"
      }`}
    >
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-500 ${
          isBlue
            ? "bg-blue-500/0 group-hover:bg-blue-500/[0.05]"
            : "bg-violet-500/0 group-hover:bg-violet-500/[0.05]"
        }`}
      />

      <div
        className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
          isBlue
            ? "border-blue-400/10 bg-blue-500/[0.05] text-blue-400"
            : "border-violet-400/10 bg-violet-500/[0.05] text-violet-400"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-6 w-6"
        >
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      </div>

      <h3 className="relative mt-5 text-base font-semibold text-zinc-200">
        {title}
      </h3>

      <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}
