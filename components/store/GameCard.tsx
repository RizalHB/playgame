import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  id: string;
  title: string;
  shortDescription?: string | null;
  basePrice: number;
  headerUrl?: string | null;
}

export function GameCard({
  id,
  title,
  shortDescription,
  basePrice,
  headerUrl,
}: GameCardProps) {
  const formattedPrice = new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    },
  ).format(basePrice);

  return (
    <Link
      href={`/game/${id}`}
      className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-950">
        {headerUrl ? (
          <Image
            src={headerUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-400">
                {title}
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Cover image coming soon
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold">
          {title}
        </h3>

        {shortDescription && (
          <p className="line-clamp-2 text-sm text-zinc-400">
            {shortDescription}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-zinc-500">
            Starting at
          </span>

          <span className="text-xl font-bold text-green-400">
            {formattedPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}