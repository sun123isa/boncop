"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-prose p-6">
      <ErrorState
        title="Impossible de charger la page"
        description="Un problème est survenu de notre côté. Réessayez dans un instant."
        onRetry={reset}
        digest={error.digest}
      />
    </div>
  );
}
