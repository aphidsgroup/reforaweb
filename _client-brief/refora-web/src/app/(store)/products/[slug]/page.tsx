"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { isValidPincode } from "@/lib/utils";

// ─── Static product data ─────────────────────────────────────────────────────
// In production this page would be async and fetch from DB by slug.
// The server component wrapper below handles metadata; this client component
// receives product data as props once the DB is wired up.
// For now we define the shape here — no prices hardcoded per spec.

interface ProductImage {
  url: string;     // [PLACEHOLDER] — replace with Cloudinary URL
  alt: string;
}

interface ProductData {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  shortDescription: string;
  priceInPaise: number;
  mrpInPaise?: number;
  size: string;
  ingredients: string;
  howToUse: string;
  deliveryReturns: string;
  images: ProductImage[];
  imageUrl: string; // primary for cart
}

// Static placeholder — replace with DB fetch once data is seeded
const COCOCREME: ProductData = {
  id: "cococreme-100g-default",
  productId: "cococreme",
  name: "COCOCRÈME",
  slug: "cococreme",
  shortDescription:
    "A coconut milk soap with colloidal oatmeal — gentle, nourishing, and grounding. Crafted for everyday rituals.",
  // ← Prices injected from DB in production; these are placeholders
  priceInPaise: 0, // [TODO: set from DB]
  mrpInPaise: undefined,
  size: "100g / 3.52 oz",
  ingredients:
    "[PLACEHOLDER — full INCI list to be confirmed by client before launch]",
  howToUse:
    "Work into a lather with wet hands or a cloth. Massage gently over skin. Rinse thoroughly. Suitable for face and body.",
  deliveryReturns:
    "We ship pan-India. Estimated delivery 4–7 business days. For returns and exchanges, please visit our Returns & Refunds policy.",
  images: [
    {
      url: "/images/cococreme-placeholder-1.jpg", // [PLACEHOLDER]
      alt: "COCOCRÈME coconut milk soap bar — front view",
    },
    {
      url: "/images/cococreme-placeholder-2.jpg", // [PLACEHOLDER]
      alt: "COCOCRÈME — texture close-up",
    },
    {
      url: "/images/cococreme-placeholder-3.jpg", // [PLACEHOLDER]
      alt: "COCOCRÈME — packaging",
    },
  ],
  imageUrl: "/images/cococreme-placeholder-1.jpg", // [PLACEHOLDER]
};

// ─── Accordion Item ───────────────────────────────────────────────────────────
function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E4D5C2]">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4 text-sm font-medium text-[#29231F] tracking-wide"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[#C7A56A] transition-transform duration-200 text-lg leading-none"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 text-sm text-[#29231F]/70 leading-relaxed whitespace-pre-line">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActive((a) => Math.max(0, a - 1));
      if (e.key === "ArrowRight")
        setActive((a) => Math.min(images.length - 1, a + 1));
      if (e.key === "Escape") setZoomed(false);
      if (e.key === "Enter" || e.key === " ") setZoomed((z) => !z);
    },
    [images.length]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative bg-[#EFE5D5] aspect-square overflow-hidden cursor-zoom-in rounded-sm"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setZoomed((z) => !z)}
        aria-label={`Product image ${active + 1} of ${images.length}. Press Enter to zoom.`}
        role="button"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]?.url ?? "/images/placeholder.jpg"}
          alt={images[active]?.alt ?? "Product image"}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            zoomed ? "scale-150 cursor-zoom-out" : "scale-100"
          }`}
          draggable={false}
        />
        <span className="absolute top-3 left-3 text-[10px] tracking-widest text-[#29231F]/40 select-none">
          [PLACEHOLDER — client asset]
        </span>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2" role="listbox" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 bg-[#EFE5D5] rounded-sm overflow-hidden border-2 transition-colors ${
                active === i
                  ? "border-[#29231F]"
                  : "border-transparent hover:border-[#C7A56A]"
              }`}
              aria-label={img.alt}
              aria-selected={active === i}
              role="option"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pincode Check ────────────────────────────────────────────────────────────
