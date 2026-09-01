import {
  and,
  eq,
  lte,
} from "drizzle-orm";

import { db } from "@/lib/database/database";

import {
  games,
  GAME_STATUS,
  type GameStatus,
} from "@/lib/database/schema";

export class GameLifecycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameLifecycleError";
  }
}

/*
 * -------------------------
 * Transition guard
 * -------------------------
 */

function assertTransition(
  currentStatus: GameStatus,
  allowedStatuses: GameStatus[],
) {
  if (!allowedStatuses.includes(currentStatus)) {
    throw new GameLifecycleError(
      `Game cannot perform this action while it is "${currentStatus}".`,
    );
  }
}

/*
 * -------------------------
 * Ownership boundary
 * -------------------------
 */

async function getDeveloperOwnedGame(
  gameId: string,
  developerId: string,
) {
  const game =
    await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

  if (!game) {
    throw new GameLifecycleError(
      "Game not found.",
    );
  }

  if (
    game.developerId !== developerId
  ) {
    throw new GameLifecycleError(
      "You do not have permission to manage this game.",
    );
  }

  return game;
}

/*
 * -------------------------
 * DRAFT → PENDING_REVIEW
 * -------------------------
 *
 * REJECTED → PENDING_REVIEW
 *
 * Developer controlled.
 */

export async function submitGameForReview(
  gameId: string,
  developerId: string,
) {
  const game =
    await getDeveloperOwnedGame(
      gameId,
      developerId,
    );

  assertTransition(
    game.status,
    [
      GAME_STATUS.DRAFT,
      GAME_STATUS.REJECTED,
    ],
  );

  if (!game.title.trim()) {
    throw new GameLifecycleError(
      "Game title is required before submitting for review.",
    );
  }

  if (!game.description?.trim()) {
    throw new GameLifecycleError(
      "Game description is required before submitting for review.",
    );
  }

  if (game.basePrice < 0) {
    throw new GameLifecycleError(
      "Game price cannot be negative.",
    );
  }

  await db
    .update(games)
    .set({
      status:
        GAME_STATUS.PENDING_REVIEW,

      updatedAt: new Date(),
    })
    .where(
      and(
        eq(games.id, gameId),

        eq(
          games.developerId,
          developerId,
        ),

        eq(
          games.status,
          game.status,
        ),
      ),
    );
}

/*
 * -------------------------
 * PENDING_REVIEW → DRAFT
 * -------------------------
 *
 * Developer withdraws submission.
 */

export async function withdrawGameSubmission(
  gameId: string,
  developerId: string,
) {
  const game =
    await getDeveloperOwnedGame(
      gameId,
      developerId,
    );

  assertTransition(
    game.status,
    [GAME_STATUS.PENDING_REVIEW],
  );

  await db
    .update(games)
    .set({
      status: GAME_STATUS.DRAFT,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(games.id, gameId),

        eq(
          games.developerId,
          developerId,
        ),

        eq(
          games.status,
          GAME_STATUS.PENDING_REVIEW,
        ),
      ),
    );
}

/*
 * -------------------------
 * APPROVED → SCHEDULED
 * -------------------------
 *
 * Developer controlled.
 */

export async function scheduleGameRelease(
  gameId: string,
  developerId: string,
) {
  const game =
    await getDeveloperOwnedGame(
      gameId,
      developerId,
    );

  assertTransition(
    game.status,
    [GAME_STATUS.APPROVED],
  );

  if (!game.releaseDate) {
    throw new GameLifecycleError(
      "A release date is required before scheduling the game.",
    );
  }

  if (
    game.releaseDate.getTime() <=
    Date.now()
  ) {
    throw new GameLifecycleError(
      "The release date must be in the future.",
    );
  }

  await db
    .update(games)
    .set({
      status:
        GAME_STATUS.SCHEDULED,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(games.id, gameId),
        eq(
          games.developerId,
          developerId,
        ),
        eq(
          games.status,
          GAME_STATUS.APPROVED,
        ),
      ),
    );
}

/*
 * -------------------------
 * SCHEDULED → RELEASED
 * -------------------------
 *
 * SYSTEM CONTROLLED.
 *
 * No developerId.
 */

export async function releaseScheduledGame(
  gameId: string,
) {
  const now = new Date();

  const result =
    await db
      .update(games)
      .set({
        status:
          GAME_STATUS.RELEASED,

        /*
         * Compatibility with older
         * application code.
         */
        isPublished: true,

        updatedAt: now,
      })
      .where(
        and(
          eq(
            games.id,
            gameId,
          ),

          eq(
            games.status,
            GAME_STATUS.SCHEDULED,
          ),

          lte(
            games.releaseDate,
            now,
          ),
        ),
      )
      .returning({
        id: games.id,

        status:
          games.status,

        releaseDate:
          games.releaseDate,
      });

  return result[0] ?? null;
}

/*
 * -------------------------
 * Bulk scheduled release
 * -------------------------
 *
 * SYSTEM CONTROLLED.
 *
 * Safe to execute repeatedly.
 */

export async function releaseDueScheduledGames() {
  const now = new Date();

  const releasedGames =
    await db
      .update(games)
      .set({
        status:
          GAME_STATUS.RELEASED,

        isPublished: true,

        updatedAt: now,
      })
      .where(
        and(
          eq(
            games.status,
            GAME_STATUS.SCHEDULED,
          ),

          lte(
            games.releaseDate,
            now,
          ),
        ),
      )
      .returning({
        id: games.id,

        status:
          games.status,

        releaseDate:
          games.releaseDate,
      });

  return releasedGames;
}
/**
 * Administrator approves a game submission.
 *
 * PENDING_REVIEW
 *      ↓
 *   APPROVED
 *
 * Only an administrator should be able to call this
 * through the admin action layer.
 */
export async function approveGameSubmission(
  gameId: string,
) {
  const game =
    await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

  if (!game) {
    throw new GameLifecycleError(
      "Game not found.",
    );
  }

  assertTransition(
    game.status,
    [GAME_STATUS.PENDING_REVIEW],
  );

  const result = await db
    .update(games)
    .set({
      status: GAME_STATUS.APPROVED,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(games.id, gameId),
        eq(
          games.status,
          GAME_STATUS.PENDING_REVIEW,
        ),
      ),
    )
    .returning({
      id: games.id,
      status: games.status,
    });

  return result[0] ?? null;
}

/**
 * Administrator rejects a game submission.
 *
 * PENDING_REVIEW
 *      ↓
 *    REJECTED
 */
export async function rejectGameSubmission(
  gameId: string,
) {
  const game =
    await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

  if (!game) {
    throw new GameLifecycleError(
      "Game not found.",
    );
  }

  assertTransition(
    game.status,
    [GAME_STATUS.PENDING_REVIEW],
  );

  const result = await db
    .update(games)
    .set({
      status: GAME_STATUS.REJECTED,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(games.id, gameId),
        eq(
          games.status,
          GAME_STATUS.PENDING_REVIEW,
        ),
      ),
    )
    .returning({
      id: games.id,
      status: games.status,
    });

  return result[0] ?? null;
}