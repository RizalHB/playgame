import type { InstallationStatus } from "@/lib/types/installation";

import { HeroBanner } from "./HeroBanner";
import { HeroInfo } from "./HeroInfo";
import { PurchaseCard } from "./PurchaseCard";

interface GameHeroProps {
  game: {
    id: string;
    title: string;
    description: string | null;
    shortDescription: string | null;
    releaseDate: Date | null;
    basePrice: number;
    developerId: string;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
    isPreOrder: boolean;
  };

  developer?: {
    studioName: string;
  } | null;

  media: Array<{
    type: string;
    url: string;
  }>;

  gameState: {
    ownership: {
      owned: boolean;
      purchasedAt: Date | null;
      playTimeMinutes: number;
      installed: boolean;
      favorite: boolean;
      hidden: boolean;
    };

    installation: {
      installed: boolean;
      status: InstallationStatus;
      installPath: string | null;
      installedVersion: string | null;
      launcherVersion: string | null;
      installSizeBytes: number;
      installedAt: Date | null;
      lastPlayedAt: Date | null;
      progress: number;
      downloadSpeedMbps: number;
      remainingSeconds: number;
      currentOperation: string;
      playing: boolean;
    };
  } | null;
}

export function GameHero({
  game,
  developer,
  media,
  gameState,
}: GameHeroProps) {
  const banner = media.find(
    (m) => m.type === "banner"
  );

  const header = media.find(
    (m) => m.type === "header"
  );

  return (
    <section className="space-y-10">
      {banner && (
        <HeroBanner
          title={game.title}
          bannerUrl={banner.url}
        />
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <HeroInfo
          title={game.title}
          developer={developer?.studioName ?? ""}
          description={game.shortDescription}
          headerUrl={header?.url ?? ""}
          releaseDate={game.releaseDate}
        />

        <PurchaseCard
          gameId={game.id}
          price={game.basePrice}
          gameState={gameState}
        />
      </div>
    </section>
  );
}