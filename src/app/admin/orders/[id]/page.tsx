import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/db";
import { orders, orderLines } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import { StatusPill } from "@/components/admin/admin-shell";
import { AdminError } from "@/components/admin/admin-error";
import { updateOrderStatus, updatePaymentStatus, saveOrderNote } from "../actions";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
  "returned",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6 py-2 text-sm">
      <dt className="text-espresso/55 shrink-0">{label}</dt>
      <dd className="text-espresso text-right">{value}</dd>
    </div>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  let order: typeof orders.$inferSelect | undefined;
  let lines: (typeof orderLines.$inferSelect)[] = [];

  try {
    [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (order) {
      lines = await db.select().from(orderLines).where(eq(orderLines.orderId, id));
    }
  } catch (error) {
    return <AdminError title="Could not load this order" error={error} />;
  }

  if (!order) notFound();

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-5xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs text-clay hover:text-espresso mb-6"
      >
        <ArrowLeft size={13} strokeWidth={1.5} aria-hidden="true" />
        All orders
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-espresso tnum leading-tight">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-espresso/55 mt-1.5">
            Placed{" "}
            {order.createdAt.toLocaleString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill status={order.status} />
          <StatusPill status={order.paymentStatus} />
          <a
            href={`/orders/${order.accessToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <span>Customer view</span>
            <ExternalLink size={12} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="space-y-6">
          {/* Items */}
          <section className="bg-soft-white border border-sand rounded-sm overflow-hidden">
            <h2 className="font-serif text-xl font-light text-espresso px-6 py-4 border-b border-sand">
              Items
            </h2>
            <ul className="divide-y divide-sand">
              {lines.map((line) => (
                <li key={line.id} className="flex items-start gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-espresso">{line.productName}</p>
                    <p className="text-xs text-espresso/50">
                      {line.variantName && `${line.variantName} · `}
                      {line.sku && `SKU ${line.sku} · `}
                      {formatPrice(line.unitPriceInPaise)} each
                    </p>
                  </div>
                  <p className="text-sm text-espresso/60 tnum">× {line.quantity}</p>
                  <p className="text-sm text-espresso tnum w-20 text-right">
                    {formatPrice(line.totalInPaise)}
                  </p>
                </li>
              ))}
              {lines.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-espresso/50">
                  No line items recorded for this order.
                </li>
              )}
            </ul>

            <dl className="px-6 py-5 border-t border-sand bg-cream/40">
              <Row label="Subtotal" value={formatPrice(order.subtotalInPaise)} />
              {(order.discountInPaise ?? 0) > 0 && (
                <Row
                  label={`Discount${order.couponCode ? ` · ${order.couponCode}` : ""}`}
                  value={`− ${formatPrice(order.discountInPaise ?? 0)}`}
                />
              )}
              <Row label="Shipping" value={formatPrice(order.shippingInPaise ?? 0)} />
              {(order.taxInPaise ?? 0) > 0 && (
                <Row label="Tax" value={formatPrice(order.taxInPaise ?? 0)} />
              )}
              <div className="flex justify-between gap-6 pt-3 mt-2 border-t border-sand">
                <span className="text-sm text-espresso">Total</span>
                <span className="font-serif text-xl text-espresso tnum">
                  {formatPrice(order.totalInPaise)}
                </span>
              </div>
            </dl>
          </section>

          {/* Internal note */}
          <section className="bg-soft-white border border-sand rounded-sm p-6">
            <h2 className="font-serif text-xl font-light text-espresso mb-4">Internal note</h2>
            <form action={saveOrderNote}>
              <input type="hidden" name="id" value={order.id} />
              <label htmlFor="notes" className="sr-only">
                Internal note
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={order.notes ?? ""}
                placeholder="Only visible to the REFORA team."
                className="input-refora resize-y mb-3"
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                <span>Save note</span>
              </button>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          {/* Status controls */}
          <section className="bg-soft-white border border-sand rounded-sm p-6">
            <h2 className="font-serif text-xl font-light text-espresso mb-5">Update</h2>

            <form action={updateOrderStatus} className="mb-6">
              <input type="hidden" name="id" value={order.id} />
              <label htmlFor="status" className="label-refora">
                Order status
              </label>
              <div className="flex gap-2">
                <select
                  id="status"
                  name="status"
                  defaultValue={order.status}
                  className="input-refora py-2.5 text-sm cursor-pointer"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary btn-sm shrink-0">
                  <span>Set</span>
                </button>
              </div>
            </form>

            <form action={updatePaymentStatus}>
              <input type="hidden" name="id" value={order.id} />
              <label htmlFor="paymentStatus" className="label-refora">
                Payment status
              </label>
              <div className="flex gap-2">
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  defaultValue={order.paymentStatus}
                  className="input-refora py-2.5 text-sm cursor-pointer"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary btn-sm shrink-0">
                  <span>Set</span>
                </button>
              </div>
            </form>
          </section>

          {/* Customer */}
          <section className="bg-soft-white border border-sand rounded-sm p-6">
            <h2 className="font-serif text-xl font-light text-espresso mb-4">Customer</h2>
            <dl className="divide-y divide-sand">
              <Row label="Name" value={order.shippingName} />
              <Row label="Phone" value={<span className="tnum">{order.shippingPhone}</span>} />
              {order.guestEmail && <Row label="Email" value={order.guestEmail} />}
              {order.paymentMethod && (
                <Row label="Paid by" value={order.paymentMethod.replace(/_/g, " ")} />
              )}
            </dl>
          </section>

          {/* Shipping address */}
          <section className="bg-soft-white border border-sand rounded-sm p-6">
            <h2 className="font-serif text-xl font-light text-espresso mb-4">Ship to</h2>
            <address className="not-italic text-sm text-espresso/75 leading-relaxed">
              {order.shippingLine1}
              <br />
              {order.shippingLine2 && (
                <>
                  {order.shippingLine2}
                  <br />
                </>
              )}
              {order.shippingCity}, {order.shippingState}
              <br />
              <span className="tnum">{order.shippingPincode}</span>
              <br />
              {order.shippingCountry ?? "IN"}
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
