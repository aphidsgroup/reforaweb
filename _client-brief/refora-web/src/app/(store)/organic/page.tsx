"use client";

import { useState } from "react";
import type { Metadata } from "next";

// Note: metadata cannot be exported from 'use client' components.
// Export metadata from a separate server component or use generateMetadata
// in a layout/page wrapper. The values below are for reference.
// export const metadata: Metadata = { ... }

// Category cards for organic range
const ORGANIC_CATEGORIES = [
  {
    id: "coconut-oil",
    name: "Coconut Oil",
    tagline: "Cold-pressed. Pure. Versatile.",
    description:
      "Traditional cold-pressed coconut oil — for cooking, hair, and skin. Naturally rich and unrefined.",
    icon: "🥥",
    comingSoon: true,
  },
  {
    id: "groundnut-oil",
    name: "Groundnut Oil",
    tagline: "Naturally pressed. Deeply nourishing.",
    description:
      "Expeller-pressed groundnut oil with its characteristic warmth. A kitchen essential with a clean finish.",
    icon: "🥜",
    comingSoon: true,
  },
  {
    id: "ghee",
    name: "Ghee",
    tagline: "Slow-cooked. Traditionally made.",
    description:
      "Clarified butter made the traditional way — slow-cooked to develop depth of flavour and aroma.",
    icon: "🫙",
    comingSoon: true,
  },
  {
    id: "future-organics",
    name: "More Organic Products",
    tagline: "Thoughtfully sourced. Coming soon.",
    description:
      "We are carefully selecting ingredients that meet our standards of purity and provenance. More to come.",
    icon: "🌾",
    comingSoon: true,
  },
];

// Notify form for individual product
function NotifyForm({ productId }: { productId: string }) {
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
        body: JSON.stringify({
          email,
          source: `organic_notify_${productId}`,
        }),
      });
      if (res.ok || res.status === 409) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-xs text-[#29231F]/60 py-2">
        ✓ We&apos;ll notify you when this is available.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="input-refora flex-1 text-xs py-2"
        aria-label={`Notify me when ${productId} is available`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-secondary text-xs px-3 py-2 flex-shrink-0"
      >
        {status === "loading" ? "…" : "Notify me"}
      </button>
      {status === "error" && (
        <span className="text-xs text-red-500" role="alert">
          Error
        </span>
      )}
    </form>
  );
}

// Page component — client because of NotifyForm
export default function OrganicPage() {
  return (
    <div className="bg-[#F7F2E9] min-h-screen">
      {/* Hero */}
      <section className="bg-[#29231F] text-[#EFE5D5] py-20 text-center">
        <div className="container-refora max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.18em] text-[#C7A56A] uppercase mb-5">
            REFORA ORGANIC
          </p>
          <h1 className="font-serif text-5xl lg:text-7xl font-light leading-tight mb-6">
            Pure essentials.
            <br />
            <em className="italic text-[#C7A56A]">Naturally sourced.</em>
          </h1>
          <p className="text-base text-[#EFE5D5]/70 leading-relaxed max-w-xl mx-auto">
            Thoughtfully chosen everyday essentials rooted in simplicity,
            purity and tradition. No shortcuts. No compromise.
          </p>
          <div className="mt-8 inline-block bg-[#C7A56A]/20 border border-[#C7A56A]/40 rounded-sm px-5 py-2">
            <span className="text-xs tracking-[0.16em] text-[#C7A56A] uppercase">
              Coming soon — join the waitlist below
            </span>
          </div>
        </div>
      </section>

      {/* Horizontal category cards */}
      <section className="container-refora py-16">
        <div className="flex items-center gap-4 mb-10">
          <span className="gold-rule" aria-hidden="true" />
          <p className="text-xs tracking-[0.14em] text-[#29231F]/50 uppercase">
            Organic Range
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ORGANIC_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative bg-[#EFE5D5] rounded-sm p-6 flex flex-col gap-4 border border-[#E4D5C2]"
              aria-label={`${cat.name} — Coming soon`}
            >
              {/* Coming Soon badge — always visible, no purchase CTA */}
              <span className="absolute top-4 right-4 bg-[#C7A56A]/20 text-[#C7A56A] text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-sm border border-[#C7A56A]/30">
                Coming Soon
              </span>

              <span className="text-3xl" aria-hidden="true">
                {cat.icon}
              </span>

              <div>
                <h2 className="font-serif text-xl text-[#29231F] mb-1">
                  {cat.name}
                </h2>
                <p className="text-xs text-[#C7A56A] tracking-wide mb-3">
                  {cat.tagline}
                </p>
                <p className="text-xs text-[#29231F]/60 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Email notification signup — no price, no stock */}
              <div className="mt-auto">
                <p className="text-xs text-[#29231F]/50 mb-1">
                  Notify me when available:
                </p>
                <NotifyForm productId={cat.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values strip */}
      <section className="bg-[#EFE5D5] py-14 border-t border-[#E4D5C2]">
        <div className="container-refora max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-6">
            Our principles
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-[#29231F] mb-8">
            What makes REFORA ORGANIC different
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: "Purity",
                body: "Single-ingredient or minimal formulations. Nothing hidden, nothing added without reason.",
              },
              {
                title: "Provenance",
                body: "Sourced from trusted origins with a traceable supply chain. We know where everything comes from.",
              },
              {
                title: "Tradition",
                body: "Methods that have worked for generations — cold-pressing, slow-cooking, minimal processing.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="text-left">
                <h3 className="font-serif text-xl text-[#29231F] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[#29231F]/60 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
