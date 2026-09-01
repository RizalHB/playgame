import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/database/database";
import {
userSessions,
} from "@/lib/database/schema";
const SESSION_COOKIE =
"playgame_session";
const SESSION_DURATION_MS =
1000 * 60 * 60 * 24 * 30;
export async function createUserSession(
userId: string
) {
const token =
randomBytes(32).toString("hex");
const expiresAt = new Date(
Date.now() +
SESSION_DURATION_MS
);
await db.insert(userSessions).values({
id: crypto.randomUUID(),
userId,
token,
expiresAt,
});
const cookieStore =
await cookies();
cookieStore.set({
name: SESSION_COOKIE,
value: token,
httpOnly: true,
secure:
process.env.NODE_ENV ===
"production",
sameSite: "lax",
path: "/",
expires: expiresAt,
});
return token;
}
export async function getCurrentSession() {
const cookieStore =
await cookies();
const token =
cookieStore.get(
SESSION_COOKIE
)?.value;
if (!token) {
return null;
}
const session =
await db.query.userSessions.findFirst({
where: eq(
userSessions.token,
token
),
with: {
user: true,
},
});

if (!session) {
return null;
}

if (
session.expiresAt.getTime() <=
Date.now()
) {
await db
.delete(userSessions)
.where(
eq(
userSessions.id,
session.id
)
);


cookieStore.delete(
  SESSION_COOKIE
);

return null;


}

return session;
}

export async function destroyCurrentSession() {
const cookieStore =
await cookies();

const token =
cookieStore.get(
SESSION_COOKIE
)?.value;

if (token) {
await db
.delete(userSessions)
.where(
eq(
userSessions.token,
token
)
);
}

cookieStore.delete(
SESSION_COOKIE
);
}
