import { BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { StarRating } from "@/components/ui/star-rating";
import { getApprovedReviews } from "@/lib/reviews";

/**
 * Customer reviews.
 * Wired directly to the Postgres database. 
 * Hides completely if there are no approved reviews yet.
 */
export async function ReviewsSection() {
  const reviews = await getApprovedReviews(3); // Fetch 3 most recent

  if (reviews.length === 0) return null;

  const average =
    Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <section className="section bg-cream relative overflow-hidden grain grain-light" aria-label="Customer reviews">
      <div className="container-refora relative">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="eyebrow mb-4">In their words</p>
          <h2
            className="font-serif font-light text-espresso leading-[1.08] text-balance mb-6"
            style={{ fontSize: "var(--text-headline)" }}
          >
            Early readers of the ritual.
          </h2>

          <div className="flex items-center justify-center gap-3">
            <StarRating rating={average} size={16} />
            <p className="text-sm text-espresso/65">
              <span className="tnum font-medium text-espresso">{average}</span> average ·{" "}
              <span className="tnum">{reviews.length}</span> reviews
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={i * 110}>
              <figure className="h-full flex flex-col bg-soft-white border border-sand rounded-sm p-7 card card-hover">
                <StarRating rating={review.rating} />

                {review.title && (
                  <figcaption className="font-serif text-xl text-espresso mt-4 mb-3 leading-snug">
                    {review.title}
                  </figcaption>
                )}

                <blockquote className="text-sm text-espresso/68 leading-relaxed flex-1 text-pretty">
                  {review.body}
                </blockquote>

                <div className="mt-6 pt-5 border-t border-sand flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-full bg-cream border border-sand flex items-center justify-center font-serif text-sm text-clay shrink-0"
                    aria-hidden="true"
                  >
                    {review.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-espresso truncate">{review.name}</p>
                    <p className="text-xs text-espresso/50 flex items-center gap-1.5">
                      {review.location}
                      {review.verified && (
                        <>
                          {review.location && <span aria-hidden="true">·</span>}
                          <BadgeCheck size={12} strokeWidth={1.6} className="text-gold" aria-hidden="true" />
                          Verified
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
