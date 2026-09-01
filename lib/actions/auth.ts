"use server";
import { hashPassword } from "@/lib/auth/password";
import {
  createUserSession,
  destroyCurrentSession,
} from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { db } from "@/lib/database/database";
import {
  roles,
  users,
  userSessions,
  wallets,
} from "@/lib/database/schema";
import { verifyPassword } from "@/lib/auth/password";
import { USER_ROLES } from "@/lib/constants/roles";

interface SignUpInput {
email: string;
username: string;
password: string;
}

export type LoginResult = {
  success: boolean;
  error?: string;
  role?: string;
};

export type SignUpResult = {
success: boolean;
error?: string;
};

export async function signUp(
input: SignUpInput
): Promise<SignUpResult> {
const email = input.email
.trim()
.toLowerCase();

const username =
input.username.trim();

const password =
input.password;

if (
!email ||
!username ||
!password
) {
return {
success: false,
error:
"Please complete all required fields.",
};
}

if (
!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(
email
)
) {
return {
success: false,
error:
"Please enter a valid email address.",
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
!/^[a-zA-Z0-9_]+$/.test(
username
)
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

const existingEmail =
await db.query.users.findFirst({
where: eq(
users.email,
email
),
});

if (existingEmail) {
return {
success: false,
error:
"An account with this email already exists.",
};
}

const existingUsername =
await db.query.users.findFirst({
where: eq(
users.username,
username
),
});

if (existingUsername) {
return {
success: false,
error:
"That username is already taken.",
};
}

const gamerRole =
await db.query.roles.findFirst({
where: eq(
roles.name,
USER_ROLES.GAMER
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
  await hashPassword(password);

const userId = crypto.randomUUID();

await db.transaction(async (tx) => {
  await tx.insert(users).values({
    id: userId,
    roleId: gamerRole.id,
    email,
    username,
    passwordHash,
    emailVerified: false,
    twoFactorEnabled: false,
    status: "active",
  });

  await tx.insert(wallets).values({
    id: crypto.randomUUID(),
    userId,
  });
});

await createUserSession(userId);

return {
  success: true,
};

}
export async function login(
  input: {
    email: string;
    password: string;
  }
): Promise<LoginResult> {
  const email = input.email
    .trim()
    .toLowerCase();

  const password = input.password;

  if (!email || !password) {
    return {
      success: false,
      error:
        "Please enter your email and password.",
    };
  }

  const user =
    await db.query.users.findFirst({
      where: eq(users.email, email),
    });

  /*
   * Use the same message whether the
   * account doesn't exist or the password
   * is incorrect. This avoids exposing
   * account existence.
   */
  if (!user) {
    return {
      success: false,
      error:
        "Invalid email or password.",
    };
  }

  if (user.status !== "active") {
    return {
      success: false,
      error:
        "This account is not available.",
    };
  }

  const validPassword =
    await verifyPassword(
      password,
      user.passwordHash
    );

  if (!validPassword) {
    return {
      success: false,
      error:
        "Invalid email or password.",
    };
  }

  await createUserSession(user.id);

const role = await db.query.roles.findFirst({
  where: eq(roles.id, user.roleId),
});

if (!role) {
  return {
    success: false,
    error: "User role is not configured.",
  };
}

return {
  success: true,
  role: role.name,
};
}

export async function logout(): Promise<{
  success: boolean;
}> {
  await destroyCurrentSession();

  return {
    success: true,
  };
}