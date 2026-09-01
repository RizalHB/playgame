import { and, eq } from "drizzle-orm";

import { db } from "@/lib/database/database";

import {
  orders,
  orderItems,
  gameMedia,
} from "@/lib/database/schema";

export async function getOrderDetails(
  orderNumber: string,
  userId: string
) {
  const order =
    await db.query.orders.findFirst({
      where: and(
        eq(orders.orderNumber, orderNumber),
        eq(orders.userId, userId)
      ),
    });

  if (!order) {
    return null;
  }

  const items =
    await Promise.all(
      (
        await db.query.orderItems.findMany({
          where: eq(
            orderItems.orderId,
            order.id
          ),
        })
      ).map(async (item) => {
        const header =
          await db.query.gameMedia.findFirst({
            where: and(
              eq(
                gameMedia.gameId,
                item.gameId
              ),
              eq(
                gameMedia.isPrimary,
                true
              )
            ),
          });

        return {
          ...item,

          headerUrl:
            header?.url ?? null,
        };
      })
    );

  return {
    order,

    items,
  };
}