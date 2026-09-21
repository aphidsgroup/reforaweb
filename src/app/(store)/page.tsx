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
import { COCOCREME, HOME_FAQS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "REFORA — A More Thoughtful Everyday Ritual",
  description:
    "Meet COCOCRÈME — coconut milk soap with colloidal oatmeal. Considered skincare and pure organic essentials from REFORA. Restore · Renew · Refora.",
  alternates: { canonical: "/" },
};

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

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: COCOCREME.name,
  description: COCOCREME.shortDescription,
  brand: { "@type": "Brand", name: "REFORA" },
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    price: (COCOCREME.priceInPaise / 100).toFixed(2),
    availability: COCOCREME.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder",
    url: "https://refora.in/products/cococreme",
  },
};

export default function HomePage() {
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
      <HeroSection />

      {/* B · Trust marquee */}
      <TrustStrip />

      {/* C · Featured launch product, with a working buy panel */}
      <FeaturedProduct />

      {/* D · Why it works — the three confirmed claims */}
      <ProductDetails />

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
