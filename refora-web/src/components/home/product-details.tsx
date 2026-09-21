export function ProductDetails() {
  return (
    <section className="section bg-[#F7F2E9]" aria-label="Product details">
      <div className="container-refora">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — confirmed information from brand board */}
          <div>
            <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-4">
              What&apos;s inside
            </p>
            <h2 className="font-serif text-4xl font-light text-[#29231F] mb-6">
              COCOCRÈME
            </h2>
            <span className="gold-rule mb-6 block" />

            {/* Ingredients — confirmed from brand board */}
            <div className="mb-8">
              <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-[#29231F]/60 mb-3">
                Key Ingredients
              </h3>
              <p className="text-sm text-[#29231F]/80 leading-relaxed">
                Coconut milk · Colloidal oatmeal
              </p>
              <p className="text-xs text-[#29231F]/50 mt-2 italic">
                Full INCI ingredient list — awaiting client confirmation
              </p>
            </div>

            {/* Claims confirmed from brand board only */}
            <div className="mb-8">
              <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-[#29231F]/60 mb-3">
                What it does
              </h3>
              <ul className="space-y-2 text-sm text-[#29231F]/80">
                <li>Gently cleanses</li>
                <li>Nourishes</li>
                <li>Leaves skin soft</li>
              </ul>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-[#29231F]/60 mb-3">
                Size
              </h3>
              <p className="text-sm text-[#29231F]/80">100g / 3.52 oz</p>
            </div>
          </div>

          {/* Right — how to use */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.1em] uppercase text-[#29231F]/60 mb-4">
              How to use
            </h3>
            <p className="text-sm text-[#29231F]/60 italic">
              Usage instructions — awaiting client confirmation
            </p>

            {/* Detail image slot */}
            <div className="mt-8 aspect-square bg-[#EFE5D5] rounded-sm flex items-center justify-center">
              <p className="text-xs text-[#29231F]/30 text-center px-4">
                [Product texture / detail photography needed]
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
