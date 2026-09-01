import { getGameOwnership } from "./game-ownership";
import { getGameInstallation } from "./game-installation";
import { getActiveGameSession } from "./game-session";

export async function getGameState(
  userId: string,
  gameId: string
) {
  const ownership =
    await getGameOwnership(
      userId,
      gameId
    );

  const installation =
    await getGameInstallation(
      userId,
      gameId
    );

  const session =
    await getActiveGameSession(
      userId,
      gameId
    );
  return {
    ownership,

    installation: {
      ...installation,

      playing:
        session !== undefined &&
        session !== null,
    },
  };
}