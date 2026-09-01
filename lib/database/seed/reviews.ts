import { db } from "../database";
import {
  games,
  reviews,
  users,
} from "../schema";

export async function seedReviews() {
  const allGames = await db.select().from(games);
  const allUsers = await db.select().from(users);

  if (!allGames.length || !allUsers.length) {
    console.warn(
      "Skipping review seed. Games or users were not found."
    );
    return;
  }

  const reviewSeed = [
    {
      game: "Half-Life",
      reviews: [
        {
          recommended: true,
          title: "Still one of the greatest FPS games ever",
          review:
            "Half-Life completely changed how story-driven shooters were designed. Even today the atmosphere, pacing and level design remain incredibly enjoyable.",
          hoursPlayed: 186,
        },

        {
          recommended: true,
          title: "Valve started something special",
          review:
            "You can clearly see why this game became legendary. The environmental storytelling still feels impressive after all these years.",
          hoursPlayed: 142,
        },

        {
          recommended: true,
          title: "Classic for a reason",
          review:
            "Every FPS fan should experience Half-Life at least once. It may be old, but the gameplay loop still holds up surprisingly well.",
          hoursPlayed: 96,
        },

        {
          recommended: true,
          title: "Black Mesa never gets old",
          review:
            "Excellent weapon variety, memorable enemies, and fantastic pacing. I still replay it every few years.",
          hoursPlayed: 211,
        },

        {
          recommended: true,
          title: "A timeless masterpiece",
          review:
            "Even after decades, this remains one of Valve's best games. The immersion is still excellent.",
          hoursPlayed: 77,
        },

        {
          recommended: false,
          title: "Important, but showing its age",
          review:
            "Historically one of the greatest shooters ever made, but modern players may struggle with the controls and older level design.",
          hoursPlayed: 8,
        },
      ],
    },
  ];

  let userIndex = 0;

  for (const gameData of reviewSeed) {
    const game = allGames.find(
      (g) => g.title === gameData.game
    );

    if (!game) continue;

    for (const review of gameData.reviews) {
      const user =
        allUsers[userIndex % allUsers.length];

      await db.insert(reviews).values({
        id: crypto.randomUUID(),

        gameId: game.id,

        userId: user.id,

        recommended: review.recommended,

        title: review.title,

        review: review.review,

        hoursPlayed: review.hoursPlayed,
      });

      userIndex++;
    }
  }

  console.log("✓ Reviews seeded");
}