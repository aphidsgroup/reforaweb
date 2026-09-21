"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { HOME_FAQS } from "@/lib/catalog";

const PREVIEW_COUNT = 4;

export function HomeFaqs() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = HOME_FAQS.slice(0, PREVIEW_COUNT);

  return (
    <section className="section bg-ivory" aria-label="Frequently asked questions">
      <div className="container-refora">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-start">
          {/* ── Heading ────────────────────────────────────────────────── */}
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow mb-4">Good to know</p>
            <h2
              className="font-serif font-light text-espresso leading-[1.08] text-balance mb-6"
              style={{ fontSize: "var(--text-headline)" }}
            >
              Questions,
              <br />
              <span className="italic text-clay">answered plainly.</span>
            </h2>
            <p className="text-espresso/65 text-pretty mb-7 max-w-sm">
              If something is not covered here, message us on WhatsApp — we answer the same day.
            </p>
            <Link href="/faqs" className="link-underline">
              All questions
              <ArrowRight size={13} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </Reveal>

          {/* ── Accordion ──────────────────────────────────────────────── */}
          <Reveal delay={100}>
            <dl className="border-t border-sand">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={faq.q} className="border-b border-sand">
                    <dt>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-trigger-${i}`}
                        className="w-full flex items-start justify-between gap-6 text-left py-6 group"
                      >
                        <span
                          className={cn(
                            "font-serif text-lg md:text-xl leading-snug transition-colors duration-300",
                            isOpen ? "text-espresso" : "text-espresso/80 group-hover:text-espresso"
                          )}
                        >
                          {faq.q}
                        </span>
                        <Plus
                          size={18}
                          strokeWidth={1.3}
                          aria-hidden="true"
                          className={cn(
                            "shrink-0 mt-1 text-clay transition-transform duration-[450ms] ease-[var(--ease-out-soft)]",
                            isOpen && "rotate-45"
                          )}
                        />
                      </button>
                    </dt>

                    <dd
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      hidden={!isOpen}
                      className="pb-7 -mt-1 pr-10"
                    >
                      <p className="text-espresso/68 leading-relaxed text-pretty">{faq.a}</p>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
