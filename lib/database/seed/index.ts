import "dotenv/config";
import { db } from "../database";
import { roles } from "../schema";
import { seedRoles } from "./roles";
import { seedUsers } from "./users";
import { seedDevelopers } from "./developers";
import { seedCategories } from "./categories";
import { seedGenres } from "./genres";
import { seedValveGames } from "./games/valve";
import { seedGameMedia } from "./game-media";
import { seedSystemRequirements } from "./system-requirements";
import { seedReviews } from "./reviews";
import { seedWallets } from "./wallets";
import { seedAdmin } from "./admin";
async function seedDatabase() {
  console.log("🌱 Starting PlayGame database seed...");

  // Seed roles
  await seedRoles();

  // Read role IDs
  const allRoles = await db.select().from(roles);

  const adminRole = allRoles.find(
    (role) => role.name === "Administrator"
  );

  const developerRole = allRoles.find(
    (role) => role.name === "Developer"
  );

  const gamerRole = allRoles.find(
    (role) => role.name === "Gamer"
  );

  if (!adminRole || !developerRole || !gamerRole) {
    throw new Error("Required roles were not found.");
  }

  // Seed administrator & demo gamer
  // Seed administrator
await seedAdmin(adminRole.id);

// Seed demo gamers
const seededUsers = await seedUsers(
  gamerRole.id
);

  await seedWallets(seededUsers);

  // Seed developer accounts
  await seedDevelopers(developerRole.id);

  await seedCategories();
  
  await seedGenres();

  await seedValveGames();

  await seedGameMedia();

  await seedSystemRequirements();

  await seedReviews();
  
  console.log("✅ Base data seeded successfully.");
}

seedDatabase()
  .then(() => {
    console.log("🎉 PlayGame seed completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });