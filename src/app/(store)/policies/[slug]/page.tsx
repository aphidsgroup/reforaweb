import type { Metadata } from "next";
import { notFound } from "next/navigation";

// ─── Valid policy slugs ───────────────────────────────────────────────────────
const POLICY_SLUGS = [
  "privacy",
  "terms",
  "shipping",
  "returns",
  "cancellation",
  "cookies",
] as const;

type PolicySlug = (typeof POLICY_SLUGS)[number];

// ─── Placeholder content (shown when DB is empty) ─────────────────────────────
const POLICY_PLACEHOLDERS: Record<
  PolicySlug,
  { title: string; content: string }
> = {
  privacy: {
    title: "Privacy Policy",
    content: `This Privacy Policy explains how REFORA ("we", "us") collects, uses, and protects your personal information when you use refora.in.

**Information we collect**
We collect information you provide directly — such as your name, email address, phone number, and delivery address when you place an order or sign up for our newsletter.

**How we use your information**
Your information is used to process orders, send order confirmations and shipping updates, and (with your consent) inform you about new products and offers.

**Data security**
We use industry-standard security measures including HTTPS encryption. Payment data is handled by Razorpay and is never stored on our servers.

**Your rights**
You may request access to, correction of, or deletion of your personal data by contacting hello@refora.in.

**Contact**
For any privacy-related queries, please write to: hello@refora.in

[This policy will be updated with full legal language before launch. Last placeholder update: ${new Date().getFullYear()}.]`,
  },
  terms: {
    title: "Terms & Conditions",
    content: `By accessing and using refora.in, you agree to the following terms.

**Products and pricing**
Prices are displayed in Indian Rupees (INR) inclusive of GST. We reserve the right to change prices without notice. Product images are for reference only.

**Orders**
Placing an order constitutes an offer to purchase. We reserve the right to cancel any order at our discretion, including in cases of pricing errors. A confirmation email indicates acceptance.

**Intellectual property**
All content on refora.in — including text, images, and the REFORA brand — is our intellectual property. You may not reproduce it without written permission.

**Limitation of liability**
To the extent permitted by law, REFORA is not liable for indirect, incidental, or consequential damages arising from use of our products or website.

**Governing law**
These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in [City, India — to be confirmed with client].

[This document will be finalized with legal counsel before launch.]`,
  },
  shipping: {
    title: "Shipping Policy",
    content: `**Delivery areas**
We currently ship across India. International shipping is not available at this time.

**Estimated delivery time**
Standard delivery: 4–7 business days from order confirmation. Delivery timelines may vary based on your location and courier availability.

**Shipping charges**
Shipping charges (if any) are calculated at checkout based on your pincode and order total. Free shipping thresholds apply and will be shown at checkout.

**Order processing**
Orders are processed on business days (Monday–Saturday, excluding public holidays). Orders placed after 2pm IST may be processed the following business day.

**Tracking**
Once dispatched, you will receive a tracking number by email.

**Failed delivery**
If delivery is unsuccessful after multiple attempts, the package will be returned to us. We will contact you to arrange re-delivery.

[This policy will be finalized before launch.]`,
  },
  returns: {
    title: "Returns & Refunds",
    content: `**Return eligibility**
We accept returns of unused, unopened products in their original packaging within 7 days of delivery.

**How to initiate a return**
Email hello@refora.in with your order number and reason for return. Do not ship products back without prior authorisation.

**Damaged or incorrect items**
If you receive a damaged or wrong item, please contact us within 48 hours of delivery with photos. We will resolve the issue promptly.

**Refunds**
Approved refunds are processed within 5–7 business days of receiving the returned item. Refunds are issued to the original payment method.

**Non-returnable items**
Opened or used products cannot be returned unless defective.

**Shipping costs for returns**
Return shipping costs are borne by the customer unless the return is due to our error.

[This policy will be finalized with legal review before launch.]`,
  },
  cancellation: {
    title: "Cancellation Policy",
    content: `**Before dispatch**
You may cancel your order before it is dispatched by contacting us immediately at hello@refora.in or WhatsApp. Once an order is dispatched, it cannot be cancelled.

**After dispatch**
If you wish to return an order after delivery, please refer to our Returns & Refunds policy.

**Refunds for cancellations**
For prepaid orders cancelled before dispatch, a full refund will be issued within 5–7 business days.

**COD orders**
COD orders cancelled before dispatch incur no charge.

[This policy will be finalized before launch.]`,
  },
  cookies: {
    title: "Cookie Policy",
    content: `**What are cookies?**
Cookies are small text files stored on your device when you visit a website. They help websites function properly and remember your preferences.

**Cookies we use**
- Essential cookies: Required for the website to function (e.g., session management, cart persistence).
- Analytics cookies: Help us understand how visitors use the site (e.g., page views). We use privacy-friendly analytics.
- No third-party advertising cookies are used on refora.in.

**Managing cookies**
You can control cookies through your browser settings. Disabling essential cookies may affect site functionality (e.g., your cart may not persist).

**Contact**
For questions about our cookie use, email hello@refora.in.

[This policy will be finalized before launch.]`,
  },
};

