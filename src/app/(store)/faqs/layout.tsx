import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about COCOCRÈME, ingredients, shipping, returns and REFORA ORGANIC.",
  alternates: { canonical: "/faqs" },
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
