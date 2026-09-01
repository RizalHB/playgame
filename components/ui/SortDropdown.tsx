"use client";

import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({
  value,
  onChange,
}: SortDropdownProps) {
  return (
    <div className="group relative w-full">

      <ArrowUpDown
        size={18}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-zinc-500
          transition-colors
          duration-200
          group-focus-within:text-blue-400
        "
      />

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          appearance-none
          rounded-xl
          border
          border-zinc-700
          bg-zinc-900
          py-3
          pl-11
          pr-10
          text-white
          outline-none
          transition-all
          duration-200

          hover:border-zinc-600

          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/30
        "
      >
        <option value="recent">
          Recently Purchased
        </option>

        <option value="az">
          Alphabetical (A–Z)
        </option>

        <option value="za">
          Alphabetical (Z–A)
        </option>

        <option value="mostPlayed">
          Most Played
        </option>

        <option value="leastPlayed">
          Least Played
        </option>
      </select>

      <svg
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-zinc-500
        "
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>

    </div>
  );
}