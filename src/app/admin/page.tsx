import Link from "next/link";
import { desc, sql, gte, and, ne } from "drizzle-orm";
import { ArrowRight, TrendingUp, Package, AlertTriangle } from "lucide-react";
import { db } from "@/db";
import { orders, products, customers, inventory } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import { PageHeader, StatusPill } from "@/components/admin/admin-shell";
import { AdminError } from "@/components/admin/admin-error";

export const dynamic = "force-dynamic";

type Metrics = {
  revenueInPaise: number;
  orderCount: number;
  pendingCount: number;
  customerCount: number;
  lowStock: { name: string; quantity: number }[];
  recent: {
    id: string;
    orderNumber: string;
    shippingName: string;
    totalInPaise: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
  }[];
};

async function loadMetrics(): Promise<Metrics> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Revenue counts paid money only — cancelled and refunded orders are excluded
  // so the figure matches what actually settled.
  const [totals] = await db
    .select({
      revenue: sql<number>`coalesce(sum(${orders.totalInPaise}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, thirtyDaysAgo),
        sql`${orders.paymentStatus} = 'paid'`,
        ne(orders.status, "refunded")
      )
    );

  const [pending] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(sql`${orders.status} in ('pending', 'confirmed', 'processing')`);

  const [people] = await db.select({ count: sql<number>`count(*)` }).from(customers);

  const low = await db
    .select({ name: products.name, quantity: inventory.quantity })
    .from(inventory)
    .innerJoin(products, sql`${products.id} = ${inventory.productId}`)
    .where(sql`${inventory.quantity} <= coalesce(${inventory.lowStockThreshold}, 5)`)
    .limit(5);

  const recent = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      shippingName: orders.shippingName,
      totalInPaise: orders.totalInPaise,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(8);

  return {
    revenueInPaise: Number(totals?.revenue ?? 0),
    orderCount: Number(totals?.count ?? 0),
    pendingCount: Number(pending?.count ?? 0),
    customerCount: Number(people?.count ?? 0),
    lowStock: low.map((r) => ({ name: r.name, quantity: r.quantity })),
    recent,
  };
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-soft-white border border-sand rounded-sm p-6">
      <p className="eyebrow mb-3">{label}</p>
      <p className="font-serif text-3xl font-light text-espresso tnum leading-none">{value}</p>
      {hint && <p className="text-xs text-espresso/45 mt-2.5">{hint}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();

  let metrics: Metrics;
  try {
    metrics = await loadMetrics();
  } catch (error) {
    return <AdminError title="Could not load the dashboard" error={error} />;
  }

  const firstName = admin.name.split(" ")[0];

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-6xl">
      <PageHeader
        title={`Good to see you, ${firstName}.`}
        subtitle="Revenue and order counts cover the last 30 days of paid orders."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <Stat
          label="Revenue · 30 days"
          value={formatPrice(metrics.revenueInPaise)}
          hint="Paid orders, excluding refunds"
        />
        <Stat label="Orders · 30 days" value={String(metrics.orderCount)} hint="Paid orders" />
        <Stat
          label="Needs attention"
          value={String(metrics.pendingCount)}
          hint="Pending, confirmed or processing"
        />
        <Stat label="Customers" value={String(metrics.customerCount)} hint="All time" />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Recent orders */}
        <section className="bg-soft-white border border-sand rounded-sm overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 border-b border-sand">
            <h2 className="font-serif text-xl font-light text-espresso">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-clay hover:text-espresso inline-flex items-center gap-1.5">
              All orders
              <ArrowRight size={12} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </header>

          {metrics.recent.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-espresso/50">
              No orders yet. They will appear here as soon as the first one is placed.
            </p>
          ) : (
            <ul className="divide-y divide-sand">
              {metrics.recent.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-cream/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-espresso tnum">{order.orderNumber}</p>
                      <p className="text-xs text-espresso/50 truncate">{order.shippingName}</p>
                    </div>
                    <StatusPill status={order.status} />
                    <p className="text-sm text-espresso tnum w-20 text-right">
                      {formatPrice(order.totalInPaise)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Low stock */}
        <section className="bg-soft-white border border-sand rounded-sm overflow-hidden h-fit">
          <header className="flex items-center gap-2.5 px-6 py-4 border-b border-sand">
            <AlertTriangle size={15} strokeWidth={1.5} className="text-clay" aria-hidden="true" />
            <h2 className="font-serif text-xl font-light text-espresso">Low stock</h2>
          </header>

          {metrics.lowStock.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-espresso/50">
              Nothing running low.
            </p>
          ) : (
            <ul className="divide-y divide-sand">
              {metrics.lowStock.map((item) => (
                <li key={item.name} className="flex items-center justify-between px-6 py-3.5">
                  <span className="text-sm text-espresso/75 truncate pr-3">{item.name}</span>
                  <span className="text-sm text-rose tnum">{item.quantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Link
          href="/admin/products"
          className="flex items-center gap-4 bg-cream border border-sand rounded-sm px-6 py-5 hover:border-gold transition-colors"
        >
          <Package size={18} strokeWidth={1.4} className="text-clay" aria-hidden="true" />
          <span className="text-sm text-espresso">Manage products, prices and stock</span>
          <ArrowRight size={14} strokeWidth={1.5} className="text-clay ml-auto" aria-hidden="true" />
        </Link>
        <Link
          href="/admin/coupons"
          className="flex items-center gap-4 bg-cream border border-sand rounded-sm px-6 py-5 hover:border-gold transition-colors"
        >
          <TrendingUp size={18} strokeWidth={1.4} className="text-clay" aria-hidden="true" />
          <span className="text-sm text-espresso">Create and expire coupons</span>
          <ArrowRight size={14} strokeWidth={1.5} className="text-clay ml-auto" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
