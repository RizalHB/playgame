"use client";

import Image from "next/image";
import { Trash2, Loader2, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, MouseEvent } from "react";
import { toast } from "sonner";
import { removeFromCart } from "@/lib/actions/cart";

interface CartItemProps {
  item: {
    itemId: string;
    gameId: string;
    title: string;
    developer: string;
    headerUrl: string | null;
    price: number;
    finalPrice: number;
    hasDiscount: boolean;
    discountPercent: number | null;
  };
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function CartItem({ item }: CartItemProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleNavigate = () => {
    router.push(`/game/${item.gameId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  };

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    startTransition(async () => {
      await removeFromCart(item.itemId);

      toast.success(`"${item.title}" removed from cart.`);

      router.refresh();
    });
  };

  return (
    <div
      tabIndex={0}
      role="link"
      aria-label={`View ${item.title}`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="
        group relative isolate cursor-pointer overflow-hidden
        rounded-2xl border border-white/[0.07]
        bg-[#10141b]
        shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        outline-none
        transition-all duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]

        hover:-translate-y-1
        hover:border-cyan-400/30
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]

        focus-visible:ring-2
        focus-visible:ring-cyan-400
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#080a0f]
      "
    >
      {/* Ambient background glow */}
      <div
        className="
          pointer-events-none absolute -inset-20 -z-10
          bg-[radial-gradient(circle_at_20%_30%,rgba(0,181,255,0.12),transparent_35%)]
          opacity-0 blur-3xl
          transition-opacity duration-700
          group-hover:opacity-100
        "
      />

      {/* Animated top light */}
      <div
        className="
          pointer-events-none absolute inset-x-0 top-0 h-px
          bg-gradient-to-r
          from-transparent
          via-cyan-400/70
          to-transparent
          opacity-30
          transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      <div className="flex flex-col gap-5 p-3 sm:flex-row sm:p-4">
        {/* Game artwork */}
        <div
          className="
            relative shrink-0 overflow-hidden rounded-xl
            bg-zinc-900
            ring-1 ring-white/[0.06]
            sm:w-72
          "
        >
          <Image
            src={
              item.headerUrl ||
              "/images/game-placeholder.jpg"
            }
            alt={item.title}
            width={460}
            height={215}
            priority={false}
            className="
              aspect-[2.14/1]
              h-auto
              w-full
              object-cover

              transition-transform
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]

              group-hover:scale-110
            "
          />

          {/* Image darkening */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-t
              from-black/45 via-transparent to-transparent
              opacity-60
              transition-opacity duration-500
              group-hover:opacity-80
            "
          />

          {/* Image shine */}
          <div
            className="
              pointer-events-none absolute inset-0
              -translate-x-full
              bg-gradient-to-r
              from-transparent
              via-white/[0.10]
              to-transparent
              skew-x-[-20deg]
              transition-transform
              duration-1000
              ease-out
              group-hover:translate-x-full
            "
          />

          {/* Open indicator */}
          <div
            className="
              absolute right-3 top-3
              flex h-8 w-8 items-center justify-center
              rounded-full
              border border-white/10
              bg-black/40
              text-white
              opacity-0
              backdrop-blur-md
              translate-y-1
              transition-all duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <ArrowUpRight size={15} />
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between px-1 py-1">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className="
                    truncate text-lg font-bold tracking-tight
                    text-white
                    transition-colors duration-300
                    group-hover:text-cyan-300
                    sm:text-xl
                  "
                >
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                  {item.developer}
                </p>
              </div>
            </div>

            {/* Subtle metadata line */}
            <div
              className="
                mt-5 h-px w-full
                bg-gradient-to-r
                from-white/[0.08]
                via-white/[0.04]
                to-transparent
              "
            />
          </div>

          {/* Bottom section */}
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {/* Price */}
            <div>
              {item.hasDiscount ? (
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-zinc-500 line-through">
                    {currencyFormatter.format(item.price)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className="
                        relative overflow-hidden
                        rounded-md
                        bg-emerald-400
                        px-2.5 py-1
                        text-xs font-black
                        tracking-wide
                        text-emerald-950
                        shadow-[0_0_20px_rgba(52,211,153,0.18)]
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    >
                      <span
                        className="
                          absolute inset-0
                          -translate-x-full
                          bg-white/30
                          skew-x-[-20deg]
                          transition-transform duration-700
                          group-hover:translate-x-full
                        "
                      />

                      <span className="relative">
                        -{item.discountPercent}%
                      </span>
                    </span>

                    <span
                      className="
                        text-xl font-extrabold tracking-tight
                        text-emerald-400
                        transition-all duration-300
                        group-hover:text-emerald-300
                        group-hover:[text-shadow:0_0_20px_rgba(52,211,153,0.25)]
                      "
                    >
                      {currencyFormatter.format(item.finalPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <p
                  className="
                    text-2xl font-extrabold tracking-tight
                    text-white
                    transition-colors duration-300
                    group-hover:text-cyan-300
                  "
                >
                  {currencyFormatter.format(item.price)}
                </p>
              )}
            </div>

            {/* Remove button */}
            <button
              type="button"
              disabled={pending}
              aria-label={`Remove ${item.title} from cart`}
              onClick={handleRemove}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              className="
                group/remove
                relative flex w-full items-center justify-center
                gap-2 overflow-hidden
                rounded-xl
                border border-red-500/20
                bg-red-500/[0.04]
                px-4 py-3
                text-sm font-semibold
                text-red-400
                backdrop-blur-sm

                transition-all duration-300

                hover:border-red-400/40
                hover:bg-red-500/10
                hover:text-red-300
                hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]

                active:scale-[0.97]

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-auto
              "
            >
              {/* Button shine */}
              <span
                className="
                  pointer-events-none absolute inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/[0.06]
                  to-transparent
                  transition-transform duration-700
                  group-hover/remove:translate-x-full
                "
              />

              {pending ? (
                <>
                  <Loader2
                    size={17}
                    className="relative animate-spin"
                  />
                  <span className="relative">Removing...</span>
                </>
              ) : (
                <>
                  <Trash2
                    size={17}
                    className="
                      relative
                      transition-transform duration-300
                      group-hover/remove:-rotate-12
                    "
                  />
                  <span className="relative">Remove</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}