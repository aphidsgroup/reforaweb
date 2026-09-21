import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/utils";
import { PageHeader } from "@/components/admin/admin-shell";
import { AdminError } from "@/components/admin/admin-error";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers" };

export default async function CustomersPage() {
  await requireAdmin();

  let rows: {
    id: string;
    email: string;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    marketingConsent: boolean | null;
    createdAt: Date;
    orderCount: number;
    spendInPaise: number;
  }[];

  try {
    // Lifetime value is computed from paid orders rather than read from
    // customers.totalOrders, so the figure cannot drift out of sync.
    rows = (
      await db
        .select({
          id: customers.id,
          email: customers.email,
          phone: customers.phone,
          firstName: customers.firstName,
          lastName: customers.lastName,
          marketingConsent: customers.marketingConsent,
          createdAt: customers.createdAt,
          orderCount: sql<number>`count(${orders.id})`,
          spendInPaise: sql<number>`coalesce(sum(case when ${orders.paymentStatus} = 'paid' then ${orders.totalInPaise} else 0 end), 0)`,
        })
        .from(customers)
        .leftJoin(orders, sql`${orders.customerId} = ${customers.id}`)
        .groupBy(customers.id)
        .orderBy(desc(customers.createdAt))
        .limit(200)
    ).map((r) => ({
      ...r,
      orderCount: Number(r.orderCount),
      spendInPaise: Number(r.spendInPaise),
    }));
  } catch (error) {
    return <AdminError title="Could not load customers" error={error} />;
  }

  return (
    <div className="p-5 md:p-8 lg:p-10">
      <PageHeader
        title="Customers"
        subtitle={`${rows.length} ${rows.length === 1 ? "customer" : "customers"}, newest first`}
      />

      {rows.length === 0 ? (
        <div className="bg-soft-white border border-sand rounded-sm py-20 text-center">
          <p className="font-serif text-2xl text-espresso mb-2">No customers yet.</p>
          <p className="text-sm text-espresso/55">
            Accounts appear here once people start ordering.
          </p>
        </div>
      ) : (
        <div className="bg-soft-white border border-sand rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Customers</caption>
              <thead>
                <tr className="border-b border-sand bg-cream/60 text-left">
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Customer</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Joined</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5">Marketing</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5 text-right">Orders</th>
                  <th scope="col" className="eyebrow font-medium px-5 py-3.5 text-right">Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {rows.map((c) => {
                  const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
                  return (
                    <tr key={c.id} className="hover:bg-cream/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-espresso">{name || c.email}</p>
                        <p className="text-xs text-espresso/45">
                          {c.email}
                          {c.phone && <span className="tnum"> · {c.phone}</span>}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-espresso/60 whitespace-nowrap">
                        {c.createdAt.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <span className={c.marketingConsent ? "text-gold" : "text-espresso/40"}>
                          {c.marketingConsent ? "Opted in" : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-espresso/70 tnum">
                        {c.orderCount}
                      </td>
                      <td className="px-5 py-4 text-right text-espresso tnum whitespace-nowrap">
                        {formatPrice(c.spendInPaise)}
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
