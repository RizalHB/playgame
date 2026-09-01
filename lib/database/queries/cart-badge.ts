import { getCurrentSession } from "@/lib/auth/session";
import { getCartItemCount } from "./cart";

export async function getCartBadgeCount() {
  const session = await getCurrentSession();

  if (!session) {
    return 0;
  }

  return getCartItemCount(session.userId);
}