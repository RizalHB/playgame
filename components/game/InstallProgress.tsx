"use client";

interface InstallProgressProps {
  progress: number;

  speedMbps: number;

  remainingSeconds: number;

  status:
    | "queued"
    | "downloading"
    | "installing"
    | "updating";
}

function formatTime(seconds: number) {
  if (seconds <= 0) return "Calculating...";

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (minutes === 0)
    return `${secs}s remaining`;

  return `${minutes}m ${secs}s remaining`;
}

export function InstallProgress({
  progress,
  speedMbps,
  remainingSeconds,
  status,
}: InstallProgressProps) {
  const title =
    status === "queued"
      ? "Queued..."
      : status === "downloading"
      ? "Downloading"
      : status === "installing"
      ? "Installing"
      : "Updating";

  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">

      <div className="flex items-center justify-between">

        <span className="font-medium">
          {title}
        </span>

        <span className="text-sm text-zinc-400">
          {progress}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="flex justify-between text-xs text-zinc-400">

        <span>
          {speedMbps.toFixed(1)} MB/s
        </span>

        <span>
          {formatTime(remainingSeconds)}
        </span>

      </div>

    </div>
  );
}