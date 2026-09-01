import { db } from "../../database";

import { developerProfiles, games } from "../../schema";

export async function seedValveGames() {
  const valve =
    await db.query.developerProfiles.findFirst({
      where: (developer, { eq }) =>
        eq(developer.studioName, "Valve"),
    });

  if (!valve) {
    throw new Error(
      "Valve developer profile not found.",
    );
  }

  await db.insert(games).values([
    {
      id: crypto.randomUUID(),

      developerId: valve.id,

      title: "Half-Life",

      shortDescription:
        "The legendary sci-fi FPS.",

      description:
        "Assume the role of Gordon Freeman in Valve's groundbreaking first-person shooter.",

      basePrice: 250000,

      releaseDate:
        new Date("1998-11-19"),

      status: "released",

      isPublished: true,
    },

    {
      id: crypto.randomUUID(),

      developerId: valve.id,

      title: "Half-Life 2",

      shortDescription:
        "The award-winning sequel.",

      description:
        "Fight against the Combine and continue Gordon Freeman's journey.",

      basePrice: 90999,

      releaseDate:
        new Date("2004-11-16"),

      status: "released",

      isPublished: true,
    },

    {
      id: crypto.randomUUID(),

      developerId: valve.id,

      title: "Portal 2",

      shortDescription:
        "Mind-bending puzzle adventure.",

      description:
        "Solve challenging puzzles using the Portal Gun in an unforgettable adventure.",

      basePrice: 90999,

      releaseDate:
        new Date("2011-04-19"),

      status: "released",

      isPublished: true,
    },

    {
      id: crypto.randomUUID(),

      developerId: valve.id,

      title: "Left 4 Dead 2",

      shortDescription:
        "Cooperative zombie survival FPS.",

      description:
        "Fight through zombie hordes with friends across multiple campaigns.",

      basePrice: 90999,

      releaseDate:
        new Date("2009-11-17"),

      status: "released",

      isPublished: true,
    },

    {
      id: crypto.randomUUID(),

      developerId: valve.id,

      title: "Counter-Strike: Source",

      shortDescription:
        "Classic competitive tactical shooter.",

      description:
        "One of the most influential multiplayer shooters ever created.",

      basePrice: 90999,

      releaseDate:
        new Date("2004-11-01"),

      status: "released",

      isPublished: true,
    },
  ]);
}