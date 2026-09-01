import { getUpcomingPreorderGames } from "@/lib/database/queries/home";

import { GameCard } from "./GameCard";

export async function UpcomingPreorders() {
  const games =
    await getUpcomingPreorderGames();

  if (games.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">
          Coming Soon
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Pre-order upcoming games before
          their release.
        </p>
      </div>

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