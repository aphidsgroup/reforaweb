import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialVisual, ProductVisual } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";
import { ORGANIC_PRODUCTS } from "@/lib/catalog";

/**
 * Both ranges given equal weight on the homepage — the client asked for
 * skincare and REFORA ORGANIC to be represented side by side rather than
 * one buried behind the other.
 */
export function BrandRanges() {
  return (
    <section className="section bg-cream relative overflow-hidden grain grain-light" aria-label="Our ranges">
      <div className="container-refora relative">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="eyebrow mb-4">Two ranges, one intent</p>
          <h2
            className="font-serif font-light text-espresso leading-[1.08] text-balance mb-5"
            style={{ fontSize: "var(--text-headline)" }}
          >
            Considered skincare.
            <br />
            <span className="italic text-clay">Pure everyday essentials.</span>
          </h2>
          <p className="text-espresso/65 text-pretty">
            One brand, two shelves. What goes on your skin, and what goes into your kitchen —
            held to the same standard.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* ── Skincare ──────────────────────────────────────────────── */}
          <Reveal>
            <article className="group h-full flex flex-col bg-soft-white border border-sand rounded-sm overflow-hidden card card-hover">
              <div className="relative overflow-hidden">
                <ProductVisual
                  kind="soap"
                  tone="warm"
                  alt="REFORA Skincare — COCOCRÈME coconut milk soap"
                  label="COCOCRÈME"
                  className="aspect-[4/3] w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <span className="absolute top-4 left-4 pill pill-dark">Available now</span>
              </div>

              <div className="p-7 md:p-9 flex flex-col flex-1">
                <h3 className="font-serif text-3xl font-light text-espresso mb-3">Skincare</h3>
                <p className="text-sm text-espresso/65 leading-relaxed mb-6 flex-1">
                  Considered formulations for daily care, beginning with COCOCRÈME — coconut
                  milk soap with colloidal oatmeal. Gentle enough for every day, made to feel
                  like more than a chore.
                </p>
                <div>
                  <Link href="/skincare" className="btn btn-primary">
                    <span>Explore skincare</span>
                    <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>

          {/* ── REFORA ORGANIC ────────────────────────────────────────── */}
          <Reveal delay={120}>
            <article className="group h-full flex flex-col bg-espresso border border-espresso rounded-sm overflow-hidden transition-shadow duration-500 hover:shadow-[var(--shadow-deep)]">
              <div className="relative overflow-hidden">
                <EditorialVisual
                  tone="dark"
                  motif="oat"
                  alt="REFORA ORGANIC — cold pressed oils and ghee"
                  className="aspect-[4/3] w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <span className="absolute top-4 left-4 pill pill-gold">Coming soon</span>
              </div>

              <div className="p-7 md:p-9 flex flex-col flex-1">
                <h3 className="wordmark text-2xl md:text-[1.75rem] text-ivory mb-3">
                  REFORA ORGANIC
                </h3>
                <p className="text-sm text-ivory/65 leading-relaxed mb-5">
                  Pure essentials. Naturally sourced. Thoughtfully chosen everyday essentials
                  rooted in simplicity, purity and tradition.
                </p>

                <ul className="flex flex-wrap gap-2 mb-7 flex-1 content-start">
                  {ORGANIC_PRODUCTS.map((p) => (
                    <li
                      key={p.id}
                      className="text-[0.6875rem] tracking-[0.12em] uppercase text-ivory/70 border border-ivory/20 rounded-full px-3 py-1.5"
                    >
                      {p.name.replace("Cold Pressed ", "")}
                    </li>
                  ))}
                </ul>

                <div>
                  <Link href="/organic" className="btn btn-invert">
                    <span>Preview the range</span>
                    <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
