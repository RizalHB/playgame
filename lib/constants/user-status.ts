export const USER_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  SUSPENDED: "suspended",
  BANNED: "banned",
} as const;

export type UserStatus =
  (typeof USER_STATUS)[keyof typeof USER_STATUS];