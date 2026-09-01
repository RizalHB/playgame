import { notFound } from "next/navigation";

import { AboutGame } from "@/components/game/AboutGame";
import { FeaturedMedia } from "@/components/game/FeaturedMedia";
import { GameHero } from "@/components/game/GameHero";
import { GameMetadata } from "@/components/game/GameMetadata";
import { GamePageExperience } from "@/components/game/GamePageExperience";
import { RelatedGames } from "@/components/game/RelatedGames";
import { SystemRequirements } from "@/components/game/SystemRequirements";
import { DlcList } from "@/components/game/DlcList";
import { ReviewList } from "@/components/game/reviews/ReviewList";
import { ReviewSummary } from "@/components/game/reviews/ReviewSummary";

import { getCurrentSession } from "@/lib/auth/session";

import { getGameDetails } from "@/lib/database/queries/game-details";
import { getGameMetadata } from "@/lib/database/queries/game-metadata";
import { getGameState } from "@/lib/database/queries/game-state";

import {
  getGameDlcs,
  getUserGameDlcs,
} from "@/lib/database/queries/dlcs";

import {
  getGameReviews,
  getReviewSummary,
  getUserGameReview,
} from "@/lib/database/queries/reviews";

import { getRelatedGames } from "@/lib/database/queries/related-games";

import { releaseDueScheduledGames } from "@/lib/services/games/game-lifecycle";

interface GamePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GamePage({
  params,
}: GamePageProps) {
  const { id } = await params;

  /*
   * Release any scheduled games whose
   * release date has arrived.
   *
   * This keeps the storefront functional
   * without requiring an external cron service
   * for this simulation project.
   */
  await releaseDueScheduledGames();

  const data = await getGameDetails(id);

  if (!data) {
    notFound();
  }

  const session = await getCurrentSession();

  const [
    dlcs,
    userDlcs,
    gameState,
    metadata,
    relatedGames,
    reviewSummary,
    reviews,
    userReview,
  ] = await Promise.all([
    getGameDlcs(id),

    session
      ? getUserGameDlcs(
          session.userId,
          id,
        )
      : Promise.resolve([]),

    session
      ? getGameState(
          session.userId,
          id,
        )
      : Promise.resolve(null),

    getGameMetadata(id),

    getRelatedGames(id),

    getReviewSummary(id),

    getGameReviews(
      id,
      session?.userId,
    ),

    session
      ? getUserGameReview(
          session.userId,
          id,
        )
      : Promise.resolve(null),
  ]);

  if (!metadata) {
    notFound();
  }

  return (
    <GamePageExperience
      gameId={id}
      media={data.media}
    >
      <main className="space-y-20 pb-24">
        <section
          id="hero"
          aria-labelledby="game-hero-heading"
          className="scroll-mt-28"
        >
          <GameHero
            game={data.game}
            developer={data.developer}
            media={data.media}
            gameState={gameState}
          />
        </section>

        <section
          id="about"
          aria-labelledby="about-game-heading"
          className="scroll-mt-28"
        >
          <AboutGame
            description={
              data.game.description
            }
          />
        </section>

        <section
          id="media"
          aria-labelledby="featured-media-heading"
          className="scroll-mt-28"
        >
          <FeaturedMedia
            media={data.media}
          />
        </section>

        {dlcs.length > 0 && (
          <section
            id="dlc"
            aria-labelledby="dlc-heading"
            className="scroll-mt-28"
          >
            <DlcList
              dlcs={dlcs}
              userDlcs={userDlcs}
            />
          </section>
        )}

        <section
          id="details"
          aria-labelledby="game-details-heading"
          className="scroll-mt-28"
        >
          <GameMetadata
            metadata={metadata}
          />
        </section>

        <section
          id="requirements"
          aria-labelledby="requirements-heading"
          className="scroll-mt-28"
        >
          <SystemRequirements
            requirements={
              data.requirements
            }
          />
        </section>

        <section
          id="reviews"
          aria-labelledby="reviews-heading"
          className="scroll-mt-28 space-y-10"
        >
          <ReviewSummary
            summary={reviewSummary}
          />

          <ReviewList
            gameId={id}
            reviews={reviews}
            userReview={userReview}
            owned={
              gameState?.ownership
                .owned ?? false
            }
          />
        </section>

        {relatedGames.length > 0 && (
          <section
            id="related"
            aria-labelledby="related-games-heading"
            className="scroll-mt-28"
          >
            <RelatedGames
              games={relatedGames}
            />
          </section>
        )}
      </main>
    </GamePageExperience>
  );
}