const RELEASE_CHECK_INTERVAL_MS = 30_000;

const SCHEDULER_KEY = Symbol.for(
  "playgame.release-scheduler.started",
);

type SchedulerGlobal = typeof globalThis & {
  [SCHEDULER_KEY]?: boolean;
};

export async function register() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const globalState =
    globalThis as SchedulerGlobal;

  if (globalState[SCHEDULER_KEY]) {
    return;
  }

  globalState[SCHEDULER_KEY] = true;

  const {
    releaseDueScheduledGames,
  } = await import(
    "@/lib/services/games/game-lifecycle"
  );

  const runReleaseCheck = async () => {
    try {
      const releasedGames =
        await releaseDueScheduledGames();

      if (releasedGames.length > 0) {
        console.log(
          `[PlayGame] Released ${releasedGames.length} scheduled game(s).`,
          releasedGames.map((game) => ({
            id: game.id,
            releaseDate: game.releaseDate,
          })),
        );
      }
    } catch (error) {
      console.error(
        "[PlayGame] Scheduled release check failed:",
        error,
      );
    }
  };

  // Check immediately when the server starts.
  await runReleaseCheck();

  // Continue checking while the local server is running.
  setInterval(
    runReleaseCheck,
    RELEASE_CHECK_INTERVAL_MS,
  );

  console.log(
    "[PlayGame] Development release scheduler started. Checking every 30 seconds.",
  );
}