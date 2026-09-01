"use client";

import { useInstallationQueue } from "@/lib/hooks/useInstallationQueue";

import { ActiveDownloadCard } from "./ActiveDownloadCard";
import { QueueItem } from "./QueueItem";


export function DownloadsPanel() {

  const installations =
    useInstallationQueue();


  if (installations.length === 0) {
    return (
      <div className="
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        text-zinc-400
      ">
        No active downloads
      </div>
    );
  }


  const active =
    installations.find(
      (item) =>
        item.status === "downloading" ||
        item.status === "installing"
    );


  const queued =
    installations.filter(
      (item) =>
        item.id !== active?.id
    );


  return (
    <div className="space-y-6">

      {active && (
        <ActiveDownloadCard
          installation={active}
        />
      )}


      <div className="space-y-3">

        {queued.map(
          (item) => (
            <QueueItem
              key={item.id}
              installation={item}
            />
          )
        )}

      </div>

    </div>
  );
}