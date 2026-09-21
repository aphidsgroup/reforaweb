import { eq, sql, desc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { withTimeout } from "@/lib/with-timeout";
import { products, inventory, productImages, reviews } from "@/db/schema";
import {
  ALL_PRODUCTS,
  COCOCREME,
  ORGANIC_PRODUCTS,
  getProductBySlug as getFallbackBySlug,
  type Product,
} from "@/lib/catalog";

/**
 * Storefront product data
 * ───────────────────────────────────────────────────────────────────────────
 * The database is the source of truth, so anything edited in /admin appears on
 * the site. `catalog.ts` is kept as a build-time fallback and is used when:
 *
 *   • DATABASE_URL is absent (a preview build, or a fresh clone)
 *   • the database is unreachable
 *   • the products table is still empty (before `npm run db:seed`)
 *
 * That means the marketing pages render correctly in every one of those cases
 * instead of shipping an empty shop, and the fallback quietly stops being used
 * the moment real rows exist.
 *
 * Presentation fields the `products` table has no column for — subtitle, which
 * composed study to draw, benefit copy, organic provenance — live in the
 * `specifications` jsonb column. The admin form writes the columns it knows
 * about and leaves this untouched.
 */

type Specifications = Partial<{
  subtitle: string;
  range: Product["range"];
  category: string;
  study: Product["study"];
  size: string;
  variantName: string;
  badge: string;
  benefits: Product["benefits"];
  origin: string;
  process: string;
  difference: string;
  suggestedUses: string[];
}>;

type ProductRow = typeof products.$inferSelect;

function mapRow(
  row: ProductRow,
  extras: {
    stock: number | null;
    imageUrl: string | null;
    rating: number;
    reviewCount: number;
  }
): Product {
  const spec = (row.specifications ?? {}) as Specifications;

  // A published product with stock is buyable. `upcoming` deliberately is not,
  // which is how the REFORA ORGANIC range shows as "coming soon".
  const inStock = row.status === "published" && (extras.stock ?? 0) > 0;

  return {
    id: row.sku ?? row.id,
    productId: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: spec.subtitle ?? row.shortDescription ?? "",
    range: spec.range ?? "skincare",
    category: spec.category ?? (spec.range === "organic" ? "Oils" : "Skincare"),
    imageUrl: extras.imageUrl,
    study: spec.study ?? "carton",
    size: spec.size ?? "",
    variantName: spec.variantName ?? spec.size ?? "Default",
    priceInPaise: row.priceInPaise,
    mrpInPaise: row.mrpInPaise ?? 0,
    inStock,
    badge: spec.badge,
    shortDescription: row.shortDescription ?? "",
    // Paragraphs are stored as one text column separated by blank lines.
    description: (row.description ?? "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    benefits: spec.benefits ?? [],
    ingredients: row.ingredients ?? "",
    howToUse: (row.howToUse ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    origin: spec.origin,
    process: spec.process,
    difference: spec.difference,
    suggestedUses: spec.suggestedUses,
    rating: extras.rating,
    reviewCount: extras.reviewCount,
  };
}

/** Primary image, stock and approved-review aggregates for a set of products. */
async function loadExtras(ids: string[]) {
  if (ids.length === 0) {
    return {
      stock: new Map<string, number>(),
      images: new Map<string, string>(),
      ratings: new Map<string, { rating: number; count: number }>(),
    };
  }

  const [stockRows, imageRows, reviewRows] = await Promise.all([
    db
      .select({ productId: inventory.productId, quantity: inventory.quantity })
      .from(inventory)
      .where(inArray(inventory.productId, ids)),
    db
      .select({
        productId: productImages.productId,
        url: productImages.url,
        isPrimary: productImages.isPrimary,
        displayOrder: productImages.displayOrder,
      })
      .from(productImages)
      .where(inArray(productImages.productId, ids)),
    // Only approved reviews count towards the public rating.
    db
      .select({
        productId: reviews.productId,
        avg: sql<number>`avg(${reviews.rating})`,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(sql`${reviews.productId} in ${ids} and ${reviews.status} = 'approved'`)
      .groupBy(reviews.productId),
  ]);

  const stock = new Map<string, number>();
  for (const row of stockRows) {
    if (row.productId) stock.set(row.productId, row.quantity);
  }

  const images = new Map<string, string>();
  for (const row of [...imageRows].sort(
    (a, b) =>
      Number(b.isPrimary) - Number(a.isPrimary) ||
      (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  )) {
    if (!images.has(row.productId)) images.set(row.productId, row.url);
  }

  const ratings = new Map<string, { rating: number; count: number }>();
  for (const row of reviewRows) {
    ratings.set(row.productId, {
      rating: Math.round(Number(row.avg) * 10) / 10,
      count: Number(row.count),
    });
  }

  return { stock, images, ratings };
}

async function hydrate(rows: ProductRow[]): Promise<Product[]> {
  const extras = await loadExtras(rows.map((r) => r.id));

  return rows.map((row) => {
    const rating = extras.ratings.get(row.id);
    return mapRow(row, {
      stock: extras.stock.get(row.id) ?? 0,
      imageUrl: extras.images.get(row.id) ?? null,
      rating: rating?.rating ?? 0,
      reviewCount: rating?.count ?? 0,
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   Public API — each falls back to the static catalog
   ═══════════════════════════════════════════════════════════════════════════ */

/** Every product a visitor may see. Archived and draft rows are excluded. */
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await withTimeout(
      (async () => {
        const rows = await db
          .select()
          .from(products)
          .where(sql`${products.status} in ('published', 'upcoming')`)
          .orderBy(desc(products.isFeatured), products.name);

        if (rows.length === 0) return ALL_PRODUCTS;
        return await hydrate(rows);
      })(),
      "getAllProducts"
    );
  } catch {
    return ALL_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    return await withTimeout(
      (async () => {
        const rows = await db
          .select()
          .from(products)
          .where(eq(products.slug, slug))
          .limit(1);

        if (rows.length === 0) return getFallbackBySlug(slug);
        // Drafts and archived products are not public.
        if (rows[0].status === "draft" || rows[0].status === "archived") return undefined;

        const [product] = await hydrate(rows);
        return product;
      })(),
      "getProductBySlug"
    );
  } catch {
    return getFallbackBySlug(slug);
  }
}

/** The product the homepage leads with. */
export async function getFeaturedProduct(): Promise<Product> {
  try {
    return await withTimeout(
      (async () => {
        const rows = await db
          .select()
          .from(products)
          .where(sql`${products.status} = 'published'`)
          .orderBy(desc(products.isFeatured), products.createdAt)
          .limit(1);

        if (rows.length === 0) return COCOCREME;
        const [product] = await hydrate(rows);
        return product;
      })(),
      "getFeaturedProduct"
    );
  } catch {
    return COCOCREME;
  }
}

export async function getProductsByRange(range: Product["range"]): Promise<Product[]> {
  const all = await getAllProducts();
  const matching = all.filter((p) => p.range === range);

  // A database with rows but none tagged for this range would otherwise blank
  // the page; fall back to the catalog's members of that range.
  if (matching.length > 0) return matching;
  return range === "organic" ? ORGANIC_PRODUCTS : [COCOCREME];
}

/** Slugs for `generateStaticParams`. Never throws — a failed build is worse. */
export async function getAllProductSlugs(): Promise<string[]> {
  try {
    return await withTimeout(
      (async () => {
        const rows = await db.select({ slug: products.slug }).from(products);
        if (rows.length === 0) return ALL_PRODUCTS.map((p) => p.slug);
        return rows.map((r) => r.slug);
      })(),
      "getAllProductSlugs"
    );
  } catch {
    return ALL_PRODUCTS.map((p) => p.slug);
  }
}

export type { Product };
