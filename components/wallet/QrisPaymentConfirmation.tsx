"use client";

import { useState } from "react";
import Link from "next/link";

import { confirmQrisPayment } from "@/lib/actions/wallet";

interface QrisPaymentConfirmationProps {
  paymentToken: string;
  amount: number;
  currency: string;
  transactionReference: string;
  status: string;
}

export function QrisPaymentConfirmation({
  paymentToken,
  amount,
  currency,
  transactionReference,
  status: initialStatus,
}: QrisPaymentConfirmationProps) {
  const [status, setStatus] =
    useState(initialStatus);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [completedBalance, setCompletedBalance] =
    useState<number | null>(null);

  async function handleConfirmPayment() {
    setError(null);
    setLoading(true);

    try {
      const result =
        await confirmQrisPayment(
          paymentToken,
        );

      setStatus("completed");

      if ("balance" in result) {
        setCompletedBalance(
          result.balance,
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete payment.",
      );
    } finally {
      setLoading(false);
    }
  }

  const isCompleted =
    status === "completed";

  return (
    <section className="space-y-6 rounded-2xl border p-6">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border">
          <span className="text-xl font-bold">
            QRIS
          </span>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          PlayGame QRIS Simulator
        </p>

        <p className="mt-2 text-4xl font-bold">
          Rp {amount.toLocaleString("id-ID")}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {currency}
        </p>
      </div>

      <div className="rounded-xl bg-muted p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">
            Reference
          </span>

          <span className="font-medium text-right">
            {transactionReference}
          </span>
        </div>

        <div className="mt-3 flex justify-between gap-4">
          <span className="text-muted-foreground">
            Status
          </span>

          <span className="font-medium">
            {status}
          </span>
        </div>
      </div>

      {isCompleted ? (
        <div className="rounded-xl border p-5 text-center">
          <p className="text-lg font-semibold">
            Payment successful
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Your PlayGame wallet has been credited.
          </p>

          {completedBalance !== null && (
            <p className="mt-4 text-2xl font-bold">
              Rp{" "}
              {completedBalance.toLocaleString(
                "id-ID",
              )}
            </p>
          )}

          <Link
            href="/wallet"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Return to wallet
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-dashed p-5 text-center">
            <p className="font-medium">
              Simulated payment
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              This is a fictional QRIS payment flow
              for the PlayGame prototype.
            </p>
          </div>

          <button
            type="button"
            disabled={
              loading ||
              status !== "pending"
            }
            onClick={
              handleConfirmPayment
            }
            className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading
              ? "Confirming payment..."
              : "Confirm QRIS Payment"}
          </button>
        </>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
    </section>
  );
}