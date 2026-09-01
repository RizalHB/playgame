import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { getCurrentUserId } from "@/lib/auth/current-user";
import { getOrderDetails } from "@/lib/database/queries/order-details";

interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function SuccessPage({
  params,
}: Props) {
  const { orderNumber } =
    await params;

  const userId =
    await getCurrentUserId();

  const data =
    await getOrderDetails(
      orderNumber,
      userId
    );

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10">

        <div className="flex flex-col items-center text-center">

          <CheckCircle2
            className="text-green-500"
            size={80}
          />

          <h1 className="mt-6 text-4xl font-bold">
            Purchase Complete
          </h1>

          <p className="mt-3 text-zinc-400">
            Thank you for your purchase.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Order #{data.order.orderNumber}
          </p>

        </div>

        <div className="mt-12 space-y-5">

          {data.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <Image
                src={
                  item.headerUrl ??
                  "https://placehold.co/460x215?text=Game"
                }
                alt={item.gameTitle}
                width={220}
                height={100}
                className="rounded-lg"
              />

              <div className="flex-1">

                <h2 className="text-lg font-semibold">
                  {item.gameTitle}
                </h2>

                <p className="mt-2 text-green-400">
                  Added to your Library
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(item.finalPrice)}
              </p>
              </div>
            </div>
          ))}

        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          <Link
            href="/library"
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold transition hover:bg-blue-700"
          >
            Go to Library
          </Link>

          <Link
            href="/"
            className="flex-1 rounded-lg border border-zinc-700 px-6 py-3 text-center transition hover:bg-zinc-800"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </main>
  );
}