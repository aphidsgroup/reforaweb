import { BrandIcon } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";
import { ASSURANCES } from "@/lib/catalog";

/**
 * Shipping, payment and support assurances — the practical reasons to
 * complete a first order, placed just before the closing call to action.
 */
export function AssuranceRow() {
  return (
    <section className="section-tight bg-sand/45 border-y border-sand" aria-label="Shopping with REFORA">
      <div className="container-refora">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-9">
          {ASSURANCES.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <BrandIcon name={item.icon} className="w-7 h-7 text-clay shrink-0" />
                <div>
                  <p className="text-sm font-medium text-espresso mb-1">{item.title}</p>
                  <p className="text-xs md:text-sm text-espresso/60 leading-relaxed text-pretty">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
