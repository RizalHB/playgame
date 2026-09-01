"use client";

import {
  useEffect,
  useState,
} from "react";
import type { InstallationState } from "@/lib/types/installation-state";
export function useInstallation(
  gameId: string,
  initialState: InstallationState
) {
  const [installation, setInstallation] =
    useState(initialState);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response =
          await fetch(
            `/api/installations/${gameId}`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (cancelled) {
          return;
        }

        setInstallation({
          ...data,

          installedAt:
            data.installedAt
              ? new Date(
                  data.installedAt
                )
              : null,

          lastPlayedAt:
            data.lastPlayedAt
              ? new Date(
                  data.lastPlayedAt
                )
              : null,
        });
      } catch {
        // Ignore temporary polling errors.
      }
    }

    refresh();

    const interval =
      setInterval(refresh, 1000);

    return () => {
      cancelled = true;

      clearInterval(interval);
    };
  }, [gameId]);

  return installation;
}