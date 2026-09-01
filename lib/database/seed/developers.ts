import { eq } from "drizzle-orm";

import { hashPassword } from "@/lib/auth/password";

import { db } from "../database";
import { users, developerProfiles } from "../schema";

const SEED_PASSWORD = "PlayGame123!";

export const DEFAULT_DEVELOPERS = [
  {
    studioName: "Valve",
    username: "valve",
    email: "valve@playgame.local",
  },
  {
    studioName: "Facepunch Studios",
    username: "facepunch",
    email: "facepunch@playgame.local",
  },
  {
    studioName: "FromSoftware",
    username: "fromsoftware",
    email: "fromsoftware@playgame.local",
  },
  {
    studioName: "CAPCOM",
    username: "capcom",
    email: "capcom@playgame.local",
  },
  {
    studioName: "Ubisoft Montreal",
    username: "ubisoftmontreal",
    email: "ubisoft@playgame.local",
  },
  {
    studioName: "Rockstar North",
    username: "rockstarnorth",
    email: "rockstar@playgame.local",
  },
  {
    studioName: "CD PROJEKT RED",
    username: "cdprojektred",
    email: "cdprojekt@playgame.local",
  },
  {
    studioName: "Re-Logic",
    username: "relogic",
    email: "relogic@playgame.local",
  },
  {
    studioName: "Game Science",
    username: "gamescience",
    email: "gamescience@playgame.local",
  },
  {
    studioName: "Larian Studios",
    username: "larian",
    email: "larian@playgame.local",
  },
];

export async function seedDevelopers(developerRoleId: string) {
  const passwordHash = await hashPassword(SEED_PASSWORD);

  const createdDevelopers = [];

  for (const developer of DEFAULT_DEVELOPERS) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, developer.email),
    });

    if (existingUser) {
      createdDevelopers.push(existingUser);
      continue;
    }

    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      roleId: developerRoleId,
      username: developer.username,
      email: developer.email,
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    });

    await db.insert(developerProfiles).values({
      id: crypto.randomUUID(),
      userId,
      studioName: developer.studioName,
      verified: true,
    });

    const createdUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (createdUser) {
      createdDevelopers.push(createdUser);
    }
  }

  return createdDevelopers;
}