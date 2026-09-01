import { getCurrentSession } from "@/lib/auth/session";

export async function getCurrentUserId() {
const session =
await getCurrentSession();

if (!session) {
throw new Error(
"User is not authenticated."
);
}

return session.userId;
}
