import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

// noindex — order confirmation pages must not be indexed
export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

type OrderStatus = "success" | "pending" | "failed" | "cancelled";

interface OrderLine {
  productName: string;
  variantName?: string;
  quantity: number;
  unitPriceInPaise: number;
  totalInPaise: number;
  imageUrl?: string;
}

interface OrderData {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod?: string;
  shippingName: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  subtotalInPaise: number;
  discountInPaise: number;
  shippingInPaise: number;
  totalInPaise: number;
  couponCode?: string;
  lines: OrderLine[];
  trackingUrl?: string;
}

async function fetchOrder(token: string): Promise<OrderData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://refora.in";
    const res = await fetch(`${baseUrl}/api/orders/${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Status UI configs ────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  OrderStatus,
  { icon: string; heading: string; message: string; color: string }
> = {
  success: {
    icon: "✓",
    heading: "Order Confirmed!",
    message:
      "Thank you for your order. You'll receive a confirmation email shortly with your order details and tracking information.",
    color: "text-green-700",
  },
  pending: {
    icon: "⏳",
    heading: "Payment Pending",
    message:
      "Your order is placed but payment is still being confirmed. If you completed payment, please wait a few minutes for confirmation. Contact us if this persists.",
    color: "text-[#C7A56A]",
  },
  failed: {
    icon: "✕",
    heading: "Payment Failed",
    message:
      "Your payment could not be processed. Your cart has not been charged. Please try again or use a different payment method.",
    color: "text-red-600",
  },
  cancelled: {
    icon: "◯",
    heading: "Order Cancelled",
    message:
      "This order has been cancelled. If you believe this is an error, please contact us.",
    color: "text-[#29231F]/50",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await fetchOrder(token);

  // Not found state
  if (!order) {
    return (
      <div className="bg-[#F7F2E9] min-h-screen">
        <div className="container-refora max-w-lg mx-auto py-24 text-center">
          <p className="font-serif text-4xl text-[#29231F]/30 mb-4">
            Order not found.
          </p>
          <p className="text-sm text-[#29231F]/50 mb-8">
            The order link may have expired or the token is invalid.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const paymentMethodLabel: Record<string, string> = {
    razorpay_upi: "UPI",
    razorpay_card: "Card",
    razorpay_netbanking: "Net Banking",
    razorpay_wallet: "Wallet",
    cod: "Cash on Delivery",
  };

  return (
    <div className="bg-[#F7F2E9] min-h-screen py-12">
      <div className="container-refora max-w-2xl mx-auto">
        {/* Status banner */}
        <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-8 text-center mb-8">
          <div
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center mx-auto mb-4 text-2xl font-light ${statusConfig.color} border-current`}
            aria-hidden="true"
          >
            {statusConfig.icon}
          </div>
          <h1
            className={`font-serif text-3xl mb-2 ${statusConfig.color}`}
          >
            {statusConfig.heading}
          </h1>
          <p className="text-sm text-[#29231F]/60 leading-relaxed max-w-md mx-auto">
            {statusConfig.message}
          </p>
          <p className="text-xs text-[#29231F]/40 mt-3">
            Order #{order.orderNumber}
          </p>
        </div>

        {/* Order details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Items */}
          <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-5">
            <h2 className="font-medium text-sm text-[#29231F] mb-4 uppercase tracking-wide">
              Items Ordered
            </h2>
            <div className="space-y-3">
              {order.lines.map((line, i) => (
                <div key={i} className="flex gap-3 items-center">
                  {line.imageUrl && (
                    <div className="w-10 h-10 bg-[#E4D5C2] rounded-sm flex-shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={line.imageUrl}
                        alt={line.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#29231F] truncate">
                      {line.productName}
                    </p>
                    {line.variantName && (
                      <p className="text-xs text-[#29231F]/50">
                        {line.variantName}
                      </p>
                    )}
                    <p className="text-xs text-[#29231F]/50">
                      Qty: {line.quantity}
                    </p>
                  </div>
                  <p className="text-sm text-[#29231F] flex-shrink-0">
                    {formatPrice(line.totalInPaise)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-5">
            <h2 className="font-medium text-sm text-[#29231F] mb-4 uppercase tracking-wide">
              Delivery Address
            </h2>
            <address className="text-sm text-[#29231F]/70 not-italic leading-relaxed">
              <strong className="text-[#29231F]">{order.shippingName}</strong>
              <br />
              {order.shippingLine1}
              {order.shippingLine2 && (
                <>
                  <br />
                  {order.shippingLine2}
                </>
              )}
              <br />
              {order.shippingCity}, {order.shippingState}
              <br />
              {order.shippingPincode}
              <br />
              India
            </address>
          </div>

          {/* Payment details */}
          <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-5">
            <h2 className="font-medium text-sm text-[#29231F] mb-4 uppercase tracking-wide">
              Payment
            </h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#29231F]/70">
                <span>Method</span>
                <span>
                  {order.paymentMethod
                    ? (paymentMethodLabel[order.paymentMethod] ??
                      order.paymentMethod)
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between text-[#29231F]/70">
                <span>Status</span>
                <span className="capitalize">
                  {order.paymentStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Order total */}
          <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-5">
            <h2 className="font-medium text-sm text-[#29231F] mb-4 uppercase tracking-wide">
              Order Total
            </h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[#29231F]/70">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotalInPaise)}</span>
              </div>
              {order.discountInPaise > 0 && (
                <div className="flex justify-between text-[#C7A56A]">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span>−{formatPrice(order.discountInPaise)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#29231F]/70">
                <span>Shipping</span>
                <span>
                  {order.shippingInPaise === 0
                    ? "Free"
                    : formatPrice(order.shippingInPaise)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-[#29231F] text-base pt-2 border-t border-[#E4D5C2] mt-2">
                <span>Total</span>
                <span>{formatPrice(order.totalInPaise)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {order.status === "success" && order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Track Order
            </a>
          )}
          {order.status === "failed" && (
            <Link href="/checkout" className="btn btn-primary">
              Try Again
            </Link>
          )}
          <Link href="/shop" className="btn btn-secondary">
            Continue Shopping
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
}
