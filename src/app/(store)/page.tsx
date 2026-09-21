import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { TrustStrip } from "@/components/home/trust-strip";
import { FeaturedProduct } from "@/components/home/featured-product";
import { ProductDetails } from "@/components/home/product-details";
import { BrandRanges } from "@/components/home/brand-ranges";
import { BrandIntro } from "@/components/home/brand-intro";
import { ReviewsSection } from "@/components/home/reviews-section";
import { AssuranceRow } from "@/components/home/assurance-row";
import { InstagramSection } from "@/components/home/instagram-section";
import { HomeFaqs } from "@/components/home/home-faqs";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { HOME_FAQS } from "@/lib/catalog";
import { getFeaturedProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "REFORA — A More Thoughtful Everyday Ritual",
  description:
    "Meet COCOCRÈME — coconut milk soap with colloidal oatmeal. Considered skincare and pure organic essentials from REFORA. Restore · Renew · Refora.",
  alternates: { canonical: "/" },
};

export const revalidate = 300;

/** FAQ structured data — earns the rich result for the questions below. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

function buildProductSchema(product: Awaited<ReturnType<typeof getFeaturedProduct>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: "REFORA" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.priceInPaise / 100).toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      url: `https://refora.in/products/${product.slug}`,
    },
  };
}

export default async function HomePage() {
  const featured = await getFeaturedProduct();
  const productSchema = buildProductSchema(featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* A · Product-led hero */}
      <HeroSection product={featured} />

      {/* B · Trust marquee */}
      <TrustStrip />

      {/* C · Featured launch product, with a working buy panel */}
      <FeaturedProduct product={featured} />

      {/* D · Why it works — the three confirmed claims */}
      <ProductDetails product={featured} />

      {/* E · Both ranges, given equal weight */}
      <BrandRanges />

      {/* F · Brand story */}
      <BrandIntro />

      {/* G · Customer reviews */}
      <ReviewsSection />

      {/* H · Shipping, payment and support assurances */}
      <AssuranceRow />

      {/* I · Instagram */}
      <InstagramSection />

      {/* J · FAQ preview */}
      <HomeFaqs />

      {/* K · Newsletter & launch offer */}
      <NewsletterSignup />
    </>
  );
}
