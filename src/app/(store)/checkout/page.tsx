"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice, isValidPincode } from "@/lib/utils";

// ─── Indian States & UTs ─────────────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

// ─── Shipping Rate ────────────────────────────────────────────────────────────
interface ShippingRate {
  name: string;
  priceInPaise: number;
  estimatedDays: number;
  isFree: boolean;
}

// ─── Step types ───────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;

interface ContactDetails {
  email: string;
  phone: string;
  isGuest: boolean;
}

interface DeliveryAddress {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// ─── Order summary sidebar ────────────────────────────────────────────────────
function OrderSummary({
  subtotalInPaise,
  discountInPaise,
  shippingInPaise,
  couponCode,
  couponInput,
  setCouponInput,
  onApplyCoupon,
  couponStatus,
  couponError,
}: {
  subtotalInPaise: number;
  discountInPaise: number;
  shippingInPaise: number | null;
  couponCode: string | null;
  couponInput: string;
  setCouponInput: (v: string) => void;
  onApplyCoupon: () => void;
  couponStatus: "idle" | "loading" | "success" | "error";
  couponError: string;
}) {
  const items = useCartStore((s) => s.items);
  const finalTotal = subtotalInPaise - discountInPaise + (shippingInPaise ?? 0);

  return (
    <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-6 lg:sticky lg:top-8">
      <h2 className="font-serif text-lg text-[#29231F] mb-4">Order Summary</h2>

      {/* Items */}
      <div className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-[#E4D5C2] rounded-sm flex-shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#29231F] truncate font-medium">
                {item.name}
              </p>
              <p className="text-xs text-[#29231F]/50">Qty: {item.quantity}</p>
            </div>
            <p className="text-xs text-[#29231F] flex-shrink-0">
              {formatPrice(item.priceInPaise * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon field */}
      <div className="mb-4">
        {couponCode ? (
          <div className="flex items-center justify-between bg-[#C7A56A]/10 border border-[#C7A56A]/30 rounded-sm px-3 py-2">
            <span className="text-xs text-[#29231F]">
              <strong className="text-[#C7A56A]">{couponCode}</strong> applied
            </span>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="Promo code"
              className="input-refora flex-1 text-xs py-2"
              aria-label="Promo / coupon code"
            />
            <button
              onClick={onApplyCoupon}
              disabled={couponStatus === "loading"}
              className="btn btn-secondary text-xs px-3 py-2 flex-shrink-0"
            >
              {couponStatus === "loading" ? "…" : "Apply"}
            </button>
          </div>
        )}
        {couponError && (
          <p className="text-xs text-red-600 mt-1" role="alert">
            {couponError}
          </p>
        )}
      </div>

      {/* Amounts */}
      <div className="space-y-2 text-sm border-t border-[#E4D5C2] pt-4">
        <div className="flex justify-between text-[#29231F]/70">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalInPaise)}</span>
        </div>
        {discountInPaise > 0 && (
          <div className="flex justify-between text-[#C7A56A]">
            <span>Discount</span>
            <span>−{formatPrice(discountInPaise)}</span>
          </div>
        )}
        <div className="flex justify-between text-[#29231F]/70">
          <span>Shipping</span>
          <span>
            {shippingInPaise === null
              ? "Calculated at step 3"
              : shippingInPaise === 0
              ? "Free"
              : formatPrice(shippingInPaise)}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-[#29231F] text-base pt-2 border-t border-[#E4D5C2]">
          <span>Total</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
        <p className="text-xs text-[#29231F]/40">Inclusive of all taxes</p>
      </div>
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalInPaise = useCartStore((s) => s.totalInPaise);
  const discountInPaise = useCartStore((s) => s.discountInPaise);
  const couponCode = useCartStore((s) => s.couponCode);
  const applyCoupon = useCartStore((s) => s.applyCoupon);

  const [step, setStep] = useState<Step>(1);
  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [couponError, setCouponError] = useState("");

  // Step 1
  const [contact, setContact] = useState<ContactDetails>({
    email: "",
    phone: "",
    isGuest: true,
  });
  const [contactErrors, setContactErrors] = useState<Partial<ContactDetails>>({});

  // Step 2
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<keyof DeliveryAddress, string>>
  >({});
  const [pincodeServiceable, setPincodeServiceable] = useState<boolean | null>(
    null
  );
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Step 3
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  // Step 4
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const subtotalInPaise = items.reduce(
    (sum, i) => sum + i.priceInPaise * i.quantity,
    0
  );

  // ── Coupon apply ──
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponStatus("loading");
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponInput.trim().toUpperCase(),
          subtotalInPaise,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        applyCoupon(couponInput.trim().toUpperCase(), data.discountInPaise);
        setCouponStatus("success");
        setCouponInput("");
      } else {
        const data = await res.json().catch(() => ({}));
        setCouponError(data?.error ?? "Invalid coupon code.");
        setCouponStatus("error");
      }
    } catch {
      setCouponError("Could not validate coupon.");
      setCouponStatus("error");
    }
  };

