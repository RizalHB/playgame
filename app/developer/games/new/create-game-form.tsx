"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createDeveloperGame,
  type CreateGameState,
} from "@/lib/actions/developer-games";

interface CreateGameFormProps {
  studioName: string;
}

const initialState: CreateGameState = {};

export function CreateGameForm({
  studioName,
}: CreateGameFormProps) {
  const [state, formAction, pending] =
    useActionState(
      createDeveloperGame,
      initialState,
    );

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b2838] shadow-2xl"
    >
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
                d="M12 5v14M5 12h14"
              />
            </svg>
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Basic Information
            </h3>

            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Add the essential information for your
              new game.
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
              <circle cx="12" cy="12" r="9" />
              <path
                strokeLinecap="round"
                d="M12 8v4M12 16h.01"
              />
            </svg>

            <div>
              <p className="text-sm font-medium text-red-300">
                Unable to create game
              </p>

              <p className="mt-1 text-sm text-red-400/80">
                {state.error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 p-6 sm:p-8">
        {/* Game title */}
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
            maxLength={120}
            autoComplete="off"
            placeholder="Enter your game title"
            disabled={pending}
            className="w-full rounded-lg border border-white/10 bg-[#10151c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="mt-2 text-xs text-zinc-600">
            Choose a clear title players will recognize.
            Maximum 120 characters.
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
            placeholder="A short summary of your game"
            disabled={pending}
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
            rows={8}
            maxLength={10000}
            placeholder="Describe your game, its gameplay, features, and what makes it unique..."
            disabled={pending}
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
              Set the initial price and planned release
              date.
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
                  placeholder="90999"
                  disabled={pending}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <p className="mt-2 text-xs text-zinc-600">
                Whole rupiah only. Example: 90999 =
                Rp 90.999.
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
                disabled={pending}
                className="w-full rounded-lg border border-white/10 bg-[#10151c] px-4 py-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-zinc-600">
                Optional. This does not automatically
                publish the game.
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
              disabled={pending}
              className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* Draft notice */}
        <div className="flex gap-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="mt-0.5 h-5 w-5 shrink-0 text-blue-400"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              strokeLinecap="round"
              d="M12 11v5M12 8h.01"
            />
          </svg>

          <div>
            <p className="text-sm font-medium text-blue-300">
              Your game will be saved as a draft
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Creating a game does not make it visible
              in the public store. You can complete its
              details before publication.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-4 border-t border-white/10 bg-[#161f2b] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs text-zinc-500">
            Creating for{" "}
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
            className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:opacity-70"
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
              ? "Creating Draft..."
              : "Create Draft"}
          </button>
        </div>
      </div>
    </form>
  );
}