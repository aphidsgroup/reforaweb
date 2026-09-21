"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is COCOCRÈME made with?",
    a: "COCOCRÈME is a coconut milk soap with colloidal oatmeal. The full ingredient list will be published once confirmed with the client.",
  },
  {
    q: "What size is COCOCRÈME?",
    a: "COCOCRÈME comes in a 100g / 3.52 oz bar.",
  },
  {
    q: "Where do you ship?",
    a: "We ship across India. Enter your pincode at checkout to check delivery availability and estimated dates.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "COD availability is pincode-dependent and will be shown at checkout. We accept UPI, cards, net banking, and wallets via Razorpay.",
  },
  {
    q: "What is your return policy?",
    a: "Please see our Returns & Refunds policy page for full details.",
  },
];

export function HomeFaqs() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section bg-[#F7F2E9]" aria-label="Frequently asked questions">
      <div className="container-refora max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-3">
            Questions
          </p>
          <h2 className="font-serif text-4xl font-light text-[#29231F]">FAQs</h2>
        </div>

        <div className="divide-y divide-[#E4D5C2]">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-sm text-[#29231F]">{faq.q}</span>
                <span
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[#C7A56A] transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="pb-5 text-sm text-[#29231F]/70 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/faqs" className="btn-ghost text-sm">
            View all FAQs →
          </a>
        </div>
      </div>
    </section>
  );
}
