"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    startTransition(async () => {
      const result = await login({
        email,
        password,
      });

      if (!result.success) {
        setError(
          result.error ??
            "Unable to sign in."
        );
        return;
      }

      if (result.role === "Developer") {
        router.push("/developer");
      } else if (result.role === "Administrator") {
        router.push("/admin/games");
      } else {
        router.push("/");
      }

      router.refresh();
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-white">
      <section className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Sign in to continue to PlayGame.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-200"
                >
                  Password
                </label>

                <span className="text-xs text-zinc-500">
                  Secure sign-in
                </span>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />

            <span className="text-xs text-zinc-500">
              OR
            </span>

            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <button
            type="button"
            disabled
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-medium text-zinc-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Continue with Google
            <span className="ml-2 text-xs text-zinc-600">
              Coming soon
            </span>
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Create one
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-5 text-zinc-600">
            By signing in, you agree to use
            PlayGame responsibly and securely.
          </p>
        </div>
      </section>
    </main>
  );
}