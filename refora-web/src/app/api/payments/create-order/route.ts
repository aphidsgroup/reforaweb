import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

interface CreateOrderPayload {
  orderId: string;       // Our internal order ID (UUID from orders table)
  amountInPaise: number; // Amount in paise — NEVER trusted from client for final charge
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.orderId !== "string" || typeof body.amountInPaise !== "number") {
      return NextResponse.json(
        { error: "orderId and amountInPaise are required." },
        { status: 400 }
      );
    }

    const { orderId } = body as CreateOrderPayload;

    // ── Server-side amount validation ──
    // NEVER use the client-provided amount for the actual charge.
    // Always fetch the authoritative total from the DB.
    const [order] = await db
      .select({
        id: orders.id,
        totalInPaise: orders.totalInPaise,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        orderNumber: orders.orderNumber,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Guard: don't allow re-payment of already paid orders
    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "This order has already been paid." },
        { status: 409 }
      );
    }

    // Use server-authoritative amount
    const authorizedAmountInPaise = order.totalInPaise;

    if (authorizedAmountInPaise <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // ── Sandbox mode (no credentials set) ──
    if (!keyId || !keySecret) {
      console.log(
        "[create-order] Sandbox mode — returning mock Razorpay order for",
        order.orderNumber
      );
      return NextResponse.json(
        {
          razorpayOrderId: `order_sandbox_${Date.now()}`,
          amount: authorizedAmountInPaise,
          currency: "INR",
          keyId: "rzp_test_sandbox",
          orderNumber: order.orderNumber,
        },
        { status: 200 }
      );
    }

    // ── Live Razorpay order creation ──
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: authorizedAmountInPaise,
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    return NextResponse.json(
      {
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId,
        orderNumber: order.orderNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[create-order] Error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order. Please try again." },
      { status: 500 }
    );
  }
}