const POLICY_META: Record<PolicySlug, { description: string }> = {
  privacy: { description: "REFORA Privacy Policy — how we collect and use your data." },
  terms: { description: "REFORA Terms & Conditions of use and purchase." },
  shipping: { description: "REFORA Shipping Policy — delivery areas, timelines, and charges." },
  returns: { description: "REFORA Returns & Refunds Policy." },
  cancellation: { description: "REFORA Order Cancellation Policy." },
  cookies: { description: "REFORA Cookie Policy — how we use cookies on refora.in." },
};

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!POLICY_SLUGS.includes(slug as PolicySlug)) {
    return { title: "Policy Not Found" };
  }
  const policySlug = slug as PolicySlug;
  const placeholder = POLICY_PLACEHOLDERS[policySlug];
  const meta = POLICY_META[policySlug];

  return {
    title: placeholder.title,
    description: meta.description,
    robots: { index: true, follow: false },
  };
}

// ─── Fetch policy from DB (or fallback to placeholder) ────────────────────────
async function fetchPolicy(
  slug: PolicySlug
): Promise<{ title: string; content: string; updatedAt?: Date }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://refora.in";
    const res = await fetch(`${baseUrl}/api/policies/${slug}`, {
      next: { revalidate: 3600 }, // revalidate every hour
    });
    if (res.ok) {
      return res.json();
    }
  } catch {
    // Fall through to placeholder
  }
  return POLICY_PLACEHOLDERS[slug];
}

// ─── Render markdown-like content ─────────────────────────────────────────────
function PolicyContent({ content }: { content: string }) {
  // Very simple: bold **text** and line breaks — not full markdown
  const lines = content.split("\n");
  return (
    <div className="prose prose-sm max-w-none text-espresso/75 leading-relaxed space-y-3">
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
          return (
            <h3
              key={i}
              className="font-semibold text-espresso text-base mt-6 mb-1"
            >
              {line.slice(2, -2)}
            </h3>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        // Inline bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-sm">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!POLICY_SLUGS.includes(slug as PolicySlug)) {
    notFound();
  }

  const policySlug = slug as PolicySlug;
  const policy = await fetchPolicy(policySlug);

  const isPlaceholder = !policy.updatedAt;

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-cream py-14 border-b border-sand">
        <div className="container-refora max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.14em] text-gold uppercase mb-3">
            Legal
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light text-espresso">
            {policy.title}
          </h1>
          {policy.updatedAt && (
            <p className="text-xs text-espresso/40 mt-3">
              Last updated:{" "}
              {new Date(policy.updatedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="container-refora max-w-2xl mx-auto py-12">
        {isPlaceholder && (
          <div className="bg-gold/10 border border-gold/30 rounded-sm px-4 py-3 mb-8">
            <p className="text-xs text-gold">
              This policy is a placeholder and will be finalized before launch.
              It is provided for information only and does not constitute legal
              advice.
            </p>
          </div>
        )}

        <PolicyContent content={policy.content} />

        {/* Policy navigation */}
        <div className="mt-12 pt-8 border-t border-sand">
          <p className="text-xs text-espresso/50 mb-4">Other policies:</p>
          <div className="flex flex-wrap gap-2">
            {POLICY_SLUGS.filter((s) => s !== policySlug).map((s) => (
              <a
                key={s}
                href={`/policies/${s}`}
                className="text-xs border border-sand px-3 py-1.5 rounded-sm text-espresso/60 hover:border-espresso capitalize transition-colors"
              >
                {POLICY_PLACEHOLDERS[s].title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
