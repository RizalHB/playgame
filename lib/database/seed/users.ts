import { eq } from "drizzle-orm"; import { hashPassword } from "@/lib/auth/password"; import { db } from "../database"; import { users } from "../schema"; const SEED_PASSWORD = "PlayGame123!"; export async function seedUsers( gamerRoleId: string, ) { const passwordHash = await hashPassword(SEED_PASSWORD);

  const seedUsers = [
    {
      roleId: gamerRoleId,
      email: "gamer@playgame.local",
      username: "DemoGamer",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "gordon@playgame.local",
      username: "Gordon",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "alyx@playgame.local",
      username: "Alyx",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "barney@playgame.local",
      username: "Barney",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "eli@playgame.local",
      username: "Eli",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "chell@playgame.local",
      username: "Chell",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "wheatley@playgame.local",
      username: "Wheatley",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "glados@playgame.local",
      username: "GLaDOS",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "coach@playgame.local",
      username: "Coach",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "ellis@playgame.local",
      username: "Ellis",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "zoey@playgame.local",
      username: "Zoey",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "cssveteran@playgame.local",
      username: "CSSVeteran",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "headshotpro@playgame.local",
      username: "HeadshotPro",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "lambdaone@playgame.local",
      username: "LambdaOne",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },

    {
      roleId: gamerRoleId,
      email: "pixelhunter@playgame.local",
      username: "PixelHunter",
      passwordHash,
      emailVerified: true,
      twoFactorEnabled: false,
      status: "active",
    },
  ];

  const result = []; for (const userData of seedUsers) { const existingUser = await db.query.users.findFirst({ where: eq( users.email, userData.email, ), }); if (existingUser) { result.push(existingUser); continue; } const userId = crypto.randomUUID(); await db.insert(users).values({ id: userId, ...userData, }); const createdUser = await db.query.users.findFirst({ where: eq( users.id, userId, ), }); if (!createdUser) { throw new Error( `Failed to create seed user: ${userData.email}`, ); } result.push(createdUser); } return result; }