"use client";

import {
  useEffect,
  useState,
} from "react";


export interface InstallationQueueItem {
  id: string;

  gameId: string;

  status:
    | "not_installed"
    | "queued"
    | "downloading"
    | "installing"
    | "installed"
    | "updating";

  currentOperation: string | null;

  downloadProgress: number;

  downloadSpeedMbps: number;

  remainingSeconds: number;

  installPath: string | null;

  installedVersion: string | null;
}


export function useInstallationQueue() {

  const [
    installations,
    setInstallations,
  ] = useState<
    InstallationQueueItem[]
  >([]);


  useEffect(() => {

    let active = true;


    async function fetchQueue() {

      try {

        const response =
          await fetch(
            "/api/installations",
            {
              cache: "no-store",
            }
          );


        if (!response.ok) {
          return;
        }


        const data =
          await response.json();


        if (active) {
          setInstallations(data);
        }


      } catch {

        // ignore temporary errors

      }

    }


    fetchQueue();


    const interval =
      setInterval(
        fetchQueue,
        1000
      );


    return () => {

      active = false;

      clearInterval(interval);

    };


  }, []);


  return installations;
}