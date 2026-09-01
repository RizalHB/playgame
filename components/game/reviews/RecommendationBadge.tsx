interface RecommendationBadgeProps {
  recommended: boolean;
}

export function RecommendationBadge({
  recommended,
}: RecommendationBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold ${
        recommended
          ? "bg-green-600/20 text-green-400"
          : "bg-red-600/20 text-red-400"
      }`}
    >
      {recommended ? "👍 Recommended" : "👎 Not Recommended"}
    </span>
  );
}