"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/lib/auth/current-user";
import { db } from "@/lib/database/database";
import {
  gameSessions,
  libraries,
  reviews,
} from "@/lib/database/schema";

const MIN_REVIEW_LENGTH = 10;
const MAX_REVIEW_LENGTH = 5000;
const MAX_TITLE_LENGTH = 120;

function validateReviewInput(input: {
  recommended: boolean;
  title?: string | null;
  review: string;
}) {
  if (
    typeof input.recommended !==
    "boolean"
  ) {
    throw new Error(
      "Recommendation is required.",
    );
  }

  const reviewText =
    input.review.trim();

  if (
    reviewText.length <
    MIN_REVIEW_LENGTH
  ) {
    throw new Error(
      `Review must be at least ${MIN_REVIEW_LENGTH} characters.`,
    );
  }

  if (
    reviewText.length >
    MAX_REVIEW_LENGTH
  ) {
    throw new Error(
      `Review must not exceed ${MAX_REVIEW_LENGTH} characters.`,
    );
  }

  const title =
    input.title?.trim() || null;

  if (
    title &&
    title.length >
      MAX_TITLE_LENGTH
  ) {
    throw new Error(
      `Review title must not exceed ${MAX_TITLE_LENGTH} characters.`,
    );
  }

  return {
    recommended:
      input.recommended,

    title,

    review:
      reviewText,
  };
}

async function getOwnedGamePlaytime(
  tx: Parameters<
    Parameters<
      typeof db.transaction
    >[0]
  >[0],
  userId: string,
  gameId: string,
) {
  const [ownership] =
    await tx
      .select({
        libraryId:
          libraries.id,
      })
      .from(libraries)
      .where(
        and(
          eq(
            libraries.userId,
            userId,
          ),
          eq(
            libraries.gameId,
            gameId,
          ),
        ),
      )
      .limit(1);

  if (!ownership) {
    throw new Error(
      "You must own this game before reviewing it.",
    );
  }

  const [result] =
    await tx
      .select({
        totalMinutes:
          sql<number>`
            COALESCE(
              SUM(
                ${gameSessions.playTimeMinutes}
              ),
              0
            )
          `,
      })
      .from(gameSessions)
      .where(
        and(
          eq(
            gameSessions.userId,
            userId,
          ),
          eq(
            gameSessions.gameId,
            gameId,
          ),
        ),
      );

  return Number(
    result?.totalMinutes ?? 0,
  );
}

export async function createReview(input: {
  gameId: string;
  recommended: boolean;
  title?: string | null;
  review: string;
}) {
  const userId =
    await getCurrentUserId();

  const validated =
    validateReviewInput(input);

  const result =
    await db.transaction(async (tx) => {
      /*
       * Ownership is checked from the
       * library, never from the client.
       */
      const hoursPlayed =
        await getOwnedGamePlaytime(
          tx,
          userId,
          input.gameId,
        );

      /*
       * The UNIQUE(userId, gameId)
       * constraint remains the final
       * database-level protection.
       */
      const existing =
        await tx.query.reviews.findFirst({
          where: and(
            eq(
              reviews.userId,
              userId,
            ),
            eq(
              reviews.gameId,
              input.gameId,
            ),
          ),
        });

      if (existing) {
        throw new Error(
          "You have already reviewed this game.",
        );
      }

      const reviewId =
        crypto.randomUUID();

      const now =
        new Date();

      const [
        createdReview,
      ] = await tx
        .insert(reviews)
        .values({
          id: reviewId,

          gameId:
            input.gameId,

          userId,

          recommended:
            validated.recommended,

          title:
            validated.title,

          review:
            validated.review,

          hoursPlayed,

          createdAt: now,

          updatedAt: now,
        })
        .returning();

      return createdReview;
    });

  revalidatePath(
    `/game/${input.gameId}`,
  );

  return {
    success: true,
    review: result,
  };
}

export async function updateReview(input: {
  reviewId: string;
  recommended: boolean;
  title?: string | null;
  review: string;
}) {
  const userId =
    await getCurrentUserId();

  const validated =
    validateReviewInput(input);

  const result =
    await db.transaction(async (tx) => {
      /*
       * First locate the review by both
       * review ID and authenticated user.
       *
       * This prevents editing another
       * user's review.
       */
      const existing =
        await tx.query.reviews.findFirst({
          where: and(
            eq(
              reviews.id,
              input.reviewId,
            ),
            eq(
              reviews.userId,
              userId,
            ),
          ),
        });

      if (!existing) {
        throw new Error(
          "Review not found or you are not allowed to edit it.",
        );
      }

      /*
       * Re-check ownership instead of
       * trusting the original review.
       */
      const hoursPlayed =
        await getOwnedGamePlaytime(
          tx,
          userId,
          existing.gameId,
        );

      const now =
        new Date();

      const [
        updatedReview,
      ] = await tx
        .update(reviews)
        .set({
          recommended:
            validated.recommended,

          title:
            validated.title,

          review:
            validated.review,

          hoursPlayed,

          updatedAt:
            now,
        })
        .where(
          and(
            eq(
              reviews.id,
              input.reviewId,
            ),
            eq(
              reviews.userId,
              userId,
            ),
          ),
        )
        .returning();

      if (!updatedReview) {
        throw new Error(
          "Review could not be updated.",
        );
      }

      return updatedReview;
    });

  revalidatePath(
    `/game/${result.gameId}`,
  );

  return {
    success: true,
    review: result,
  };
}

export async function deleteReview(
  reviewId: string,
) {
  const userId =
    await getCurrentUserId();

  const deleted =
    await db.transaction(async (tx) => {
      /*
       * Ownership is part of the DELETE
       * condition itself.
       */
      const [
        deletedReview,
      ] = await tx
        .delete(reviews)
        .where(
          and(
            eq(
              reviews.id,
              reviewId,
            ),
            eq(
              reviews.userId,
              userId,
            ),
          ),
        )
        .returning({
          id: reviews.id,
          gameId:
            reviews.gameId,
        });

      if (!deletedReview) {
        throw new Error(
          "Review not found or you are not allowed to delete it.",
        );
      }

      return deletedReview;
    });

  revalidatePath(
    `/game/${deleted.gameId}`,
  );

  return {
    success: true,
    reviewId: deleted.id,
    gameId: deleted.gameId,
  };
}