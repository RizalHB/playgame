"use client";

import { useTransition } from "react";

import {
  Download,
  Loader2,
  Play,
} from "lucide-react";

import { InstallProgress } from "./InstallProgress";

import {
  installGame,
  removeInstalledGame,
} from "@/lib/actions/installations";
import {
  launchGame,
  exitGame,
} from "@/lib/actions/launcher";

import { useInstallation } from "@/lib/hooks/useInstallation";

import type { InstallationState } from "@/lib/types/installation-state";

interface InstallButtonProps {
  gameId: string;

  installation: InstallationState;
}

export function InstallButton({
  gameId,
  installation: initialInstallation,
}: InstallButtonProps) {
  const [pending, startTransition] =
    useTransition();

  const installation =
    useInstallation(
      gameId,
      initialInstallation
    );

  switch (installation.status) {
    case "installed":
  return (
    <div className="space-y-3">

      {installation.playing ? (
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await exitGame(gameId);
            })
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-red-600
            px-4
            py-3
            font-semibold
            text-white
            transition
            hover:bg-red-700
          "
        >
          {pending
            ? "Stopping..."
            : "STOP"}
        </button>
      ) : (
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await launchGame(gameId);
            })
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-b
            from-green-500
            to-green-700
            px-4
            py-3
            font-semibold
            text-white
            transition
            hover:from-green-400
            hover:to-green-600
          "
        >
          <Play size={18} />

          {pending
            ? "Launching..."
            : "PLAY"}
        </button>
      )}

      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await removeInstalledGame(gameId);
          })
        }
        className="
          w-full
          rounded-xl
          border
          border-zinc-700
          px-4
          py-3
          text-sm
          transition
          hover:bg-zinc-800
        "
      >
        Uninstall
      </button>

    </div>
  );

    case "queued":
      return (
        <InstallProgress
          progress={0}
          speedMbps={0}
          remainingSeconds={0}
          status="queued"
        />
      );

    case "downloading":
      return (
        <InstallProgress
          progress={
            installation.progress
          }
          speedMbps={
            installation.downloadSpeedMbps
          }
          remainingSeconds={
            installation.remainingSeconds
          }
          status="downloading"
        />
      );

    case "installing":
      return (
        <InstallProgress
          progress={100}
          speedMbps={0}
          remainingSeconds={0}
          status="installing"
        />
      );

    case "updating":
      return (
        <InstallProgress
          progress={
            installation.progress
          }
          speedMbps={
            installation.downloadSpeedMbps
          }
          remainingSeconds={
            installation.remainingSeconds
          }
          status="updating"
        />
      );

    default:
      return (
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await installGame(gameId);
            })
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-4
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:opacity-60
          "
        >
          {pending ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Preparing...
            </>
          ) : (
            <>
              <Download size={18} />
              INSTALL
            </>
          )}
        </button>
      );
  }
}