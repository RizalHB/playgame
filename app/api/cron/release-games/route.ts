import { NextResponse } from "next/server";

import {
  releaseDueScheduledGames,
} from "@/lib/services/games/game-lifecycle";

export async function GET(
  request: Request,
) {
  const authHeader =
    request.headers.get("authorization");

  const cronSecret =
    process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error(
      "CRON_SECRET is not configured.",
    );

    return NextResponse.json(
      {
        error:
          "Cron endpoint is not configured.",
      },
      {
        status: 500,
      },
    );
  }

  if (
    authHeader !==
    `Bearer ${cronSecret}`
  ) {
    return NextResponse.json(
      {
        error: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const releasedGames =
      await releaseDueScheduledGames();

    return NextResponse.json({
      success: true,
      releasedCount:
        releasedGames.length,
      games: releasedGames.map(
        (game) => ({
          id: game.id,
          status: game.status,
          releaseDate:
            game.releaseDate,
        }),
      ),
    });
  } catch (error) {
    console.error(
      "release-games cron failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to release scheduled games.",
      },
      {
        status: 500,
      },
    );
  }
}