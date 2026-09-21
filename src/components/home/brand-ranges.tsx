import Link from "next/link";

export function BrandRanges() {
  return (
    <section className="section bg-[#EFE5D5]" aria-label="Brand ranges">
      <div className="container-refora">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-3">
            What we offer
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#29231F]">
            Two ranges, one brand.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Skincare range */}
          <div className="relative bg-[#F7F2E9] overflow-hidden rounded-sm group">
            <div className="aspect-[4/3] bg-[#E4D5C2] relative">
              {/* CLIENT ASSET: Skincare range image — COCOCRÈME in bathroom context */}
              <div className="absolute inset-0 flex items-center justify-center text-[#29231F]/20 text-sm">
                [Skincare photography needed]
              </div>
            </div>
            <div className="p-8">
              <p className="text-xs tracking-[0.12em] text-[#C7A56A] uppercase mb-2">
                Available now
              </p>
              <h3 className="font-serif text-3xl font-light text-[#29231F] mb-3">
                Skincare
              </h3>
              <p className="text-sm text-[#29231F]/70 leading-relaxed mb-6">
                Considered formulations for daily care. Beginning with
                COCOCRÈME — coconut milk soap with colloidal oatmeal.
              </p>
              <Link href="/skincare" className="btn btn-primary">
                Explore Skincare
              </Link>
            </div>
          </div>

          {/* REFORA ORGANIC range */}
          <div className="relative bg-[#29231F] overflow-hidden rounded-sm group">
            <div className="aspect-[4/3] bg-[#3a2e29] relative">
              {/* CLIENT ASSET: Organic range image — warm, natural, pantry feel */}
              <div className="absolute inset-0 flex items-center justify-center text-[#EFE5D5]/20 text-sm">
                [REFORA ORGANIC photography needed]
              </div>
            </div>
            <div className="p-8">
              <p className="text-xs tracking-[0.12em] text-[#C7A56A] uppercase mb-2">
                Coming soon
              </p>
              <h3 className="font-serif text-3xl font-light text-[#EFE5D5] mb-3">
                REFORA ORGANIC
              </h3>
              <p className="text-sm text-[#EFE5D5]/70 leading-relaxed mb-6">
                Pure essentials. Naturally sourced. Thoughtfully chosen everyday
                essentials rooted in simplicity, purity and tradition.
              </p>
              <Link
                href="/organic"
                className="btn btn-secondary border-[#EFE5D5] text-[#EFE5D5] hover:bg-[#EFE5D5] hover:text-[#29231F]"
              >
                Preview REFORA ORGANIC
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
