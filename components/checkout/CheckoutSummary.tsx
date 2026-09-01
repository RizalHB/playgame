import { CheckoutButton } from "./CheckoutButton";
interface CheckoutSummaryProps {
  itemCount: number;
  total: number;
}

export function CheckoutSummary({
  itemCount,
  total,
}: CheckoutSummaryProps) {
  return (
    <aside className="sticky top-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold">
        Order Summary
      </h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span>Games</span>

          <span>{itemCount}</span>
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>

          <span>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(total)}
          </span>
        </div>
      </div>

      
      <CheckoutButton />
    </aside>
  );
}