import { db } from "../database";
import { genres } from "../schema";

const DEFAULT_GENRES = [
  { name: "Action", description: "Fast-paced gameplay focused on combat and reflexes." },
  { name: "Adventure", description: "Story-driven exploration and discovery." },
  { name: "RPG", description: "Role-playing games with character progression." },
  { name: "Strategy", description: "Planning and tactical decision-making." },
  { name: "Simulation", description: "Realistic or life-like simulation gameplay." },
  { name: "Racing", description: "Vehicle racing and motorsports." },
  { name: "Sports", description: "Sports-based gameplay." },
  { name: "Casual", description: "Easy-to-play games for all audiences." },
  { name: "Indie", description: "Games developed by independent studios." },
  { name: "Horror", description: "Designed to create fear and suspense." },
  { name: "Survival", description: "Resource management and survival mechanics." },
  { name: "Open World", description: "Freely explorable game world." },
  { name: "Sandbox", description: "Creative gameplay with minimal restrictions." },
  { name: "FPS", description: "First-person shooter." },
  { name: "Third-Person Shooter", description: "Shooter played from a third-person perspective." },
  { name: "Souls-like", description: "Challenging action RPG inspired by Souls games." },
  { name: "Roguelike", description: "Procedurally generated runs with permanent death." },
  { name: "Roguelite", description: "Roguelike gameplay with persistent progression." },
  { name: "MMO", description: "Massively multiplayer online games." },
  { name: "Fighting", description: "One-on-one or arena-based combat games." },
];

export async function seedGenres() {
  await db.insert(genres).values(
    DEFAULT_GENRES.map((genre) => ({
      id: crypto.randomUUID(),
      ...genre,
    }))
  );
}