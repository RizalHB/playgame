"use client";

import {
  FormEvent,
  useState,
  useTransition,
} from "react";

import { toast } from "sonner";

import {
  changePassword,
} from "@/lib/actions/profile";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [pending, startTransition] =
    useTransition();

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    startTransition(async () => {
      const result =
        await changePassword(
          currentPassword,
          newPassword,
          confirmPassword
        );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success(result.message);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="current-password"
          className="block text-sm font-medium"
        >
          Current Password
        </label>

        <input
          id="current-password"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(
              event.target.value
            )
          }
          autoComplete="current-password"
          required
          disabled={pending}
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-950
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="block text-sm font-medium"
        >
          New Password
        </label>

        <input
          id="new-password"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(event) =>
            setNewPassword(
              event.target.value
            )
          }
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          disabled={pending}
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-950
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />

        <p className="mt-2 text-xs text-zinc-500">
          Use at least 8 characters.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium"
        >
          Confirm New Password
        </label>

        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value
            )
          }
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          disabled={pending}
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-950
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="
          w-full
          rounded-xl
          bg-blue-600
          px-5
          py-3
          font-semibold
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {pending
          ? "Changing Password..."
          : "Change Password"}
      </button>
    </form>
  );
}