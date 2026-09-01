import { getCurrentUserId } from "@/lib/auth/current-user";
import { getLibrary } from "@/lib/database/queries/library";

import { LibraryView } from "@/components/library/LibraryView";
import { LibrarySidebar } from "@/components/library/LibrarySidebar";

export default async function LibraryPage() {
  const userId = await getCurrentUserId();

  const games = await getLibrary(userId);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Library
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">

        <LibrarySidebar />

        <LibraryView games={games} />

      </div>
    </main>
  );
}