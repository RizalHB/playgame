"use client";

import { useActionState } from "react";

import {
  submitGameForReview,
  withdrawGameFromReview,
  scheduleGameRelease,
  type GameLifecycleState,
} from "@/lib/actions/developer-games";

import {
  GAME_STATUS,
  type GameStatus,
} from "@/lib/database/schema/games";

interface GameLifecycleActionsProps {
  gameId: string;
  status: GameStatus;
}

const initialState: GameLifecycleState = {};

export function GameLifecycleActions({
  gameId,
  status,
}: GameLifecycleActionsProps) {
  const [
    submitState,
    submitAction,
    submitPending,
  ] = useActionState(
    submitGameForReview,
    initialState,
  );

  const [
    withdrawState,
    withdrawAction,
    withdrawPending,
  ] = useActionState(
    withdrawGameFromReview,
    initialState,
  );

  const [
    scheduleState,
    scheduleAction,
    schedulePending,
  ] = useActionState(
    scheduleGameRelease,
    initialState,
  );

  const pending =
    submitPending ||
    withdrawPending ||
    schedulePending;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {(
        status === GAME_STATUS.DRAFT ||
        status === GAME_STATUS.REJECTED
      ) && (
        <form action={submitAction}>
          <input
            type="hidden"
            name="gameId"
            value={gameId}
          />

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitPending
              ? "Submitting..."
              : "Submit for Review"}
          </button>
        </form>
      )}

      {status ===
        GAME_STATUS.PENDING_REVIEW && (
        <form action={withdrawAction}>
          <input
            type="hidden"
            name="gameId"
            value={gameId}
          />

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {withdrawPending
              ? "Withdrawing..."
              : "Withdraw Submission"}
          </button>
        </form>
      )}

      {status === GAME_STATUS.APPROVED && (
        <form action={scheduleAction}>
          <input
            type="hidden"
            name="gameId"
            value={gameId}
          />

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {schedulePending
              ? "Scheduling..."
              : "Schedule Release"}
          </button>
        </form>
      )}

      {submitState.error && (
        <p
          role="alert"
          className="w-full text-sm text-red-400"
        >
          {submitState.error}
        </p>
      )}

      {withdrawState.error && (
        <p
          role="alert"
          className="w-full text-sm text-red-400"
        >
          {withdrawState.error}
        </p>
      )}

      {scheduleState.error && (
        <p
          role="alert"
          className="w-full text-sm text-red-400"
        >
          {scheduleState.error}
        </p>
      )}

      {submitState.success && (
        <p
          role="status"
          className="w-full text-sm text-emerald-400"
        >
          {submitState.success}
        </p>
      )}

      {withdrawState.success && (
        <p
          role="status"
          className="w-full text-sm text-emerald-400"
        >
          {withdrawState.success}
        </p>
      )}

      {scheduleState.success && (
        <p
          role="status"
          className="w-full text-sm text-emerald-400"
        >
          {scheduleState.success}
        </p>
      )}
    </div>
  );
}