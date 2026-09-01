import {
  enqueueInstallation,
} from "./queue-service";

export async function enqueue(
  userId: string,
  gameId: string
) {
  await enqueueInstallation(
    userId,
    gameId
  );
}