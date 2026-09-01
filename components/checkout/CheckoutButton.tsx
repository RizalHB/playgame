"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { completePurchase } from "@/lib/actions/checkout";

export function CheckoutButton() {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            const result =
              await completePurchase();

            toast.success(
              "Purchase completed successfully."
            );

            router.push(
              `/checkout/success/${result.orderNumber}`
            );
          } catch {
            toast.error(
              "Purchase failed."
            );
          }
        })
      }
      className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700 disabled:opacity-60"
    >
      {pending
        ? "Processing..."
        : "Complete Purchase"}
    </button>
  );
}