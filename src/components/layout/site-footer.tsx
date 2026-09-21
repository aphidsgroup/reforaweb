import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { LeafMotif, SocialIcon, type SocialName } from "@/components/ui/brand-art";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/skincare", label: "Skincare" },
      { href: "/organic", label: "REFORA Organic" },
      { href: "/products/cococreme", label: "COCOCRÈME" },
    ],
  },
  {
    title: "REFORA",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/journal", label: "Journal" },
      { href: "/faqs", label: "FAQs" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/policies/privacy-policy", label: "Privacy policy" },
      { href: "/policies/terms-and-conditions", label: "Terms & conditions" },
      { href: "/policies/shipping-policy", label: "Shipping policy" },
      { href: "/policies/return-refund-policy", label: "Returns & refunds" },
      { href: "/policies/cancellation-policy", label: "Cancellation policy" },
    ],
  },
] as const;

const SOCIALS: { href: string; label: string; icon: SocialName }[] = [
  { href: "https://www.instagram.com/refora", label: "Instagram", icon: "instagram" },
  { href: "https://www.facebook.com/refora", label: "Facebook", icon: "facebook" },
  { href: "https://www.youtube.com/@refora", label: "YouTube", icon: "youtube" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-espresso text-ivory overflow-hidden grain" aria-label="Site footer">
      <div
        className="absolute -right-24 -bottom-32 w-96 text-gold opacity-[0.07] rotate-[18deg] pointer-events-none"
        aria-hidden="true"
      >
        <LeafMotif className="w-full h-auto" />
      </div>

      <div className="container-refora relative pt-16 md:pt-20 pb-10">
        {/* ── Brand block ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-12 lg:gap-16 pb-14 border-b border-ivory/12">
          <div>
            <Link href="/" className="wordmark text-2xl text-ivory inline-block mb-4">
              REFORA
            </Link>
            <p className="tagline text-sm text-gold/85 mb-6">Restore · Renew · Refora.</p>
            <p className="text-sm text-ivory/60 leading-relaxed max-w-xs text-pretty">
              A more thoughtful everyday ritual. Considered skincare and pure organic
              essentials, made in India.
            </p>

            <div className="flex items-center gap-3 mt-7">
              {SOCIALS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`REFORA on ${label}`}
                  className="w-10 h-10 rounded-full border border-ivory/25 flex items-center justify-center text-ivory/75 hover:text-espresso hover:bg-ivory hover:border-ivory transition-colors duration-300"
                >
                  <SocialIcon name={icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-10">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="eyebrow text-gold/80 mb-5">{col.title}</h2>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ivory/65 hover:text-ivory transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* ── Contact strip ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 py-8 border-b border-ivory/12">
          <a
            href="mailto:hello@refora.in"
            className="inline-flex items-center gap-2.5 text-sm text-ivory/70 hover:text-ivory transition-colors"
          >
            <Mail size={15} strokeWidth={1.4} className="text-gold" aria-hidden="true" />
            hello@refora.in
          </a>
          <a
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-sm text-ivory/70 hover:text-ivory transition-colors"
          >
            <MessageCircle size={15} strokeWidth={1.4} className="text-gold" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>

        {/* ── Legal ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-ivory/45">
          <p>© {year} REFORA. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Secure payments by Razorpay</span>
            <span aria-hidden="true">·</span>
            <span>UPI · Cards · Net banking · COD</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
