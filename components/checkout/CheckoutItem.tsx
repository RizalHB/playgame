import Image from "next/image";

interface CheckoutItemProps {
  item: {
    title: string;
    developer: string;
    headerUrl: string | null;

    price: number;
    finalPrice: number;

    hasDiscount: boolean;
    discountPercent: number | null;
  };
}

export function CheckoutItem({
  item,
}: CheckoutItemProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:flex-row">
      <Image
        src={
          item.headerUrl ||
          "/images/game-placeholder.jpg"
        }
        alt={item.title}
        width={240}
        height={120}
        className="w-full rounded-lg object-cover sm:w-60"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {item.title}
          </h3>

          <p className="text-sm text-zinc-400">
            {item.developer}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {item.hasDiscount ? (
            <div className="flex items-center gap-3">
              <span className="rounded bg-green-600 px-2 py-1 text-sm font-semibold">
                -{item.discountPercent}%
              </span>

              <span className="text-sm text-zinc-500 line-through">
                {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(item.price)}
              </span>

              <span className="text-xl font-bold text-green-400">
                {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(item.finalPrice)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(item.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}