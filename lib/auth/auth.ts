"use server";

import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";

import { db } from "@/lib/database/database";
import { roles, users } from "@/lib/database/schema";
import { createUserSession } from "@/lib/auth/session";

interface SignUpInput {
  email: string;
  username: string;
  password: string;
}

interface SignUpResult {
  success: boolean;
  error?: string;
}

export async function signUp(
  input: SignUpInput
): Promise<SignUpResult> {
  const email =
    input.email.trim().toLowerCase();

  const username =
    input.username.trim();

  const password =
    input.password;

  if (!email) {
    return {
      success: false,
      error: "Email is required.",
    };
  }

  if (!username) {
    return {
      success: false,
      error: "Username is required.",
    };
  }

  if (!password) {
    return {
      success: false,
      error: "Password is required.",
    };
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  if (
    username.length < 3 ||
    username.length > 30
  ) {
    return {
      success: false,
      error:
        "Username must be between 3 and 30 characters.",
    };
  }

  if (
    !/^[a-zA-Z0-9_]+$/.test(username)
  ) {
    return {
      success: false,
      error:
        "Username can only contain letters, numbers, and underscores.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error:
        "Password must be at least 8 characters.",
    };
  }

  const existingUser =
    await db.query.users.findFirst({
      where: or(
        eq(users.email, email),
        eq(users.username, username)
      ),
    });

  if (existingUser) {
    if (existingUser.email === email) {
      return {
        success: false,
        error:
          "An account with this email already exists.",
      };
    }

    return {
      success: false,
      error:
        "This username is already taken.",
    };
  }

  const gamerRole =
    await db.query.roles.findFirst({
      where: eq(
        roles.name,
        "gamer"
      ),
    });

  if (!gamerRole) {
    return {
      success: false,
      error:
        "Gamer role is not configured.",
    };
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );

  const userId =
    crypto.randomUUID();

  await db.insert(users).values({
    id: userId,
    roleId: gamerRole.id,
    email,
    username,
    passwordHash,
    emailVerified: false,
    twoFactorEnabled: false,
    status: "active",
  });

  await createUserSession(userId);

  return {
    success: true,
  };
}