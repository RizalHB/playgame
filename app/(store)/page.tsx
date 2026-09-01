import { FeaturedGames } from "@/components/store/FeaturedGames";
import { Hero } from "@/components/store/Hero";
import { UpcomingPreorders } from "@/components/store/UpcomingPreorders";

export default function HomePage() {
  return (
    <main className="space-y-12">
      <Hero />

      <FeaturedGames />

      <UpcomingPreorders />
    </main>
  );
}