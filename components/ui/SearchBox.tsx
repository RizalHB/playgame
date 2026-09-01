"use client";

import { Search, X } from "lucide-react";

interface SearchBoxProps {
  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder?: string;
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBoxProps) {
  return (
    <div className="group relative w-full">

      <Search
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

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        className="
          w-full
          rounded-xl
          border
          border-zinc-700
          bg-zinc-900
          py-3
          pl-11
          pr-11
          text-white
          placeholder:text-zinc-500
          outline-none
          transition-all
          duration-200

          hover:border-zinc-600

          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/30
        "
      />

      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() =>
            onChange("")
          }
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-zinc-500
            transition
            hover:bg-zinc-800
            hover:text-white
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >
          <X size={16} />
        </button>
      )}

    </div>
  );
}