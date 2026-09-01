import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export function LibraryEmpty() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-20 text-center">

      <div className="rounded-full bg-zinc-800 p-6">
        <Gamepad2
          size={44}
          className="text-zinc-400"
        />
      </div>

      <h2 className="mt-8 text-3xl font-bold">
        Your Library is Empty
      </h2>

      <p className="mt-4 max-w-md text-zinc-400">
        Purchase your first game to start
        building your collection.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold transition hover:bg-blue-500"
      >
        Browse Store
      </Link>

    </div>
  );
}