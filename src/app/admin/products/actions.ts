"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, inventory, productImages } from "@/db/schema";
import { requireAdmin, requireRole, recordAudit } from "@/lib/admin-auth";
import { uploadImage } from "@/lib/cloudinary";

const STATUSES = ["draft", "published", "archived", "upcoming"] as const;
type Status = (typeof STATUSES)[number];

/** Rupees in the form → paise in the database. */
function toPaise(value: FormDataEntryValue | null): number {
  const rupees = Number(String(value ?? "").trim());
  if (!Number.isFinite(rupees) || rupees < 0) return 0;
  return Math.round(rupees * 100);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function readProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("A product name is required.");

  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!slug) throw new Error("Could not derive a URL slug from that name.");

  const priceInPaise = toPaise(formData.get("price"));
  const mrpInPaise = toPaise(formData.get("mrp"));

  if (priceInPaise <= 0) throw new Error("Price must be greater than zero.");
  if (mrpInPaise > 0 && mrpInPaise < priceInPaise) {
    throw new Error("MRP cannot be lower than the selling price.");
  }

  const status = String(formData.get("status") ?? "draft") as Status;
  if (!STATUSES.includes(status)) throw new Error(`Unknown status: ${status}`);

  return {
    name,
    slug,
    shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    ingredients: String(formData.get("ingredients") ?? "").trim() || null,
    howToUse: String(formData.get("howToUse") ?? "").trim() || null,
    priceInPaise,
    mrpInPaise: mrpInPaise > 0 ? mrpInPaise : null,
    sku: String(formData.get("sku") ?? "").trim() || null,
    status,
    isFeatured: formData.get("isFeatured") === "on",
    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
    updatedAt: new Date(),
  };
}

async function handleImageUploads(productId: string, formData: FormData) {
  const images = formData.getAll("images") as File[];
  const uploadedUrls = [];

  for (const image of images) {
    if (image.size > 0 && image.name) {
      const result = await uploadImage(image);
      if (result) uploadedUrls.push(result);
    }
  }

  if (uploadedUrls.length > 0) {
    const [maxRow] = await db
      .select({ max: sql<number>`max(${productImages.displayOrder})` })
      .from(productImages)
      .where(eq(productImages.productId, productId));
    
    let order = Number(maxRow?.max ?? 0);

    for (let i = 0; i < uploadedUrls.length; i++) {
      await db.insert(productImages).values({
        productId,
        cloudinaryId: uploadedUrls[i].publicId,
        url: uploadedUrls[i].url,
        isPrimary: order === 0 && i === 0, // First image is primary if none exist
        displayOrder: order + i + 1,
      });
    }
  }
}

export async function createProduct(formData: FormData) {
  const admin = await requireRole("super_admin", "admin");
  const values = readProductForm(formData);

  const [created] = await db.insert(products).values(values).returning({ id: products.id });

  // Every product gets an inventory row up front
  await db.insert(inventory).values({
    productId: created.id,
    quantity: Number(formData.get("stock") ?? 0) || 0,
  });

  await handleImageUploads(created.id, formData);

  await recordAudit(admin, "product.create", "products", created.id, { name: values.name });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${created.id}`);
}

export async function updateProduct(formData: FormData) {
  const admin = await requireRole("super_admin", "admin");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing product id.");

  const values = readProductForm(formData);
  await db.update(products).set(values).where(eq(products.id, id));

  await handleImageUploads(id, formData);

  await recordAudit(admin, "product.update", "products", id, { name: values.name });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/products/${values.slug}`);
}

/** Stock is edited inline from the list, so it has its own narrow action. */
export async function updateStock(formData: FormData) {
  const admin = await requireAdmin();

  const productId = String(formData.get("productId") ?? "");
  const quantity = Math.max(0, Number(formData.get("quantity") ?? 0) || 0);
  if (!productId) throw new Error("Missing product id.");

  const existing = await db
    .select({ id: inventory.id })
    .from(inventory)
    .where(eq(inventory.productId, productId))
    .limit(1);

  if (existing.length) {
    await db
      .update(inventory)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(inventory.productId, productId));
  } else {
    await db.insert(inventory).values({ productId, quantity });
  }

  await recordAudit(admin, "product.stock", "products", productId, { quantity });
  revalidatePath("/admin/products");
}

/**
 * Archives rather than deletes.
 *
 * Order lines reference products, so a hard delete would either fail on the
 * foreign key or orphan order history. Archiving removes it from the
 * storefront and keeps past orders readable.
 */
export async function archiveProduct(formData: FormData) {
  const admin = await requireRole("super_admin", "admin");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing product id.");

  await db
    .update(products)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(products.id, id));

  await recordAudit(admin, "product.archive", "products", id);

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function countProducts(): Promise<number> {
  const [row] = await db.select({ count: sql<number>`count(*)` }).from(products);
  return Number(row?.count ?? 0);
}
