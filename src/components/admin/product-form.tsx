import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProduct, updateProduct, archiveProduct } from "@/app/admin/products/actions";

type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  ingredients: string | null;
  howToUse: string | null;
  priceInPaise: number;
  mrpInPaise: number | null;
  sku: string | null;
  status: string;
  isFeatured: boolean | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

const STATUSES = ["draft", "published", "upcoming", "archived"];

/** Paise are the storage unit; the form works in rupees. */
const toRupees = (paise: number | null | undefined) =>
  paise && paise > 0 ? (paise / 100).toFixed(2) : "";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label-refora">{label}</label>
      {children}
      {hint && <p className="text-xs text-espresso/45 mt-1.5">{hint}</p>}
    </div>
  );
}

export function ProductForm({
  product,
  stock,
}: {
  product?: ProductRecord;
  stock?: number;
}) {
  const editing = Boolean(product);

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-3xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs text-clay hover:text-espresso mb-6"
      >
        <ArrowLeft size={13} strokeWidth={1.5} aria-hidden="true" />
        All products
      </Link>

      <h1 className="font-serif text-3xl font-light text-espresso mb-8">
        {editing ? product!.name : "New product"}
      </h1>

      <form action={editing ? updateProduct : createProduct} className="space-y-6">
        {editing && <input type="hidden" name="id" value={product!.id} />}

        {/* Basics */}
        <section className="bg-soft-white border border-sand rounded-sm p-6 space-y-5">
          <h2 className="font-serif text-xl font-light text-espresso">Basics</h2>

          <Field label="Name">
            <input
              name="name"
              required
              defaultValue={product?.name}
              className="input-refora"
              placeholder="COCOCRÈME"
            />
          </Field>

          <Field label="URL slug" hint="Leave blank to generate from the name.">
            <input
              name="slug"
              defaultValue={product?.slug}
              className="input-refora"
              placeholder="cococreme"
            />
          </Field>

          <Field label="Short description" hint="Shown on product cards and in search results.">
            <textarea
              name="shortDescription"
              rows={2}
              defaultValue={product?.shortDescription ?? ""}
              className="input-refora resize-y"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="SKU">
              <input name="sku" defaultValue={product?.sku ?? ""} className="input-refora" />
            </Field>

            <Field label="Status">
              <select
                name="status"
                defaultValue={product?.status ?? "draft"}
                className="input-refora cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-3 text-sm text-espresso/75">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={product?.isFeatured ?? false}
              className="w-4 h-4 accent-[var(--color-espresso)]"
            />
            Feature on the homepage
          </label>
        </section>

        {/* Images */}
        <section className="bg-soft-white border border-sand rounded-sm p-6 space-y-5">
          <h2 className="font-serif text-xl font-light text-espresso">Images</h2>

          <Field label="Upload Images" hint="Select one or more images. They will be automatically converted to optimized WebP format on Cloudinary.">
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="input-refora w-full"
            />
          </Field>
        </section>

        {/* Pricing */}
        <section className="bg-soft-white border border-sand rounded-sm p-6 space-y-5">
          <h2 className="font-serif text-xl font-light text-espresso">Pricing &amp; stock</h2>

          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Price (₹)">
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={toRupees(product?.priceInPaise)}
                className="input-refora tnum"
                placeholder="349.00"
              />
            </Field>

            <Field label="MRP (₹)" hint="Optional. Shown struck through.">
              <input
                name="mrp"
                type="number"
                step="0.01"
                min="0"
                defaultValue={toRupees(product?.mrpInPaise)}
                className="input-refora tnum"
                placeholder="449.00"
              />
            </Field>

            {!editing && (
              <Field label="Opening stock">
                <input
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={stock ?? 0}
                  className="input-refora tnum"
                />
              </Field>
            )}
          </div>
        </section>

        {/* Detail copy */}
        <section className="bg-soft-white border border-sand rounded-sm p-6 space-y-5">
          <h2 className="font-serif text-xl font-light text-espresso">Product detail</h2>

          <Field label="Description">
            <textarea
              name="description"
              rows={5}
              defaultValue={product?.description ?? ""}
              className="input-refora resize-y"
            />
          </Field>

          <Field label="Ingredients">
            <textarea
              name="ingredients"
              rows={3}
              defaultValue={product?.ingredients ?? ""}
              className="input-refora resize-y"
            />
          </Field>

          <Field label="How to use">
            <textarea
              name="howToUse"
              rows={3}
              defaultValue={product?.howToUse ?? ""}
              className="input-refora resize-y"
            />
          </Field>
        </section>

        {/* SEO */}
        <section className="bg-soft-white border border-sand rounded-sm p-6 space-y-5">
          <h2 className="font-serif text-xl font-light text-espresso">SEO</h2>

          <Field label="Meta title" hint="Falls back to the product name.">
            <input
              name="metaTitle"
              defaultValue={product?.metaTitle ?? ""}
              className="input-refora"
            />
          </Field>

          <Field label="Meta description" hint="Around 155 characters reads best in Google.">
            <textarea
              name="metaDescription"
              rows={2}
              defaultValue={product?.metaDescription ?? ""}
              className="input-refora resize-y"
            />
          </Field>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary">
            <span>{editing ? "Save changes" : "Create product"}</span>
          </button>
          <Link href="/admin/products" className="btn btn-secondary">
            <span>Cancel</span>
          </Link>
        </div>
      </form>

      {editing && product!.status !== "archived" && (
        <form
          action={archiveProduct}
          className="mt-10 pt-7 border-t border-sand flex items-center justify-between gap-6"
        >
          <input type="hidden" name="id" value={product!.id} />
          <div>
            <p className="text-sm text-espresso">Archive this product</p>
            <p className="text-xs text-espresso/55 mt-1">
              Removes it from the storefront. Past orders keep their history.
            </p>
          </div>
          <button type="submit" className="btn btn-secondary btn-sm shrink-0">
            <span>Archive</span>
          </button>
        </form>
      )}
    </div>
  );
}
