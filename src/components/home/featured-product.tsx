"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Check, ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { ProductVisual, BrandIcon } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";
import { COCOCREME, LAUNCH_OFFER } from "@/lib/catalog";

const VIEWS = [
  { kind: "carton", label: "Carton", tone: "glow" },
  { kind: "soap", label: "The bar", tone: "warm" },
] as const;

export function FeaturedProduct() {
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const product = COCOCREME;
  const saving = product.mrpInPaise - product.priceInPaise;
  const savingPct = product.mrpInPaise > 0 ? Math.round((saving / product.mrpInPaise) * 100) : 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      productId: product.productId,
      name: product.name,
      variantName: product.variantName,
      slug: product.slug,
      imageUrl: product.imageUrl,
      priceInPaise: product.priceInPaise,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <section className="section bg-ivory" aria-label={`${product.name} — buy`}>
      <div className="container-refora">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* ── Gallery ────────────────────────────────────────────────── */}
          <Reveal className="lg:sticky lg:top-28">
            <ProductVisual
              kind={VIEWS[view].kind}
              tone={VIEWS[view].tone}
              alt={`${product.name} — ${VIEWS[view].label}`}
              label={product.name}
              sublabel="Coconut Milk Soap"
              src={product.imageUrl}
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="aspect-square w-full rounded-sm shadow-[var(--shadow-lifted)]"
            />

            {/* View switcher */}
            <div className="flex gap-3 mt-4" role="group" aria-label="Product views">
              {VIEWS.map((v, i) => (
                <button
                  key={v.kind}
                  onClick={() => setView(i)}
                  aria-pressed={view === i}
                  aria-label={`Show ${v.label}`}
                  className={cn(
                    "relative w-20 h-20 rounded-sm overflow-hidden border transition-all duration-300",
                    view === i
                      ? "border-espresso shadow-[var(--shadow-soft)]"
                      : "border-sand opacity-65 hover:opacity-100"
                  )}
                >
                  <ProductVisual
                    kind={v.kind}
                    tone={v.tone}
                    alt=""
                    label={product.name}
                    src={product.imageUrl}
                    className="absolute inset-0"
                  />
                </button>
              ))}
            </div>
          </Reveal>

          {/* ── Buy panel ──────────────────────────────────────────────── */}
          <Reveal delay={100}>
            <div className="max-w-md">
              <p className="eyebrow mb-3">
                {product.category} · {product.badge}
              </p>

              <h2 className="font-serif font-light leading-[1.05] text-espresso mb-2" style={{ fontSize: "var(--text-headline)" }}>
                {product.name}
              </h2>
              <p className="text-sm md:text-base text-espresso/65 mb-5">{product.subtitle}</p>

              <span className="gold-rule mb-6" />

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                <span className="font-serif text-3xl text-espresso tnum">
                  {formatPrice(product.priceInPaise)}
                </span>
                {saving > 0 && (
                  <>
                    <span className="text-sm text-espresso/45 line-through tnum">
                      {formatPrice(product.mrpInPaise)}
                    </span>
                    <span className="pill pill-gold">Save {savingPct}%</span>
                  </>
                )}
              </div>
              <p className="text-xs text-espresso/50 mb-6 tnum">
                {product.size} · Inclusive of all taxes
              </p>

              {/* Launch offer — stated as an invitation, not a shout */}
              {LAUNCH_OFFER.enabled && (
                <div className="border border-gold/45 bg-gold/[0.07] rounded-sm px-5 py-4 mb-7">
                  <p className="eyebrow text-gold mb-1.5">{LAUNCH_OFFER.label}</p>
                  <p className="font-serif text-lg text-espresso leading-snug">
                    {LAUNCH_OFFER.headline}
                  </p>
                  <p className="text-sm text-espresso/70 mt-1">
                    {LAUNCH_OFFER.detail} with code{" "}
                    <span className="font-medium tracking-[0.12em] text-espresso">
                      {LAUNCH_OFFER.code}
                    </span>
                  </p>
                </div>
              )}

              {/* Quantity + add */}
              <div className="flex items-center gap-4 mb-4">
                <span className="label-refora mb-0">Quantity</span>
                <div className="qty-stepper">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} strokeWidth={1.5} />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <button onClick={handleAdd} className="btn btn-primary btn-lg btn-block">
                  {added ? (
                    <>
                      <Check size={15} strokeWidth={2} aria-hidden="true" />
                      <span>Added to bag</span>
                    </>
                  ) : (
                    <span>Add to bag — {formatPrice(product.priceInPaise * quantity)}</span>
                  )}
                </button>
                <Link href={`/products/${product.slug}`} className="btn btn-secondary btn-block">
                  <span>Full product details</span>
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>

              {/* Benefits — the three claims confirmed on the brand board */}
              <ul className="space-y-3 mb-7">
                {product.benefits.map((b) => (
                  <li key={b.title} className="flex gap-3">
                    <BrandIcon name={b.icon} className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-espresso">{b.title}</p>
                      <p className="text-sm text-espresso/60 leading-relaxed">{b.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Delivery assurances */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-5 border-t border-sand text-xs text-espresso/60">
                <span className="inline-flex items-center gap-2">
                  <Truck size={14} strokeWidth={1.4} className="text-clay" aria-hidden="true" />
                  Free shipping over ₹599
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={14} strokeWidth={1.4} className="text-clay" aria-hidden="true" />
                  Secure UPI, cards & COD
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
