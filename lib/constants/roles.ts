export const USER_ROLES = {
  ADMINISTRATOR: "Administrator",
  DEVELOPER: "Developer",
  GAMER: "Gamer",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];