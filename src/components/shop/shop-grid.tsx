"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shop/product-card";
import { Reveal } from "@/components/ui/reveal";
import type { Product } from "@/lib/catalog";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "skincare", label: "Skincare" },
  { key: "organic", label: "REFORA Organic" },
] as const;

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Alphabetical" },
];

export function ShopGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [range, setRange] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((p) => {
      const matchesRange = range === "all" || p.range === range;
      const matchesQuery =
        !q ||
        [p.name, p.subtitle, p.category, p.shortDescription]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesRange && matchesQuery;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.priceInPaise - b.priceInPaise;
        case "price-desc":
          return b.priceInPaise - a.priceInPaise;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          // Featured — purchasable items first, then by review volume.
          if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
          return b.reviewCount - a.reviewCount;
      }
    });

    return list;
  }, [products, range, sort, query]);

  const clearSearch = () => {
    setQuery("");
    router.replace("/shop");
  };

  return (
    <>
      {/* ── Controls ──────────────────────────────────────────────────── */}
      <div className="border-y border-sand bg-ivory/70 backdrop-blur-sm sticky top-16 md:top-[4.5rem] z-20">
        <div className="container-refora py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Range filters */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1">
              <SlidersHorizontal
                size={15}
                strokeWidth={1.4}
                className="text-clay shrink-0 hidden sm:block"
                aria-hidden="true"
              />
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setRange(f.key)}
                  aria-pressed={range === f.key}
                  className={cn(
                    "shrink-0 text-[0.6875rem] tracking-[0.13em] uppercase px-4 py-2 rounded-full border transition-colors duration-300",
                    range === f.key
                      ? "bg-espresso text-ivory border-espresso"
                      : "bg-transparent text-espresso/70 border-sand hover:border-clay"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Search */}
            <div className="relative lg:w-64">
              <Search
                size={15}
                strokeWidth={1.4}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-clay pointer-events-none"
              />
              <label htmlFor="shop-search" className="sr-only">
                Search products
              </label>
              <input
                id="shop-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="input-refora pl-9 pr-9 py-2.5 text-sm"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-clay hover:text-espresso"
                >
                  <X size={14} strokeWidth={1.5} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="lg:w-52">
              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="input-refora py-2.5 text-sm cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      <div className="container-refora section">
        <p className="text-sm text-espresso/55 mb-8 tnum" aria-live="polite">
          {visible.length} {visible.length === 1 ? "product" : "products"}
          {query && <> matching “{query}”</>}
        </p>

        {visible.length === 0 ? (
          <div className="py-20 text-center border border-sand rounded-sm bg-soft-white">
            <p className="font-serif text-2xl text-espresso mb-3">Nothing here yet.</p>
            <p className="text-sm text-espresso/60 mb-7 max-w-sm mx-auto">
              We could not find anything matching that. Try a different term, or browse the
              full range.
            </p>
            <button
              onClick={() => {
                clearSearch();
                setRange("all");
              }}
              className="btn btn-secondary btn-sm"
            >
              <span>Show everything</span>
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {visible.map((product, i) => (
              <Reveal key={product.id} delay={i * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
