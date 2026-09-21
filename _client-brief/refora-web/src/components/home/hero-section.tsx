"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] md:min-h-screen flex items-center bg-[#EFE5D5] overflow-hidden"
      aria-label="Featured product hero"
    >
      {/* Background image placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-[#EFE5D5] via-[#E4D5C2] to-[#EFE5D5]" />
        {/* 
          CLIENT ASSET NEEDED:
          Replace with COCOCRÈME hero photography — soft directional light,
          warm neutral surface, product + packaging in bathroom/wash-area context.
          Recommended dimensions: 2880×1620px, WebP format.
          <Image src="/hero-cocoCreme.jpg" alt="COCOCRÈME coconut milk soap" fill className="object-cover" priority />
        */}
      </div>

      <div className="container-refora relative z-10 py-24 md:py-0">
        <div className="max-w-lg">
          {/* Brand signature */}
          <p className="text-xs tracking-[0.16em] text-[#C7A56A] uppercase mb-6">
            Restore · Renew · Refora.
          </p>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-[#29231F] mb-6">
            Gentle care
            <br />
            for a brighter
            <br />
            tomorrow.
          </h1>

          {/* Sub-line — only confirmed claims from brand board */}
          <p className="text-base md:text-lg text-[#29231F]/75 leading-relaxed mb-8 max-w-sm">
            Meet COCOCRÈME — a coconut milk soap with colloidal oatmeal.
            Gently cleanses, nourishes, and leaves skin soft.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/products/cococreme" className="btn btn-primary">
              Shop COCOCRÈME
            </Link>
            <Link href="/about" className="btn btn-secondary">
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Product image — right side on desktop */}
      <div className="hidden md:flex absolute right-0 top-0 h-full w-1/2 items-center justify-center p-16">
        <div className="relative w-full max-w-md aspect-square bg-[#F7F2E9]/50 rounded-sm flex items-center justify-center">
          {/* PLACEHOLDER — replace with actual product photography */}
          <div className="text-center text-[#29231F]/30">
            <div className="font-serif text-5xl tracking-widest mb-2">REFORA</div>
            <div className="font-serif text-xl">COCOCRÈME</div>
            <div className="text-xs mt-2 tracking-widest">100g · Product photography needed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
