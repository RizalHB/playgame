import Link from "next/link";

interface HeroActionsProps {
  gameId: string;
}

export function HeroActions({ gameId }: HeroActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/game/${gameId}`}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#1a9fff] to-[#66c0f4] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(26,159,255,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#66c0f4] hover:to-[#1a9fff] hover:shadow-[0_0_32px_rgba(26,159,255,0.45)] active:translate-y-0"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative flex items-center gap-2">
          View Details
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
}