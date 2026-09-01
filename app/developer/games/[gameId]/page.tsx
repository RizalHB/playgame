import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MediaManager } from "./media-manager";
import {
  getCurrentDeveloper,
} from "@/lib/auth/current-developer";

import {
  getDeveloperGame,
} from "@/lib/database/queries/developer-games";

import {
  GAME_STATUS,
} from "@/lib/database/schema/games";

import { EditGameForm } from "./edit-game-form";
import {
  GameLifecycleActions,
} from "./game-lifecycle-actions";

interface DeveloperGamePageProps {
  params: Promise<{
    gameId: string;
  }>;
}

function getStatusLabel(
  status: string,
) {
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

export default async function DeveloperGamePage({
  params,
}: DeveloperGamePageProps) {
  const developer =
    await getCurrentDeveloper();

  if (!developer) {
    redirect("/login");
  }

  const { gameId } =
    await params;

  const game =
    await getDeveloperGame(
      developer.id,
      gameId,
    );

  if (!game) {
    notFound();
  }

  const statusLabel =
    getStatusLabel(game.status);

  const isReleased =
    game.status ===
    GAME_STATUS.RELEASED;

  return (
    <main className="min-h-screen bg-[#171a21] text-white">
      <header className="border-b border-white/10 bg-[#171a21]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              PlayGame
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              Developer Portal
            </h1>
          </div>

          <Link
            href="/developer"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm"
        >
          <Link
            href="/developer"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            Developer
          </Link>

          <span className="text-zinc-700">
            /
          </span>

          <span className="truncate text-zinc-300">
            {game.title}
          </span>
        </nav>

        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">
                Game Management
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                {game.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Manage your game metadata and
                release lifecycle.
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Current Status
              </p>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />

                <span className="text-sm font-medium text-zinc-300">
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-6 rounded-xl border border-white/10 bg-[#1b2838] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">
                Release Lifecycle
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Control the next valid lifecycle
                transition for this game.
              </p>
            </div>

            <GameLifecycleActions
              gameId={game.id}
              status={game.status}
            />
          </div>
        </section>

        {isReleased && (
          <div className="mb-6 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
            <p className="text-sm font-medium text-emerald-300">
              This game has been released.
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Lifecycle status is controlled by
              the release system. Metadata can
              still be managed according to your
              application rules.
            </p>
          </div>
        )}

        {game.status ===
          GAME_STATUS.PENDING_REVIEW && (
          <div className="mb-6 rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">
            <p className="text-sm font-medium text-amber-300">
              Game is awaiting review.
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              An administrator must approve or
              reject the submission.
            </p>
          </div>
        )}

        <EditGameForm
          game={game}
          studioName={
            developer.studioName
          }
        />
        <MediaManager
          gameId={game.id}
          media={game.media}
        />
      </div>
    </main>
  );
}