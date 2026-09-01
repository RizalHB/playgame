"use client";

import {
  FormEvent,
  useState,
  useTransition,
} from "react";

import { toast } from "sonner";

import { updateUsername } from "@/lib/actions/profile";

interface ProfileFormProps {
  username: string;
}

export function ProfileForm({
  username: initialUsername,
}: ProfileFormProps) {
  const [username, setUsername] =
    useState(initialUsername);

  const [pending, startTransition] =
    useTransition();

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    startTransition(async () => {
      const result =
        await updateUsername(username);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

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
          htmlFor="username"
          className="block text-sm font-medium"
        >
          Username
        </label>

        <p className="mt-1 text-sm text-zinc-400">
          This name is visible on your PlayGame
          account.
        </p>

        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(event) =>
            setUsername(event.target.value)
          }
          minLength={3}
          maxLength={32}
          required
          autoComplete="username"
          disabled={pending}
          className="
            mt-3
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-950
            px-4
            py-3
            text-white
            outline-none
            transition
            placeholder:text-zinc-600
            focus:border-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />

        <p className="mt-2 text-xs text-zinc-500">
          3–32 characters. Letters, numbers, and
          underscores only.
        </p>
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
          ? "Saving..."
          : "Save Changes"}
      </button>
    </form>
  );
}