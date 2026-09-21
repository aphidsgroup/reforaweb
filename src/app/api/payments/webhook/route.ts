import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { db } from "@/db";
import { orders, paymentAttempts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Razorpay sends webhooks with X-Razorpay-Signature header.
// We verify using HMAC-SHA256 with RAZORPAY_WEBHOOK_SECRET.
// Register this URL in Razorpay Dashboard → Webhooks:
//   https://refora.in/api/payments/webhook
// Events to subscribe: payment.captured, payment.failed, refund.created

function verifyRazorpaySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return expectedSignature === signature;
}

// Always return 200 immediately — process async to avoid Razorpay retries
export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Signature verification
  if (webhookSecret) {
    if (!verifyRazorpaySignature(rawBody, signature, webhookSecret)) {
      console.warn("[webhook] Invalid Razorpay signature");
      // Return 200 to prevent retries — log and discard
      return NextResponse.json({ received: true }, { status: 200 });
    }
  } else {
    console.warn("[webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature verification");
  }

  let event: {
    event: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          method?: string;
          status?: string;
          notes?: { orderId?: string };
        };
      };
      refund?: {
        entity?: {
          id?: string;
          payment_id?: string;
          amount?: number;
        };
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    console.error("[webhook] Failed to parse webhook body");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const eventType = event.event;

  // ── Process async (fire and forget — do not await) ──
  handleWebhookEvent(eventType, event).catch((err) => {
    console.error("[webhook] Async processing error:", err);
  });

  // Always return 200 immediately
  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleWebhookEvent(
  eventType: string,
  event: {
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          method?: string;
          notes?: { orderId?: string };
        };
      };
      refund?: {
        entity?: {
          id?: string;
          payment_id?: string;
          amount?: number;
        };
      };
    };
  }
): Promise<void> {
  switch (eventType) {
    case "payment.captured": {
      const payment = event.payload?.payment?.entity;
      if (!payment?.id || !payment.order_id) {
        console.warn("[webhook] payment.captured: missing payment entity");
        return;
      }

      const razorpayPaymentId = payment.id;
      const razorpayOrderId = payment.order_id;
      const amountInPaise = payment.amount ?? 0;

      // Idempotency: check if already processed via webhookEventId
      const existing = await db
        .select({ id: paymentAttempts.id, status: paymentAttempts.status })
        .from(paymentAttempts)
        .where(and(
          eq(paymentAttempts.razorpayOrderId, razorpayOrderId),
          eq(paymentAttempts.status, "paid")
        ))
        .limit(1);

      if (existing.length > 0) {
        console.log(`[webhook] payment.captured already processed for ${razorpayOrderId}`);
        return;
      }

      // Find our order via razorpay order id in payment_attempts
      const [attempt] = await db
        .select({ orderId: paymentAttempts.orderId, id: paymentAttempts.id })
        .from(paymentAttempts)
        .where(eq(paymentAttempts.razorpayOrderId, razorpayOrderId))
        .limit(1);

      if (!attempt) {
        console.warn(`[webhook] payment.captured: no attempt found for ${razorpayOrderId}`);
        return;
      }

      // Map Razorpay method to our enum
      const methodMap: Record<string, string> = {
        upi: "razorpay_upi",
        card: "razorpay_card",
        netbanking: "razorpay_netbanking",
        wallet: "razorpay_wallet",
      };
      const rawMethod = String(payment.method ?? "").toLowerCase();
      const mappedMethod = methodMap[rawMethod] ?? "razorpay_card";

      // Update payment attempt
      await db
        .update(paymentAttempts)
        .set({
          razorpayPaymentId,
          status: "paid",
          method: mappedMethod as "razorpay_upi" | "razorpay_card" | "razorpay_netbanking" | "razorpay_wallet" | "cod",
          gatewayResponse: event.payload?.payment?.entity as Record<string, unknown>,
          webhookEventId: razorpayPaymentId,
          updatedAt: new Date(),
        })
        .where(eq(paymentAttempts.id, attempt.id));

      // Update order status
      await db
        .update(orders)
        .set({
          paymentStatus: "paid",
          status: "confirmed",
          paymentMethod: mappedMethod as "razorpay_upi" | "razorpay_card" | "razorpay_netbanking" | "razorpay_wallet" | "cod",
          confirmedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(orders.id, attempt.orderId));

      console.log(`[webhook] ✓ payment.captured: order ${attempt.orderId} confirmed`);
      break;
    }

    case "payment.failed": {
      const payment = event.payload?.payment?.entity;
      if (!payment?.order_id) return;

      const razorpayOrderId = payment.order_id;

      const [attempt] = await db
        .select({ orderId: paymentAttempts.orderId, id: paymentAttempts.id })
        .from(paymentAttempts)
        .where(eq(paymentAttempts.razorpayOrderId, razorpayOrderId))
        .limit(1);

      if (!attempt) return;

      await db
        .update(paymentAttempts)
        .set({
          status: "failed",
          gatewayResponse: event.payload?.payment?.entity as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .where(eq(paymentAttempts.id, attempt.id));

      await db
        .update(orders)
        .set({
          paymentStatus: "failed",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, attempt.orderId));

      console.log(`[webhook] ✓ payment.failed: order ${attempt.orderId} marked failed`);
      break;
    }

    case "refund.created": {
      const refund = event.payload?.refund?.entity;
      if (!refund?.payment_id) return;

      // Find the payment attempt by razorpay payment ID
      const [attempt] = await db
        .select({ orderId: paymentAttempts.orderId, id: paymentAttempts.id })
        .from(paymentAttempts)
        .where(eq(paymentAttempts.razorpayPaymentId, refund.payment_id))
        .limit(1);

      if (!attempt) {
        console.warn(`[webhook] refund.created: no attempt for payment ${refund.payment_id}`);
        return;
      }

      // Update order payment status to refunded
      await db
        .update(orders)
        .set({
          paymentStatus: "refunded",
          status: "refunded",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, attempt.orderId));

      console.log(`[webhook] ✓ refund.created: order ${attempt.orderId} refunded`);
      break;
    }

    default:
      console.log(`[webhook] Unhandled event type: ${eventType}`);
  }
}
