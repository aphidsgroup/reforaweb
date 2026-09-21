import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProduct } from "@/components/home/featured-product";
import { BrandRanges } from "@/components/home/brand-ranges";
import { ProductDetails } from "@/components/home/product-details";
import { BrandIntro } from "@/components/home/brand-intro";
import { HomeFaqs } from "@/components/home/home-faqs";
import { NewsletterSignup } from "@/components/home/newsletter-signup";

export const metadata: Metadata = {
  title: "REFORA — A More Thoughtful Everyday Ritual",
  description:
    "Meet COCOCRÈME — coconut milk soap with colloidal oatmeal. Considered skincare and organic essentials from REFORA. Restore · Renew · Refora.",
};

export default function HomePage() {
  return (
    <>
      {/* A: Product-led hero */}
      <HeroSection />

      {/* B: Featured launch product module */}
      <FeaturedProduct />

      {/* C: Two brand ranges */}
      <BrandRanges />

      {/* D: Product details — ingredients, use */}
      <ProductDetails />

      {/* E: Brand introduction */}
      <BrandIntro />

      {/* F: FAQs preview */}
      <HomeFaqs />

      {/* G: Newsletter */}
      <NewsletterSignup />
    </>
  );
}
