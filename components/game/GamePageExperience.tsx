"use client";

import type {
  ReactNode,
} from "react";

import {
  useEffect,
  useState,
} from "react";

interface MediaItem {
  type: string;
  mediaType?: string | null;
  url: string;
  title?: string | null;
  thumbnailUrl?: string | null;
}

interface GamePageExperienceProps {
  children: ReactNode;
  gameId: string;
  media: MediaItem[];
}

const NAV_ITEMS = [
  {
    id: "hero",
    label: "Overview",
  },
  {
    id: "media",
    label: "Media",
  },
  {
    id: "about",
    label: "About",
  },
  {
    id: "dlc",
    label: "DLC",
  },
  {
    id: "details",
    label: "Details",
  },
  {
    id: "requirements",
    label: "Requirements",
  },
  {
    id: "reviews",
    label: "Reviews",
  },
  {
    id: "related",
    label: "Related",
  },
];

export function GamePageExperience({
  children,
}: GamePageExperienceProps) {
  const [activeSection, setActiveSection] =
    useState("hero");

  const [
    navigationVisible,
    setNavigationVisible,
  ] = useState(true);

  const [lastScrollY, setLastScrollY] =
    useState(0);

  /*
   * ---------------------------------------------------------
   * Scroll tracking
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const sections =
      NAV_ITEMS.map((item) =>
        document.getElementById(
          item.id,
        ),
      ).filter(
        (
          section,
        ): section is HTMLElement =>
          section !== null,
      );

    if (!sections.length) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting,
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio,
              );

          const current =
            visibleEntries[0];

          if (current?.target.id) {
            setActiveSection(
              current.target.id,
            );
          }
        },
        {
          rootMargin:
            "-120px 0px -55% 0px",
          threshold: [
            0.1,
            0.25,
            0.5,
          ],
        },
      );

    sections.forEach(
      (section) =>
        observer.observe(section),
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Hide the floating page navigation while scrolling down.
   * Show it when scrolling up.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    function handleScroll() {
      const currentY =
        window.scrollY;

      if (currentY < 80) {
        setNavigationVisible(true);
      } else if (
        currentY > lastScrollY + 8
      ) {
        setNavigationVisible(false);
      } else if (
        currentY <
        lastScrollY - 8
      ) {
        setNavigationVisible(true);
      }

      setLastScrollY(currentY);
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [lastScrollY]);

  /*
   * ---------------------------------------------------------
   * Keyboard navigation
   *
   * Alt + ArrowUp / ArrowDown moves through page sections.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (!event.altKey) {
        return;
      }

      if (
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp"
      ) {
        return;
      }

      event.preventDefault();

      const currentIndex =
        NAV_ITEMS.findIndex(
          (item) =>
            item.id === activeSection,
        );

      if (currentIndex === -1) {
        return;
      }

      const direction =
        event.key === "ArrowDown"
          ? 1
          : -1;

      const nextIndex = Math.min(
        Math.max(
          currentIndex + direction,
          0,
        ),
        NAV_ITEMS.length - 1,
      );

      const target =
        document.getElementById(
          NAV_ITEMS[nextIndex].id,
        );

      target?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

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
  }, [activeSection]);

  /*
   * ---------------------------------------------------------
   * Navigation click
   * ---------------------------------------------------------
   */

  function scrollToSection(
    id: string,
  ) {
    const element =
      document.getElementById(id);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="relative">
      {/* =====================================================
          FLOATING GAME NAVIGATION
      ===================================================== */}

      <div
        className={`
          fixed
          left-1/2
          top-[72px]
          z-40
          w-[calc(100%-24px)]
          max-w-5xl
          -translate-x-1/2
          transition-all
          duration-300
          ${
            navigationVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }
        `}
      >
        <nav
          aria-label="Game sections"
          className="
            overflow-x-auto
            rounded-2xl
            border
            border-zinc-800/80
            bg-zinc-950/90
            px-2
            py-2
            shadow-2xl
            shadow-black/30
            backdrop-blur-xl
          "
        >
          <div className="flex min-w-max items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                activeSection ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      item.id,
                    )
                  }
                  className={`
                    rounded-xl
                    px-3
                    py-2
                    text-sm
                    font-medium
                    transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      {children}
    </div>
  );
}
