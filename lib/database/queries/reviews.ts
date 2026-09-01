import { and, count, desc, eq, sql } from "drizzle-orm";

import { db } from "../database";
import {
  gamerProfiles,
  reviews,
  users,
  libraries,
} from "../schema";

export async function getUserGameReview(
  userId: string,
  gameId: string,
) {
  const [review] =
    await db
      .select({
        id: reviews.id,

        recommended:
          reviews.recommended,

        title: reviews.title,

        review:
          reviews.review,

        hoursPlayed:
          reviews.hoursPlayed,

        createdAt:
          reviews.createdAt,

        updatedAt:
          reviews.updatedAt,
      })

      .from(reviews)

      .where(
        and(
          eq(
            reviews.userId,
            userId,
          ),
          eq(
            reviews.gameId,
            gameId,
          ),
        ),
      )

      .limit(1);

  return review ?? null;
}

export async function getGameReviews(
  gameId: string,
  currentUserId?: string,
) {
  return db
    .select({
      id: reviews.id,

      recommended:
        reviews.recommended,

      title: reviews.title,

      review: reviews.review,

      hoursPlayed:
        reviews.hoursPlayed,

      createdAt:
        reviews.createdAt,

      username:
        users.username,

      avatarUrl:
        gamerProfiles.avatarUrl,

      libraryId:
        libraries.id,

      isCurrentUser:
        currentUserId
          ? sql<boolean>`
              CASE
                WHEN ${reviews.userId} = ${currentUserId}
                THEN 1
                ELSE 0
              END
            `
          : sql<boolean>`0`,
    })

    .from(reviews)

    .innerJoin(
      users,
      eq(
        reviews.userId,
        users.id,
      ),
    )

    .leftJoin(
      gamerProfiles,
      eq(
        gamerProfiles.userId,
        users.id,
      ),
    )

    .leftJoin(
      libraries,
      and(
        eq(
          libraries.userId,
          users.id,
        ),
        eq(
          libraries.gameId,
          reviews.gameId,
        ),
      ),
    )

    .where(
      eq(
        reviews.gameId,
        gameId,
      ),
    )

    .orderBy(
      desc(
        reviews.createdAt,
      ),
    );
}

export async function getReviewSummary(
  gameId: string,
) {
  const [summary] = await db
    .select({
      totalReviews: count(),

      positiveReviews:
        sql<number>`
          SUM(
            CASE
              WHEN ${reviews.recommended} = 1
              THEN 1
              ELSE 0
            END
          )
        `,
    })
    .from(reviews)

    .where(
      eq(
        reviews.gameId,
        gameId,
      ),
    );

  const total =
    Number(summary.totalReviews);

  const positive =
    Number(
      summary.positiveReviews ?? 0,
    );

  const negative =
    total - positive;

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (positive / total) * 100,
        );

  let label = "No Reviews";

  if (total === 0) {
    label = "No Reviews";
  } else if (total < 5) {
    label =
      total === 1
        ? "1 Review"
        : `${total} Reviews`;
  } else if (percentage >= 95) {
    label =
      "Overwhelmingly Positive";
  } else if (percentage >= 80) {
    label = "Very Positive";
  } else if (percentage >= 70) {
    label = "Mostly Positive";
  } else if (percentage >= 40) {
    label = "Mixed";
  } else if (percentage >= 20) {
    label = "Mostly Negative";
  } else if (percentage >= 5) {
    label = "Very Negative";
  } else {
    label =
      "Overwhelmingly Negative";
  }

  return {
    totalReviews: total,
    positiveReviews: positive,
    negativeReviews: negative,
    percentage,
    label,
  };
}
