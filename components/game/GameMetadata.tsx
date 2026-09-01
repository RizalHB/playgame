import { CalendarDays, Building2, Tag, Layers3 } from "lucide-react";

interface GameMetadataProps {
  metadata: {
    developer: string;
    publisher: string;
    releaseDate: Date | null;
    genres: {
      id: string;
      name: string;
    }[];
    categories: {
      id: string;
      name: string;
    }[];
    platforms: string[];
    languages: string[];
  };
}

function MetadataRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-6 border-b border-white/10 py-4">
      <span className="text-sm font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </span>

      <div>{children}</div>
    </div>
  );
}

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-100">
      {children}
    </span>
  );
}

export function GameMetadata({
  metadata,
}: GameMetadataProps) {
  return (
    <section className="space-y-6 rounded-xl border border-white/10 bg-zinc-900/60 p-8">
      <h2 className="text-3xl font-bold">
        Game Details
      </h2>

      <MetadataRow label="Developer">
        <div className="flex items-center gap-2">
          <Building2 size={18} />
          {metadata.developer}
        </div>
      </MetadataRow>

      <MetadataRow label="Publisher">
        <div className="flex items-center gap-2">
          <Building2 size={18} />
          {metadata.publisher}
        </div>
      </MetadataRow>

      <MetadataRow label="Release Date">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} />
          {metadata.releaseDate
            ? new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            }).format(metadata.releaseDate)
            : "Coming Soon"}
        </div>
      </MetadataRow>

      <MetadataRow label="Platforms">
        <div className="flex flex-wrap gap-2">
          {metadata.platforms.map((platform) => (
            <Badge key={platform}>
              {platform}
            </Badge>
          ))}
        </div>
      </MetadataRow>

      <MetadataRow label="Languages">
        <div className="flex flex-wrap gap-2">
          {metadata.languages.map((language) => (
            <Badge key={language}>
              {language}
            </Badge>
          ))}
        </div>
      </MetadataRow>
    </section>
  );
}