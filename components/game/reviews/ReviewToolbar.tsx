"use client";

interface ReviewToolbarProps {
  sortBy: string;
  filterBy: string;

  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export function ReviewToolbar({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
}: ReviewToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-400">
          Sort
        </span>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
          <option value="hours">Highest Playtime</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-400">
          Filter
        </span>

        <select
          value={filterBy}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
        >
          <option value="all">All Reviews</option>
          <option value="positive">Recommended</option>
          <option value="negative">Not Recommended</option>
        </select>
      </div>
    </div>
  );
}