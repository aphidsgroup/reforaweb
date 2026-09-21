"use client";

import { useState } from "react";
import Link from "next/link";

// Note: 'use client' prevents static metadata export here.
// Add a generateMetadata export in a server layout or use Next.js metadata
// in the parent layout. SEO values for reference:
// title: "Contact Us | REFORA"
// description: "Get in touch with REFORA. Send us a message, reach us on WhatsApp, or email us directly."

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hi REFORA, I have a question about..."
  )}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div className="bg-[#F7F2E9] min-h-screen">
      {/* Header */}
      <div className="bg-[#EFE5D5] py-16 text-center border-b border-[#E4D5C2]">
        <div className="container-refora">
          <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-3">
            Reach us
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light text-[#29231F]">
            Contact
          </h1>
        </div>
      </div>

      <div className="container-refora py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Form */}
          <div>
            <h2 className="font-serif text-2xl text-[#29231F] mb-6">
              Send us a message
            </h2>

            {status === "success" ? (
              <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-6">
                <p className="text-sm text-[#29231F] font-medium mb-2">
                  Message received — thank you.
                </p>
                <p className="text-sm text-[#29231F]/60">
                  We&apos;ll get back to you within 1–2 business days.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-ghost text-sm mt-4"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                  >
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="input-refora"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                  >
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    className="input-refora"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                  >
                    Phone{" "}
                    <span className="text-[#29231F]/30">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    className="input-refora"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs text-[#29231F]/60 uppercase tracking-wide mb-1"
                  >
                    Message <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help?"
                    className="input-refora resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-600" role="alert">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>

                <p className="text-xs text-[#29231F]/40">
                  We typically respond within 1–2 business days.
                </p>
              </form>
            )}
          </div>

          {/* Right — Contact details */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-serif text-2xl text-[#29231F] mb-6">
                Other ways to reach us
              </h2>
            </div>

            {/* WhatsApp */}
            <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl" aria-hidden="true">
                  💬
                </span>
                <div>
                  <p className="font-medium text-[#29231F] mb-1">WhatsApp</p>
                  <p className="text-sm text-[#29231F]/60 mb-3">
                    Quick questions? Chat with us on WhatsApp — typically
                    available Mon–Sat, 10am–6pm IST.
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex text-sm px-4 py-2"
                    aria-label="Chat on WhatsApp"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-[#EFE5D5] border border-[#E4D5C2] rounded-sm p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl" aria-hidden="true">
                  ✉️
                </span>
                <div>
                  <p className="font-medium text-[#29231F] mb-1">Email</p>
                  <p className="text-sm text-[#29231F]/60 mb-2">
                    For general inquiries, orders, and feedback:
                  </p>
                  <a
                    href="mailto:hello@refora.in"
                    className="text-sm text-[#29231F] underline hover:text-[#C7A56A] transition-colors"
                  >
                    hello@refora.in
                  </a>
                  <p className="text-xs text-[#29231F]/40 mt-1">
                    [PLACEHOLDER — confirm official email with client]
                  </p>
                </div>
              </div>
            </div>

            {/* Policies links */}
            <div>
              <p className="text-xs text-[#29231F]/50 mb-3">
                Looking for something specific?
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { href: "/faqs", label: "FAQs" },
                  { href: "/policies/returns", label: "Returns" },
                  { href: "/policies/shipping", label: "Shipping" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-xs border border-[#E4D5C2] px-3 py-1.5 rounded-sm text-[#29231F]/70 hover:border-[#29231F] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
