"use client";

import { useTransition } from "react";
import { CheckCircle2, Download, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { purchaseDlc } from "@/lib/actions/dlc";

interface Dlc {
  id: string;
  title: string;
  description: string | null;
  price: number;
  releaseDate: Date | null;
  installSizeBytes: number;
  owned: boolean;
  installed: boolean;
}

interface DlcSectionProps {
  dlcs: Dlc[];
}

export function DlcSection({
  dlcs,
}: DlcSectionProps) {
  const [pending, startTransition] =
    useTransition();

  if (dlcs.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">
        Downloadable Content
      </h2>

      <div className="mt-6 space-y-4">
        {dlcs.map((dlc) => (
          <div
            key={dlc.id}
            className="
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              p-5
            "
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">
                  {dlc.title}
                </h3>

                {dlc.description && (
                  <p className="mt-1 text-sm text-zinc-400">
                    {dlc.description}
                  </p>
                )}

                <p className="mt-2 text-sm text-zinc-500">
                  ${dlc.price.toFixed(2)}
                </p>
              </div>

              <div className="sm:min-w-32">
                {dlc.installed ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-green-800 px-4 py-2 text-sm text-green-400">
                    <CheckCircle2 size={16} />
                    Installed
                  </div>
                ) : dlc.owned ? (
                  <button
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-blue-600
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      hover:bg-blue-700
                    "
                  >
                    <Download size={16} />
                    Install
                  </button>
                ) : (
                  <button
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        const result =
                          await purchaseDlc(
                            dlc.id
                          );

                        if (result.success) {
                          toast.success(
                            "DLC added to your library."
                          );

                          window.location.reload();
                        } else {
                          toast.error(
                            result.message
                          );
                        }
                      })
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-blue-600
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      hover:bg-blue-700
                      disabled:opacity-50
                    "
                  >
                    <ShoppingCart size={16} />

                    {pending
                      ? "Purchasing..."
                      : "Buy DLC"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}