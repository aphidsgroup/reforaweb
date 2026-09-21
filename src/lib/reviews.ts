import { db } from "@/db";
import { reviews, customers, customerAddresses } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { withTimeout } from "@/lib/with-timeout";

export type PublicReview = {
  id: string;
  rating: number;
  title: string;
  body: string;
  name: string;
  location: string | null;
  verified: boolean;
  date: string;
};

/**
 * Approved reviews for public display.
 *
 * Only `approved` rows are ever returned — nothing a customer submits appears
 * on the storefront until someone signs it off.
 *
 * Reviewers are shown as "Karthik S." rather than in full. The city comes from
 * their default shipping address, which is worth being deliberate about: it is
 * data they gave for delivery, not for publication. It is coarse (city only)
 * and omitted entirely when absent, but if REFORA would rather not infer a
 * location from a delivery address at all, delete the join and the `location`
 * field — the card handles a null location.
 */
export async function getApprovedReviews(limit = 6): Promise<PublicReview[]> {
  try {
    return await withTimeout(
      (async () => {
        const rows = await db
          .select({
            id: reviews.id,
            rating: reviews.rating,
            title: reviews.title,
            body: reviews.body,
            verified: reviews.isVerifiedPurchase,
            createdAt: reviews.createdAt,
            firstName: customers.firstName,
            lastName: customers.lastName,
            city: customerAddresses.city,
          })
          .from(reviews)
          .leftJoin(customers, eq(reviews.customerId, customers.id))
          .leftJoin(
            customerAddresses,
            and(
              eq(customerAddresses.customerId, customers.id),
              eq(customerAddresses.isDefault, true)
            )
          )
          .where(eq(reviews.status, "approved"))
          .orderBy(desc(reviews.createdAt))
          // Over-fetch, because nothing stops a customer having two addresses
          // flagged default — that join would emit the same review twice.
          // Duplicates are collapsed below before the limit is applied.
          .limit(limit * 3);

        const seen = new Set<string>();
        const unique: PublicReview[] = [];

        for (const row of rows) {
          if (seen.has(row.id)) continue;
          seen.add(row.id);

          const name = row.firstName
            ? row.lastName
              ? `${row.firstName} ${row.lastName.charAt(0)}.`
              : row.firstName
            : "Verified customer";

          unique.push({
            id: row.id,
            rating: row.rating,
            title: row.title ?? "",
            body: row.body ?? "",
            name,
            location: row.city ?? null,
            verified: row.verified ?? false,
            date: row.createdAt.toISOString().slice(0, 10),
          });

          if (unique.length === limit) break;
        }

        return unique;
      })(),
      "getApprovedReviews"
    );
  } catch {
    // An unreachable database must not take the section — or a build — down.
    // Returning nothing hides the section, which is the honest failure mode:
    // better to show no reviews than to imply there are none, or to crash.
    return [];
  }
}
