import { NextResponse, type NextRequest } from "next/server";
import { desc, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getAdminSession, recordAudit } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** Wraps a value for CSV and neutralises spreadsheet formula injection. */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";

  let text = value instanceof Date ? value.toISOString() : String(value);

  // A leading =, +, - or @ makes Excel and Sheets evaluate the cell. Order
  // data is attacker-influenced (names, addresses), so prefix a quote.
  if (/^[=+\-@]/.test(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
}

const COLUMNS = [
  "Order number",
  "Placed at",
  "Status",
  "Payment status",
  "Payment method",
  "Customer name",
  "Phone",
  "Email",
  "Address line 1",
  "Address line 2",
  "City",
  "State",
  "Pincode",
  "Subtotal (INR)",
  "Discount (INR)",
  "Shipping (INR)",
  "Tax (INR)",
  "Total (INR)",
  "Coupon",
];

const rupees = (paise: number | null) => ((paise ?? 0) / 100).toFixed(2);

export async function GET(request: NextRequest) {
  // A route handler is its own endpoint — it does not inherit the admin
  // layout's check, so it authenticates independently.
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const where: SQL | undefined =
    status && status !== "all" ? sql`${orders.status} = ${status}` : undefined;

  try {
    const rows = await db
      .select()
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(5000);

    const body = [
      COLUMNS.join(","),
      ...rows.map((o) =>
        [
          o.orderNumber,
          o.createdAt,
          o.status,
          o.paymentStatus,
          o.paymentMethod,
          o.shippingName,
          o.shippingPhone,
          o.guestEmail,
          o.shippingLine1,
          o.shippingLine2,
          o.shippingCity,
          o.shippingState,
          o.shippingPincode,
          rupees(o.subtotalInPaise),
          rupees(o.discountInPaise),
          rupees(o.shippingInPaise),
          rupees(o.taxInPaise),
          rupees(o.totalInPaise),
          o.couponCode,
        ]
          .map(csvCell)
          .join(",")
      ),
    ].join("\r\n");

    await recordAudit(admin, "order.export", "orders", undefined, {
      status: status ?? "all",
      count: rows.length,
    });

    const stamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(
      // A BOM makes Excel read the file as UTF-8, so ₹ and accented names survive.
      "﻿" + body,
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="refora-orders-${stamp}.csv"`,
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
