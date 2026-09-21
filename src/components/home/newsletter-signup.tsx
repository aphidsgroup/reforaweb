"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { LeafMotif } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";
import { LAUNCH_OFFER } from "@/lib/catalog";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative bg-espresso text-ivory overflow-hidden grain" aria-label="Join the REFORA list">
      {/* Botanical watermarks */}
      <div className="absolute -left-16 -bottom-24 w-72 text-gold opacity-[0.10] rotate-[-12deg]" aria-hidden="true">
        <LeafMotif className="w-full h-auto" />
      </div>
      <div className="absolute -right-20 -top-28 w-80 text-gold opacity-[0.08] rotate-[160deg]" aria-hidden="true">
        <LeafMotif className="w-full h-auto" />
      </div>

      <div className="container-refora relative section">
        <Reveal className="max-w-xl mx-auto text-center">
          <p className="eyebrow text-gold mb-5">{LAUNCH_OFFER.label}</p>

          <h2
            className="font-serif font-light text-ivory leading-[1.08] text-balance mb-4"
            style={{ fontSize: "var(--text-headline)" }}
          >
            {LAUNCH_OFFER.headline}
          </h2>

          <p className="text-ivory/70 mb-2 text-pretty">
            Join the list for {LAUNCH_OFFER.detail.toLowerCase()}, plus first word on
            REFORA ORGANIC.
          </p>
          <p className="text-sm text-gold/85 tracking-[0.12em] uppercase mb-9">
            Use code {LAUNCH_OFFER.code}
          </p>

          {status === "success" ? (
            <p className="inline-flex items-center gap-2.5 text-ivory/90 py-4" role="status">
              <Check size={17} strokeWidth={1.6} className="text-gold" aria-hidden="true" />
              Thank you — you are on the list.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                autoComplete="email"
                className="input-refora flex-1 bg-ivory/[0.06] border-ivory/25 text-ivory placeholder:text-ivory/40 focus:border-gold"
              />
              <button type="submit" className="btn btn-gold shrink-0" disabled={status === "loading"}>
                {status === "loading" ? (
                  <span>Joining…</span>
                ) : (
                  <>
                    <span>Join</span>
                    <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-sm text-rose mt-4" role="alert">
              Something went wrong. Please try again, or email us directly.
            </p>
          )}

          <p className="text-xs text-ivory/40 mt-6">
            A note or two a month. Unsubscribe any time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
