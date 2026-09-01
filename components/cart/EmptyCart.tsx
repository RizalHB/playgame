import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-20 text-center">
      <h2 className="text-3xl font-bold">
        Your cart is empty
      </h2>

      <p className="mt-3 text-zinc-400">
        Browse the store and add some games.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
      >
        Browse Store
      </Link>
    </div>
  );
}