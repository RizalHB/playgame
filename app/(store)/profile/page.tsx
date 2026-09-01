import Link from "next/link";

import { getCurrentSession } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/database/queries/profile";
import { ProfileForm } from "@/components/profile/ProfileForm";
export default async function ProfilePage() {
  const session =
    await getCurrentSession();

  if (!session) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h1 className="text-2xl font-bold">
            Sign in required
          </h1>

          <p className="mt-3 text-zinc-400">
            You need to sign in to view your
            profile.
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

  const profile =
    await getUserProfile(
      session.userId
    );

  if (!profile) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-8">
          <h1 className="text-2xl font-bold">
            Profile unavailable
          </h1>

          <p className="mt-3 text-zinc-400">
            We could not load your account
            profile.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-blue-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Your Profile
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your PlayGame account.
          </p>
        </div>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">
            Account Information
          </h2>

          <div className="mt-6 divide-y divide-zinc-800">
            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-zinc-400">
                Username
              </span>

              <span className="font-medium">
                {profile.username}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-zinc-400">
                Email
              </span>

              <span className="font-medium">
                {profile.email}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-zinc-400">
                Role
              </span>

              <span className="font-medium capitalize">
                {profile.role}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-zinc-400">
                Account Status
              </span>

              <span className="font-medium capitalize">
                {profile.status}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-zinc-400">
                Email Verified
              </span>

              <span className="font-medium">
                {profile.emailVerified
                  ? "Yes"
                  : "No"}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-zinc-400">
                Member Since
              </span>

              <span className="font-medium">
                {profile.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>
<section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
  <h2 className="text-xl font-semibold">
    Edit Profile
  </h2>

  <p className="mt-2 text-sm text-zinc-400">
    Update the username associated with your
    account.
  </p>

  <div className="mt-6">
    <ProfileForm
      username={profile.username}
    />
  </div>
</section>
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">
            Security
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Password and account security settings
            will be managed here.
          </p>

          <Link
            href="/profile/password"
            className="
              mt-5
              inline-flex
              rounded-xl
              border
              border-zinc-700
              px-5
              py-3
              font-medium
              transition
              hover:bg-zinc-800
            "
          >
            Change Password
          </Link>
        </section>
      </div>
    </main>
  );
}