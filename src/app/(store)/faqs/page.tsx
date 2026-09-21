"use client";

import { useState } from "react";

// Note: metadata for this page should be declared in a co-located metadata.ts
// or parent layout due to 'use client'. Reference values:
// title: "FAQs | REFORA"
// description: "Frequently asked questions about REFORA products, ordering, shipping, returns, and your account."

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["Product", "Ordering", "Shipping", "Returns", "Account"] as const;
type Category = (typeof CATEGORIES)[number];

interface FAQ {
  q: string;
  a: string;
  category: Category;
}

const ALL_FAQS: FAQ[] = [
  // ── Product ──
  {
    category: "Product",
    q: "What is COCOCRÈME made with?",
    a: "COCOCRÈME is a coconut milk soap with colloidal oatmeal, formulated to be gentle and nourishing. The full INCI ingredient list will be published on the product page once confirmed with our formulator.",
  },
  {
    category: "Product",
    q: "What size is COCOCRÈME?",
    a: "COCOCRÈME comes in a 100g / 3.52 oz bar.",
  },
  {
    category: "Product",
    q: "Is COCOCRÈME suitable for sensitive skin?",
    a: "COCOCRÈME is formulated to be gentle. However, if you have known allergies or very sensitive skin, we recommend reviewing the full ingredient list before purchase. We do not make medical claims.",
  },
  {
    category: "Product",
    q: "Is COCOCRÈME cruelty-free?",
    a: "Yes — COCOCRÈME is not tested on animals.",
  },
  {
    category: "Product",
    q: "Can I use COCOCRÈME on my face?",
    a: "COCOCRÈME is designed for face and body. As with any new product, we recommend patch testing first.",
  },
  {
    category: "Product",
    q: "How should I store COCOCRÈME?",
    a: "Keep COCOCRÈME on a well-drained soap dish and away from direct streams of water. Allow it to dry between uses to extend the bar's life.",
  },

  // ── Ordering ──
  {
    category: "Ordering",
    q: "How do I place an order?",
    a: "Browse to your product, add it to your bag, and proceed to checkout. You can checkout as a guest — no account required.",
  },
  {
    category: "Ordering",
    q: "What payment methods do you accept?",
    a: "We accept UPI, debit/credit cards, net banking, and wallets via Razorpay. Cash on Delivery (COD) is available in select pincodes and will be shown at checkout.",
  },
  {
    category: "Ordering",
    q: "Can I modify or cancel my order after placing it?",
    a: "Please contact us as soon as possible at hello@refora.in or via WhatsApp if you need to change or cancel an order. We process orders quickly and cannot guarantee changes once dispatch begins.",
  },
  {
    category: "Ordering",
    q: "Do you have a minimum order value?",
    a: "There is no minimum order value. Shipping charges (if any) will be shown at checkout based on your pincode and order total.",
  },
  {
    category: "Ordering",
    q: "Will I receive a confirmation after ordering?",
    a: "Yes — an order confirmation will be sent to your email address once payment is received.",
  },

  // ── Shipping ──
  {
    category: "Shipping",
    q: "Where do you ship?",
    a: "We ship across India. Enter your pincode at checkout to check delivery availability and estimated dates.",
  },
  {
    category: "Shipping",
    q: "How long does delivery take?",
    a: "Estimated delivery is 4–7 business days for most pincodes. You can check your pincode on the product page for a more specific estimate.",
  },
  {
    category: "Shipping",
    q: "Do you offer free shipping?",
    a: "We offer free shipping on orders above a threshold shown at checkout. This may vary — the applicable shipping cost will always be shown before you pay.",
  },
  {
    category: "Shipping",
    q: "How do I track my order?",
    a: "Once your order is shipped, you will receive a tracking link by email. You can also track via the order confirmation link sent to your email.",
  },
  {
    category: "Shipping",
    q: "Do you ship internationally?",
    a: "Not at this time. We currently deliver within India only.",
  },

  // ── Returns ──
  {
    category: "Returns",
    q: "What is your return policy?",
    a: "Please see our full Returns & Refunds policy page for all details. In short: we accept returns of unused, unopened products in original condition within the policy window. Please contact us before returning anything.",
  },
  {
    category: "Returns",
    q: "My order arrived damaged — what do I do?",
    a: "We're sorry to hear that. Please contact us within 48 hours of delivery with photos of the damage at hello@refora.in. We'll make it right.",
  },
  {
    category: "Returns",
    q: "I received the wrong item. What should I do?",
    a: "Please contact us immediately at hello@refora.in with your order number and a photo. We will resolve this as quickly as possible.",
  },
  {
    category: "Returns",
    q: "How long do refunds take?",
    a: "Once a return is received and approved, refunds are processed within 5–7 business days. The time to appear in your account depends on your payment method and bank.",
  },

  // ── Account ──
  {
    category: "Account",
    q: "Do I need an account to order?",
    a: "No — you can checkout as a guest. Creating an account lets you track orders, save addresses, and access your order history.",
  },
  {
    category: "Account",
    q: "How do I reset my password?",
    a: "Account features including password reset will be available when the customer account section is launched. For now, checkout as a guest.",
  },
  {
    category: "Account",
    q: "How do I unsubscribe from emails?",
    a: "Each marketing email includes an unsubscribe link. You can also email us at hello@refora.in and we will remove you promptly.",
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────
function FaqItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sand">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-medium text-sm text-espresso leading-snug">
          {faq.q}
        </span>
        <span
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gold transition-transform duration-200 text-lg"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm text-espresso/70 leading-relaxed">
          {faq.a}
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FaqsPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filtered =
    activeCategory === "All"
      ? ALL_FAQS
      : ALL_FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-cream py-16 text-center border-b border-sand">
        <div className="container-refora">
          <p className="text-xs tracking-[0.14em] text-gold uppercase mb-3">
            Help
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light text-espresso">
            Frequently Asked Questions
          </h1>
        </div>
      </div>

      <div className="container-refora max-w-3xl mx-auto py-12">
        {/* Category filter tabs */}
        <div
          className="flex flex-wrap gap-2 mb-10"
          role="tablist"
          aria-label="FAQ categories"
        >
          {(["All", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-2 rounded-sm border transition-colors ${
                activeCategory === cat
                  ? "bg-espresso text-soft-white border-espresso"
                  : "border-sand text-espresso/60 hover:border-espresso"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        <div
          className="divide-y divide-sand border-t border-sand"
          role="tabpanel"
        >
          {filtered.map((faq, i) => (
            <FaqItem key={i} faq={faq} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-cream rounded-sm p-6 text-center border border-sand">
          <p className="text-sm text-espresso/70 mb-3">
            Didn&apos;t find what you were looking for?
          </p>
          <a href="/contact" className="btn btn-primary inline-flex text-sm">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
