"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore } from "@/store/cart";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/skincare", label: "Skincare" },
  { href: "/organic", label: "REFORA ORGANIC" },
  { href: "/about", label: "Our Story" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCartStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar — hidden until configured */}
      {/* <AnnouncementBar message="..." /> */}

      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "bg-[#F7F2E9]/95 backdrop-blur-sm border-b border-[#E4D5C2]"
            : "bg-[#F7F2E9]"
        )}
      >
        <div className="container-refora">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>

            {/* Wordmark */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 font-serif text-2xl md:text-3xl tracking-[0.15em] font-medium text-[#29231F] hover:opacity-80 transition-opacity"
              aria-label="REFORA — Home"
            >
              REFORA
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-wide text-[#29231F] hover:text-[#C7A56A] transition-colors duration-200 uppercase font-sans"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </Link>
              <Link
                href="/account"
                className="p-2 hover:opacity-70 transition-opacity hidden sm:block"
                aria-label="My account"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
              <button
                className="p-2 hover:opacity-70 transition-opacity relative"
                onClick={() => setCartOpen(true)}
                aria-label={`Open bag${itemCount > 0 ? `, ${itemCount} items` : ""}`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#29231F] text-[#FFFDFC] text-[10px] font-medium rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#E4D5C2] bg-[#F7F2E9]">
            <nav className="container-refora py-6 flex flex-col gap-5" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base tracking-wide text-[#29231F] uppercase font-sans"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#E4D5C2] flex gap-6">
                <Link href="/account" className="text-sm text-[#29231F]/70" onClick={() => setMobileOpen(false)}>
                  Account
                </Link>
                <Link href="/faqs" className="text-sm text-[#29231F]/70" onClick={() => setMobileOpen(false)}>
                  FAQs
                </Link>
                <Link href="/contact" className="text-sm text-[#29231F]/70" onClick={() => setMobileOpen(false)}>
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
