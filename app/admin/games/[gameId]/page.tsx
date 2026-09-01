import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/current-admin";
import { getAdminGame } from "@/lib/database/queries/admin-games";
import {
  GAME_STATUS,
} from "@/lib/database/schema";
import { AdminGameReviewActions } from "./admin-game-review-actions";

interface AdminGameReviewPageProps {
  params: Promise<{
    gameId: string;
  }>;
}
export default async function AdminGameReviewPage({
  params,
}: AdminGameReviewPageProps) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  const { gameId } = await params;

  const game = await getAdminGame(
    gameId,
  );

  if (!game) {
    notFound();
  }

  const isPendingReview =
    game.status ===
    GAME_STATUS.PENDING_REVIEW;

  return (
    <main className="min-h-screen bg-[#171a21] text-white">
      {/* Header */}
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

          <Link
            href="/admin/games"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Back to Review Queue
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm"
        >
          <Link
            href="/admin"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            Admin
          </Link>

          <span className="text-zinc-700">
            /
          </span>

          <Link
            href="/admin/games"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            Game Review
          </Link>

          <span className="text-zinc-700">
            /
          </span>

          <span className="truncate text-zinc-300">
            {game.title}
          </span>
        </nav>

        {/* Heading */}
        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-400">
                Game Submission
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                {game.title}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
                Review the submitted game metadata
                before deciding whether the game
                can proceed to release scheduling.
              </p>
            </div>

            {/* Status */}
            <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Current Status
              </p>

              <p className="mt-1.5 text-sm font-semibold text-amber-300">
                {game.status}
              </p>
            </div>
          </div>
        </div>

        {/* Review warning */}
        {isPendingReview && (
          <div className="mb-6 rounded-xl border border-amber-400/10 bg-amber-400/5 p-4">
            <p className="text-sm font-medium text-amber-300">
              This game is awaiting review.
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Approving the submission moves it
              to APPROVED. Rejecting it moves it
              to REJECTED.
            </p>
          </div>
        )}

        {/* Game metadata */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h3 className="text-base font-semibold text-zinc-100">
              Game Information
            </h3>

            <p className="mt-1 text-sm text-zinc-600">
              Submitted metadata for administrative
              review.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Title
              </p>

              <p className="mt-2 text-sm text-zinc-200">
                {game.title}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Base Price
              </p>

              <p className="mt-2 text-sm text-zinc-200">
                {game.basePrice.toLocaleString(
                  "id-ID",
                )}{" "}
                IDR
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Short Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                {game.shortDescription ||
                  "No short description provided."}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Description
              </p>

              <div className="mt-2 rounded-xl border border-white/10 bg-black/10 p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                  {game.description ||
                    "No description provided."}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Release Date
              </p>

              <p className="mt-2 text-sm text-zinc-200">
                {game.releaseDate
                  ? game.releaseDate.toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Pre-order
              </p>

              <p className="mt-2 text-sm text-zinc-200">
                {game.isPreOrder
                  ? "Enabled"
                  : "Disabled"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Submitted
              </p>

              <p className="mt-2 text-sm text-zinc-200">
                {game.updatedAt.toLocaleString(
                  "id-ID",
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Developer ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-zinc-500">
                {game.developerId}
              </p>
            </div>
          </div>
        </section>

        {/* Developer Information */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h3 className="text-base font-semibold text-zinc-100">
              Developer
            </h3>

            <p className="mt-1 text-sm text-zinc-600">
              Developer account associated with this game.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Studio
              </p>

              <p className="mt-2 text-sm text-zinc-200">
                {game.developer?.studioName ||
                  "No studio name"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Username
              </p>

              <p className="mt-2 text-sm text-zinc-200">
                {game.developer?.user?.username ||
                  "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Email
              </p>

              <p className="mt-2 break-all text-sm text-zinc-400">
                {game.developer?.user?.email ||
                  "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                Developer ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-zinc-500">
                {game.developerId}
              </p>
            </div>
          </div>
        </section>

        {/* Media Review */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h3 className="text-base font-semibold text-zinc-100">
              Game Media
            </h3>

            <p className="mt-1 text-sm text-zinc-600">
              Media submitted by the developer for this game.
            </p>
          </div>

          {game.media.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-zinc-500">
                No media has been submitted for this game.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {game.media.map((media) => (
                <div
                  key={media.id}
                  className="px-6 py-6"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[11px] font-medium uppercase text-blue-300">
                        {media.type}
                      </span>

                      {media.isPrimary && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                          Primary
                        </span>
                      )}

                      <span className="text-xs text-zinc-600">
                        {media.mediaType}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {media.title ||
                          "Untitled media"}
                      </p>

                      {media.altText && (
                        <p className="mt-1 text-xs text-zinc-500">
                          Alt text: {media.altText}
                        </p>
                      )}
                    </div>

                    {media.mediaType === "image" ? (
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                        <img
                          src={media.url}
                          alt={
                            media.altText ||
                            media.title ||
                            "Game media"
                          }
                          className="max-h-[420px] w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-zinc-200">
                              Video Media
                            </p>

                            <p className="mt-1 break-all text-xs text-zinc-500">
                              {media.url}
                            </p>
                          </div>

                          <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                          >
                            Open Video
                          </a>
                        </div>

                        {media.thumbnailUrl && (
                          <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
                            <img
                              src={media.thumbnailUrl}
                              alt={
                                media.title ||
                                "Video thumbnail"
                              }
                              className="max-h-72 w-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-600">
                      <span>
                        Order: {media.displayOrder}
                      </span>

                      <span className="break-all">
                        URL: {media.url}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Actions */}
        {isPendingReview && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-zinc-100">
                Review Decision
              </h3>

              <p className="mt-1 text-sm text-zinc-600">
                Choose whether this submission is
                ready to proceed.
              </p>
            </div>

            <AdminGameReviewActions
              gameId={game.id}
            />
          </section>
        )}

        {/* Already processed */}
        {!isPendingReview && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-zinc-400">
              This submission is no longer waiting
              for review.
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Current lifecycle status:{" "}
              {game.status}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
