import { LibraryCard } from "./LibraryCard";

interface Props {
  games: Array<{
    id: string;
    gameId: string;
    title: string;
    developer: string;
    headerUrl: string | null;
    purchasedAt: Date;
    playTimeMinutes: number;
  }>;
}

export function LibraryGrid({
  games,
}: Props) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {games.map((game, index) => (
      <div
      key={game.id}
      className="animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{
        animationDelay: `${index * 40}ms`,
      }}
    >
      <LibraryCard game={game} />
    </div>
      ))}
    </section>
  );
}