"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, itemCount, totalInPaise, discountInPaise, couponCode, updateQuantity, removeItem } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus & close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const subtotal = totalInPaise;
  const finalTotal = subtotal - discountInPaise;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-[#29231F]/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md z-50 bg-[#F7F2E9] flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4D5C2]">
          <h2 className="font-serif text-xl tracking-wide">
            Your Bag {itemCount > 0 && <span className="text-[#C7A56A]">({itemCount})</span>}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close bag"
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#E4D5C2]" />
              <div>
                <p className="font-serif text-lg">Your bag is empty</p>
                <p className="text-sm text-[#29231F]/60 mt-1">
                  Add COCOCRÈME to get started.
                </p>
              </div>
              <Link
                href="/products/cocoCreme"
                onClick={onClose}
                className="btn btn-primary mt-2"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={onClose}
                    className="flex-shrink-0 w-20 h-20 bg-[#EFE5D5] rounded-sm overflow-hidden relative"
                  >
                    <Image
                      src={item.imageUrl || "/placeholder-product.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-medium text-sm leading-snug">{item.name}</p>
                        {item.variantName && (
                          <p className="text-xs text-[#29231F]/60 mt-0.5">{item.variantName}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#29231F]/40 hover:text-[#29231F] transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Qty + Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="qty-stepper">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-medium text-sm">
                        {formatPrice(item.priceInPaise * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only when items exist */}
        {items.length > 0 && (
          <div className="border-t border-[#E4D5C2] px-6 py-5 space-y-4">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#29231F]/70">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountInPaise > 0 && (
                <div className="flex justify-between text-[#C7A56A]">
                  <span>Discount {couponCode && `(${couponCode})`}</span>
                  <span>−{formatPrice(discountInPaise)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#29231F]/50">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-[#E4D5C2]">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn btn-primary w-full text-center"
            >
              Checkout
            </Link>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-[#29231F]/60 hover:text-[#29231F] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
