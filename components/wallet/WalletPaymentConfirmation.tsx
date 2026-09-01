"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { confirmQrisPayment } from "@/lib/actions/wallet";

interface WalletPaymentConfirmationProps {
  paymentToken: string;
}

export function WalletPaymentConfirmation({
  paymentToken,
}: WalletPaymentConfirmationProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleConfirmPayment() {
    setError(null);
    setLoading(true);

    try {
      await confirmQrisPayment(paymentToken);

      router.refresh();
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

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleConfirmPayment}
        disabled={loading}
        className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Processing payment..."
          : "Confirm Payment"}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}