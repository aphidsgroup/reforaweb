import Link from "next/link";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  );
}


const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/skincare", label: "Skincare" },
  { href: "/organic", label: "REFORA ORGANIC" },
  { href: "/journal", label: "Journal" },
];

const SUPPORT_LINKS = [
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
  { href: "/track", label: "Track Order" },
  { href: "/account", label: "My Account" },
];

const POLICY_LINKS = [
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/returns", label: "Returns & Refunds" },
  { href: "/policies/cancellation", label: "Cancellation" },
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms & Conditions" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#29231F] text-[#EFE5D5]">
      <div className="container-refora py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-3xl tracking-[0.15em] text-[#FFFDFC] hover:opacity-80 transition-opacity"
            >
              REFORA
            </Link>
            <p className="mt-3 text-xs tracking-[0.12em] text-[#C7A56A] uppercase">
              Restore · Renew · Refora.
            </p>
            <p className="mt-4 text-sm text-[#EFE5D5]/70 leading-relaxed max-w-xs">
              A more thoughtful everyday ritual. Skincare and organic essentials, considered.
            </p>
            {/* Social */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com/refora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="REFORA on Instagram"
                className="text-[#EFE5D5]/60 hover:text-[#C7A56A] transition-colors"
              >
                <IconInstagram />
              </a>
              <a
                href="https://facebook.com/refora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="REFORA on Facebook"
                className="text-[#EFE5D5]/60 hover:text-[#C7A56A] transition-colors"
              >
                <IconFacebook />
              </a>
              <a
                href="https://youtube.com/@refora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="REFORA on YouTube"
                className="text-[#EFE5D5]/60 hover:text-[#C7A56A] transition-colors"
              >
                <IconYoutube />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.12em] uppercase text-[#EFE5D5]/50 mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EFE5D5]/80 hover:text-[#EFE5D5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.12em] uppercase text-[#EFE5D5]/50 mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EFE5D5]/80 hover:text-[#EFE5D5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies + Newsletter */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.12em] uppercase text-[#EFE5D5]/50 mb-5">
              Policies
            </h3>
            <ul className="space-y-3 mb-8">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#EFE5D5]/80 hover:text-[#EFE5D5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#C7A56A] hover:opacity-80 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#EFE5D5]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#EFE5D5]/40">
            © {new Date().getFullYear()} REFORA. All rights reserved.
          </p>
          <p className="text-xs text-[#EFE5D5]/30 tracking-widest uppercase">
            refora.in
          </p>
        </div>
      </div>
    </footer>
  );
}
