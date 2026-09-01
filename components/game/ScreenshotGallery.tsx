"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Minimize,
} from "lucide-react";

interface GameMedia {
  id?: string;
  type: string;
  mediaType?: string | null;
  url: string;
  title?: string | null;
  thumbnailUrl?: string | null;
}

interface ScreenshotGalleryProps {
  media: GameMedia[];
}

export function ScreenshotGallery({
  media,
}: ScreenshotGalleryProps) {
  const screenshots = media.filter(
    (item) =>
      item.type === "screenshot",
  );

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [fullscreen, setFullscreen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const active =
    screenshots[activeIndex];

  const next = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current + 1) %
        screenshots.length,
    );
  }, [screenshots.length]);

  const previous = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current -
          1 +
          screenshots.length) %
        screenshots.length,
    );
  }, [screenshots.length]);

  useEffect(() => {
    if (!fullscreen) return;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setFullscreen(false);
        return;
      }

      if (
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        next();
      }

      if (
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();
        previous();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    fullscreen,
    next,
    previous,
  ]);

  useEffect(() => {
    const handleFullscreen =
      () => {
        setFullscreen(
          Boolean(
            document.fullscreenElement,
          ),
        );
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen,
      );
    };
  }, []);

  if (!active) {
    return null;
  }

  const enterFullscreen =
    async () => {
      if (!containerRef.current) {
        return;
      }

      try {
        if (
          !document.fullscreenElement
        ) {
          await containerRef.current.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch {
        setFullscreen(true);
      }
    };

  return (
    <div
      ref={containerRef}
      className={`
        relative
        bg-[#050b13]
        ${
          fullscreen
            ? "flex h-screen w-screen items-center justify-center"
            : ""
        }
      `}
    >
      {/* Main image */}
      <div
        className={`
          relative
          w-full
          overflow-hidden
          bg-black
          ${
            fullscreen
              ? "h-screen"
              : "aspect-video"
          }
        `}
      >
        <Image
          src={active.url}
          alt={
            active.title ??
            `Screenshot ${
              activeIndex + 1
            }`
          }
          fill
          priority
          sizes="100vw"
          className={`
            object-contain
            ${
              fullscreen
                ? "p-0"
                : "p-1"
            }
          `}
        />

        {/* Gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Counter */}
        <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          {activeIndex + 1} /{" "}
          {screenshots.length}
        </div>

        {/* Previous */}
        {screenshots.length > 1 && (
          <button
            type="button"
            onClick={previous}
            aria-label="Previous screenshot"
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              rounded-full
              border
              border-white/10
              bg-black/60
              p-3
              text-white
              opacity-80
              shadow-xl
              backdrop-blur-md
              transition
              hover:scale-105
              hover:bg-sky-500
              sm:left-5
            "
          >
            <ChevronLeft
              size={24}
            />
          </button>
        )}

        {/* Next */}
        {screenshots.length > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next screenshot"
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              rounded-full
              border
              border-white/10
              bg-black/60
              p-3
              text-white
              opacity-80
              shadow-xl
              backdrop-blur-md
              transition
              hover:scale-105
              hover:bg-sky-500
              sm:right-5
            "
          >
            <ChevronRight
              size={24}
            />
          </button>
        )}

        {/* Fullscreen */}
        <button
          type="button"
          onClick={
            enterFullscreen
          }
          aria-label={
            fullscreen
              ? "Exit fullscreen"
              : "View fullscreen"
          }
          className="
            absolute
            bottom-4
            right-4
            rounded-lg
            border
            border-white/10
            bg-black/60
            p-2.5
            text-white
            backdrop-blur-md
            transition
            hover:bg-sky-500
          "
        >
          {fullscreen ? (
            <Minimize
              size={19}
            />
          ) : (
            <Expand
              size={19}
            />
          )}
        </button>
      </div>

      {/* Thumbnail navigation */}
      {!fullscreen &&
        screenshots.length > 1 && (
          <div
            className="
              flex
              gap-2
              overflow-x-auto
              border-t
              border-zinc-800
              bg-[#07111f]
              p-3
              scrollbar-thin
            "
          >
            {screenshots.map(
              (screenshot, index) => (
                <button
                  key={
                    screenshot.id ??
                    `${screenshot.url}-${index}`
                  }
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      index,
                    )
                  }
                  aria-label={`View screenshot ${
                    index + 1
                  }`}
                  aria-current={
                    index ===
                    activeIndex
                  }
                  className={`
                    relative
                    h-16
                    w-28
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    border-2
                    transition
                    sm:h-20
                    sm:w-36
                    ${
                      index ===
                      activeIndex
                        ? "border-sky-400 shadow-lg shadow-sky-500/20"
                        : "border-transparent opacity-60 hover:border-zinc-600 hover:opacity-100"
                    }
                  `}
                >
                  <Image
                    src={
                      screenshot.thumbnailUrl ??
                      screenshot.url
                    }
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover"
                  />

                  {index ===
                    activeIndex && (
                    <span className="absolute inset-0 bg-sky-400/10" />
                  )}
                </button>
              ),
            )}
          </div>
        )}
    </div>
  );
}
