"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin, recordAudit } from "@/lib/admin-auth";

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
] as const;

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/**
 * Moves an order to a new status.
 *
 * Statuses that carry a timestamp column set it here, so the storefront's
 * tracking page and any later analytics read a consistent record rather than
 * having to infer dates from an audit trail.
 */
export async function updateOrderStatus(formData: FormData) {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;

  if (!id) throw new Error("Missing order id.");
  if (!ORDER_STATUSES.includes(status)) throw new Error(`Unknown order status: ${status}`);

  const now = new Date();
  const patch: Record<string, unknown> = { status, updatedAt: now };

  const stampColumn: Partial<Record<OrderStatus, string>> = {
    confirmed: "confirmedAt",
    shipped: "shippedAt",
    delivered: "deliveredAt",
    cancelled: "cancelledAt",
  };
  const column = stampColumn[status];
  if (column) patch[column] = now;

  await db.update(orders).set(patch).where(eq(orders.id, id));
  await recordAudit(admin, "order.status", "orders", id, { status });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function updatePaymentStatus(formData: FormData) {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const paymentStatus = String(formData.get("paymentStatus") ?? "") as PaymentStatus;

  if (!id) throw new Error("Missing order id.");
  if (!PAYMENT_STATUSES.includes(paymentStatus)) {
    throw new Error(`Unknown payment status: ${paymentStatus}`);
  }

  await db
    .update(orders)
    .set({ paymentStatus, updatedAt: new Date() })
    .where(eq(orders.id, id));

  await recordAudit(admin, "order.payment_status", "orders", id, { paymentStatus });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function saveOrderNote(formData: FormData) {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 2000);

  if (!id) throw new Error("Missing order id.");

  await db.update(orders).set({ notes, updatedAt: new Date() }).where(eq(orders.id, id));
  await recordAudit(admin, "order.note", "orders", id);

  revalidatePath(`/admin/orders/${id}`);
}
