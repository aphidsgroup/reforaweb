import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialVisual, ProductVisual, BrandIcon, OatSprigMotif } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { ORGANIC_PRODUCTS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "REFORA ORGANIC — Pure essentials, naturally sourced",
  description:
    "Cold pressed coconut oil, groundnut oil and bilona ghee. Thoughtfully chosen everyday essentials rooted in simplicity, purity and tradition.",
  alternates: { canonical: "/organic" },
  openGraph: {
    title: "REFORA ORGANIC | REFORA",
    description: "Pure essentials. Naturally sourced.",
    type: "website",
  },
};

const PRINCIPLES = [
  {
    icon: "leaf" as const,
    title: "Nothing refined away",
    body: "Unrefined, unbleached, undeodorised. What the press yields is what reaches the bottle.",
  },
  {
    icon: "droplet" as const,
    title: "Pressed slow and cold",
    body: "Traditional wood churns turn slowly enough that the oil never overheats.",
  },
  {
    icon: "jar" as const,
    title: "Traceable to the source",
    body: "Sourced direct from growers and dairies we can name, in batches small enough to watch.",
  },
];

export default function OrganicPage() {
  return (
    <>
      {/* ═══ Hero ══════════════════════════════════════════════════════ */}
      <section className="relative bg-espresso text-ivory overflow-hidden grain" aria-label="REFORA ORGANIC">
        <div
          className="absolute -right-16 top-0 h-full w-72 text-gold opacity-[0.10] pointer-events-none"
          aria-hidden="true"
        >
          <OatSprigMotif className="h-full w-auto" />
        </div>
        <div
          className="absolute -left-20 bottom-0 h-3/4 w-64 text-gold opacity-[0.07] rotate-180 pointer-events-none"
          aria-hidden="true"
        >
          <OatSprigMotif className="h-full w-auto" />
        </div>

        <div className="container-refora relative py-20 md:py-32 text-center">
          <Reveal>
            <p className="eyebrow text-gold mb-6">Coming soon</p>
            <h1 className="wordmark text-3xl md:text-5xl lg:text-6xl text-ivory mb-7">
              REFORA ORGANIC
            </h1>
            <p
              className="font-serif font-light italic text-gold-soft mb-6"
              style={{ fontSize: "var(--text-title)" }}
            >
              Pure essentials. Naturally sourced.
            </p>
            <p className="text-ivory/70 max-w-xl mx-auto leading-relaxed text-pretty">
              Thoughtfully chosen everyday essentials rooted in simplicity, purity and
              tradition.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href="#range" className="btn btn-gold">
                <span>See the range</span>
                <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
              <a href="#notify" className="btn btn-invert">
                <span>Tell me when it launches</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ Categories ════════════════════════════════════════════════ */}
      <section className="section bg-cream relative overflow-hidden grain grain-light" id="range">
        <div className="container-refora relative">
          <Reveal className="max-w-2xl mb-12 md:mb-16">
            <p className="eyebrow mb-4">The range</p>
            <h2
              className="font-serif font-light text-espresso leading-[1.08] text-balance mb-5"
              style={{ fontSize: "var(--text-headline)" }}
            >
              Three things,
              <br />
              <span className="italic text-clay">made properly.</span>
            </h2>
            <p className="text-espresso/65 text-pretty">
              We are starting with the essentials a kitchen actually reaches for every day.
              More will follow, but only when it is worth making.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {ORGANIC_PRODUCTS.map((product, i) => (
              <Reveal key={product.id} delay={i * 110}>
                <article className="group h-full flex flex-col bg-soft-white border border-sand rounded-sm overflow-hidden card card-hover">
                  <div className="relative overflow-hidden">
                    <ProductVisual
                      kind="bottle"
                      tone={i === 1 ? "glow" : "warm"}
                      alt={`${product.name} — ${product.subtitle}`}
                      label={product.name.replace("Cold Pressed ", "").toUpperCase()}
                      src={product.imageUrl}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="aspect-[4/5] w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-4 left-4 pill pill-gold">{product.badge}</span>
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <p className="eyebrow mb-2.5">{product.category}</p>
                    <h3 className="font-serif text-2xl font-light text-espresso mb-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-clay mb-4 tnum">{product.subtitle}</p>
                    <p className="text-sm text-espresso/65 leading-relaxed mb-6 flex-1 text-pretty">
                      {product.shortDescription}
                    </p>

                    <Link href={`/products/${product.slug}`} className="link-underline self-start">
                      Read the detail
                      <ArrowRight size={13} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Future products */}
          <Reveal delay={120}>
            <div className="mt-6 lg:mt-7 border border-dashed border-sand rounded-sm bg-soft-white/50 px-7 py-10 text-center">
              <p className="font-serif text-2xl font-light text-espresso mb-2">
                And more, in time.
              </p>
              <p className="text-sm text-espresso/60 max-w-md mx-auto text-pretty">
                Further organic and natural essentials are in sourcing. We would rather add
                slowly than add often.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ Principles ════════════════════════════════════════════════ */}
      <section className="section bg-soft-white" aria-label="How we make it">
        <div className="container-refora">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <EditorialVisual
                tone="warm"
                motif="oat"
                alt="Wood-churn cold pressing"
                className="aspect-[4/3] w-full rounded-sm shadow-[var(--shadow-lifted)]"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </Reveal>

            <Reveal delay={110}>
              <p className="eyebrow mb-4">Our standard</p>
              <h2
                className="font-serif font-light text-espresso leading-[1.08] text-balance mb-9"
                style={{ fontSize: "var(--text-headline)" }}
              >
                Slow is not a
                <br />
                <span className="italic text-clay">marketing word.</span>
              </h2>

              <ul className="space-y-7">
                {PRINCIPLES.map((p) => (
                  <li key={p.title} className="flex gap-5">
                    <span className="w-12 h-12 rounded-full border border-sand flex items-center justify-center shrink-0">
                      <BrandIcon name={p.icon} className="w-5 h-5 text-gold" />
                    </span>
                    <div>
                      <h3 className="font-serif text-xl font-light text-espresso mb-1.5">
                        {p.title}
                      </h3>
                      <p className="text-sm text-espresso/65 leading-relaxed text-pretty">
                        {p.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ Detail table — every field the brief asked for ════════════ */}
      <section className="section bg-cream" aria-label="Product detail">
        <div className="container-refora">
          <Reveal className="mb-12">
            <p className="eyebrow mb-4">In detail</p>
            <h2
              className="font-serif font-light text-espresso leading-[1.08]"
              style={{ fontSize: "var(--text-headline)" }}
            >
              Everything, stated plainly.
            </h2>
          </Reveal>

          <div className="space-y-5">
            {ORGANIC_PRODUCTS.map((product, i) => (
              <Reveal key={product.id} delay={i * 90}>
                <article className="bg-soft-white border border-sand rounded-sm p-7 md:p-10">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 mb-7 pb-6 border-b border-sand">
                    <div>
                      <h3 className="font-serif text-2xl font-light text-espresso">
                        {product.name}
                      </h3>
                      <p className="text-sm text-clay mt-1">{product.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-xl text-clay">Price at launch</p>
                      <p className="text-xs text-espresso/50 tnum">{product.size}</p>
                    </div>
                  </div>

                  <dl className="grid md:grid-cols-2 gap-x-12 gap-y-5 text-sm">
                    <div>
                      <dt className="eyebrow mb-1.5">Origin</dt>
                      <dd className="text-espresso/70 leading-relaxed">{product.origin}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow mb-1.5">Ingredients</dt>
                      <dd className="text-espresso/70 leading-relaxed">{product.ingredients}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow mb-1.5">How it is made</dt>
                      <dd className="text-espresso/70 leading-relaxed">{product.process}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow mb-1.5">What makes it different</dt>
                      <dd className="text-espresso/70 leading-relaxed">{product.difference}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="eyebrow mb-2">Suggested uses</dt>
                      <dd className="flex flex-wrap gap-2">
                        {product.suggestedUses?.map((use) => (
                          <span key={use} className="pill">
                            {use}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Notify ════════════════════════════════════════════════════ */}
      <div id="notify">
        <NewsletterSignup />
      </div>
    </>
  );
}
