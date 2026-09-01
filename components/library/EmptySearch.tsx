import { Search } from "lucide-react";

interface Props {
  query: string;
}

export function EmptySearch({
  query,
}: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-20 text-center">

      <div className="rounded-full bg-zinc-800 p-6">
        <Search
          className="text-zinc-400"
          size={40}
        />
      </div>

      <h2 className="mt-8 text-2xl font-bold">
        No games found
      </h2>

      <p className="mt-3 text-zinc-400">
        No games match{" "}
        <span className="font-semibold text-white">
          "{query}"
        </span>
      </p>

      <p className="mt-2 text-sm text-zinc-500">
        Try searching by another
        title or developer.
      </p>

    </div>
  );
}