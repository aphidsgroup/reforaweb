"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

// ─── PROVISIONAL data — replace with DB-driven content ────────────────────────
// CLIENT INPUT NEEDED: confirmed price, MRP, SKU, final product details
const PRODUCT = {
  id: "cococreme-100g",
  productId: "00000000-0000-0000-0000-000000000001",
  name: "COCOCRÈME",
  subtitle: "Coconut Milk Soap with Colloidal Oatmeal",
  slug: "cococreme",
  priceInPaise: 0, // ← AWAITING CLIENT: replace with actual price in paise (e.g. 39900 = ₹399)
  mrpInPaise: 0,   // ← AWAITING CLIENT: replace with MRP
  size: "100g / 3.52 oz",
  imageUrl: "/placeholder-product.jpg",
  variantName: "100g",
};

export function FeaturedProduct() {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAddToBag = () => {
    addItem({
      id: PRODUCT.id,
      productId: PRODUCT.productId,
      name: PRODUCT.name,
      variantName: PRODUCT.variantName,
      slug: PRODUCT.slug,
      imageUrl: PRODUCT.imageUrl,
      priceInPaise: PRODUCT.priceInPaise,
      quantity,
    });
  };

  return (
    <section className="section bg-[#F7F2E9]" aria-label="Featured product">
      <div className="container-refora">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Product image */}
          <div className="relative aspect-square bg-[#EFE5D5] rounded-sm overflow-hidden">
            {/* PLACEHOLDER — replace with Cloudinary-hosted product photography */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#29231F]/25">
              <div className="font-serif text-6xl tracking-widest">REFORA</div>
              <div className="font-serif text-2xl mt-2">COCOCRÈME</div>
              <div className="text-xs mt-3 tracking-widest">
                Coconut Milk Soap · 100g
              </div>
              <div className="text-xs mt-1 opacity-60">
                [Product photography needed]
              </div>
            </div>
          </div>

          {/* Purchase panel */}
          <div className="max-w-sm">
            {/* Category pill */}
            <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-3">
              Skincare · Launch Product
            </p>

            {/* Product name */}
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight text-[#29231F] mb-1">
              COCOCRÈME
            </h2>
            <p className="text-sm text-[#29231F]/70 mb-4">
              {PRODUCT.subtitle}
            </p>

            {/* Gold rule */}
            <span className="gold-rule mb-5 block" />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              {PRODUCT.priceInPaise > 0 ? (
                <>
                  <span className="font-medium text-2xl">
                    {formatPrice(PRODUCT.priceInPaise)}
                  </span>
                  {PRODUCT.mrpInPaise > PRODUCT.priceInPaise && (
                    <span className="text-sm text-[#29231F]/50 line-through">
                      {formatPrice(PRODUCT.mrpInPaise)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-[#29231F]/50 italic">
                  Price coming soon
                </span>
              )}
              <span className="text-xs text-[#29231F]/50">{PRODUCT.size}</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-[#29231F]/70">Quantity</span>
              <div className="qty-stepper">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleAddToBag}
                className="btn btn-primary w-full"
                disabled={PRODUCT.priceInPaise === 0}
              >
                {PRODUCT.priceInPaise > 0 ? "Add to Bag" : "Price Coming Soon"}
              </button>
              <Link
                href={`/products/${PRODUCT.slug}`}
                className="btn btn-secondary w-full text-center"
              >
                View Product
              </Link>
            </div>

            {/* Confirmed claims from brand board */}
            <ul className="space-y-2 text-sm text-[#29231F]/70">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C7A56A] flex-shrink-0" />
                Gentle Cleanses
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C7A56A] flex-shrink-0" />
                Nourishes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C7A56A] flex-shrink-0" />
                Leaves Skin Soft
              </li>
            </ul>

            {/* View full product */}
            <Link
              href={`/products/${PRODUCT.slug}`}
              className="btn-ghost mt-6 inline-flex items-center gap-1 text-sm"
            >
              Full product details →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
