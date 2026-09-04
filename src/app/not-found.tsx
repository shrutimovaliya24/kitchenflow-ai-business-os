import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl font-semibold text-brand-600">404</p>
      <p className="mt-2 text-sm text-ink-500">
        This page is not part of the Business OS Portal.
      </p>
      <Link
        href="/"
        className="focus-ring mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
