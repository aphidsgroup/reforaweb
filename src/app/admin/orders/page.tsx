import Link from "next/link";
import { desc, sql, and, or, ilike, type SQL } from "drizzle-orm";
import { Download, Search } from "lucide-react";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import { PageHeader, StatusPill } from "@/components/admin/admin-shell";
import { AdminError } from "@/components/admin/admin-error";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const PAGE_SIZE = 25;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();

  const { q = "", status = "all", page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  const conditions: SQL[] = [];
  if (status !== "all") conditions.push(sql`${orders.status} = ${status}`);
  if (q.trim()) {
    const term = `%${q.trim()}%`;
    const match = or(
      ilike(orders.orderNumber, term),
      ilike(orders.shippingName, term),
      ilike(orders.shippingPhone, term),
      ilike(orders.guestEmail, term)
    );
    if (match) conditions.push(match);
  }
  const where = conditions.length ? and(...conditions) : undefined;

  let rows: Awaited<ReturnType<typeof loadRows>>;
  let total = 0;
  try {
    [rows, total] = await Promise.all([
      loadRows(where, pageNum),
      countRows(where),
    ]);
  } catch (error) {
    return <AdminError title="Could not load orders" error={error} />;
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (patch: Record<string, string>) => {
    const params = new URLSearchParams({ q, status, page: String(pageNum), ...patch });
    for (const [k, v] of [...params]) if (!v || v === "all" || v === "1") params.delete(k);
    const s = params.toString();
    return s ? `/admin/orders?${s}` : "/admin/orders";
  };

  return (
    <div className="p-5 md:p-8 lg:p-10">
      <PageHeader
        title="Orders"
        subtitle={`${total} ${total === 1 ? "order" : "orders"} matching this view`}
        action={
          <a
            href={`/admin/orders/export${status !== "all" ? `?status=${status}` : ""}`}
            className="btn btn-secondary btn-sm"
          >
            <Download size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>Export CSV</span>
          </a>
        }
      />

      {/* Filters + search */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={qs({ status: f.key, page: "1" })}
              aria-current={status === f.key ? "page" : undefined}
              className={`shrink-0 text-[0.6875rem] tracking-[0.12em] uppercase px-4 py-2 rounded-full border transition-colors ${
                status === f.key
                  ? "bg-espresso text-ivory border-espresso"
                  : "bg-transparent text-espresso/65 border-sand hover:border-clay"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <form action="/admin/orders" className="lg:ml-auto relative lg:w-72" role="search">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <Search
            size={15}
            strokeWidth={1.4}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-clay pointer-events-none"
          />
          <label htmlFor="order-search" className="sr-only">
            Search orders
          </label>
          <input
            id="order-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Order number, name, phone, email"
            className="input-refora pl-9 py-2.5 text-sm"
          />
        </form>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="bg-soft-white border border-sand rounded-sm py-20 text-center">
          <p className="font-serif text-2xl text-espresso mb-2">No orders here.</p>
          <p className="text-sm text-espresso/55">
            {q || status !== "all"
              ? "Try a different filter or search term."
              : "Orders will appear as soon as the first one is placed."}
          </p>
        </div>
      ) : (
        <div className="bg-soft-white border border-sand rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Orders</caption>
              <thead>
                <tr className="border-b border-sand bg-cream/60 text-left">
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Order</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Customer</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Placed</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Status</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Payment</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {rows.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/40 transition-colors">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-espresso tnum hover:text-clay"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-espresso/80">{order.shippingName}</p>
                      <p className="text-xs text-espresso/45 tnum">{order.shippingPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-espresso/60 whitespace-nowrap">
                      {order.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-4 text-right text-espresso tnum whitespace-nowrap">
                      {formatPrice(order.totalInPaise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <nav className="flex items-center justify-between mt-6" aria-label="Pagination">
          <Link
            href={qs({ page: String(pageNum - 1) })}
            aria-disabled={pageNum <= 1}
            className={`btn btn-secondary btn-sm ${pageNum <= 1 ? "pointer-events-none opacity-40" : ""}`}
          >
            <span>Previous</span>
          </Link>
          <p className="text-xs text-espresso/55 tnum">
            Page {pageNum} of {pageCount}
          </p>
          <Link
            href={qs({ page: String(pageNum + 1) })}
            aria-disabled={pageNum >= pageCount}
            className={`btn btn-secondary btn-sm ${pageNum >= pageCount ? "pointer-events-none opacity-40" : ""}`}
          >
            <span>Next</span>
          </Link>
        </nav>
      )}
    </div>
  );
}

function loadRows(where: SQL | undefined, pageNum: number) {
  return db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      shippingName: orders.shippingName,
      shippingPhone: orders.shippingPhone,
      totalInPaise: orders.totalInPaise,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(where)
    .orderBy(desc(orders.createdAt))
    .limit(PAGE_SIZE)
    .offset((pageNum - 1) * PAGE_SIZE);
}

async function countRows(where: SQL | undefined): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(where);
  return Number(row?.count ?? 0);
}
