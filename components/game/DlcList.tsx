"use client";

import { useTransition } from "react";
import { purchaseDlc } from "@/lib/actions/dlc";

interface DlcListProps {
  dlcs: Array<{
    id: string;
    title: string;
    description: string | null;
    price: number;
    releaseDate: Date | null;
    installSizeBytes: number;
  }>;

  userDlcs: Array<{
    dlcId: string;
  }>;
}

export function DlcList({
  dlcs,
  userDlcs,
}: DlcListProps) {
  const [pending, startTransition] =
    useTransition();

  const ownedDlcIds =
    new Set(
      userDlcs.map(
        (userDlc) => userDlc.dlcId
      )
    );

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold">
        Downloadable Content
      </h2>

      {dlcs.length === 0 ? (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900/40
            p-6
            text-center
          "
        >
          <p className="text-sm text-zinc-400">
            DLC is not available for this game.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {dlcs.map((dlc) => {
            const owned =
              ownedDlcIds.has(dlc.id);

            return (
              <div
                key={dlc.id}
                className="
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900/60
                  p-5
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {dlc.title}
                    </h3>

                    {dlc.description && (
                      <p className="mt-2 text-sm text-zinc-400">
                        {dlc.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="font-semibold">
                      ${dlc.price.toFixed(2)}
                    </div>

                    {owned ? (
                      <div
                        className="
                          mt-3
                          rounded-lg
                          border
                          border-green-700
                          bg-green-950/30
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-green-400
                        "
                      >
                        Owned
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          startTransition(
                            async () => {
                              await purchaseDlc(
                                dlc.id
                              );
                            }
                          )
                        }
                        className="
                          mt-3
                          rounded-lg
                          bg-blue-600
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:bg-blue-700
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {pending
                          ? "Purchasing..."
                          : "Purchase"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-xs text-zinc-500">
                  {formatSize(
                    dlc.installSizeBytes
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatSize(bytes: number) {
  if (bytes <= 0) {
    return "Size unavailable";
  }

  const gb =
    bytes / 1024 / 1024 / 1024;

  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  }

  const mb =
    bytes / 1024 / 1024;

  return `${mb.toFixed(0)} MB`;
}