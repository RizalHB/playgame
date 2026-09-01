import {
  and,
  eq,
  gte,
  inArray,
  lte,
} from "drizzle-orm";

import {
  discounts,
  games,
} from "@/lib/database/schema";

export interface CartPrice {
  gameId: string;
  title: string;
  unitPrice: number;
  discountPercentage: number;
  finalPrice: number;
}

export async function calculateCartPrices(
  gameRows: typeof games.$inferSelect[],
  discountRows: typeof discounts.$inferSelect[],
): Promise<CartPrice[]> {
  const discountMap =
    new Map(
      discountRows.map(
        (discount) => [
          discount.gameId,
          discount,
        ],
      ),
    );

  return gameRows.map(
    (game) => {
      const discount =
        discountMap.get(
          game.id,
        );

      const discountPercentage =
        discount?.percentage ?? 0;

      const finalPrice =
        Number(
          (
            game.basePrice *
            (
              1 -
              discountPercentage /
                100
            )
          ).toFixed(2),
        );

      return {
        gameId: game.id,
        title: game.title,
        unitPrice:
          game.basePrice,
        discountPercentage,
        finalPrice,
      };
    },
  );
}