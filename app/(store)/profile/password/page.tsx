import Link from "next/link";

import { getCurrentSession } from "@/lib/auth/session";
import { PasswordForm } from "@/components/profile/PasswordForm";

export default async function ChangePasswordPage() {
  const session =
    await getCurrentSession();

  if (!session) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h1 className="text-2xl font-bold">
            Sign in required
          </h1>

          <p className="mt-3 text-zinc-400">
            You need to sign in before changing
            your password.
          </p>

          <Link
            href="/login"
            className="
              mt-6
              inline-flex
              rounded-xl
              bg-blue-600
              px-5
              py-3
              font-semibold
              transition
              hover:bg-blue-700
            "
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="space-y-8">
        <div>
          <Link
            href="/profile"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Profile
          </Link>

          <p className="mt-6 text-sm font-medium text-blue-400">
            Security
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Change Password
          </h1>

          <p className="mt-2 text-zinc-400">
            Choose a new password for your PlayGame
            account.
          </p>
        </div>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <PasswordForm />
        </section>
      </div>
    </main>
  );
}