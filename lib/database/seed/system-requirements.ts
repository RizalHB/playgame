import { randomUUID } from "crypto";

import { db } from "../database";
import { games, systemRequirements } from "../schema";

export async function seedSystemRequirements() {
  const allGames = await db.select().from(games);

  const requirements = [
    {
      title: "Half-Life",
      minimum: {
        os: "Windows 10",
        processor: "1.2 GHz Processor",
        memory: "1 GB RAM",
        graphics: "DirectX 9 Compatible GPU",
        directX: "9.0c",
        storage: "2 GB available space",
        notes: "Keyboard, mouse",
      },
      recommended: {
        os: "Windows 10 / 11",
        processor: "Dual Core 2.4 GHz",
        memory: "2 GB RAM",
        graphics: "GeForce GTX 650 / Radeon HD 7750",
        directX: "11",
        storage: "2 GB SSD",
        notes: "SSD recommended",
      },
    },

    {
      title: "Half-Life 2",
      minimum: {
        os: "Windows 10",
        processor: "1.7 GHz Processor",
        memory: "2 GB RAM",
        graphics: "DirectX 9 Compatible GPU",
        directX: "9.0c",
        storage: "7 GB available space",
        notes: "Broadband Internet connection",
      },
      recommended: {
        os: "Windows 10 / 11",
        processor: "Quad Core 3.0 GHz",
        memory: "4 GB RAM",
        graphics: "GeForce GTX 750 Ti / RX 560",
        directX: "11",
        storage: "7 GB SSD",
        notes: "SSD recommended",
      },
    },

    {
      title: "Portal 2",
      minimum: {
        os: "Windows 10",
        processor: "Dual Core 2.0 GHz",
        memory: "2 GB RAM",
        graphics: "DirectX 9 Compatible GPU",
        directX: "9.0c",
        storage: "8 GB available space",
        notes: "Broadband Internet connection",
      },
      recommended: {
        os: "Windows 10 / 11",
        processor: "Quad Core 3.0 GHz",
        memory: "4 GB RAM",
        graphics: "GeForce GTX 750 Ti / RX 560",
        directX: "11",
        storage: "8 GB SSD",
        notes: "SSD recommended",
      },
    },

    {
      title: "Left 4 Dead 2",
      minimum: {
        os: "Windows 10",
        processor: "Dual Core 2.4 GHz",
        memory: "2 GB RAM",
        graphics: "DirectX 9 Compatible GPU",
        directX: "9.0c",
        storage: "13 GB available space",
        notes: "Broadband Internet connection",
      },
      recommended: {
        os: "Windows 10 / 11",
        processor: "Quad Core 3.2 GHz",
        memory: "8 GB RAM",
        graphics: "GeForce GTX 960 / RX 570",
        directX: "11",
        storage: "13 GB SSD",
        notes: "SSD recommended",
      },
    },

    {
      title: "Counter-Strike: Source",
      minimum: {
        os: "Windows 10",
        processor: "1.7 GHz Processor",
        memory: "2 GB RAM",
        graphics: "DirectX 9 Compatible GPU",
        directX: "9.0c",
        storage: "15 GB available space",
        notes: "Broadband Internet connection",
      },
      recommended: {
        os: "Windows 10 / 11",
        processor: "Quad Core 3.0 GHz",
        memory: "4 GB RAM",
        graphics: "GeForce GTX 750 Ti / RX 560",
        directX: "11",
        storage: "15 GB SSD",
        notes: "SSD recommended",
      },
    },
  ];

  for (const item of requirements) {
    const game = allGames.find((g) => g.title === item.title);

    if (!game) continue;

    await db.insert(systemRequirements).values({
      id: randomUUID(),
      gameId: game.id,

      minimumOS: item.minimum.os,
      minimumProcessor: item.minimum.processor,
      minimumMemory: item.minimum.memory,
      minimumGraphics: item.minimum.graphics,
      minimumDirectX: item.minimum.directX,
      minimumStorage: item.minimum.storage,
      minimumNotes: item.minimum.notes,

      recommendedOS: item.recommended.os,
      recommendedProcessor: item.recommended.processor,
      recommendedMemory: item.recommended.memory,
      recommendedGraphics: item.recommended.graphics,
      recommendedDirectX: item.recommended.directX,
      recommendedStorage: item.recommended.storage,
      recommendedNotes: item.recommended.notes,
    });
  }

  console.log("✅ System requirements seeded.");
}