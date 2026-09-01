import { getCurrentUserId } from "@/lib/auth/current-user";

import { getCartPage } from "@/lib/database/queries/cart";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

export default async function CartPage() {
  const userId = await getCurrentUserId();

  const cart = await getCartPage(userId);

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <EmptyCart />
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-3">
      <section className="space-y-6 lg:col-span-2">
        <h1 className="text-4xl font-bold">
          Shopping Cart
        </h1>

        {cart.items.map((item) => (
          <CartItem
            key={item.itemId}
            item={item}
          />
        ))}
      </section>

      <CartSummary
        itemCount={cart.itemCount}
        total={cart.total}
      />
    </main>
  );
}