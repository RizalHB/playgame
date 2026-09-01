import { db } from "../database";
import { categories } from "../schema";

const DEFAULT_CATEGORIES = [
  { name: "Single-player", description: "Playable by one player." },
  { name: "Multiplayer", description: "Supports multiple players." },
  { name: "Online Co-op", description: "Online cooperative gameplay." },
  { name: "LAN Co-op", description: "Local network cooperative gameplay." },
  { name: "PvP", description: "Player versus Player." },
  { name: "PvE", description: "Player versus Environment." },
  { name: "Controller Support", description: "Supports game controllers." },
  { name: "Full Controller Support", description: "Fully playable using a controller." },
  { name: "PlayGame Cloud", description: "Cloud save support." },
  { name: "Achievements", description: "Earn in-game achievements." },
  { name: "Family Sharing", description: "Supports family library sharing." },
  { name: "Cross-Platform Multiplayer", description: "Play across multiple platforms." },
  { name: "PlayGame Verified", description: "Verified for the PlayGame platform." },
  { name: "VR Support", description: "Virtual Reality supported." },
  { name: "Workshop Support", description: "Supports community-created content." },
  { name: "Remote Play Together", description: "Play remotely with friends." },
  { name: "Online PvP", description: "Online competitive multiplayer." },
  { name: "Split Screen", description: "Local split-screen gameplay." },
  { name: "Cross Save", description: "Progress sync across devices." },
  { name: "Steam-like Features", description: "Special PlayGame platform features." },
];

export async function seedCategories() {
  await db.insert(categories).values(
    DEFAULT_CATEGORIES.map((category) => ({
      id: crypto.randomUUID(),
      ...category,
    }))
  );
}