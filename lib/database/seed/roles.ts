import { db } from "../database";
import { roles } from "../schema";
import { USER_ROLES } from "@/lib/constants/roles";

export async function seedRoles() {
  await db.insert(roles).values([
    {
      id: crypto.randomUUID(),
      name: USER_ROLES.ADMINISTRATOR,
      description: "System administrator",
    },
    {
      id: crypto.randomUUID(),
      name: USER_ROLES.DEVELOPER,
      description: "Game developer",
    },
    {
      id: crypto.randomUUID(),
      name: USER_ROLES.GAMER,
      description: "Game player",
    },
  ]);
}