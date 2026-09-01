"use client";

import { useTransition } from "react";
import {
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";

import { toast } from "sonner";
import type { InstallationState } from "@/lib/types/installation-state";
import { addToCart } from "@/lib/actions/cart";
import { InstallButton } from "./InstallButton";

interface PurchaseCardProps {
  gameId: string;
  price: number;

  gameState: {
    ownership: {
      owned: boolean;
      purchasedAt: Date | null;
      playTimeMinutes: number;
      installed: boolean;
      favorite: boolean;
      hidden: boolean;
    };

    installation: InstallationState;
  } | null;
}

export function PurchaseCard({
  gameId,
  price,
  gameState,
}: PurchaseCardProps) {
  const [pending, startTransition] =
    useTransition();

  if (!gameState) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">
          Purchase
        </h2>

        <p className="mt-6 text-3xl font-bold">
          Rp{" "}
          {new Intl.NumberFormat("id-ID").format(
            Math.round(price * 1)
          )}
        </p>

        <p className="mt-3 text-sm text-zinc-400">
          Sign in to purchase this game and add
          it to your library.
        </p>

        <a
          href="/login"
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            px-4
            py-3
            font-semibold
            transition
            hover:bg-blue-700
          "
        >
          Sign in to purchase
        </a>
      </div>
    );
  }

  const owned =
    gameState.ownership.owned;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold">
        Purchase
      </h2>

      {owned ? (
        <>
          <div className="mt-6 rounded-xl border border-green-700 bg-green-950/30 p-4">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 size={20} />

              <span className="font-semibold">
                In Library
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-400">
              You already own this game.
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm text-zinc-400">
            <div className="flex justify-between">
              <span>Status</span>

              <span className="capitalize">
                {gameState.installation.status.replaceAll(
                  "_",
                  " "
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Version</span>

              <span>
                {gameState.installation
                  .installedVersion ?? "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Installed</span>

              <span>
                {gameState.installation.installedAt
                  ? gameState.installation.installedAt.toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <InstallButton
              gameId={gameId}
              installation={
                gameState.installation
              }
            />
          </div>
        </>
      ) : (
        <>
          <p className="mt-6 text-3xl font-bold">
            Rp{" "}
            {new Intl.NumberFormat("id-ID").format(
              Math.round(price * 1)
            )}
          </p>

          <button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result =
                  await addToCart(gameId);

                switch (result.reason) {
                  case "added":
                    toast.success(
                      result.message,
                      {
                        description:
                          "The game has been added to your shopping cart.",
                        action: {
                          label: "View Cart",
                          onClick: () => {
                            window.location.href =
                              "/cart";
                          },
                        },
                      }
                    );
                    break;

                  case "exists":
                    toast.info(
                      result.message,
                      {
                        description:
                          "You can continue shopping or proceed to checkout.",
                        action: {
                          label: "Open Cart",
                          onClick: () => {
                            window.location.href =
                              "/cart";
                          },
                        },
                      }
                    );
                    break;

                  case "owned":
                    toast.error(
                      result.message,
                      {
                        description:
                          "Purchased games are available in your Library.",
                        action: {
                          label: "Library",
                          onClick: () => {
                            window.location.href =
                              "/library";
                          },
                        },
                      }
                    );
                    break;
                }
              })
            }
            className="
              mt-6
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
              transition
              hover:bg-blue-700
              disabled:opacity-60
            "
          >
            <ShoppingCart size={18} />

            {pending
              ? "Adding..."
              : "Add to Cart"}
          </button>

          <button
            className="
              mt-3
              w-full
              rounded-xl
              border
              border-zinc-700
              px-4
              py-3
              transition
              hover:bg-zinc-800
            "
          >
            Add to Wishlist
          </button>
        </>
      )}
    </div>
  );
}