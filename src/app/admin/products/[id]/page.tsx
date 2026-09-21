import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, inventory } from "@/db/schema";
import { requireRole } from "@/lib/admin-auth";
import { ProductForm } from "@/components/admin/product-form";
import { AdminError } from "@/components/admin/admin-error";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit product" };

type Loaded =
  | { ok: true; product: typeof products.$inferSelect; stock: number }
  | { ok: false; error: unknown };

/** Kept out of the component so no JSX is constructed inside the try. */
async function load(id: string): Promise<Loaded> {
  try {
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!product) return { ok: true, product: undefined as never, stock: 0 };

    const [stockRow] = await db
      .select({ quantity: inventory.quantity })
      .from(inventory)
      .where(eq(inventory.productId, id))
      .limit(1);

    return { ok: true, product, stock: stockRow?.quantity ?? 0 };
  } catch (error) {
    return { ok: false, error };
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("super_admin", "admin");
  const { id } = await params;

  const result = await load(id);

  if (!result.ok) return <AdminError title="Could not load this product" error={result.error} />;
  if (!result.product) notFound();

  return <ProductForm product={result.product} stock={result.stock} />;
}
