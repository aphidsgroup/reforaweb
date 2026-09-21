"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore } from "@/store/cart";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { useHydrated } from "@/lib/use-hydrated";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/skincare", label: "Skincare" },
  { href: "/organic", label: "REFORA Organic" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "Our Story" },
];

const SECONDARY_LINKS = [
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
  { href: "/policies/shipping-policy", label: "Shipping" },
];

export function SiteHeader() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const itemCount = useCartStore((s) => s.itemCount);

  // The cart count comes from persisted storage, so it is only rendered once
  // hydration has happened — otherwise server and client markup disagree.
  const mounted = useHydrated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSearchOpen(false);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <>
      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-[background-color,box-shadow,border-color] duration-500",
          scrolled
            ? "bg-ivory/92 backdrop-blur-md border-b border-sand shadow-[var(--shadow-soft)]"
            : "bg-ivory border-b border-transparent"
        )}
      >
        <div className="container-refora">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem] gap-4">
            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 -ml-2 text-espresso"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={20} strokeWidth={1.4} aria-hidden="true" />
            </button>

            {/* Wordmark */}
            <Link
              href="/"
              aria-label="REFORA — home"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 wordmark text-xl md:text-2xl text-espresso hover:text-clay transition-colors duration-300"
            >
              REFORA
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8 mx-auto" aria-label="Main">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative text-[0.8125rem] tracking-[0.1em] uppercase text-espresso/85 hover:text-espresso transition-colors duration-300 py-1"
                >
                  {link.label}
                  <span
                    className="absolute left-0 -bottom-0.5 h-px w-full bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[450ms] ease-[var(--ease-out-soft)]"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 text-espresso hover:text-clay transition-colors"
                aria-label="Search products"
                aria-expanded={searchOpen}
              >
                <Search size={18} strokeWidth={1.4} aria-hidden="true" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-espresso hover:text-clay transition-colors relative"
                aria-label={
                  mounted && itemCount > 0 ? `Open bag, ${itemCount} items` : "Open bag"
                }
              >
                <ShoppingBag size={18} strokeWidth={1.4} aria-hidden="true" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-espresso text-soft-white text-[10px] font-medium rounded-full flex items-center justify-center tnum">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search drawer */}
        <div
          className={cn(
            "overflow-hidden border-sand bg-ivory transition-[max-height,border-color] duration-[450ms] ease-[var(--ease-out-soft)]",
            searchOpen ? "max-h-32 border-t" : "max-h-0 border-t-0"
          )}
        >
          <form onSubmit={submitSearch} className="container-refora py-5 flex gap-3" role="search">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              ref={searchRef}
              id="site-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for soap, oils, ghee…"
              className="input-refora flex-1"
            />
            <button type="submit" className="btn btn-primary shrink-0">
              <span>Search</span>
            </button>
          </form>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-400",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          className="absolute inset-0 bg-espresso/45 backdrop-blur-[2px] w-full"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          tabIndex={mobileOpen ? 0 : -1}
        />

        <nav
          className={cn(
            "absolute inset-y-0 left-0 w-[86%] max-w-sm bg-ivory flex flex-col transition-transform duration-[450ms] ease-[var(--ease-out-soft)]",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Mobile"
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-sand">
            <span className="wordmark text-lg text-espresso">REFORA</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 -mr-2 text-espresso"
              aria-label="Close menu"
              tabIndex={mobileOpen ? 0 : -1}
            >
              <X size={20} strokeWidth={1.4} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-7">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    tabIndex={mobileOpen ? 0 : -1}
                    className="flex items-center justify-between py-3.5 border-b border-sand/70 font-serif text-2xl font-light text-espresso"
                  >
                    {link.label}
                    <ArrowRight size={16} strokeWidth={1.3} className="text-clay" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-9 space-y-3">
              {SECONDARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    tabIndex={mobileOpen ? 0 : -1}
                    className="text-sm text-espresso/65"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-6 py-6 border-t border-sand">
            <p className="tagline text-xs text-clay">Restore · Renew · Refora.</p>
          </div>
        </nav>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
