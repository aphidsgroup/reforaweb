import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://refora.in"
  ),
  title: {
    default: "REFORA — A More Thoughtful Everyday Ritual",
    template: "%s | REFORA",
  },
  description:
    "REFORA brings you considered skincare and organic essentials. Meet COCOCRÈME — coconut milk soap with colloidal oatmeal. Restore · Renew · Refora.",
  keywords: ["REFORA", "COCOCRÈME", "coconut milk soap", "natural skincare", "organic essentials"],
  authors: [{ name: "REFORA" }],
  creator: "REFORA",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://refora.in",
    siteName: "REFORA",
    title: "REFORA — A More Thoughtful Everyday Ritual",
    description:
      "Considered skincare and organic essentials. Meet COCOCRÈME — coconut milk soap with colloidal oatmeal.",
  },
  twitter: {
    card: "summary_large_image",
    title: "REFORA — A More Thoughtful Everyday Ritual",
    description: "Considered skincare and organic essentials.",
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
    googleBot: {
      index: process.env.NODE_ENV === "production",
      follow: process.env.NODE_ENV === "production",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "REFORA",
              url: "https://refora.in",
              logo: "https://refora.in/logo.png",
              sameAs: [
                "https://www.instagram.com/refora",
                "https://www.facebook.com/refora",
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
