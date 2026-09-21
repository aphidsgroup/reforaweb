import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About REFORA",
  description:
    "REFORA is a considered lifestyle brand rooted in simplicity, purity, and everyday ritual. Meet the brand behind COCOCRÈME.",
  openGraph: {
    title: "About REFORA",
    description:
      "A considered lifestyle brand rooted in simplicity, purity, and everyday ritual.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#F7F2E9] min-h-screen">
      {/* Hero */}
      <section className="bg-[#EFE5D5] py-24 text-center border-b border-[#E4D5C2]">
        <div className="container-refora max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.18em] text-[#C7A56A] uppercase mb-5">
            The Brand
          </p>
          <h1 className="font-serif text-5xl lg:text-7xl font-light text-[#29231F] leading-tight mb-6">
            About REFORA
          </h1>
          <p className="text-base text-[#29231F]/60 leading-relaxed">
            Restore · Renew · Refora
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 border-b border-[#E4D5C2]">
        <div className="container-refora max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="gold-rule" aria-hidden="true" />
            <p className="text-xs tracking-[0.14em] text-[#29231F]/50 uppercase">
              Our Story
            </p>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-[#29231F] mb-8">
            Our story is being written.
          </h2>
          <div className="space-y-5 text-[#29231F]/70 leading-relaxed">
            <p>
              REFORA was born from a simple belief: that the things we use every
              day should be made with the same care and consideration we bring to
              the rest of our lives.
            </p>
            <p>
              We are at the very beginning of that journey. Every product we
              bring to you will be considered — chosen for what it genuinely
              does, sourced with transparency, and made without shortcuts.
            </p>
            <p>
              We&apos;re not chasing trends. We&apos;re building something
              quiet, honest, and lasting. This page will grow as we do.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="bg-[#EFE5D5] py-20 border-b border-[#E4D5C2]">
        <div className="container-refora max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-3">
              What we stand for
            </p>
            <h2 className="font-serif text-4xl font-light text-[#29231F]">
              Our values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Honesty",
                body: "We say what is in our products. We say what we don&rsquo;t know. We don&rsquo;t invent claims.",
              },
              {
                title: "Simplicity",
                body: "Fewer, better ingredients. Cleaner formulas. Products that do one thing well.",
              },
              {
                title: "Intention",
                body: "Nothing in the range exists without a reason. Every product earns its place.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="flex flex-col gap-3">
                <span className="gold-rule" aria-hidden="true" />
                <h3 className="font-serif text-xl text-[#29231F]">{title}</h3>
                <p
                  className="text-sm text-[#29231F]/60 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 border-b border-[#E4D5C2]">
        <div className="container-refora max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="gold-rule" aria-hidden="true" />
            <p className="text-xs tracking-[0.14em] text-[#29231F]/50 uppercase">
              Vision
            </p>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-[#29231F] mb-6">
            Where we&apos;re going
          </h2>
          <p className="text-[#29231F]/70 leading-relaxed mb-5">
            REFORA is building a considered lifestyle brand — starting with
            skincare and expanding into organic pantry essentials. We are not in
            a hurry. Quality and integrity come before scale.
          </p>
          <p className="text-[#29231F]/70 leading-relaxed">
            Our long-term vision is to be the brand you trust for the things
            that matter most in daily life: what goes on your skin, what goes
            into your food, and how you feel in the quiet moments of your day.
          </p>
        </div>
      </section>

      {/* Product intro */}
      <section className="bg-[#29231F] py-20">
        <div className="container-refora max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-5">
            Where it begins
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-[#EFE5D5] mb-6">
            Meet COCOCRÈME
          </h2>
          <p className="text-base text-[#EFE5D5]/60 leading-relaxed mb-8 max-w-xl mx-auto">
            A coconut milk soap with colloidal oatmeal. Gentle enough for
            everyday use. The first product in the REFORA range — and a glimpse
            of what we&apos;re building toward.
          </p>
          <Link href="/products/cococreme" className="btn btn-secondary border-[#C7A56A] text-[#C7A56A] hover:bg-[#C7A56A] hover:text-[#29231F]">
            Discover COCOCRÈME
          </Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 text-center">
        <div className="container-refora">
          <p className="text-sm text-[#29231F]/60 mb-4">
            Have questions? We&apos;d love to hear from you.
          </p>
          <Link href="/contact" className="btn-ghost text-sm">
            Get in touch →
          </Link>
        </div>
      </section>
    </div>
  );
}
