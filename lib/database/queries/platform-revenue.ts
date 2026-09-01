import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/database/database";

import {
  orderItems,
  orders,
} from "@/lib/database/schema";

export async function getPlatformRevenue() {
  const [result] = await db
    .select({
      salesCount: sql<number>`
        count(${orderItems.id})
      `,

      grossRevenue: sql<number>`
        coalesce(
          sum(${orderItems.finalPrice}),
          0
        )
      `,

      developerRevenue: sql<number>`
        coalesce(
          sum(${orderItems.developerAmount}),
          0
        )
      `,

      platformRevenue: sql<number>`
        coalesce(
          sum(${orderItems.platformAmount}),
          0
        )
      `,
    })
    .from(orderItems)
    .innerJoin(
      orders,
      eq(
        orderItems.orderId,
        orders.id,
      ),
    )
    .where(
      eq(
        orders.status,
        "completed",
      ),
    );

  return {
    salesCount:
      result?.salesCount ?? 0,

    grossRevenue:
      result?.grossRevenue ?? 0,

    developerRevenue:
      result?.developerRevenue ?? 0,

    platformRevenue:
      result?.platformRevenue ?? 0,
  };
}