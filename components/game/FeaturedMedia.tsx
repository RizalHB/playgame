"use client";

import { useMemo, useState } from "react";
import { Film, Image as ImageIcon } from "lucide-react";

import { TrailerPlayer } from "./TrailerPlayer";
import { ScreenshotGallery } from "./ScreenshotGallery";

interface GameMedia {
  id?: string;
  type: string;
  mediaType?: string | null;
  url: string;
  title?: string | null;
  thumbnailUrl?: string | null;
}

interface FeaturedMediaProps {
  media: GameMedia[];
}

export function FeaturedMedia({
  media,
}: FeaturedMediaProps) {
  const screenshots = useMemo(
    () =>
      media.filter(
        (item) => item.type === "screenshot",
      ),
    [media],
  );

  const trailers = useMemo(
    () =>
      media.filter(
        (item) =>
          item.type === "trailer" ||
          item.mediaType === "youtube",
      ),
    [media],
  );

  const hasTrailer = trailers.length > 0;
  const hasScreenshots = screenshots.length > 0;

  const [activeTab, setActiveTab] = useState<
    "trailer" | "screenshots"
  >(
    hasTrailer
      ? "trailer"
      : "screenshots",
  );

  if (!hasTrailer && !hasScreenshots) {
    return null;
  }

  const activeTrailer =
    trailers[0] ?? null;

  return (
    <section
      id="media"
      className="
        scroll-mt-28
        space-y-5
      "
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Featured Media
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Explore the game
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Watch the trailer or browse
            screenshots.
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Game media"
          className="
            inline-flex
            w-fit
            rounded-xl
            border
            border-zinc-800
            bg-zinc-950/80
            p-1
            shadow-lg
          "
        >
          {hasTrailer && (
            <button
              type="button"
              role="tab"
              aria-selected={
                activeTab === "trailer"
              }
              onClick={() =>
                setActiveTab("trailer")
              }
              className={`
                flex
                items-center
                gap-2
                rounded-lg
                px-4
                py-2.5
                text-sm
                font-semibold
                transition
                ${
                  activeTab === "trailer"
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }
              `}
            >
              <Film size={17} />

              Trailer
            </button>
          )}

          {hasScreenshots && (
            <button
              type="button"
              role="tab"
              aria-selected={
                activeTab ===
                "screenshots"
              }
              onClick={() =>
                setActiveTab(
                  "screenshots",
                )
              }
              className={`
                flex
                items-center
                gap-2
                rounded-lg
                px-4
                py-2.5
                text-sm
                font-semibold
                transition
                ${
                  activeTab ===
                  "screenshots"
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }
              `}
            >
              <ImageIcon size={17} />

              Screenshots
            </button>
          )}
        </div>
      </div>

      {/* Media stage */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-950
          shadow-2xl
          shadow-black/30
        "
      >
        {activeTab === "trailer" &&
          activeTrailer && (
            <TrailerPlayer
              media={activeTrailer}
            />
          )}

        {activeTab ===
          "screenshots" &&
          hasScreenshots && (
            <ScreenshotGallery
              media={screenshots}
            />
          )}
      </div>
    </section>
  );
}
