interface SystemRequirementsProps {
  requirements: any;
}

export function SystemRequirements({
  requirements,
}: SystemRequirementsProps) {
  if (!requirements) {
    return null;
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-8 text-3xl font-bold">
        System Requirements
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Minimum
          </h3>

          <div className="space-y-3 text-zinc-300">
            <p><strong>OS:</strong> {requirements.minimumOS}</p>
            <p><strong>Processor:</strong> {requirements.minimumProcessor}</p>
            <p><strong>Memory:</strong> {requirements.minimumMemory}</p>
            <p><strong>Graphics:</strong> {requirements.minimumGraphics}</p>
            <p><strong>DirectX:</strong> {requirements.minimumDirectX}</p>
            <p><strong>Storage:</strong> {requirements.minimumStorage}</p>

            {requirements.minimumNotes && (
              <p>
                <strong>Notes:</strong> {requirements.minimumNotes}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Recommended
          </h3>

          <div className="space-y-3 text-zinc-300">
            <p><strong>OS:</strong> {requirements.recommendedOS}</p>
            <p><strong>Processor:</strong> {requirements.recommendedProcessor}</p>
            <p><strong>Memory:</strong> {requirements.recommendedMemory}</p>
            <p><strong>Graphics:</strong> {requirements.recommendedGraphics}</p>
            <p><strong>DirectX:</strong> {requirements.recommendedDirectX}</p>
            <p><strong>Storage:</strong> {requirements.recommendedStorage}</p>

            {requirements.recommendedNotes && (
              <p>
                <strong>Notes:</strong> {requirements.recommendedNotes}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}