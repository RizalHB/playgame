"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  updateDeveloperGame,
  type UpdateGameState,
} from "@/lib/actions/developer-games";

interface EditGame {
  id: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  basePrice: number;
  releaseDate: Date | null;
  isPublished: boolean;
  isPreOrder: boolean;
}

interface EditGameFormProps {
  game: EditGame;
  studioName: string;
}

const initialState: UpdateGameState = {};

function formatDateForInput(
  date: Date | null,
) {
  if (!date) {
    return "";
  }

  const year = date.getUTCFullYear();
  const month = String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getUTCDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatIdr(
  value: number,
) {
  return new Intl.NumberFormat(
    "id-ID",
  ).format(value);
}

export function EditGameForm({
  game,
  studioName,
}: EditGameFormProps) {
  const [state, formAction, pending] =
    useActionState(
      updateDeveloperGame,
      initialState,
    );

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b2838] shadow-2xl"
    >
      {/* Hidden identity */}
      <input
        type="hidden"
        name="gameId"
        value={game.id}
      />

      {/* Header */}
      <div className="border-b border-white/10 px-6 py-6 sm:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20h9"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L8 18l-4 1 1-4Z"
              />
            </svg>
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Game Information
            </h3>

            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Update the metadata shown for your
              game.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {state.error && (
        <div
          role="alert"
          aria-live="polite"
          className="mx-6 mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 sm:mx-8"
        >
          <div className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />

              <path
                strokeLinecap="round"
                d="M12 8v4M12 16h.01"
              />
            </svg>

            <div>
              <p className="text-sm font-medium text-red-300">
                Unable to save changes
              </p>

              <p className="mt-1 text-sm text-red-400/80">
                {state.error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {state.success && (
        <div
          role="status"
          aria-live="polite"
          className="mx-6 mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 sm:mx-8"
        >
          <div className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.5 12 2.25 2.25L15.5 9.5"
              />
            </svg>

            <div>
              <p className="text-sm font-medium text-emerald-300">
                Changes saved
              </p>

              <p className="mt-1 text-sm text-emerald-400/80">
                {state.success}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 p-6 sm:p-8">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Game Title
            <span className="ml-1 text-red-400">
              *
            </span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={2}
            maxLength={120}
            defaultValue={game.title}
            autoComplete="off"
            disabled={pending}
            className="w-full rounded-lg border border-white/10 bg-[#10151c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-2 text-xs text-zinc-600">
            2–120 characters.
          </p>
        </div>

        {/* Short description */}
        <div>
          <label
            htmlFor="shortDescription"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Short Description
          </label>

          <input
            id="shortDescription"
            name="shortDescription"
            type="text"
            maxLength={300}
            defaultValue={
              game.shortDescription ?? ""
            }
            disabled={pending}
            placeholder="A short summary of your game"
            className="w-full rounded-lg border border-white/10 bg-[#10151c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-2 text-xs text-zinc-600">
            Maximum 300 characters.
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-zinc-200"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={9}
            maxLength={10000}
            defaultValue={
              game.description ?? ""
            }
            disabled={pending}
            placeholder="Describe your game, its gameplay, features, and what makes it unique..."
            className="w-full resize-y rounded-lg border border-white/10 bg-[#10151c] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-2 text-xs text-zinc-600">
            Maximum 10,000 characters.
          </p>
        </div>

        {/* Pricing / Release */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">
              Pricing & Release
            </h3>

            <p className="mt-1 text-xs text-zinc-600">
              Set the current price and planned
              release date.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Price */}
            <div>
              <label
                htmlFor="basePrice"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Price
                <span className="ml-1 text-red-400">
                  *
                </span>
              </label>

              <div className="flex overflow-hidden rounded-lg border border-white/10 bg-[#10151c] transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                <span className="flex items-center border-r border-white/10 px-4 text-sm font-medium text-zinc-400">
                  Rp
                </span>

                <input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  required
                  defaultValue={
                    game.basePrice
                  }
                  disabled={pending}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <p className="mt-2 text-xs text-zinc-600">
                Current price:{" "}
                <span className="text-zinc-400">
                  Rp{" "}
                  {formatIdr(
                    game.basePrice,
                  )}
                </span>
              </p>
            </div>

            {/* Release date */}
            <div>
              <label
                htmlFor="releaseDate"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Release Date
              </label>

              <input
                id="releaseDate"
                name="releaseDate"
                type="date"
                defaultValue={formatDateForInput(
                  game.releaseDate,
                )}
                disabled={pending}
                className="w-full rounded-lg border border-white/10 bg-[#10151c] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Optional. This does not publish the
                game.
              </p>
            </div>
          </div>
        </div>

        {/* Pre-order */}
        <div className="rounded-xl border border-white/10 bg-[#10151c] p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="isPreOrder"
              defaultChecked={
                game.isPreOrder
              }
              disabled={pending}
              className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <span>
              <span className="block text-sm font-medium text-zinc-200">
                Enable pre-order
              </span>

              <span className="mt-1 block text-xs leading-5 text-zinc-500">
                Allow players to pre-order this game
                once it has been published.
              </span>
            </span>
          </label>
        </div>

        {/* Publishing status */}
        <div
          className={`flex gap-3 rounded-xl border p-4 ${
            game.isPublished
              ? "border-emerald-500/10 bg-emerald-500/5"
              : "border-amber-500/10 bg-amber-500/5"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={`mt-0.5 h-5 w-5 shrink-0 ${
              game.isPublished
                ? "text-emerald-400"
                : "text-amber-400"
            }`}
          >
            <circle
              cx="12"
              cy="12"
              r="9"
            />

            <path
              strokeLinecap="round"
              d="M12 11v5M12 8h.01"
            />
          </svg>

          <div>
            <p
              className={`text-sm font-medium ${
                game.isPublished
                  ? "text-emerald-300"
                  : "text-amber-300"
              }`}
            >
              {game.isPublished
                ? "This game is published"
                : "This game is currently a draft"}
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Editing metadata does not change
              the publication status.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-white/10 bg-[#161f2b] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs text-zinc-500">
            Editing for{" "}
            <span className="font-medium text-zinc-300">
              {studioName}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/developer"
            aria-disabled={pending}
            className={`rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white ${
              pending
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-w-[145px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:opacity-70"
          >
            {pending && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-30"
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3"
                />

                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {pending
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}