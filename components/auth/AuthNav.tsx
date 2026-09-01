"use client";

import Link from "next/link";
import { useTransition } from "react";

import { logout } from "@/lib/actions/auth";

interface AuthNavProps {
  authenticated: boolean;
}

export function AuthNav({
  authenticated,
}: AuthNavProps) {
  const [pending, startTransition] =
    useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();

      window.location.href = "/";
    });
  }

  if (!authenticated) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium transition hover:bg-zinc-800"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-zinc-800"
      >
        Profile
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? "Logging out..."
          : "Logout"}
      </button>
    </div>
  );
}