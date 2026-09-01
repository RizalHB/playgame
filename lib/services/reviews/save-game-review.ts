import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";
import {
  libraries,
  reviews,
} from "@/lib/database/schema";

interface SaveGameReviewInput {
  userId: string;
  gameId: string;
  recommended: boolean;
  title: string | null;
  review: string;
}

export async function saveGameReview({
  userId,
  gameId,
  recommended,
  title,
  review,
}: SaveGameReviewInput) {
  const cleanedReview =
    review.trim();

  const cleanedTitle =
    title?.trim() || null;

  if (!cleanedReview) {
    throw new Error(
      "Review cannot be empty."
    );
  }

  if (cleanedReview.length > 5000) {
    throw new Error(
      "Review is too long."
    );
  }

  if (
    cleanedTitle &&
    cleanedTitle.length > 120
  ) {
    throw new Error(
      "Review title is too long."
    );
  }

  return db.transaction(async (tx) => {
    /*
     * 1. Verify ownership.
     *
     * A user may only review a game
     * that exists in their library.
     */
    const libraryEntry =
      await tx.query.libraries.findFirst({
        where: and(
          eq(
            libraries.userId,
            userId
          ),
          eq(
            libraries.gameId,
            gameId
          )
        ),
      });

    if (!libraryEntry) {
      throw new Error(
        "You must own this game before reviewing it."
      );
    }

    /*
     * 2. Check whether this user already
     * has a review for this game.
     */
    const existingReview =
      await tx.query.reviews.findFirst({
        where: and(
          eq(
            reviews.userId,
            userId
          ),
          eq(
            reviews.gameId,
            gameId
          )
        ),
      });

    /*
     * 3. Create the first review.
     */
    if (!existingReview) {
      const now =
        new Date();

      const [
        createdReview,
      ] = await tx
        .insert(reviews)
        .values({
          id:
            crypto.randomUUID(),

          gameId,

          userId,

          recommended,

          title:
            cleanedTitle,

          review:
            cleanedReview,

          hoursPlayed:
            libraryEntry.playTimeMinutes /
            60,

          createdAt: now,

          updatedAt: now,
        })
        .returning();

      return {
        success: true,
        action: "created" as const,
        review:
          createdReview,
      };
    }

    /*
     * 4. Update the existing review.
     *
     * We deliberately keep the original
     * createdAt and only update the mutable
     * review fields.
     */
    const now =
      new Date();

    const [
      updatedReview,
    ] = await tx
      .update(reviews)
      .set({
        recommended,

        title:
          cleanedTitle,

        review:
          cleanedReview,

        hoursPlayed:
          libraryEntry.playTimeMinutes /
          60,

        updatedAt:
          now,
      })
      .where(
        and(
          eq(
            reviews.id,
            existingReview.id
          ),
          eq(
            reviews.userId,
            userId
          ),
          eq(
            reviews.gameId,
            gameId
          )
        )
      )
      .returning();

    if (!updatedReview) {
      throw new Error(
        "Review could not be updated."
      );
    }

    return {
      success: true,
      action: "updated" as const,
      review:
        updatedReview,
    };
  });
}