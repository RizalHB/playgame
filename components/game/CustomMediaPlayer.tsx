import { notFound } from "next/navigation";

import { AboutGame } from "@/components/game/AboutGame";
import { DlcList } from "@/components/game/DlcList";
import { FeaturedMedia } from "@/components/game/FeaturedMedia";
import { GameHero } from "@/components/game/GameHero";
import { GameMetadata } from "@/components/game/GameMetadata";
import { GamePageExperience } from "@/components/game/GamePageExperience";
import { RelatedGames } from "@/components/game/RelatedGames";
import { SystemRequirements } from "@/components/game/SystemRequirements";

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
   * ---------------------------------------------------------
   * GAME
   * ---------------------------------------------------------
   */

  const data = await getGameDetails(id);

  if (!data) {
    notFound();
  }

  /*
   * ---------------------------------------------------------
   * SESSION
   * ---------------------------------------------------------
   */

  const session =
    await getCurrentSession();

  /*
   * ---------------------------------------------------------
   * PAGE DATA
   *
   * Independent queries run in parallel.
   * ---------------------------------------------------------
   */

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

  /*
   * Game metadata is required for this page.
   */

  if (!metadata) {
    notFound();
  }

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <GamePageExperience
      gameId={id}
      media={data.media}
    >
      <main className="space-y-20 pb-24">
        {/* =================================================
            1. GAME HERO
        ================================================= */}

        <section
          id="hero"
          className="scroll-mt-28"
        >
          <GameHero
            game={data.game}
            developer={data.developer}
            media={data.media}
            gameState={gameState}
          />
        </section>

        {/* =================================================
            2. FEATURED MEDIA
               
               Trailer and screenshots are intentionally
               combined into one Steam-style media area.
        ================================================= */}

        <section
          id="media"
          className="scroll-mt-28"
        >
          <FeaturedMedia
            media={data.media}
          />
        </section>

        {/* =================================================
            3. ABOUT THIS GAME
        ================================================= */}

        <section
          id="about"
          className="scroll-mt-28"
        >
          <AboutGame
            description={
              data.game.description
            }
          />
        </section>

        {/* =================================================
            4. DLC
               
               Don't render an empty DLC section.
        ================================================= */}

        {dlcs.length > 0 && (
          <section
            id="dlc"
            className="scroll-mt-28"
          >
            <DlcList
              dlcs={dlcs}
              userDlcs={userDlcs}
            />
          </section>
        )}

        {/* =================================================
            5. GAME DETAILS
        ================================================= */}

        <section
          id="details"
          className="scroll-mt-28"
        >
          <GameMetadata
            metadata={metadata}
          />
        </section>

        {/* =================================================
            6. SYSTEM REQUIREMENTS
        ================================================= */}

        <section
          id="requirements"
          className="scroll-mt-28"
        >
          <SystemRequirements
            requirements={
              data.requirements
            }
          />
        </section>

        {/* =================================================
            7. REVIEWS
        ================================================= */}

        <section
          id="reviews"
          className="
            scroll-mt-28
            space-y-10
          "
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

        {/* =================================================
            8. RELATED GAMES
               
               Don't render an empty section.
        ================================================= */}

        {relatedGames.length > 0 && (
          <section
            id="related"
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
