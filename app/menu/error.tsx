"use client";

import { AlertTriangle } from "lucide-react";

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 font-serif text-2xl font-bold text-warm-900">
          Something went wrong
        </h2>
        <p className="mt-2 text-warm-500">
          {error.message || "Failed to load the menu. Please try again."}
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
