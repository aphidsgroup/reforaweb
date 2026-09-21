"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Check, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { ProductVisual, BrandIcon } from "@/components/ui/brand-art";
import { StarRating } from "@/components/home/reviews-section";
import { PincodeCheck } from "@/components/product/pincode-check";
import { Reveal } from "@/components/ui/reveal";
import { LAUNCH_OFFER, type Product } from "@/lib/catalog";

type Panel = "description" | "ingredients" | "how-to-use" | "shipping";

export function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState(0);
  const [added, setAdded] = useState(false);
  const [panel, setPanel] = useState<Panel>("description");

  const addItem = useCartStore((s) => s.addItem);

  const purchasable = product.inStock && product.priceInPaise > 0;
  const saving = product.mrpInPaise - product.priceInPaise;
  const savingPct =
    product.mrpInPaise > 0 && saving > 0
      ? Math.round((saving / product.mrpInPaise) * 100)
      : null;

  // The composed studies stand in for a photo gallery until real images land.
  const views =
    product.range === "skincare"
      ? ([
          { kind: "carton", label: "Carton", tone: "glow" },
          { kind: "soap", label: "The bar", tone: "warm" },
        ] as const)
      : ([{ kind: "bottle", label: "Bottle", tone: "warm" }] as const);

  const handleAdd = () => {
    if (!purchasable) return;
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

  const panels: { key: Panel; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "ingredients", label: "Ingredients" },
    { key: "how-to-use", label: "How to use" },
    { key: "shipping", label: "Shipping & returns" },
  ];

  return (
    <>
      <div className="container-refora py-10 md:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-espresso/55">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-espresso transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-espresso transition-colors">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-espresso">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ── Gallery ──────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-28">
            <ProductVisual
              kind={views[view].kind}
              tone={views[view].tone}
              alt={`${product.name} — ${views[view].label}`}
              label={product.name}
              sublabel={product.range === "skincare" ? "Coconut Milk Soap" : undefined}
              src={product.imageUrl}
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="aspect-square w-full rounded-sm shadow-[var(--shadow-lifted)]"
            />

            {views.length > 1 && (
              <div className="flex gap-3 mt-4" role="group" aria-label="Product views">
                {views.map((v, i) => (
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
            )}
          </div>

          {/* ── Buy panel ────────────────────────────────────────────── */}
          <div className="max-w-md">
            <p className="eyebrow mb-3">{product.category}</p>

            <h1
              className="font-serif font-light leading-[1.05] text-espresso mb-2"
              style={{ fontSize: "var(--text-headline)" }}
            >
              {product.name}
            </h1>
            <p className="text-espresso/65 mb-4">{product.subtitle}</p>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2.5 mb-5">
                <StarRating rating={product.rating} size={14} />
                <span className="text-sm text-espresso/60 tnum">
                  {product.rating} · {product.reviewCount} reviews
                </span>
              </div>
            )}

            <span className="gold-rule mb-6" />

            {purchasable ? (
              <>
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
              </>
            ) : (
              <div className="mb-6">
                <p className="font-serif text-2xl text-clay mb-1">Coming soon</p>
                <p className="text-sm text-espresso/60">
                  Join the list below and you will hear from us first.
                </p>
              </div>
            )}

            {purchasable && LAUNCH_OFFER.enabled && (
              <div className="border border-gold/45 bg-gold/[0.07] rounded-sm px-5 py-4 mb-7">
                <p className="eyebrow text-gold mb-1.5">{LAUNCH_OFFER.label}</p>
                <p className="text-sm text-espresso/75">
                  {LAUNCH_OFFER.detail} with code{" "}
                  <span className="font-medium tracking-[0.12em] text-espresso">
                    {LAUNCH_OFFER.code}
                  </span>
                </p>
              </div>
            )}

            {purchasable && (
              <>
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
                  <span className="text-xs text-gold ml-auto">In stock</span>
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
                  <Link href="/checkout" onClick={handleAdd} className="btn btn-secondary btn-block">
                    <span>Buy it now</span>
                  </Link>
                </div>

                <div className="mb-6">
                  <PincodeCheck />
                </div>
              </>
            )}

            {/* Benefits */}
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

            <ul className="grid gap-3 pt-5 border-t border-sand text-xs text-espresso/60">
              <li className="flex items-center gap-2.5">
                <Truck size={14} strokeWidth={1.4} className="text-clay" aria-hidden="true" />
                Free shipping over ₹599 · dispatched in 24 hours
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck size={14} strokeWidth={1.4} className="text-clay" aria-hidden="true" />
                Secure payment — UPI, cards, net banking, wallets, COD
              </li>
              <li className="flex items-center gap-2.5">
                <RotateCcw size={14} strokeWidth={1.4} className="text-clay" aria-hidden="true" />
                Easy returns on unopened items within 7 days
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Detail panels ───────────────────────────────────────────── */}
      <section className="bg-cream" aria-label="Product information">
        <div className="container-refora section">
          <div
            className="flex gap-1 overflow-x-auto hide-scrollbar border-b border-sand mb-9"
            role="tablist"
            aria-label="Product information"
          >
            {panels.map((p) => (
              <button
                key={p.key}
                role="tab"
                id={`tab-${p.key}`}
                aria-selected={panel === p.key}
                aria-controls={`panel-${p.key}`}
                onClick={() => setPanel(p.key)}
                className={cn(
                  "shrink-0 px-5 py-3.5 text-[0.6875rem] tracking-[0.14em] uppercase border-b-2 -mb-px transition-colors duration-300",
                  panel === p.key
                    ? "border-espresso text-espresso"
                    : "border-transparent text-espresso/55 hover:text-espresso"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="max-w-2xl">
            {panel === "description" && (
              <div
                role="tabpanel"
                id="panel-description"
                aria-labelledby="tab-description"
                className="space-y-5 text-espresso/72 leading-relaxed text-pretty"
              >
                {product.description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {product.origin && (
                  <dl className="grid sm:grid-cols-[auto_1fr] gap-x-8 gap-y-3 pt-5 mt-3 border-t border-sand text-sm">
                    <dt className="eyebrow sm:pt-0.5">Origin</dt>
                    <dd className="text-espresso/72">{product.origin}</dd>
                    <dt className="eyebrow sm:pt-0.5">Process</dt>
                    <dd className="text-espresso/72">{product.process}</dd>
                    <dt className="eyebrow sm:pt-0.5">What is different</dt>
                    <dd className="text-espresso/72">{product.difference}</dd>
                  </dl>
                )}
              </div>
            )}

            {panel === "ingredients" && (
              <div role="tabpanel" id="panel-ingredients" aria-labelledby="tab-ingredients">
                <p className="text-espresso/72 leading-relaxed text-pretty">
                  {product.ingredients}
                </p>
              </div>
            )}

            {panel === "how-to-use" && (
              <div role="tabpanel" id="panel-how-to-use" aria-labelledby="tab-how-to-use">
                <ol className="space-y-4">
                  {product.howToUse.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span
                        className="font-serif text-xl text-clay shrink-0 tnum leading-none pt-0.5"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-espresso/72 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {panel === "shipping" && (
              <div
                role="tabpanel"
                id="panel-shipping"
                aria-labelledby="tab-shipping"
                className="space-y-4 text-espresso/72 leading-relaxed"
              >
                <p>
                  Orders are dispatched within 24 hours on working days, with tracked delivery
                  across India. Shipping is free on orders over ₹599; below that a flat charge
                  is shown at checkout before you pay.
                </p>
                <p>
                  Cash on delivery is available on most pincodes — enter yours above to
                  confirm. Unopened items can be returned within 7 days of delivery.
                </p>
                <p>
                  <Link href="/policies/shipping-policy" className="link-underline">
                    Full shipping policy
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Sticky mobile buy bar ───────────────────────────────────── */}
      {purchasable && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-ivory/95 backdrop-blur-md border-t border-sand px-4 py-3 safe-bottom flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-espresso/55 truncate">{product.name}</p>
            <p className="font-serif text-lg text-espresso tnum leading-tight">
              {formatPrice(product.priceInPaise * quantity)}
            </p>
          </div>
          <button onClick={handleAdd} className="btn btn-primary flex-1 ml-auto">
            {added ? <span>Added</span> : <span>Add to bag</span>}
          </button>
        </div>
      )}
    </>
  );
}

/** Related products strip — server-safe, rendered below the detail. */
export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="section bg-soft-white" aria-label="You may also like">
      <div className="container-refora">
        <Reveal className="mb-10">
          <p className="eyebrow mb-4">You may also like</p>
          <h2
            className="font-serif font-light text-espresso leading-[1.08]"
            style={{ fontSize: "var(--text-title)" }}
          >
            More from REFORA
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <Link
                href={`/products/${p.slug}`}
                className="group block bg-cream border border-sand rounded-sm overflow-hidden card card-hover h-full"
              >
                <ProductVisual
                  kind={p.study}
                  tone="warm"
                  alt={`${p.name} — ${p.subtitle}`}
                  label={p.name}
                  src={p.imageUrl}
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  className="aspect-[4/3] w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                />
                <div className="p-6">
                  <p className="eyebrow mb-2">{p.category}</p>
                  <h3 className="font-serif text-xl font-light text-espresso mb-2">{p.name}</h3>
                  <p className="text-sm text-espresso/60 leading-relaxed line-clamp-2">
                    {p.shortDescription}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
