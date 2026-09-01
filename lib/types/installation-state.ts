import type { InstallationStatus } from "./installation";

export interface InstallationState {
  installed: boolean;

  status: InstallationStatus;

  progress: number;

  downloadSpeedMbps: number;

  remainingSeconds: number;

  currentOperation: string;

  playing: boolean;

  installPath: string | null;

  installedVersion: string | null;

  launcherVersion: string | null;

  installSizeBytes: number;

  installedAt: Date | null;

  lastPlayedAt: Date | null;
}