import { InstallButton } from "./InstallButton";
import type { InstallationState } from "@/lib/types/installation-state";

interface LauncherCardProps {
  gameId: string;

  gameState: {
    installation: InstallationState;
  };
}

export function LauncherCard({
  gameId,
  gameState,
}: LauncherCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">

      <h2 className="text-xl font-semibold">
        Launcher
      </h2>

      <div className="mt-6 space-y-3 text-sm text-zinc-400">

        <div className="flex justify-between">
          <span>Status</span>
          <span>{gameState.installation.status}</span>
        </div>

        <div className="flex justify-between">
          <span>Version</span>
          <span>
            {gameState.installation.installedVersion ??
              "-"}
          </span>
        </div>

      </div>

      <div className="mt-6">
        <InstallButton
          gameId={gameId}
          installation={gameState.installation}
        />
      </div>

    </div>
  );
}