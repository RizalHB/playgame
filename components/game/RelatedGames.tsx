import { GameCard } from "@/components/store/GameCard";

interface RelatedGamesProps {
  games: {
    id: string;
    title: string;
    basePrice: number;
    headerUrl: string;
  }[];
}

export function RelatedGames({
  games,
}: RelatedGamesProps) {
  if (!games.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">
          More Like This
        </h2>

        <p className="mt-2 text-zinc-400">
          Discover more games you might enjoy.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.title}
            basePrice={game.basePrice}
            headerUrl={game.headerUrl}
          />
        ))}
      </div>
    </section>
  );
}