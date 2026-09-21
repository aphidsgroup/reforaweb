import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialVisual, BrandIcon, LeafMotif } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "REFORA began with an ordinary observation: the things we use most are the things we think about least. Considered skincare and pure organic essentials, made in India.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our Story | REFORA",
    description: "A more thoughtful everyday ritual.",
    type: "website",
  },
};

const VALUES = [
  {
    icon: "leaf" as const,
    title: "Ingredients that earn their place",
    body: "Every component is there because of what it does on skin or in a pan — not because it photographs well on a label.",
  },
  {
    icon: "droplet" as const,
    title: "One thing, done properly",
    body: "We would rather make a short range well than a long one adequately. New products arrive when they are ready, not when the calendar says so.",
  },
  {
    icon: "jar" as const,
    title: "Plainly said",
    body: "No miracle claims, no invented science. What a product does, we say. What it does not, we do not imply.",
  },
  {
    icon: "shield" as const,
    title: "Made in India, sourced close",
    body: "Growers, dairies and makers we can name — in batches small enough that someone is actually watching.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ═══ Hero ══════════════════════════════════════════════════════ */}
      <section className="relative bg-cream overflow-hidden grain grain-light">
        <div
          className="absolute -right-12 -top-16 w-80 text-espresso opacity-[0.07] rotate-12 pointer-events-none"
          aria-hidden="true"
        >
          <LeafMotif className="w-full h-auto" />
        </div>

        <div className="container-refora relative py-20 md:py-28 text-center">
          <Reveal>
            <p className="eyebrow mb-5">Our story</p>
            <h1
              className="font-serif font-light text-espresso leading-[1.04] text-balance max-w-3xl mx-auto mb-7"
              style={{ fontSize: "var(--text-headline)" }}
            >
              The things we use most are the things we think about{" "}
              <span className="italic text-clay">least.</span>
            </h1>
            <p className="tagline text-sm text-clay">Restore · Renew · Refora.</p>
          </Reveal>
        </div>
      </section>

      {/* ═══ The beginning ═════════════════════════════════════════════ */}
      <section className="section bg-ivory">
        <div className="container-refora">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <EditorialVisual
                tone="warm"
                motif="leaf"
                alt="The beginning of REFORA"
                className="aspect-[4/5] w-full rounded-sm shadow-[var(--shadow-lifted)]"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </Reveal>

            <Reveal delay={110}>
              <p className="eyebrow mb-4">How it started</p>
              <h2
                className="font-serif font-light text-espresso leading-[1.08] text-balance mb-7"
                style={{ fontSize: "var(--text-headline)" }}
              >
                A bar of soap,
                <br />
                <span className="italic text-clay">reconsidered.</span>
              </h2>

              <div className="space-y-5 text-espresso/70 leading-relaxed text-pretty">
                <p>
                  A bar of soap. A spoon of oil. Small objects, reached for without a second
                  thought, several times a day. We wanted to make those objects worth
                  noticing — not louder or more complicated, just better made.
                </p>
                <p>
                  COCOCRÈME was where that started. Coconut milk behaves differently from
                  water in a cold-process bar; colloidal oatmeal has to be milled fine enough
                  to stay suspended rather than settle at the bottom. It took longer than we
                  planned. It was worth it.
                </p>
                <p className="text-espresso/85">
                  Restore what the day takes. Renew what care can give back. That is the whole
                  idea, and it is enough.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ Philosophy ════════════════════════════════════════════════ */}
      <section className="section bg-espresso text-ivory relative overflow-hidden grain">
        <div className="container-refora relative">
          <Reveal className="max-w-2xl mb-14">
            <p className="eyebrow text-gold mb-4">What we hold to</p>
            <h2
              className="font-serif font-light text-ivory leading-[1.08] text-balance"
              style={{ fontSize: "var(--text-headline)" }}
            >
              More than a routine.
              <br />
              <span className="italic text-gold-soft">A ritual.</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 90}>
                <div className="flex gap-5 pb-9 border-b border-ivory/12">
                  <span className="w-12 h-12 rounded-full border border-ivory/25 flex items-center justify-center shrink-0">
                    <BrandIcon name={value.icon} className="w-5 h-5 text-gold" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-light text-ivory mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-ivory/62 leading-relaxed text-pretty">
                      {value.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Where we are going ════════════════════════════════════════ */}
      <section className="section bg-soft-white">
        <div className="container-refora">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal delay={110} className="order-2 lg:order-1">
              <p className="eyebrow mb-4">Where this goes</p>
              <h2
                className="font-serif font-light text-espresso leading-[1.08] text-balance mb-7"
                style={{ fontSize: "var(--text-headline)" }}
              >
                Two shelves,
                <br />
                <span className="italic text-clay">one standard.</span>
              </h2>

              <div className="space-y-5 text-espresso/70 leading-relaxed text-pretty mb-9">
                <p>
                  Skincare is where we began. REFORA ORGANIC is where we are heading — cold
                  pressed oils and bilona ghee, held to exactly the same standard as what goes
                  on your skin.
                </p>
                <p>
                  It is the same question either way: what would this be like if nothing about
                  it were rushed?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop" className="btn btn-primary">
                  <span>Shop the range</span>
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <Link href="/organic" className="btn btn-secondary">
                  <span>REFORA Organic</span>
                </Link>
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <EditorialVisual
                tone="glow"
                motif="oat"
                alt="REFORA ORGANIC — what comes next"
                className="aspect-[4/3] w-full rounded-sm shadow-[var(--shadow-lifted)]"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
