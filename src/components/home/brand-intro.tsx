import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialVisual } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";

/**
 * Brand story — the dark, moody panel from the brand board
 * ("More than a routine. A ritual.").
 */
export function BrandIntro() {
  return (
    <section className="relative bg-espresso text-ivory overflow-hidden" aria-label="The REFORA story">
      <div className="grid lg:grid-cols-2 items-stretch">
        {/* ── Visual ─────────────────────────────────────────────────── */}
        <EditorialVisual
          tone="dark"
          motif="leaf"
          alt="A quiet moment — the REFORA ritual"
          className="min-h-[340px] lg:min-h-[640px] order-1"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />

        {/* ── Copy ───────────────────────────────────────────────────── */}
        <div className="order-2 flex items-center grain">
          <div className="px-6 sm:px-10 lg:px-16 xl:px-24 py-16 md:py-24 max-w-xl relative">
            <Reveal>
              <p className="eyebrow text-gold mb-6">The REFORA story</p>
            </Reveal>

            <Reveal delay={80}>
              <h2
                className="font-serif font-light leading-[1.05] text-ivory mb-7 text-balance"
                style={{ fontSize: "var(--text-headline)" }}
              >
                More than a routine.
                <br />
                <span className="italic text-gold-soft">A ritual.</span>
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <div className="space-y-5 text-ivory/72 leading-relaxed text-pretty">
                <p>
                  REFORA began with an ordinary observation: the things we use most are the
                  things we think about least. A bar of soap. A spoon of oil. Small objects,
                  reached for without a second thought, several times a day.
                </p>
                <p>
                  We wanted to make those objects worth noticing — not louder or more
                  complicated, just better made. Ingredients chosen for how they behave rather
                  than how they read. Formulations that do one thing properly.
                </p>
                <p className="text-ivory/85">
                  Restore what the day takes. Renew what care can give back. That is the whole
                  idea, and it is enough.
                </p>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link href="/about" className="btn btn-invert">
                  <span>Read our story</span>
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <p className="tagline text-sm text-gold/75 mt-10">Restore · Renew · Refora.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
