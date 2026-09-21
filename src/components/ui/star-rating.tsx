import { Star } from "lucide-react";

/**
 * Five-star display.
 *
 * Deliberately lives in its own module with no data imports.
 *
 * It previously sat in `reviews-section.tsx`, which is fine until that file
 * becomes a server component that queries the database — then every client
 * component importing StarRating drags the Drizzle/Neon module graph into the
 * browser bundle along with it. That happened: the database schema, including
 * `admin_users` and `password_hash`, ended up in a public JS chunk.
 *
 * Keep presentational pieces like this free of server-only imports so client
 * components can use them safely.
 */
export function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className={i < Math.round(rating) ? "fill-gold text-gold" : "fill-sand text-sand"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
