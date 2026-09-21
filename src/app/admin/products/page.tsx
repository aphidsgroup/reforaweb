import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { products, inventory } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import { PageHeader, StatusPill } from "@/components/admin/admin-shell";
import { AdminError } from "@/components/admin/admin-error";
import { updateStock } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function ProductsPage() {
  await requireAdmin();

  let rows: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    priceInPaise: number;
    mrpInPaise: number | null;
    status: string;
    stock: number | null;
  }[];

  try {
    rows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        priceInPaise: products.priceInPaise,
        mrpInPaise: products.mrpInPaise,
        status: products.status,
        stock: inventory.quantity,
      })
      .from(products)
      .leftJoin(inventory, eq(inventory.productId, products.id))
      .orderBy(desc(products.updatedAt));
  } catch (error) {
    return <AdminError title="Could not load products" error={error} />;
  }

  return (
    <div className="p-5 md:p-8 lg:p-10">
      <PageHeader
        title="Products"
        subtitle="Prices, stock and publication status. Changes go live immediately."
        action={
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus size={13} strokeWidth={1.8} aria-hidden="true" />
            <span>New product</span>
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="bg-soft-white border border-sand rounded-sm py-20 text-center">
          <p className="font-serif text-2xl text-espresso mb-2">No products yet.</p>
          <p className="text-sm text-espresso/55 mb-7">
            Add COCOCRÈME to replace the placeholder catalog on the storefront.
          </p>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">
            <span>Add the first product</span>
          </Link>
        </div>
      ) : (
        <div className="bg-soft-white border border-sand rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Products</caption>
              <thead>
                <tr className="border-b border-sand bg-cream/60 text-left">
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Product</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Status</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5 text-right">Price</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5 text-right">MRP</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Stock</th>
                  <th scope="col" className="sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {rows.map((product) => (
                  <tr key={product.id} className="hover:bg-cream/40 transition-colors">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-espresso hover:text-clay"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-espresso/45">
                        /{product.slug}
                        {product.sku && ` · ${product.sku}`}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={product.status} />
                    </td>
                    <td className="px-5 py-4 text-right text-espresso tnum whitespace-nowrap">
                      {formatPrice(product.priceInPaise)}
                    </td>
                    <td className="px-5 py-4 text-right text-espresso/50 tnum whitespace-nowrap">
                      {product.mrpInPaise ? formatPrice(product.mrpInPaise) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <form action={updateStock} className="flex items-center gap-2">
                        <input type="hidden" name="productId" value={product.id} />
                        <label htmlFor={`stock-${product.id}`} className="sr-only">
                          Stock for {product.name}
                        </label>
                        <input
                          id={`stock-${product.id}`}
                          name="quantity"
                          type="number"
                          min={0}
                          defaultValue={product.stock ?? 0}
                          className="input-refora w-20 py-1.5 text-sm tnum"
                        />
                        <button type="submit" className="btn btn-secondary btn-sm">
                          <span>Save</span>
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/products/${product.id}`} className="text-xs text-clay hover:text-espresso font-medium uppercase tracking-widest">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
