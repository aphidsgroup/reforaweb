import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Skincare",
  description:
    "REFORA Skincare — considered formulas for everyday rituals. Meet COCOCRÈME, a coconut milk soap with colloidal oatmeal.",
  openGraph: {
    title: "Skincare | REFORA",
    description:
      "Considered skincare for everyday rituals. Gentle, nourishing, grounding.",
    type: "website",
  },
};

// Static data — replace with DB query for published skincare products
const SKINCARE_PRODUCTS = [
  {
    slug: "cococreme",
    name: "COCOCRÈME",
    shortDescription:
      "A coconut milk soap with colloidal oatmeal — gentle, nourishing, and grounding. Crafted for everyday rituals.",
    priceInPaise: 0, // [TODO: set from DB]
    mrpInPaise: undefined as number | undefined,
    imageUrl: "/images/cococreme-placeholder-1.jpg", // [PLACEHOLDER]
    size: "100g / 3.52 oz",
  },
];

export default async function SkincareCollectionPage() {
  const products = SKINCARE_PRODUCTS;

  return (
    <div className="bg-[#F7F2E9] min-h-screen">
      {/* Hero */}
      <section className="bg-[#EFE5D5] py-20 text-center border-b border-[#E4D5C2]">
        <div className="container-refora max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-4">
            Collection
          </p>
          <h1 className="font-serif text-5xl lg:text-7xl font-light text-[#29231F] mb-6">
            Skincare
          </h1>
          <p className="text-base text-[#29231F]/60 leading-relaxed">
            Formulated with care. Ingredients chosen for what they do, not what
            they cost. Simple rituals with a real difference.
          </p>
        </div>
      </section>

      {/* Featured product — COCOCRÈME */}
      <section className="container-refora py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-16">
          {/* Featured image */}
          <div className="relative bg-[#EFE5D5] aspect-square rounded-sm overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cococreme-placeholder-1.jpg" // [PLACEHOLDER]
              alt="COCOCRÈME coconut milk soap bar"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 text-[9px] tracking-widest text-[#29231F]/30 select-none">
              [PLACEHOLDER — client asset]
            </span>
            <span className="absolute top-4 right-4 bg-[#29231F] text-[#EFE5D5] text-[10px] px-3 py-1 tracking-[0.12em] uppercase">
              New
            </span>
          </div>

          {/* Featured info */}
          <div className="flex flex-col gap-5">
            <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase">
              Featured · Skincare
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-[#29231F]">
              COCOCRÈME
            </h2>
            <p className="text-base text-[#29231F]/70 leading-relaxed">
              A coconut milk soap with colloidal oatmeal — gentle, nourishing,
              and grounding. Crafted for everyday rituals. Suitable for all skin
              types.
            </p>
            <p className="text-sm text-[#29231F]/50">100g / 3.52 oz</p>

            {products[0]?.priceInPaise && products[0].priceInPaise > 0 ? (
              <p className="font-serif text-3xl text-[#29231F]">
                {formatPrice(products[0].priceInPaise)}
              </p>
            ) : (
              <p className="text-sm text-[#29231F]/50">Price coming soon</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/products/cococreme"
                className="btn btn-primary text-center"
              >
                Shop Now
              </Link>
              <Link
                href="/products/cococreme#ingredients"
                className="btn btn-secondary text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* All skincare grid */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="gold-rule" aria-hidden="true" />
            <p className="text-xs tracking-[0.14em] text-[#29231F]/50 uppercase">
              All Skincare
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group block bg-[#EFE5D5] rounded-sm overflow-hidden hover:shadow-md transition-shadow"
                aria-label={`View ${p.name}`}
              >
                <div className="relative aspect-[4/5] bg-[#E4D5C2] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 text-[9px] tracking-widest text-[#29231F]/30 select-none">
                    [PLACEHOLDER]
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-serif text-xl text-[#29231F] mb-1">
                    {p.name}
                  </p>
                  <p className="text-xs text-[#29231F]/60 mb-3 leading-relaxed line-clamp-2">
                    {p.shortDescription}
                  </p>
                  <p className="text-xs text-[#29231F]/50 mb-1">{p.size}</p>
                  {p.priceInPaise > 0 ? (
                    <span className="font-medium text-[#29231F] text-sm">
                      {formatPrice(p.priceInPaise)}
                    </span>
                  ) : (
                    <span className="text-xs text-[#29231F]/50">
                      Price coming soon
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="bg-[#EFE5D5] py-12 border-t border-[#E4D5C2]">
        <div className="container-refora">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🌿", label: "No harsh sulphates" },
              { icon: "🧴", label: "pH balanced" },
              { icon: "🐇", label: "Cruelty-free" },
              { icon: "🇮🇳", label: "Made in India" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  {icon}
                </span>
                <p className="text-xs text-[#29231F]/60 tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
