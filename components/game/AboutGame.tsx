interface AboutGameProps {
  description: string | null;
}

export function AboutGame({
  description,
}: AboutGameProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-6 text-3xl font-bold">
        About This Game
      </h2>

      <div className="whitespace-pre-line leading-8 text-zinc-300">
        {description ?? "No description available."}
      </div>
    </section>
  );
}