import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth/session";
import {
  getCurrentWallet,
  getCurrentWalletTransactions,
} from "@/lib/database/queries/wallet";

import { WalletTopUp } from "@/components/wallet/WalletTopUp";

export default async function WalletPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?next=/wallet");
  }

  const wallet = await getCurrentWallet();
  const transactions =
    await getCurrentWalletTransactions();

  if (!wallet) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="rounded-2xl border p-8">
          <h1 className="text-2xl font-bold">
            Wallet
          </h1>

          <p className="mt-2 text-muted-foreground">
            Your wallet is not available yet.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header>
        <p className="text-sm font-medium text-muted-foreground">
          PlayGame Account
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Wallet
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your PlayGame balance and simulated payments.
        </p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Available balance
              </p>

              <p className="mt-3 text-4xl font-bold tracking-tight">
                Rp{" "}
                {wallet.balance.toLocaleString("id-ID")}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {wallet.currency}
              </p>
            </div>

            <div className="rounded-xl bg-muted px-3 py-2 text-xs font-medium">
              {wallet.status}
            </div>
          </div>
        </div>

        <WalletTopUp />
      </section>

      <section className="mt-10">
        <div>
          <h2 className="text-xl font-semibold">
            Transaction history
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your latest wallet activity.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed p-8 text-center">
            <p className="font-medium">
              No wallet transactions yet.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your completed wallet activity will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border">
            <div className="divide-y">
              {transactions.map((transaction) => {
                const isCredit = transaction.amount >= 0;

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 p-5 transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {transaction.description ??
                          transaction.type}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Balance after:  
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                         Rp{" "}
                          {transaction.balanceAfter.toLocaleString("id-ID")}
                        </span>
                      </p>

                 <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  {new Date(transaction.createdAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
                    </div>

                    <p
                      className={`shrink-0 font-semibold ${
                        isCredit
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {isCredit ? "+" : "-"}Rp{" "}
                      {Math.abs(
                        transaction.amount,
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}