function PincodeCheck() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{
    serviceable: boolean;
    codAvailable: boolean;
    estimatedDays: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!isValidPincode(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/shipping/check-pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not check. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <p className="text-xs text-[#29231F]/60 mb-2 tracking-wide uppercase">
        Check delivery
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            setPincode(v);
            setResult(null);
            setError("");
          }}
          placeholder="Enter pincode"
          className="input-refora flex-1 text-sm"
          aria-label="Pincode for delivery check"
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <button
          onClick={check}
          disabled={loading || pincode.length !== 6}
          className="btn btn-secondary text-xs px-4 py-2 flex-shrink-0"
        >
          {loading ? "…" : "Check"}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
      {result && (
        <p
          className={`text-xs mt-2 ${
            result.serviceable ? "text-green-700" : "text-red-600"
          }`}
          role="status"
        >
          {result.serviceable
            ? `✓ Delivery available${result.estimatedDays ? ` in ${result.estimatedDays} days` : ""}. ${result.codAvailable ? "COD available." : "Prepaid only."}`
            : "✗ Delivery not available to this pincode."}
        </p>
      )}
    </div>
  );
}

// ─── Wishlist Button ──────────────────────────────────────────────────────────
function WishlistButton({ productId }: { productId: string }) {
  const [wished, setWished] = useState(false);
  return (
    <button
      onClick={() => setWished((w) => !w)}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      className="flex items-center gap-2 text-xs text-[#29231F]/60 hover:text-[#29231F] transition-colors mt-2"
      data-product-id={productId}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={wished ? "#B88F7A" : "none"}
        stroke={wished ? "#B88F7A" : "currentColor"}
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {wished ? "Saved to wishlist" : "Save to wishlist"}
    </button>
  );
}

