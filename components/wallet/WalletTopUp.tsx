"use client";

import { useState } from "react";

import { createTopUp } from "@/lib/actions/wallet";

const PRESET_AMOUNTS = [
  25_000,
  50_000,
  100_000,
  250_000,
  500_000,
];

export function WalletTopUp() {
  const [amount, setAmount] = useState(100_000);

  const [topUp, setTopUp] = useState<{
    id: string;
    amount: number;
    transactionReference: string;
    status: string;
    paymentUrl?: string;
    qrDataUrl?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateTopUp() {
    setError(null);
    setLoading(true);

    try {
      const idempotencyKey = crypto.randomUUID();

      const result = await createTopUp(
        amount,
        idempotencyKey,
      );

      setTopUp({
        id: result.topUp.id,
        amount: result.topUp.amount,
        transactionReference:
          result.topUp.transactionReference,
        status: result.topUp.status,
        paymentUrl: result.payment.paymentUrl,
        qrDataUrl: result.payment.qrDataUrl,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create top-up.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-background shadow-sm dark:border-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200/80 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-800">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          Add wallet balance
        </h2>

        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Select an amount to generate a QRIS payment.
        </p>
      </div>

      {!topUp && (
        <div className="space-y-4 p-3.5 sm:space-y-5 sm:p-6">
          {/* Amount selection */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                Select amount
              </p>

              <span className="text-xs text-muted-foreground">
                Choose one
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {PRESET_AMOUNTS.map((preset) => {
                const selected = amount === preset;

                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    aria-pressed={selected}
                    className={[
                      "group relative flex min-h-11 w-full items-center justify-center rounded-lg border",
                      "px-3 py-2.5 text-sm font-semibold",
                      "transition-all duration-200 ease-out",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      "active:scale-[0.98]",

                      selected
                        ? [
                            "border-blue-500",
                            "bg-blue-500/10",
                            "text-blue-600",
                            "shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_4px_16px_rgba(59,130,246,0.12)]",
                            "dark:border-blue-400",
                            "dark:bg-blue-400/10",
                            "dark:text-blue-400",
                          ].join(" ")
                        : [
                            "border-slate-200",
                            "bg-background",
                            "text-foreground",
                            "hover:border-blue-400",
                            "hover:bg-blue-500/[0.04]",
                            "hover:text-blue-600",
                            "hover:shadow-sm",
                            "dark:border-slate-700",
                            "dark:hover:border-blue-500/70",
                            "dark:hover:bg-blue-500/[0.08]",
                            "dark:hover:text-blue-400",
                          ].join(" "),
                    ].join(" ")}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:bg-blue-400" />
                    )}

                    <span className="whitespace-nowrap">
                      Rp {preset / 1000}K
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected amount */}
          <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.08] via-background to-background px-4 py-3.5 text-center sm:px-6 sm:py-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

            <p className="relative text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Selected amount
            </p>

            <p className="relative mt-1 text-xl font-bold tracking-tight text-blue-600 sm:text-3xl dark:text-blue-400">
              Rp {amount.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Generate button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleCreateTopUp}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-lg",
              "bg-gradient-to-r from-blue-600 to-blue-500",
              "px-4 py-3.5 text-sm font-semibold text-white",
              "shadow-[0_4px_14px_rgba(37,99,235,0.25)]",
              "transition-all duration-200",
              "hover:from-blue-500 hover:to-blue-400",
              "hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]",
              "active:scale-[0.99]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
            ].join(" ")}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating QRIS...
              </>
            ) : (
              <>
                Generate QRIS
                <span className="text-blue-100">
                  · Rp {amount.toLocaleString("id-ID")}
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Payment result */}
      {topUp && (
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-slate-200 bg-background p-4 sm:p-5 dark:border-slate-800">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                QRIS payment
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Rp {topUp.amount.toLocaleString("id-ID")}
              </p>

              {topUp.qrDataUrl && (
                <div className="mx-auto mt-5 w-fit max-w-full rounded-xl border bg-white p-2.5 shadow-sm sm:p-3">
                  <img
                    src={topUp.qrDataUrl}
                    alt="QRIS payment QR code"
                    className="h-auto w-[min(64vw,256px)]"
                  />
                </div>
              )}
            </div>

            {/* Transaction information */}
            <div className="mt-5 space-y-2 rounded-lg bg-muted/60 p-4 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-muted-foreground">
                  Reference
                </span>

                <span className="break-all font-medium sm:text-right">
                  {topUp.transactionReference}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-muted-foreground">
                  Status
                </span>

                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold capitalize text-blue-600 dark:text-blue-400">
                  {topUp.status}
                </span>
              </div>
            </div>

            
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </p>
        </div>
      )}
    </section>
  );
}