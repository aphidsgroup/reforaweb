import { db } from "@/db";
import { reviews, customers, customerAddresses } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getApprovedReviews(limit = 6) {
  try {
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
      .leftJoin(customerAddresses, and(
         eq(customerAddresses.customerId, customers.id),
         eq(customerAddresses.isDefault, true)
      ))
      .where(eq(reviews.status, "approved"))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title ?? "Review",
      body: r.body ?? "",
      name: r.firstName && r.lastName ? `${r.firstName} ${r.lastName.charAt(0)}.` : r.firstName ? r.firstName : "Anonymous",
      location: r.city ?? "India",
      verified: r.verified ?? false,
      date: r.createdAt.toISOString().split("T")[0],
    }));
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    return [];
  }
}
