import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://refora.in";

  if (!isProduction) {
    // Development / staging: disallow all crawlers
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // Production: allow public pages, disallow sensitive routes
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/checkout",
          "/checkout/",
          "/account",
          "/account/",
          "/api/",
          "/orders/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
