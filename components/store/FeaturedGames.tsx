import { getFeaturedGames } from "@/lib/database/queries/home";

import { GameCard } from "./GameCard";

export async function FeaturedGames() {
  const games = await getFeaturedGames();

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">
        Featured Games
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <GameCard
            key={game.id}
            {...game}
          />
        ))}
      </div>
    </section>
  );
}