import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://refora.in";

// Static routes with priorities and change frequencies
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/shop`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/skincare`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    url: `${BASE_URL}/organic`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/faqs`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/journal`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  // Policy pages
  {
    url: `${BASE_URL}/policies/privacy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/policies/terms`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/policies/shipping`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/policies/returns`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${BASE_URL}/policies/cancellation`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/policies/cookies`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Dynamic product routes ──
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const publishedProducts = await db
      .select({
        slug: products.slug,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.status, "published"));

    productRoutes = publishedProducts.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch {
    // DB not yet configured — include COCOCRÈME statically
    productRoutes = [
      {
        url: `${BASE_URL}/products/cococreme`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      },
    ];
  }

  // ── Dynamic journal routes ──
  // TODO: add journal posts to sitemap once DB is seeded
  // const journalRoutes = await db.select({ slug: journalPosts.slug, publishedAt: journalPosts.publishedAt })
  //   .from(journalPosts).where(eq(journalPosts.isPublished, true));

  return [
    ...STATIC_ROUTES,
    ...productRoutes,
    // Excluded: /admin, /checkout, /account, /orders (per spec)
  ];
}
