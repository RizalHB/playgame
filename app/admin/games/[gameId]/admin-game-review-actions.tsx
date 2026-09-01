"use client";

import { useActionState } from "react";

import {
  approveGame,
  rejectGame,
  type AdminGameLifecycleState,
} from "@/lib/actions/admin-games";

interface AdminGameReviewActionsProps {
  gameId: string;
}

const initialState: AdminGameLifecycleState = {};

export function AdminGameReviewActions({
  gameId,
}: AdminGameReviewActionsProps) {
  const [
    approveState,
    approveAction,
    approvePending,
  ] = useActionState(
    approveGame,
    initialState,
  );

  const [
    rejectState,
    rejectAction,
    rejectPending,
  ] = useActionState(
    rejectGame,
    initialState,
  );

  const pending =
    approvePending ||
    rejectPending;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Approve */}
        <form
          action={approveAction}
          className="flex-1"
        >
          <input
            type="hidden"
            name="gameId"
            value={gameId}
          />

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {approvePending
              ? "Approving..."
              : "Approve Game"}
          </button>
        </form>

        {/* Reject */}
        <form
          action={rejectAction}
          className="flex-1"
        >
          <input
            type="hidden"
            name="gameId"
            value={gameId}
          />

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {rejectPending
              ? "Rejecting..."
              : "Reject Game"}
          </button>
        </form>
      </div>

      {/* Approve error */}
      {approveState.error && (
        <p
          role="alert"
          className="text-sm text-red-400"
        >
          {approveState.error}
        </p>
      )}

      {/* Reject error */}
      {rejectState.error && (
        <p
          role="alert"
          className="text-sm text-red-400"
        >
          {rejectState.error}
        </p>
      )}

      {/* Success */}
      {approveState.success && (
        <p
          role="status"
          className="text-sm text-emerald-400"
        >
          {approveState.success}
        </p>
      )}

      {rejectState.success && (
        <p
          role="status"
          className="text-sm text-emerald-400"
        >
          {rejectState.success}
        </p>
      )}
    </div>
  );
}