// ─── Main Product Detail Page ─────────────────────────────────────────────────
export default function ProductDetailPage() {
  const product = COCOCREME;
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  // Observe main CTA going off-screen → show sticky bar
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAddToBag = () => {
    addItem({
      id: product.id,
      productId: product.productId,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      priceInPaise: product.priceInPaise,
      quantity: qty,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToBag();
    window.location.href = "/checkout";
  };

  const discount =
    product.mrpInPaise && product.mrpInPaise > product.priceInPaise
      ? Math.round(
          ((product.mrpInPaise - product.priceInPaise) / product.mrpInPaise) *
            100
        )
      : null;

  return (
    <>
      {/* Breadcrumb */}
      <nav
        className="bg-[#F7F2E9] border-b border-[#E4D5C2]"
        aria-label="Breadcrumb"
      >
        <div className="container-refora py-3">
          <ol className="flex items-center gap-2 text-xs text-[#29231F]/50">
            <li>
              <Link href="/" className="hover:text-[#29231F] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link
                href="/skincare"
                className="hover:text-[#29231F] transition-colors"
              >
                Skincare
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-[#29231F] font-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Two-column layout */}
      <section className="bg-[#F7F2E9] py-10 lg:py-16">
        <div className="container-refora">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* LEFT — Image Gallery */}
            <div className="lg:sticky lg:top-8">
              <ImageGallery images={product.images} />
            </div>

            {/* RIGHT — Purchase Panel */}
            <div className="flex flex-col gap-6">
              {/* Category label */}
              <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase">
                Skincare · Soap
              </p>

              {/* Product name */}
              <h1 className="font-serif text-4xl lg:text-5xl font-light text-[#29231F] leading-tight">
                {product.name}
              </h1>

              {/* Short description */}
              <p className="text-[15px] text-[#29231F]/70 leading-relaxed max-w-sm">
                {product.shortDescription}
              </p>

              {/* Size */}
              <p className="text-sm text-[#29231F]/60">
                Size:{" "}
                <span className="font-medium text-[#29231F]">
                  {product.size}
                </span>
              </p>

              {/* Price block */}
              <div className="flex items-baseline gap-3">
                {product.priceInPaise > 0 ? (
                  <>
                    <span className="font-serif text-3xl text-[#29231F]">
                      {formatPrice(product.priceInPaise)}
                    </span>
                    {product.mrpInPaise &&
                      product.mrpInPaise > product.priceInPaise && (
                        <>
                          <span className="text-base text-[#29231F]/40 line-through">
                            {formatPrice(product.mrpInPaise)}
                          </span>
                          {discount && (
                            <span className="text-xs bg-[#C7A56A]/15 text-[#C7A56A] px-2 py-0.5 rounded-sm font-medium">
                              {discount}% off
                            </span>
                          )}
                        </>
                      )}
                  </>
                ) : (
                  <span className="font-serif text-2xl text-[#29231F]/50">
                    Price coming soon
                  </span>
                )}
              </div>

              {/* Tax note */}
              <p className="text-xs text-[#29231F]/40 -mt-4">
                Inclusive of all taxes. Free shipping on orders above ₹499.
              </p>

              {/* Quantity + CTA */}
              <div ref={ctaRef} className="flex flex-col gap-3">
                {/* Qty stepper */}
                <div className="flex items-center gap-4">
                  <label className="text-xs text-[#29231F]/60 uppercase tracking-wide">
                    Qty
                  </label>
                  <div className="qty-stepper" aria-label="Quantity">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span aria-live="polite" aria-atomic="true">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Bag */}
                <button
                  className="btn btn-primary w-full"
                  onClick={handleAddToBag}
                  aria-live="polite"
                >
                  {addedFeedback ? "Added ✓" : "Add to Bag"}
                </button>

                {/* Buy Now */}
                <button
                  className="btn btn-secondary w-full"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>

              {/* Wishlist */}
              <WishlistButton productId={product.productId} />

              {/* Pincode Check */}
              <PincodeCheck />

              {/* Gold divider */}
              <span className="gold-rule" aria-hidden="true" />

              {/* Accordion sections */}
              <div>
                <AccordionItem title="Ingredients">
                  {product.ingredients}
                </AccordionItem>
                <AccordionItem title="How to Use">
                  {product.howToUse}
                </AccordionItem>
                <AccordionItem title="Delivery & Returns">
                  {product.deliveryReturns}{" "}
                  <Link
                    href="/policies/returns"
                    className="underline text-[#C7A56A]"
                  >
                    View full policy
                  </Link>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        className="bg-[#EFE5D5] py-16"
        aria-label="Customer reviews"
        id="reviews"
      >
        <div className="container-refora max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-3">
            Reviews
          </p>
          <h2 className="font-serif text-3xl font-light text-[#29231F] mb-6">
            What customers say
          </h2>
          {/* Honest empty state — no fake reviews */}
          <div className="bg-[#F7F2E9] rounded-sm p-8">
            <p className="text-sm text-[#29231F]/60 leading-relaxed">
              COCOCRÈME is new — no reviews yet, and we&apos;re keeping it
              honest. Be among the first to try it and share your experience.
            </p>
            <p className="text-xs text-[#29231F]/40 mt-3">
              Reviews from verified purchases will appear here once collected.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Purchase Bar */}
      {stickyVisible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#F7F2E9] border-t border-[#E4D5C2] px-4 py-3 flex items-center gap-3 lg:hidden shadow-lg"
          aria-label="Quick add to bag"
          role="region"
        >
          {/* Thumbnail */}
          <div className="w-12 h-12 bg-[#EFE5D5] rounded-sm flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Name + price */}
          <div className="flex-1 min-w-0">
            <p className="font-serif text-base text-[#29231F] truncate">
              {product.name}
            </p>
            {product.priceInPaise > 0 && (
              <p className="text-xs text-[#29231F]/60">
                {formatPrice(product.priceInPaise)}
              </p>
            )}
          </div>
          {/* Add to bag button */}
          <button
            className="btn btn-primary text-xs px-4 py-3 flex-shrink-0"
            onClick={handleAddToBag}
          >
            {addedFeedback ? "Added ✓" : "Add to Bag"}
          </button>
        </div>
      )}
    </>
  );
}

// ─── SEO Metadata (exported from a thin server wrapper if needed) ─────────────
// Because this file is 'use client', metadata is exported from a separate
// generateMetadata in a co-located server component. For Next.js 15 app router,
// the metadata below is placed here as a reference — wire up to a layout or
// a server page wrapper that calls this product's DB data.
export const dynamic = "force-dynamic";
