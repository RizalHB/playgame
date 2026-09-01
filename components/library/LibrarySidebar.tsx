"use client";

import {
  Library,
  Download,
  Heart,
  Folder,
  EyeOff,
} from "lucide-react";

export function LibrarySidebar() {
  const items = [
    {
      icon: Library,
      label: "All Games",
      active: true,
    },
    {
      icon: Download,
      label: "Installed",
      active: false,
      soon: true,
    },
    {
      icon: Heart,
      label: "Favorites",
      active: false,
      soon: true,
    },
    {
      icon: Folder,
      label: "Collections",
      active: false,
      soon: true,
    },
    {
      icon: EyeOff,
      label: "Hidden",
      active: false,
      soon: true,
    },
  ];

  return (
    <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg shadow-black/20">

      <h2 className="mb-4 px-2 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Library
      </h2>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              disabled={item.soon}
              className={`
                group
                relative
                flex
                w-full
                items-center
                gap-3
                overflow-hidden
                rounded-xl
                px-4
                py-3
                text-left
                transition-all
                duration-200
                ease-out

                ${
                  item.active
                    ? "border-l-4 border-blue-500 bg-zinc-800 text-white shadow-md"
                    : "text-zinc-300 hover:translate-x-1 hover:bg-zinc-800 hover:text-white"
                }

                ${
                  item.soon
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              `}
            >
              <Icon
                size={18}
                className="transition-transform duration-200 group-hover:scale-110"
              />

              <span className="flex-1 font-medium">
                {item.label}
              </span>

              {item.soon && (
                <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

    </aside>
  );
}