import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid } from "@/components/shop/shop-grid";
import { Reveal } from "@/components/ui/reveal";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse REFORA — considered skincare and pure organic essentials. Shop COCOCRÈME coconut milk soap, cold pressed oils and bilona ghee.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop | REFORA",
    description: "Considered skincare and organic essentials — thoughtfully made.",
    type: "website",
  },
};

// Revalidated on a timer, and immediately whenever /admin saves a product.
export const revalidate = 300;

export default async function ShopPage() {
  const catalog = await getAllProducts();

  return (
    <>
      {/* ── Page header ───────────────────────────────────────────────── */}
      <section className="bg-cream relative overflow-hidden grain grain-light">
        <div className="container-refora py-16 md:py-24 text-center relative">
          <Reveal>
            <p className="eyebrow mb-4">All products</p>
            <h1
              className="font-serif font-light text-espresso leading-[1.05] text-balance mb-5"
              style={{ fontSize: "var(--text-headline)" }}
            >
              The full range.
            </h1>
            <p className="text-espresso/65 max-w-lg mx-auto text-pretty">
              Considered skincare and pure everyday essentials — made with intention, priced
              without theatre.
            </p>
          </Reveal>
        </div>
      </section>

      <Suspense fallback={<div className="container-refora section" />}>
        <ShopGrid products={catalog} />
      </Suspense>
    </>
  );
}
