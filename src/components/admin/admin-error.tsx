import { AlertTriangle } from "lucide-react";

/**
 * Shown when an admin query fails.
 *
 * The overwhelmingly likely cause during setup is a missing or unreachable
 * DATABASE_URL, so the copy says so plainly rather than showing a blank page.
 * The underlying message is rendered in development only — in production it
 * could leak connection details.
 */
export function AdminError({
  title,
  error,
}: {
  title: string;
  error: unknown;
}) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-2xl">
      <div className="bg-soft-white border border-rose/40 rounded-sm p-7">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={18} strokeWidth={1.5} className="text-rose" aria-hidden="true" />
          <h1 className="font-serif text-2xl font-light text-espresso">{title}</h1>
        </div>

        <p className="text-sm text-espresso/70 leading-relaxed mb-4">
          The database could not be reached. Check that <code className="text-espresso">DATABASE_URL</code>{" "}
          is set in <code className="text-espresso">.env.local</code> and that the migrations have
          been applied with <code className="text-espresso">npm run db:migrate</code>.
        </p>

        {process.env.NODE_ENV !== "production" && (
          <pre className="text-xs text-espresso/55 bg-cream border border-sand rounded-sm p-4 overflow-x-auto whitespace-pre-wrap">
            {message}
          </pre>
        )}
      </div>
    </div>
  );
}
