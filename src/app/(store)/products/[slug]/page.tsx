import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail, RelatedProducts } from "@/components/product/product-detail";
import { ALL_PRODUCTS, getProductBySlug } from "@/lib/catalog";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} — ${product.subtitle}`,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | REFORA`,
      description: product.shortDescription,
      type: "website",
      url: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = ALL_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.id,
    brand: { "@type": "Brand", name: "REFORA" },
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.priceInPaise / 100).toFixed(2),
      availability:
        product.inStock && product.priceInPaise > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      url: `https://refora.in/products/${product.slug}`,
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://refora.in" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "https://refora.in/shop" },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://refora.in/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProductDetail product={product} />
      <RelatedProducts products={related} />
    </>
  );
}
