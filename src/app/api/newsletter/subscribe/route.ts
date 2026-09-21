import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterConsents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const source = typeof body.source === "string" ? body.source : "unknown";

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Check for existing subscription (handle unique constraint)
    const existing = await db
      .select({ id: newsletterConsents.id, isSubscribed: newsletterConsents.isSubscribed })
      .from(newsletterConsents)
      .where(eq(newsletterConsents.email, email))
      .limit(1);

    if (existing.length > 0) {
      // If previously unsubscribed, resubscribe
      if (!existing[0].isSubscribed) {
        await db
          .update(newsletterConsents)
          .set({ isSubscribed: true, unsubscribedAt: null, source })
          .where(eq(newsletterConsents.email, email));
        return NextResponse.json({ message: "Resubscribed successfully." }, { status: 200 });
      }
      // Already subscribed
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 }
      );
    }

    // Insert new subscriber
    await db.insert(newsletterConsents).values({
      email,
      source,
      isSubscribed: true,
    });

    return NextResponse.json({ message: "Subscribed successfully." }, { status: 200 });
  } catch (error) {
    console.error("[newsletter/subscribe] Error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
