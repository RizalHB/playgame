import Image from "next/image";

interface HeroInfoProps {
  title: string;
  developer: string;
  description: string | null;
  headerUrl: string;
  releaseDate: Date | null;
}

export function HeroInfo({
  title,
  developer,
  description,
  headerUrl,
  releaseDate,
}: HeroInfoProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <Image
        src={headerUrl}
        alt={title}
        width={320}
        height={150}
        className="rounded-lg"
      />

      <div>
        <h1 className="text-5xl font-bold">
          {title}
        </h1>

        <p className="mt-2 text-blue-400">
          {developer}
        </p>

        <p className="mt-4 text-zinc-300">
          {description}
        </p>

        {releaseDate && (
          <p className="mt-6 text-sm text-zinc-500">
            Released: {releaseDate.toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}