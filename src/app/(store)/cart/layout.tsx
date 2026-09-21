import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Bag",
  description:
    "Review the items in your REFORA bag and continue to a secure checkout.",
  alternates: { canonical: "/cart" },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
