interface ReviewSummaryProps {
  summary: {
    totalReviews: number;
    positiveReviews: number;
    percentage: number;
    label: string;
  };
}

export function ReviewSummary({
  summary,
}: ReviewSummaryProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Customer Reviews
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-500">
            Overall Reviews
          </p>

          <h3 className="mt-2 text-3xl font-bold text-sky-400">
            {summary.label}
          </h3>

          <p className="mt-3 text-zinc-300">
            {summary.percentage}% of the{" "}
            {summary.totalReviews.toLocaleString()} user reviews are positive.
          </p>
        </div>

        <div className="flex items-center justify-center rounded-lg bg-zinc-950">
          <div className="text-center">
            <p className="text-6xl font-black text-sky-400">
              {summary.percentage}%
            </p>

            <p className="mt-2 text-zinc-400">
              Positive Reviews
            </p>

            <p className="mt-4 text-sm text-zinc-500">
              {summary.positiveReviews} Recommended
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}