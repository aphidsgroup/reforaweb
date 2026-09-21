import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { ProductVisual } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";
import { COCOCREME } from "@/lib/catalog";

/**
 * Editorial split hero — type on the left, product study on the right.
 * On mobile the product sits above the copy so the first thing seen is
 * the thing being sold.
 */
export function HeroSection() {
  return (
    <section className="relative bg-cream overflow-hidden" aria-label="COCOCRÈME — featured">
      <div className="container-refora">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-7 lg:gap-16 items-center lg:min-h-[calc(100svh-7rem)] py-8 md:py-12 lg:py-20">
          {/* ── Copy ───────────────────────────────────────────────────── */}
          <div className="order-2 lg:order-1 max-w-xl">
            <Reveal>
              <p className="tagline text-xs md:text-sm text-clay mb-5 md:mb-7">
                Restore · Renew · Refora.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1
                className="font-serif font-light leading-[0.98] text-espresso text-balance mb-6"
                style={{ fontSize: "var(--text-display)" }}
              >
                Gentle care
                <br />
                for a brighter
                <br />
                <span className="italic text-clay">tomorrow.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-base md:text-lg text-espresso/70 leading-relaxed max-w-md mb-8 text-pretty">
                Meet {COCOCREME.name} — a coconut milk soap with colloidal oatmeal.
                Gently cleanses, nourishes, and leaves skin soft.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-col sm:flex-row gap-3 mb-9">
                <Link href={`/products/${COCOCREME.slug}`} className="btn btn-primary btn-lg">
                  <span>Shop {COCOCREME.name}</span>
                  <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <Link href="/about" className="btn btn-secondary btn-lg">
                  <span>Our story</span>
                </Link>
              </div>
            </Reveal>

            {/* Social proof — quiet, not shouted */}
            <Reveal delay={320}>
              <div className="flex items-center gap-4 pt-7 border-t border-sand/80">
                <div className="flex items-center gap-1" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-gold text-gold" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-espresso/65">
                  <span className="tnum font-medium text-espresso">{COCOCREME.rating}</span> from{" "}
                  <span className="tnum">{COCOCREME.reviewCount}</span> early reviews
                </p>
              </div>
            </Reveal>
          </div>

          {/* ── Product study ──────────────────────────────────────────── */}
          <Reveal delay={120} className="order-1 lg:order-2">
            <div className="relative">
              <ProductVisual
                kind="carton"
                tone="glow"
                alt={`${COCOCREME.name} — ${COCOCREME.subtitle}`}
                label={COCOCREME.name}
                sublabel="Coconut Milk Soap"
                src={COCOCREME.imageUrl}
                priority
                animate
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="aspect-[16/11] sm:aspect-[5/4] lg:aspect-[4/5] w-full rounded-sm shadow-[var(--shadow-deep)]"
              />

              {/* Floating detail card — anchors scale and adds depth */}
              <div className="hidden sm:block absolute -bottom-6 -left-4 lg:-left-8 bg-soft-white border border-sand rounded-sm px-5 py-4 shadow-[var(--shadow-lifted)] max-w-[220px]">
                <p className="eyebrow mb-1.5">{COCOCREME.badge}</p>
                <p className="font-serif text-lg leading-tight text-espresso">
                  {COCOCREME.subtitle}
                </p>
                <p className="text-xs text-espresso/55 mt-1.5 tnum">{COCOCREME.size}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
