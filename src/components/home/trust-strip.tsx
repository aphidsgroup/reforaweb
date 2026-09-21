import { TRUST_POINTS } from "@/lib/catalog";

/**
 * Continuous trust marquee directly below the hero, in the manner of the
 * client's reference site. Duplicated track so the loop is seamless; the
 * copy is aria-hidden so screen readers hear the list once.
 */
export function TrustStrip() {
  return (
    <section
      className="bg-espresso text-cream py-3.5 border-y border-espresso-800 overflow-hidden"
      aria-label="What we stand for"
    >
      <div className="marquee">
        {[0, 1].map((track) => (
          <div
            key={track}
            className="marquee__track"
            aria-hidden={track === 1 ? "true" : undefined}
          >
            {TRUST_POINTS.map((point) => (
              <div key={point} className="flex items-center gap-3 whitespace-nowrap">
                <span className="w-1 h-1 rounded-full bg-gold shrink-0" aria-hidden="true" />
                <span className="text-[0.6875rem] md:text-xs tracking-[0.18em] uppercase text-cream/85">
                  {point}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
