import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialVisual, BrandIcon } from "@/components/ui/brand-art";
import { ProductCard } from "@/components/shop/product-card";
import { Reveal } from "@/components/ui/reveal";
import { ReviewsSection } from "@/components/home/reviews-section";
import { COCOCREME } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Skincare",
  description:
    "Considered skincare from REFORA. Meet COCOCRÈME — coconut milk soap with colloidal oatmeal that gently cleanses, nourishes and leaves skin soft.",
  alternates: { canonical: "/skincare" },
  openGraph: {
    title: "Skincare | REFORA",
    description: "Considered formulations for daily care.",
    type: "website",
  },
};

export default function SkincarePage() {
  return (
    <>
      {/* ═══ Hero ══════════════════════════════════════════════════════ */}
      <section className="relative bg-cream overflow-hidden grain grain-light">
        <div className="container-refora relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <p className="eyebrow mb-4">The skincare range</p>
              <h1
                className="font-serif font-light text-espresso leading-[1.04] text-balance mb-6"
                style={{ fontSize: "var(--text-headline)" }}
              >
                Care that asks
                <br />
                <span className="italic text-clay">very little of you.</span>
              </h1>
              <p className="text-espresso/68 leading-relaxed max-w-md text-pretty mb-8">
                One bar, made properly, used every day. Considered formulations that do one
                thing well rather than several things vaguely.
              </p>
              <Link href={`/products/${COCOCREME.slug}`} className="btn btn-primary">
                <span>Shop {COCOCREME.name}</span>
                <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </Reveal>

            <Reveal delay={110}>
              <EditorialVisual
                tone="glow"
                motif="oat"
                alt="COCOCRÈME — coconut milk soap with colloidal oatmeal"
                className="aspect-[4/3] w-full rounded-sm shadow-[var(--shadow-lifted)]"
                sizes="(min-width: 1024px) 48vw, 100vw"
                priority
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ The product ═══════════════════════════════════════════════ */}
      <section className="section bg-ivory" aria-label="Skincare products">
        <div className="container-refora">
          <Reveal className="mb-10">
            <p className="eyebrow mb-4">Available now</p>
            <h2
              className="font-serif font-light text-espresso leading-[1.08]"
              style={{ fontSize: "var(--text-title)" }}
            >
              One product, to begin with.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            <Reveal>
              <ProductCard product={COCOCREME} />
            </Reveal>

            <Reveal delay={110} className="sm:col-span-1 lg:col-span-2">
              <div className="h-full flex flex-col justify-center border border-sand rounded-sm bg-soft-white p-8 md:p-12">
                <p className="eyebrow mb-5">Why only one</p>
                <p
                  className="font-serif font-light text-espresso leading-snug mb-6 text-balance"
                  style={{ fontSize: "var(--text-title)" }}
                >
                  Because a range should earn its shelf, one product at a time.
                </p>
                <p className="text-espresso/65 leading-relaxed text-pretty mb-8 max-w-lg">
                  COCOCRÈME took longer than it should have. Coconut milk behaves differently
                  from water in a cold-process bar, and colloidal oatmeal has to be milled
                  finely enough to stay suspended rather than settle. We kept adjusting until
                  it felt right on skin — then stopped.
                </p>

                <ul className="grid sm:grid-cols-3 gap-6">
                  {COCOCREME.benefits.map((b) => (
                    <li key={b.title}>
                      <BrandIcon name={b.icon} className="w-6 h-6 text-gold mb-3" />
                      <p className="text-sm font-medium text-espresso mb-1">{b.title}</p>
                      <p className="text-xs text-espresso/60 leading-relaxed">{b.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ How to use ════════════════════════════════════════════════ */}
      <section className="section bg-espresso text-ivory relative overflow-hidden grain">
        <div className="container-refora relative">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
            <Reveal>
              <p className="eyebrow text-gold mb-4">The ritual</p>
              <h2
                className="font-serif font-light text-ivory leading-[1.08] text-balance mb-6"
                style={{ fontSize: "var(--text-headline)" }}
              >
                Four steps,
                <br />
                <span className="italic text-gold-soft">thirty seconds.</span>
              </h2>
              <p className="text-ivory/65 leading-relaxed text-pretty">
                Nothing complicated. The only thing worth being deliberate about is letting
                the lather sit a moment before you rinse.
              </p>
            </Reveal>

            <Reveal delay={110}>
              <ol className="space-y-7">
                {COCOCREME.howToUse.map((step, i) => (
                  <li key={i} className="flex gap-6 pb-7 border-b border-ivory/12 last:border-0 last:pb-0">
                    <span
                      className="font-serif text-3xl font-light text-gold/70 shrink-0 tnum leading-none"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-ivory/75 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <ReviewsSection />
    </>
  );
}
