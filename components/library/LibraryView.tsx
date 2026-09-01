"use client";

import { useEffect, useMemo, useState } from "react";

import { SearchBox } from "@/components/ui/SearchBox";
import { SortDropdown } from "@/components/ui/SortDropdown";

import { LibraryGrid } from "./LibraryGrid";
import { LibraryEmpty } from "./LibraryEmpty";
import { EmptySearch } from "./EmptySearch";

interface LibraryGame {
  id: string;

  gameId: string;

  title: string;

  developer: string;

  headerUrl: string | null;

  purchasedAt: Date;

  playTimeMinutes: number;
}

interface Props {
  games: LibraryGame[];
}

export function LibraryView({
  games,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [sort, setSort] =
    useState("recent");

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "library-sort"
      );

    if (saved) {
      setSort(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "library-sort",
      sort
    );
  }, [sort]);

  const filtered =
    useMemo(() => {
      const value = search
        .trim()
        .toLowerCase();

      let results = games.filter(
        (game) =>
          game.title
            .toLowerCase()
            .includes(value) ||
          game.developer
            .toLowerCase()
            .includes(value)
      );

      switch (sort) {
        case "az":
          results = [...results].sort(
            (a, b) =>
              a.title.localeCompare(
                b.title
              )
          );
          break;

        case "za":
          results = [...results].sort(
            (a, b) =>
              b.title.localeCompare(
                a.title
              )
          );
          break;

        case "mostPlayed":
          results = [...results].sort(
            (a, b) =>
              b.playTimeMinutes -
              a.playTimeMinutes
          );
          break;

        case "leastPlayed":
          results = [...results].sort(
            (a, b) =>
              a.playTimeMinutes -
              b.playTimeMinutes
          );
          break;

        default:
          results = [...results].sort(
            (a, b) =>
              b.purchasedAt.getTime() -
              a.purchasedAt.getTime()
          );
      }

      return results;
    }, [games, search, sort]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

        <div className="flex-1">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search your library..."
          />
        </div>

        <div className="w-full lg:w-64">
          <SortDropdown
            value={sort}
            onChange={setSort}
          />
        </div>

      </div>

      <p className="text-sm text-zinc-400">
        Showing {filtered.length} of{" "}
        {games.length} games
      </p>

      {games.length === 0 ? (
        <LibraryEmpty />
      ) : filtered.length === 0 ? (
        <EmptySearch
          query={search}
        />
      ) : (
        <LibraryGrid
          games={filtered}
        />
      )}

    </div>
  );
}