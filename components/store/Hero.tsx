import Image from "next/image";

import { getHeroGame } from "@/lib/database/queries/home";

import { HeroActions } from "./HeroActions";

export async function Hero() {
  const game = await getHeroGame();

  if (!game) return null;

  return (
    <section className="relative overflow-hidden rounded-xl">
      <Image
        src={game.bannerUrl}
        alt={game.title}
        width={1280}
        height={720}
        className="h-[420px] w-full object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

      <div className="absolute left-10 top-10 max-w-xl text-white">
        <p className="text-blue-400 font-semibold">
          {game.developer}
        </p>

        <h1 className="mt-2 text-5xl font-bold">
          {game.title}
        </h1>

        <p className="mt-4 text-zinc-300">
          {game.shortDescription}
        </p>

        <p className="mt-6 text-3xl font-bold">
          {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(game.basePrice)}
        </p>

        <HeroActions gameId={game.id} />
      </div>
    </section>
  );
}