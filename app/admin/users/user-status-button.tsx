"use client";

import { useTransition } from "react";

import { updateUserStatus } from "./user-actions";

interface UserStatusButtonProps {
  userId: string;
  status: string;
}

export function UserStatusButton({
  userId,
  status,
}: UserStatusButtonProps) {
  const [pending, startTransition] =
    useTransition();

  const isActive =
    status === "active";

  function handleClick() {
    const nextStatus = isActive
      ? "inactive"
      : "active";

    startTransition(async () => {
      await updateUserStatus(
        userId,
        nextStatus,
      );

      window.location.reload();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={
        isActive
          ? "rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          : "rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {pending
        ? "Updating..."
        : isActive
          ? "Deactivate"
          : "Activate"}
    </button>
  );
}