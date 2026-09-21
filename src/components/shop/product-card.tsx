import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductVisual } from "@/components/ui/brand-art";
import { StarRating } from "@/components/home/reviews-section";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const saving = product.mrpInPaise - product.priceInPaise;
  const savingPct =
    product.mrpInPaise > 0 && saving > 0
      ? Math.round((saving / product.mrpInPaise) * 100)
      : null;

  const purchasable = product.inStock && product.priceInPaise > 0;

  return (
    <article className="group h-full">
      <Link
        href={`/products/${product.slug}`}
        className="h-full flex flex-col bg-soft-white border border-sand rounded-sm overflow-hidden card card-hover"
        aria-label={`View ${product.name}`}
      >
        {/* Visual */}
        <div className="relative overflow-hidden">
          <ProductVisual
            kind={product.study}
            tone={product.range === "organic" ? "warm" : "glow"}
            alt={`${product.name} — ${product.subtitle}`}
            label={product.name}
            sublabel={product.range === "skincare" ? "Coconut Milk Soap" : undefined}
            src={product.imageUrl}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="aspect-[4/5] w-full transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
          />

          {product.badge && (
            <span
              className={`absolute top-4 left-4 pill ${
                purchasable ? "pill-dark" : "pill-gold"
              }`}
            >
              {product.badge}
            </span>
          )}

          {savingPct && (
            <span className="absolute top-4 right-4 pill pill-gold">Save {savingPct}%</span>
          )}
        </div>

        {/* Detail */}
        <div className="p-6 flex flex-col flex-1">
          <p className="eyebrow mb-2.5">{product.category}</p>

          <h3 className="font-serif text-2xl font-light text-espresso leading-tight mb-2">
            {product.name}
          </h3>

          <p className="text-sm text-espresso/62 leading-relaxed mb-4 flex-1 text-pretty">
            {product.shortDescription}
          </p>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={product.rating} size={12} />
              <span className="text-xs text-espresso/50 tnum">({product.reviewCount})</span>
            </div>
          )}

          <div className="pt-4 border-t border-sand flex items-end justify-between gap-3">
            <div>
              {purchasable ? (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-serif text-xl text-espresso tnum">
                    {formatPrice(product.priceInPaise)}
                  </span>
                  {saving > 0 && (
                    <span className="text-xs text-espresso/45 line-through tnum">
                      {formatPrice(product.mrpInPaise)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-clay">Notify me at launch</span>
              )}
              <p className="text-xs text-espresso/45 mt-0.5 tnum">{product.size}</p>
            </div>

            <ArrowRight
              size={17}
              strokeWidth={1.3}
              aria-hidden="true"
              className="text-clay shrink-0 mb-1 transition-transform duration-[450ms] ease-[var(--ease-out-soft)] group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
