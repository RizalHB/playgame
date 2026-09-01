"use client";

import Link from "next/link";
import Image from "next/image";

import { Play } from "lucide-react";

interface LibraryCardProps {
  game: {
    gameId: string;

    title: string;

    developer: string;

    headerUrl: string | null;

    purchasedAt: Date;

    playTimeMinutes: number;
  };
}

export function LibraryCard({
  game,
}: LibraryCardProps) {
  const hours =
    (
      game.playTimeMinutes / 60
    ).toFixed(1);

  return (
    <Link
      href={`/game/${game.gameId}`}
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-zinc-700
        hover:shadow-2xl
        hover:shadow-black/30
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500
        "
    >
      <div className="relative aspect-video overflow-hidden">

        <Image
          src={
            game.headerUrl ??
            "https://placehold.co/460x215"
          }
          alt={game.title}
          fill
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-[1.03]
            "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-70 transition group-hover:opacity-90" />

      </div>

      <div className="space-y-4 p-5">

        <div>

          <h2 className="line-clamp-1 text-lg font-bold">
            {game.title}
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {game.developer}
          </p>

        </div>

        <div className="border-t border-zinc-800 pt-4 text-sm text-zinc-500">

          <div className="flex justify-between">

            <span>Play Time</span>

            <span>

              {hours} hrs

            </span>

          </div>

          <div className="mt-2 flex justify-between">

          <span>Purchased</span>

          <span>
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            }).format(game.purchasedAt)}
          </span>

        </div>

        </div>

        <button
  className="
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl

    bg-gradient-to-b
    from-green-500
    to-green-700

    px-4
    py-3

    font-semibold
    text-white

    shadow-lg
    shadow-green-900/40

    transition-all
    duration-200

    hover:-translate-y-0.5
    hover:from-green-400
    hover:to-green-600
    hover:shadow-green-500/30

    active:translate-y-0
    active:scale-[0.98]

    focus:outline-none
    focus:ring-2
    focus:ring-green-400
  "
>
  

  View Game on Store
</button>
      </div>
    </Link>
  );
}