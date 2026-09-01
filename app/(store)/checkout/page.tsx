import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth/current-user";
import { getCartPage } from "@/lib/database/queries/cart";

import { CheckoutItem } from "@/components/checkout/CheckoutItem";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";

export default async function CheckoutPage() {
  const userId = await getCurrentUserId();

  const cart = await getCartPage(userId);

  if (cart.itemCount === 0) {
    redirect("/cart");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="space-y-5 lg:col-span-2">
          {cart.items.map((item) => (
            <CheckoutItem
              key={item.itemId}
              item={item}
            />
          ))}
        </section>

        <CheckoutSummary
          itemCount={cart.itemCount}
          total={cart.total}
        />
      </div>
    </main>
  );
}