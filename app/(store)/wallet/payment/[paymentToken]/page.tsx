import Link from "next/link";

import { getWalletTopUpByPaymentToken } from "@/lib/database/queries/wallet-payment";
import { generateWalletPaymentQr } from "@/lib/services/wallet/generate-wallet-payment-qr";
import { WalletPaymentConfirmation } from "@/components/wallet/WalletPaymentConfirmation";
import { WalletPaymentExpiryRefresh } from "@/components/wallet/WalletPaymentExpiryRefresh";
interface WalletPaymentPageProps {
  params: Promise<{
    paymentToken: string;
  }>;
}

export default async function WalletPaymentPage({
  params,
}: WalletPaymentPageProps) {
  const { paymentToken } = await params;

  if (!paymentToken) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <section className="rounded-xl border p-6">
          <h1 className="text-2xl font-bold">
            Invalid payment session
          </h1>

          <p className="mt-2 text-muted-foreground">
            The payment token is missing.
          </p>
        </section>
      </main>
    );
  }

  const payment =
    await getWalletTopUpByPaymentToken(
      paymentToken,
    );

  if (!payment) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <section className="rounded-xl border p-6">
          <h1 className="text-2xl font-bold">
            Payment session not found
          </h1>

          <p className="mt-2 text-muted-foreground">
            This QRIS payment session does not
            exist or is no longer available.
          </p>

          <Link
            href="/wallet"
            className="mt-6 inline-block rounded-lg bg-black px-4 py-3 text-sm font-medium text-white"
          >
            Back to wallet
          </Link>
        </section>
      </main>
    );
  }

  const { topUp, wallet } = payment;

  const qr =
    await generateWalletPaymentQr(
      topUp.paymentToken,
    );

  if (topUp.status === "completed") {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <section className="rounded-xl border p-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
              ✓
            </div>

            <h1 className="mt-4 text-2xl font-bold">
              Payment Successful
            </h1>

            <p className="mt-2 text-muted-foreground">
              Your PlayGame wallet has been
              credited successfully.
            </p>
          </div>

          <div className="mt-6 space-y-4 rounded-lg bg-muted p-4">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Merchant
              </span>

              <span className="font-medium">
                PlayGame
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Amount
              </span>

              <span className="font-semibold">
                Rp{" "}
                {topUp.amount.toLocaleString(
                  "id-ID",
                )}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Reference
              </span>

              <span className="break-all text-right font-mono text-sm">
                {topUp.transactionReference}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Completed
              </span>

              <span className="text-right text-sm">
                {topUp.completedAt
                  ? topUp.completedAt.toLocaleString(
                      "id-ID",
                    )
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t pt-4">
              <span className="font-medium">
                Wallet balance
              </span>

              <span className="font-bold">
                Rp{" "}
                {wallet.balance.toLocaleString(
                  "id-ID",
                )}
              </span>
            </div>
          </div>

          <Link
            href="/wallet"
            className="mt-6 block rounded-lg bg-black px-4 py-3 text-center text-sm font-medium text-white"
          >
            Return to wallet
          </Link>
        </section>
      </main>
    );
  }
  if (
      topUp.status === "pending" &&
      topUp.expiresAt &&
      topUp.expiresAt.getTime() <= Date.now()
    ) {
      return (
        <main className="mx-auto max-w-xl px-6 py-12">
          <section className="rounded-xl border p-6">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-700">
                !
              </div>

              <h1 className="mt-4 text-2xl font-bold">
                Payment Session Expired
              </h1>

              <p className="mt-2 text-muted-foreground">
                This QRIS payment session expired after
                30 seconds.
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-muted p-4 text-sm">
              <p>
                <span className="font-medium">
                  Merchant:
                </span>{" "}
                PlayGame
              </p>

              <p className="mt-2">
                <span className="font-medium">
                  Amount:
                </span>{" "}
                Rp{" "}
                {topUp.amount.toLocaleString(
                  "id-ID",
                )}
              </p>

              <p className="mt-2 break-all">
                <span className="font-medium">
                  Reference:
                </span>{" "}
                {topUp.transactionReference}
              </p>

              <p className="mt-2">
                <span className="font-medium">
                  Status:
                </span>{" "}
                Expired
              </p>
            </div>

            <Link
              href="/wallet"
              className="mt-6 block rounded-lg bg-black px-4 py-3 text-center text-sm font-medium text-white"
            >
              Create new payment
            </Link>
          </section>
        </main>
      );
    }
  if (topUp.status !== "pending") {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <section className="rounded-xl border p-6">
          <h1 className="text-2xl font-bold">
            Payment unavailable
          </h1>

          <p className="mt-2 text-muted-foreground">
            This payment cannot currently be
            completed.
          </p>

          <div className="mt-6 rounded-lg bg-muted p-4 text-sm">
            <p>
              <span className="font-medium">
                Status:
              </span>{" "}
              {topUp.status}
            </p>

            <p className="mt-2 break-all">
              <span className="font-medium">
                Reference:
              </span>{" "}
              {topUp.transactionReference}
            </p>
          </div>

          <Link
            href="/wallet"
            className="mt-6 inline-block rounded-lg bg-black px-4 py-3 text-sm font-medium text-white"
          >
            Back to wallet
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <section className="rounded-xl border p-6">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            QRIS PAYMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            PlayGame
          </h1>

          <p className="mt-3 text-muted-foreground">
            Click Confirm Payment to proceed payment.
          </p>

          <p className="mt-6 text-3xl font-bold">
            Rp{" "}
            {topUp.amount.toLocaleString(
              "id-ID",
            )}
          </p>
        </div>

       

        <div className="mt-6 space-y-3 rounded-lg bg-muted p-4 text-sm">
          <div>
            <p className="text-muted-foreground">
              Payment status
            </p>

            <p className="mt-1 font-semibold">
              Pending payment
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              QRIS reference
            </p>

            <p className="mt-1 break-all font-mono">
              {topUp.transactionReference}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">
              Payment method
            </p>

            <p className="mt-1 font-medium">
              QRIS
            </p>
          </div>
        </div>
        <WalletPaymentConfirmation
          paymentToken={paymentToken}
        />
        <WalletPaymentExpiryRefresh
        expiresAt={
          topUp.expiresAt
            ? topUp.expiresAt.getTime()
            : null
        }
      />

        <Link
          href="/wallet"
          className="mt-4 block text-center text-sm text-muted-foreground underline"
        >
          Cancel and return to wallet
        </Link>
      </section>
    </main>
  );
}