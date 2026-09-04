"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-10">
      <ErrorState
        title="This module failed to load"
        description={error.message || "An unexpected error occurred."}
        onRetry={reset}
      />
    </div>
  );
}