  // ── Step 1 validation ──
  const validateContact = () => {
    const errors: Partial<ContactDetails> = {};
    if (!contact.email || !/^\S+@\S+\.\S+$/.test(contact.email)) {
      errors.email = "Valid email required";
    }
    if (!contact.phone || !/^[6-9]\d{9}$/.test(contact.phone.replace(/\s/g, ""))) {
      errors.phone = "Valid 10-digit Indian mobile number required";
    }
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Step 2 validation + pincode check ──
  const validateAddress = () => {
    const errors: Partial<Record<keyof DeliveryAddress, string>> = {};
    if (!address.fullName.trim()) errors.fullName = "Full name required";
    if (!address.line1.trim()) errors.line1 = "Address line 1 required";
    if (!address.city.trim()) errors.city = "City required";
    if (!address.state) errors.state = "State required";
    if (!isValidPincode(address.pincode)) errors.pincode = "Valid 6-digit pincode required";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkPincode = useCallback(async (pincode: string) => {
    if (!isValidPincode(pincode)) return;
    setPincodeLoading(true);
    try {
      const res = await fetch("/api/shipping/check-pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      setPincodeServiceable(data.serviceable);
    } catch {
      setPincodeServiceable(null);
    } finally {
      setPincodeLoading(false);
    }
  }, []);

  // ── Step 3 — fetch rates ──
  const fetchShippingRates = async () => {
    setRatesLoading(true);
    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pincode: address.pincode,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          subtotalInPaise,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setShippingRates(data.rates ?? []);
        if (data.rates?.length === 1) setSelectedRate(data.rates[0]);
      } else {
        // Fallback: free shipping mock
        const fallback: ShippingRate[] = [
          { name: "Standard Delivery", priceInPaise: 0, estimatedDays: 5, isFree: true },
        ];
        setShippingRates(fallback);
        setSelectedRate(fallback[0]);
      }
    } catch {
      const fallback: ShippingRate[] = [
        { name: "Standard Delivery", priceInPaise: 0, estimatedDays: 5, isFree: true },
      ];
      setShippingRates(fallback);
      setSelectedRate(fallback[0]);
    } finally {
      setRatesLoading(false);
    }
  };

  // ── Step 4 — Razorpay initiation ──
  const handleRazorpayPayment = async () => {
    setPaymentLoading(true);
    setPaymentError("");

    const finalAmount =
      subtotalInPaise - discountInPaise + (selectedRate?.priceInPaise ?? 0);

    try {
      // Create order in our DB first (not shown here — wire to /api/orders/create)
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `temp-${Date.now()}`, // Replace with real DB order ID
          amountInPaise: finalAmount,
        }),
      });

      if (!orderRes.ok) throw new Error("Order creation failed");
      const { razorpayOrderId, amount, currency, keyId } =
        await orderRes.json();

      // Load Razorpay SDK
      const rzp = new (
        window as unknown as {
          Razorpay: new (opts: Record<string, unknown>) => {
            open: () => void;
          };
        }
      ).Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "REFORA",
        description: "Your REFORA order",
        prefill: {
          email: contact.email,
          contact: contact.phone,
          name: address.fullName,
        },
        theme: { color: "#29231F" },
        handler: () => {
          // Payment successful — navigate to order confirmation
          window.location.href = `/orders/confirmation`;
        },
      });
      rzp.open();
    } catch {
      setPaymentError(
        "Payment initiation failed. Please try again or choose COD."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // ── Step navigation ──
  const goToStep = (target: Step) => {
    if (target > step) {
      if (step === 1 && !validateContact()) return;
      if (step === 2 && !validateAddress()) return;
    }
    setStep(target);
    if (target === 3) fetchShippingRates();
  };

  const isStepComplete = (s: Step) => s < step;

  // ── Empty cart guard ──
  if (items.length === 0) {
    return (
      <div className="bg-[#F7F2E9] min-h-screen flex flex-col items-center justify-center py-24">
        <p className="font-serif text-3xl text-[#29231F]/40 mb-4">
          Your bag is empty.
        </p>
        <Link href="/shop" className="btn btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Checkout-specific header (wordmark only, no full nav) */}
      <header className="bg-[#F7F2E9] border-b border-[#E4D5C2] py-4">
        <div className="container-refora flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl text-[#29231F] tracking-[0.12em]"
            aria-label="REFORA — return to home"
          >
            REFORA
          </Link>
          <Link
            href="/cart"
            className="text-xs text-[#29231F]/50 hover:text-[#29231F] transition-colors"
          >
            ← Back to bag
          </Link>
        </div>
      </header>

      <div className="bg-[#F7F2E9] min-h-screen py-10">
        <div className="container-refora">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* LEFT — Steps (2/3) */}
            <div className="lg:col-span-2">
              <h1 className="font-serif text-3xl text-[#29231F] mb-8">
                Checkout
              </h1>

              {/* ── Step 1: Contact ── */}
              <div className="mb-4 border border-[#E4D5C2] rounded-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 px-6 py-4 bg-[#EFE5D5] text-left"
                  onClick={() => step !== 1 && goToStep(1)}
                >
                  <span
                    className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                      isStepComplete(1)
                        ? "bg-[#29231F] border-[#29231F] text-[#FFFDFC]"
                        : "border-[#29231F] text-[#29231F]"
                    }`}
                  >
                    {isStepComplete(1) ? "✓" : "1"}
                  </span>
                  <span className="font-medium text-sm text-[#29231F]">
                    Contact Details
                  </span>
                  {isStepComplete(1) && (
                    <span className="ml-auto text-xs text-[#29231F]/50">
                      {contact.email}
                    </span>
                  )}
                </button>

                {step === 1 && (
                  <div className="px-6 py-6 bg-[#F7F2E9] flex flex-col gap-4">
                    {/* Guest / Account choice */}
                    <div className="flex gap-4 mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="checkout-type"
                          checked={contact.isGuest}
                          onChange={() =>
                            setContact((c) => ({ ...c, isGuest: true }))
                          }
                          className="accent-[#29231F]"
                        />
                        <span className="text-sm text-[#29231F]">
                          Guest checkout
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="checkout-type"
                          checked={!contact.isGuest}
                          onChange={() =>
                            setContact((c) => ({ ...c, isGuest: false }))
                          }
                          className="accent-[#29231F]"
                        />
                        <span className="text-sm text-[#29231F]">
                          Sign in / Create account
                        </span>
                      </label>
                    </div>
                    {!contact.isGuest && (
                      <p className="text-xs text-[#29231F]/50 bg-[#EFE5D5] rounded-sm px-3 py-2 border border-[#E4D5C2]">
                        Account features are coming soon. Please use guest
                        checkout for now.
                      </p>
                    )}

                    <div>
                      <label
                        htmlFor="checkout-email"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        Email *
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        value={contact.email}
                        onChange={(e) =>
                          setContact((c) => ({ ...c, email: e.target.value }))
                        }
                        autoComplete="email"
                        className={`input-refora ${contactErrors.email ? "border-red-400" : ""}`}
                        placeholder="your@email.com"
                      />
                      {contactErrors.email && (
                        <p className="text-xs text-red-600 mt-1" role="alert">
                          {contactErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-phone"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        Mobile Number *
                      </label>
                      <div className="flex gap-2">
                        <span className="input-refora w-14 flex-shrink-0 flex items-center justify-center text-sm text-[#29231F]/60 pointer-events-none select-none">
                          +91
                        </span>
                        <input
                          id="checkout-phone"
                          type="tel"
                          inputMode="numeric"
                          value={contact.phone}
                          onChange={(e) =>
                            setContact((c) => ({
                              ...c,
                              phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                            }))
                          }
                          autoComplete="tel"
                          placeholder="98765 43210"
                          className={`input-refora flex-1 ${contactErrors.phone ? "border-red-400" : ""}`}
                        />
                      </div>
                      {contactErrors.phone && (
                        <p className="text-xs text-red-600 mt-1" role="alert">
                          {contactErrors.phone}
                        </p>
                      )}
                    </div>

                    <button
                      className="btn btn-primary self-start mt-2"
                      onClick={() => goToStep(2)}
                    >
                      Continue to Delivery →
                    </button>
                  </div>
                )}
              </div>

              {/* ── Step 2: Delivery Address ── */}
              <div className="mb-4 border border-[#E4D5C2] rounded-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 px-6 py-4 bg-[#EFE5D5] text-left"
                  onClick={() => step >= 2 && goToStep(2)}
                  disabled={step < 2}
                >
                  <span
                    className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                      isStepComplete(2)
                        ? "bg-[#29231F] border-[#29231F] text-[#FFFDFC]"
                        : step === 2
                        ? "border-[#29231F] text-[#29231F]"
                        : "border-[#E4D5C2] text-[#29231F]/30"
                    }`}
                  >
                    {isStepComplete(2) ? "✓" : "2"}
                  </span>
                  <span
                    className={`font-medium text-sm ${step >= 2 ? "text-[#29231F]" : "text-[#29231F]/40"}`}
                  >
                    Delivery Address
                  </span>
                  {isStepComplete(2) && (
                    <span className="ml-auto text-xs text-[#29231F]/50 truncate max-w-[160px]">
                      {address.city}, {address.state}
                    </span>
                  )}
                </button>

                {step === 2 && (
                  <div className="px-6 py-6 bg-[#F7F2E9] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full name — full width */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="addr-name"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        id="addr-name"
                        type="text"
                        value={address.fullName}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, fullName: e.target.value }))
                        }
                        autoComplete="name"
                        placeholder="As on delivery"
                        className={`input-refora ${addressErrors.fullName ? "border-red-400" : ""}`}
                      />
                      {addressErrors.fullName && (
                        <p className="text-xs text-red-600 mt-1">
                          {addressErrors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Line 1 — full width */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="addr-line1"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        Address Line 1 *
                      </label>
                      <input
                        id="addr-line1"
                        type="text"
                        value={address.line1}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, line1: e.target.value }))
                        }
                        autoComplete="address-line1"
                        placeholder="House / Flat No., Street"
                        className={`input-refora ${addressErrors.line1 ? "border-red-400" : ""}`}
                      />
                      {addressErrors.line1 && (
                        <p className="text-xs text-red-600 mt-1">
                          {addressErrors.line1}
                        </p>
                      )}
                    </div>

                    {/* Line 2 — full width, optional */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="addr-line2"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        Address Line 2{" "}
                        <span className="text-[#29231F]/30">(optional)</span>
                      </label>
                      <input
                        id="addr-line2"
                        type="text"
                        value={address.line2}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, line2: e.target.value }))
                        }
                        autoComplete="address-line2"
                        placeholder="Landmark, Area, Colony"
                        className="input-refora"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label
                        htmlFor="addr-city"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        City *
                      </label>
                      <input
                        id="addr-city"
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, city: e.target.value }))
                        }
                        autoComplete="address-level2"
                        placeholder="Your city"
                        className={`input-refora ${addressErrors.city ? "border-red-400" : ""}`}
                      />
                      {addressErrors.city && (
                        <p className="text-xs text-red-600 mt-1">
                          {addressErrors.city}
                        </p>
                      )}
                    </div>

                    {/* Pincode */}
                    <div>
                      <label
                        htmlFor="addr-pincode"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        Pincode *
                      </label>
                      <input
                        id="addr-pincode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={address.pincode}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          setAddress((a) => ({ ...a, pincode: v }));
                          setPincodeServiceable(null);
                        }}
                        onBlur={() => checkPincode(address.pincode)}
                        placeholder="6-digit pincode"
                        className={`input-refora ${addressErrors.pincode ? "border-red-400" : ""}`}
                      />
                      {pincodeLoading && (
                        <p className="text-xs text-[#29231F]/40 mt-1">
                          Checking…
                        </p>
                      )}
                      {pincodeServiceable === false && (
                        <p className="text-xs text-red-600 mt-1" role="alert">
                          Delivery not available to this pincode.
                        </p>
                      )}
                      {pincodeServiceable === true && (
                        <p className="text-xs text-green-700 mt-1" role="status">
                          ✓ Delivery available
                        </p>
                      )}
                      {addressErrors.pincode && (
                        <p className="text-xs text-red-600 mt-1">
                          {addressErrors.pincode}
                        </p>
                      )}
                    </div>

                    {/* State dropdown */}
                    <div>
                      <label
                        htmlFor="addr-state"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        State *
                      </label>
                      <select
                        id="addr-state"
                        value={address.state}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, state: e.target.value }))
                        }
                        autoComplete="address-level1"
                        className={`input-refora ${addressErrors.state ? "border-red-400" : ""}`}
                      >
                        <option value="">Select state…</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {addressErrors.state && (
                        <p className="text-xs text-red-600 mt-1">
                          {addressErrors.state}
                        </p>
                      )}
                    </div>

                    {/* Country — fixed India */}
                    <div>
                      <label
                        htmlFor="addr-country"
                        className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                      >
                        Country
                      </label>
                      <input
                        id="addr-country"
                        type="text"
                        value="India"
                        readOnly
                        className="input-refora bg-[#E4D5C2]/50 text-[#29231F]/50 cursor-default"
                      />
                    </div>

                    <div className="sm:col-span-2 flex gap-3 mt-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => goToStep(1)}
                      >
                        ← Back
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => goToStep(3)}
                        disabled={pincodeServiceable === false}
                      >
                        Continue to Shipping →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Step 3: Shipping Method ── */}
              <div className="mb-4 border border-[#E4D5C2] rounded-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 px-6 py-4 bg-[#EFE5D5] text-left"
                  onClick={() => step >= 3 && goToStep(3)}
                  disabled={step < 3}
                >
                  <span
                    className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                      isStepComplete(3)
                        ? "bg-[#29231F] border-[#29231F] text-[#FFFDFC]"
                        : step === 3
                        ? "border-[#29231F] text-[#29231F]"
                        : "border-[#E4D5C2] text-[#29231F]/30"
                    }`}
                  >
                    {isStepComplete(3) ? "✓" : "3"}
                  </span>
                  <span
                    className={`font-medium text-sm ${step >= 3 ? "text-[#29231F]" : "text-[#29231F]/40"}`}
                  >
                    Delivery Method
                  </span>
                  {isStepComplete(3) && selectedRate && (
                    <span className="ml-auto text-xs text-[#29231F]/50">
                      {selectedRate.name}
                    </span>
                  )}
                </button>

                {step === 3 && (
                  <div className="px-6 py-6 bg-[#F7F2E9]">
                    {ratesLoading ? (
                      <p className="text-sm text-[#29231F]/50">
                        Fetching delivery options…
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {shippingRates.map((rate, i) => (
                          <label
                            key={i}
                            className={`flex items-center gap-4 border rounded-sm px-4 py-3 cursor-pointer transition-colors ${
                              selectedRate?.name === rate.name
                                ? "border-[#29231F] bg-[#EFE5D5]"
                                : "border-[#E4D5C2] hover:border-[#29231F]/40"
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping-rate"
                              checked={selectedRate?.name === rate.name}
                              onChange={() => setSelectedRate(rate)}
                              className="accent-[#29231F]"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#29231F]">
                                {rate.name}
                              </p>
                              <p className="text-xs text-[#29231F]/50">
                                Estimated {rate.estimatedDays} business days
                              </p>
                            </div>
                            <span className="text-sm font-medium text-[#29231F]">
                              {rate.isFree || rate.priceInPaise === 0
                                ? "Free"
                                : formatPrice(rate.priceInPaise)}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 mt-5">
                      <button
                        className="btn btn-secondary"
                        onClick={() => goToStep(2)}
                      >
                        ← Back
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => goToStep(4)}
                        disabled={!selectedRate}
                      >
                        Continue to Payment →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Step 4: Payment ── */}
              <div className="mb-4 border border-[#E4D5C2] rounded-sm overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 px-6 py-4 bg-[#EFE5D5] text-left"
                  onClick={() => step >= 4 && goToStep(4)}
                  disabled={step < 4}
                >
                  <span
                    className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                      step === 4
                        ? "border-[#29231F] text-[#29231F]"
                        : "border-[#E4D5C2] text-[#29231F]/30"
                    }`}
                  >
                    4
                  </span>
                  <span
                    className={`font-medium text-sm ${step >= 4 ? "text-[#29231F]" : "text-[#29231F]/40"}`}
                  >
                    Payment
                  </span>
                </button>

                {step === 4 && (
                  <div className="px-6 py-6 bg-[#F7F2E9] flex flex-col gap-4">
                    {/* Final total */}
                    <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm px-4 py-3">
                      <div className="flex justify-between text-sm font-semibold text-[#29231F]">
                        <span>Total to pay</span>
                        <span>
                          {formatPrice(
                            subtotalInPaise -
                              discountInPaise +
                              (selectedRate?.priceInPaise ?? 0)
                          )}
                        </span>
                      </div>
                    </div>

                    {paymentError && (
                      <p className="text-xs text-red-600" role="alert">
                        {paymentError}
                      </p>
                    )}

                    {/* Razorpay button */}
                    <button
                      className="btn btn-primary w-full"
                      onClick={handleRazorpayPayment}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? "Initiating…" : "Pay with Razorpay"}
                    </button>

                    {/* COD option placeholder */}
                    <div className="border border-[#E4D5C2] rounded-sm px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#29231F]">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-[#29231F]/50">
                          Available on select pincodes
                        </p>
                      </div>
                      <button className="btn btn-secondary text-xs px-3 py-2">
                        Select COD
                      </button>
                    </div>

                    <p className="text-xs text-[#29231F]/40">
                      Payments secured by Razorpay. Your card details are never
                      stored on REFORA servers.
                    </p>

                    <button
                      className="btn btn-secondary self-start text-sm"
                      onClick={() => goToStep(3)}
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Order Summary (1/3) */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotalInPaise={subtotalInPaise}
                discountInPaise={discountInPaise}
                shippingInPaise={selectedRate ? selectedRate.priceInPaise : null}
                couponCode={couponCode}
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                onApplyCoupon={handleApplyCoupon}
                couponStatus={couponStatus}
                couponError={couponError}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
