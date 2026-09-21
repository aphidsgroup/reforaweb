import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { discounts } from "@/db/schema";
import { requireAdmin, requireRole, recordAudit } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import { PageHeader } from "@/components/admin/admin-shell";
import { AdminError } from "@/components/admin/admin-error";

export const dynamic = "force-dynamic";
export const metadata = { title: "Coupons" };

const TYPES = [
  { value: "percentage", label: "Percentage off" },
  { value: "fixed_amount", label: "Fixed amount off" },
  { value: "free_shipping", label: "Free shipping" },
];

async function createCoupon(formData: FormData) {
  "use server";
  const admin = await requireRole("super_admin", "admin");

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "percentage");
  const rawValue = Number(String(formData.get("value") ?? "0"));

  if (!code) throw new Error("A coupon code is required.");
  if (!name) throw new Error("Give the coupon an internal name.");
  if (type === "percentage" && (rawValue <= 0 || rawValue > 100)) {
    throw new Error("A percentage discount must be between 1 and 100.");
  }
  if (type === "fixed_amount" && rawValue <= 0) {
    throw new Error("A fixed discount must be greater than zero.");
  }

  // Percentages are stored as-is; fixed amounts are stored in paise to match
  // every other money column in the schema.
  const value = type === "fixed_amount" ? Math.round(rawValue * 100) : rawValue;

  const minRupees = Number(String(formData.get("minimumOrder") ?? "0")) || 0;
  const expiresRaw = String(formData.get("expiresAt") ?? "").trim();
  const usageLimitRaw = String(formData.get("usageLimit") ?? "").trim();

  await db.insert(discounts).values({
    code,
    name,
    type: type as "percentage" | "fixed_amount" | "free_shipping",
    value: String(value),
    minimumOrderInPaise: Math.round(minRupees * 100),
    isFirstOrderOnly: formData.get("isFirstOrderOnly") === "on",
    usageLimit: usageLimitRaw ? Number(usageLimitRaw) : null,
    expiresAt: expiresRaw ? new Date(expiresRaw) : null,
    isActive: true,
  });

  await recordAudit(admin, "coupon.create", "discounts", code, { name, type });
  revalidatePath("/admin/coupons");
}

async function toggleCoupon(formData: FormData) {
  "use server";
  const admin = await requireRole("super_admin", "admin");

  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  if (!id) throw new Error("Missing coupon id.");

  await db
    .update(discounts)
    .set({ isActive: next, updatedAt: new Date() })
    .where(eq(discounts.id, id));

  await recordAudit(admin, next ? "coupon.activate" : "coupon.deactivate", "discounts", id);
  revalidatePath("/admin/coupons");
}

function describe(type: string, value: string): string {
  const n = Number(value);
  if (type === "percentage") return `${n}% off`;
  if (type === "fixed_amount") return `${formatPrice(n)} off`;
  return "Free shipping";
}

type CouponRow = typeof discounts.$inferSelect & { expired: boolean };

/**
 * Loads coupons and resolves expiry here rather than during render — reading
 * the clock in a component body is an impure call, and the comparison belongs
 * with the data anyway.
 */
async function loadCoupons(): Promise<
  { ok: true; rows: CouponRow[] } | { ok: false; error: unknown }
> {
  try {
    const rows = await db.select().from(discounts).orderBy(desc(discounts.createdAt));
    const now = Date.now();
    return {
      ok: true,
      rows: rows.map((c) => ({
        ...c,
        expired: c.expiresAt ? c.expiresAt.getTime() < now : false,
      })),
    };
  } catch (error) {
    return { ok: false, error };
  }
}

