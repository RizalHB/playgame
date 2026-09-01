import Link from "next/link";
interface CartSummaryProps {
  itemCount: number;
  total: number;
}

export function CartSummary({
  itemCount,
  total,
}: CartSummaryProps) {
  return (
    <aside className="sticky top-24 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-bold">
        Summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-zinc-400">
          <span>Items</span>

          <span>{itemCount}</span>
        </div>

        <div className="flex justify-between text-xl font-semibold">
          <span>Estimated Total</span>

          <span>
            {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(total)}
          </span>
        </div>
      </div>

        <Link
    href="/checkout"
    className="
      mt-8
      block
      w-full
      rounded-lg
      bg-green-600
      px-5
      py-3
      text-center
      font-semibold
      transition
      hover:bg-green-700
      focus:outline-none
      focus:ring-2
      focus:ring-green-400
    "
  >
    Continue to Checkout
  </Link>

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        Taxes will be calculated during checkout.
      </p>
    </aside>
  );
}