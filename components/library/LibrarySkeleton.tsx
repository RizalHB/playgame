import { LibraryCardSkeleton } from "./LibraryCardSkeleton";

export function LibrarySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <LibraryCardSkeleton
          key={index}
        />
      ))}
    </div>
  );
}