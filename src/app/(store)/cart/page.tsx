"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

// Note: metadata for 'use client' pages should go in a sibling metadata.ts
// or parent layout. Reference values:
// title: "Your Bag | REFORA"
// description: "Review your REFORA bag and proceed to checkout."

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount);
  const totalInPaise = useCartStore((s) => s.totalInPaise);
  const discountInPaise = useCartStore((s) => s.discountInPaise);
  const couponCode = useCartStore((s) => s.couponCode);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [couponError, setCouponError] = useState("");

  const subtotalInPaise = items.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  );
  const finalTotalInPaise = subtotalInPaise - discountInPaise;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponStatus("loading");
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponInput.trim().toUpperCase(),
          subtotalInPaise,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        applyCoupon(couponInput.trim().toUpperCase(), data.discountInPaise);
        setCouponStatus("success");
        setCouponInput("");
      } else {
        const data = await res.json().catch(() => ({}));
        setCouponError(data?.error ?? "Invalid coupon code.");
        setCouponStatus("error");
      }
    } catch {
      setCouponError("Could not validate coupon. Please try again.");
      setCouponStatus("error");
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="bg-[#F7F2E9] min-h-screen">
        <div className="bg-[#EFE5D5] py-12 text-center border-b border-[#E4D5C2]">
          <div className="container-refora">
            <h1 className="font-serif text-4xl font-light text-[#29231F]">
              Your Bag
            </h1>
          </div>
        </div>
        <div className="container-refora max-w-md mx-auto py-24 text-center">
          <p className="font-serif text-3xl text-[#29231F]/40 mb-4">
            Your bag is empty.
          </p>
          <p className="text-sm text-[#29231F]/50 mb-8">
            Discover our considered range of skincare and organic essentials.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F2E9] min-h-screen">
      {/* Header */}
      <div className="bg-[#EFE5D5] py-12 border-b border-[#E4D5C2]">
        <div className="container-refora">
          <h1 className="font-serif text-4xl font-light text-[#29231F]">
            Your Bag{" "}
            <span className="text-[#29231F]/40 text-2xl">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>
      </div>

      <div className="container-refora py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Cart items — 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-0 divide-y divide-[#E4D5C2] border-t border-b border-[#E4D5C2]">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex gap-4 items-start">
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-[#EFE5D5] rounded-sm overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-serif text-lg text-[#29231F]">
                        {item.name}
                      </p>
                      {item.variantName && (
                        <p className="text-xs text-[#29231F]/50">
                          {item.variantName}
                        </p>
                      )}
                    </div>
                    <p className="font-medium text-[#29231F] flex-shrink-0">
                      {formatPrice(item.priceInPaise * item.quantity)}
                    </p>
                  </div>

                  <p className="text-xs text-[#29231F]/50 mb-3">
                    {formatPrice(item.priceInPaise)} each
                  </p>

                  {/* Qty stepper + remove */}
                  <div className="flex items-center gap-4">
                    <div className="qty-stepper" aria-label={`Quantity for ${item.name}`}>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-[#29231F]/40 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${item.name} from bag`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary — 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-6 lg:sticky lg:top-8">
              <h2 className="font-serif text-xl text-[#29231F] mb-5">
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="mb-5">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-[#C7A56A]/10 border border-[#C7A56A]/30 rounded-sm px-3 py-2">
                    <span className="text-xs text-[#29231F]">
                      Coupon:{" "}
                      <strong className="text-[#C7A56A]">{couponCode}</strong>{" "}
                      applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#29231F]/40 hover:text-red-500 ml-2"
                      aria-label="Remove coupon"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="coupon-input"
                      className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                    >
                      Coupon code
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="coupon-input"
                        type="text"
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.toUpperCase())
                        }
                        placeholder="Enter code"
                        className="input-refora flex-1 text-xs py-2"
                        aria-describedby={
                          couponError ? "coupon-error" : undefined
                        }
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponStatus === "loading"}
                        className="btn btn-secondary text-xs px-3 py-2 flex-shrink-0"
                      >
                        {couponStatus === "loading" ? "…" : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p
                        id="coupon-error"
                        className="text-xs text-red-600 mt-1"
                        role="alert"
                      >
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Amounts */}
              <div className="space-y-2 text-sm border-t border-[#E4D5C2] pt-4">
                <div className="flex justify-between text-[#29231F]/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalInPaise)}</span>
                </div>
                {discountInPaise > 0 && (
                  <div className="flex justify-between text-[#C7A56A]">
                    <span>Discount</span>
                    <span>−{formatPrice(discountInPaise)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#29231F]/50 text-xs">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-semibold text-[#29231F] text-base pt-2 border-t border-[#E4D5C2]">
                  <span>Total</span>
                  <span>{formatPrice(finalTotalInPaise)}</span>
                </div>
                <p className="text-xs text-[#29231F]/40">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="btn btn-primary w-full text-center mt-6 block"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/shop"
                className="block text-center text-xs text-[#29231F]/40 hover:text-[#29231F] mt-3 transition-colors"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
