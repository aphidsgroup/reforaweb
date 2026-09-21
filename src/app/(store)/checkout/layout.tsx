import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Secure checkout — UPI, cards, net banking, wallets and cash on delivery.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
