import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse REFORA's collection of considered skincare and organic essentials. Shop COCOCRÈME and more.",
  openGraph: {
    title: "Shop | REFORA",
    description:
      "Considered skincare and organic essentials — thoughtfully made.",
    type: "website",
  },
};

// Product card shape — DB-ready
interface ProductCardData {
  slug: string;
  name: string;
  shortDescription: string;
  priceInPaise: number;
  mrpInPaise?: number;
  imageUrl: string; // [PLACEHOLDER]
  size: string;
  badge?: string;
}

// Static seed — replace with DB query once products are seeded
const PRODUCTS: ProductCardData[] = [
  {
    slug: "cococreme",
    name: "COCOCRÈME",
    shortDescription:
      "Coconut milk soap with colloidal oatmeal. Gentle, nourishing, grounding.",
    priceInPaise: 0, // [TODO: set from DB]
    mrpInPaise: undefined,
    imageUrl: "/images/cococreme-placeholder-1.jpg", // [PLACEHOLDER]
    size: "100g",
    badge: "Skincare",
  },
];

function ProductCard({ product }: { product: ProductCardData }) {
  const discount =
    product.mrpInPaise && product.mrpInPaise > product.priceInPaise
      ? Math.round(
          ((product.mrpInPaise - product.priceInPaise) / product.mrpInPaise) *
            100
        )
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-[#EFE5D5] rounded-sm overflow-hidden hover:shadow-md transition-shadow"
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#E4D5C2] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 text-[9px] tracking-widest text-[#29231F]/30 select-none">
          [PLACEHOLDER]
        </span>
        {discount && (
          <span className="absolute top-2 right-2 bg-[#C7A56A] text-[#FFFDFC] text-[10px] px-2 py-0.5 tracking-widest">
            {discount}% OFF
          </span>
        )}
        {product.badge && (
          <span className="absolute bottom-2 left-2 bg-[#29231F]/80 text-[#EFE5D5] text-[10px] px-2 py-0.5 tracking-widest uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-serif text-xl text-[#29231F] mb-1">{product.name}</p>
        <p className="text-xs text-[#29231F]/60 mb-3 leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>
        <p className="text-xs text-[#29231F]/50 mb-2">{product.size}</p>
        <div className="flex items-baseline gap-2">
          {product.priceInPaise > 0 ? (
            <>
              <span className="font-medium text-[#29231F]">
                {formatPrice(product.priceInPaise)}
              </span>
              {product.mrpInPaise && product.mrpInPaise > product.priceInPaise && (
                <span className="text-xs text-[#29231F]/40 line-through">
                  {formatPrice(product.mrpInPaise)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-[#29231F]/50">Price coming soon</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function ShopPage() {
  // In production: fetch published products from DB with drizzle
  // const products = await db.select().from(schema.products)
  //   .where(eq(schema.products.status, 'published'))
  //   .orderBy(schema.products.createdAt);
  const products = PRODUCTS;

  return (
    <div className="bg-[#F7F2E9] min-h-screen">
      {/* Page header */}
      <div className="bg-[#EFE5D5] py-16 text-center border-b border-[#E4D5C2]">
        <div className="container-refora">
          <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-3">
            All products
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light text-[#29231F]">
            Shop
          </h1>
          <p className="mt-4 text-sm text-[#29231F]/60 max-w-md mx-auto">
            Considered skincare and organic essentials — made with intention.
          </p>
        </div>
      </div>

      {/* Filters placeholder */}
      <div className="border-b border-[#E4D5C2] bg-[#F7F2E9]">
        <div className="container-refora py-3 flex items-center gap-4">
          <span className="text-xs text-[#29231F]/40 uppercase tracking-widest">
            Filter
          </span>
          <button className="text-xs text-[#29231F]/60 border border-[#E4D5C2] px-3 py-1.5 rounded-sm hover:border-[#29231F] transition-colors">
            All
          </button>
          <button className="text-xs text-[#29231F]/60 border border-[#E4D5C2] px-3 py-1.5 rounded-sm hover:border-[#29231F] transition-colors">
            Skincare
          </button>
          <button className="text-xs text-[#29231F]/60 border border-[#E4D5C2] px-3 py-1.5 rounded-sm hover:border-[#29231F] transition-colors">
            Organic
          </button>
          <span className="ml-auto text-xs text-[#29231F]/40">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Product grid */}
      <div className="container-refora py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-3xl text-[#29231F]/40 mb-4">
              More products coming soon.
            </p>
            <p className="text-sm text-[#29231F]/50">
              Check back shortly — we&apos;re just getting started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
