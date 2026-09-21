import { BrandIcon } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";
import { COCOCREME } from "@/lib/catalog";

/**
 * The three confirmed product claims, set as the brand board draws them:
 * a thin-line icon in a ring, a short label, a line of support copy.
 */
export function ProductDetails() {
  return (
    <section className="section bg-soft-white" aria-label="Why COCOCRÈME">
      <div className="container-refora">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow mb-4">Why it works</p>
          <h2
            className="font-serif font-light text-espresso leading-[1.08] text-balance"
            style={{ fontSize: "var(--text-headline)" }}
          >
            Two ingredients doing
            <br />
            <span className="italic text-clay">the quiet work.</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-8 md:gap-10">
          {COCOCREME.benefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={i * 110}>
              <div className="group">
                <div className="w-16 h-16 rounded-full border border-sand flex items-center justify-center mb-6 transition-colors duration-500 group-hover:border-gold group-hover:bg-gold/[0.06]">
                  <BrandIcon name={benefit.icon} className="w-7 h-7 text-clay transition-colors duration-500 group-hover:text-gold" />
                </div>
                <h3 className="font-serif text-2xl font-light text-espresso mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-espresso/65 leading-relaxed text-pretty">
                  {benefit.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Composition note */}
        <Reveal delay={120}>
          <div className="mt-14 md:mt-20 pt-10 border-t border-sand grid md:grid-cols-[auto_1fr] gap-6 md:gap-14 items-start">
            <p className="eyebrow md:pt-1 whitespace-nowrap">What is in it</p>
            <p className="text-espresso/70 leading-relaxed max-w-3xl text-pretty">
              {COCOCREME.ingredients}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