export default async function CouponsPage() {
  await requireAdmin();

  const result = await loadCoupons();
  if (!result.ok) return <AdminError title="Could not load coupons" error={result.error} />;
  const rows = result.rows;

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-5xl">
      <PageHeader
        title="Coupons"
        subtitle="Create, expire and switch off discount codes without a developer."
      />

      {/* Create */}
      <section className="bg-soft-white border border-sand rounded-sm p-6 mb-8">
        <h2 className="font-serif text-xl font-light text-espresso mb-5">New coupon</h2>

        <form action={createCoupon} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label htmlFor="code" className="label-refora">Code</label>
            <input
              id="code"
              name="code"
              required
              placeholder="WELCOME15"
              className="input-refora uppercase tracking-[0.1em]"
            />
          </div>

          <div>
            <label htmlFor="name" className="label-refora">Internal name</label>
            <input
              id="name"
              name="name"
              required
              placeholder="Launch offer"
              className="input-refora"
            />
          </div>

          <div>
            <label htmlFor="type" className="label-refora">Type</label>
            <select id="type" name="type" className="input-refora cursor-pointer">
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="value" className="label-refora">Value</label>
            <input
              id="value"
              name="value"
              type="number"
              step="0.01"
              min="0"
              placeholder="15"
              className="input-refora tnum"
            />
            <p className="text-xs text-espresso/45 mt-1.5">Percent, or ₹ for a fixed amount.</p>
          </div>

          <div>
            <label htmlFor="minimumOrder" className="label-refora">Minimum order (₹)</label>
            <input
              id="minimumOrder"
              name="minimumOrder"
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
              className="input-refora tnum"
            />
          </div>

          <div>
            <label htmlFor="usageLimit" className="label-refora">Usage limit</label>
            <input
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              placeholder="Unlimited"
              className="input-refora tnum"
            />
          </div>

          <div>
            <label htmlFor="expiresAt" className="label-refora">Expires</label>
            <input id="expiresAt" name="expiresAt" type="date" className="input-refora" />
          </div>

          <label className="flex items-center gap-3 text-sm text-espresso/75 sm:col-span-2 lg:col-span-1 sm:pt-7">
            <input
              type="checkbox"
              name="isFirstOrderOnly"
              className="w-4 h-4 accent-[var(--color-espresso)]"
            />
            First order only
          </label>

          <div className="sm:col-span-2 lg:col-span-3">
            <button type="submit" className="btn btn-primary btn-sm">
              <span>Create coupon</span>
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      {rows.length === 0 ? (
        <div className="bg-soft-white border border-sand rounded-sm py-16 text-center">
          <p className="text-sm text-espresso/55">No coupons yet.</p>
        </div>
      ) : (
        <div className="bg-soft-white border border-sand rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Coupons</caption>
              <thead>
                <tr className="border-b border-sand bg-cream/60 text-left">
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Code</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Discount</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Conditions</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Used</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5 text-right">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {rows.map((c) => {
                  const live = Boolean(c.isActive) && !c.expired;

                  return (
                    <tr key={c.id} className="hover:bg-cream/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-espresso tracking-[0.1em]">{c.code}</p>
                        <p className="text-xs text-espresso/45">{c.name}</p>
                      </td>
                      <td className="px-5 py-4 text-espresso/80">
                        {describe(c.type, c.value)}
                      </td>
                      <td className="px-5 py-4 text-xs text-espresso/55">
                        {(c.minimumOrderInPaise ?? 0) > 0 && (
                          <>Min {formatPrice(c.minimumOrderInPaise ?? 0)}<br /></>
                        )}
                        {c.isFirstOrderOnly && <>First order only<br /></>}
                        {c.expiresAt && (
                          <>
                            {c.expired ? "Expired " : "Expires "}
                            {c.expiresAt.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </>
                        )}
                        {!c.minimumOrderInPaise && !c.isFirstOrderOnly && !c.expiresAt && "—"}
                      </td>
                      <td className="px-5 py-4 text-espresso/70 tnum">
                        {c.usageCount ?? 0}
                        {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <form action={toggleCoupon} className="inline-flex items-center gap-3">
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="next" value={String(!c.isActive)} />
                          <span
                            className={`text-[0.625rem] tracking-[0.1em] uppercase ${
                              live ? "text-gold" : "text-espresso/40"
                            }`}
                          >
                            {c.expired ? "expired" : c.isActive ? "active" : "off"}
                          </span>
                          <button type="submit" className="btn btn-secondary btn-sm">
                            <span>{c.isActive ? "Turn off" : "Turn on"}</span>
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
