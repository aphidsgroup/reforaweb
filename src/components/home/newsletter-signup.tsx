"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section bg-[#EFE5D5]" aria-label="Newsletter signup">
      <div className="container-refora max-w-lg mx-auto text-center">
        <p className="text-xs tracking-[0.14em] text-[#C7A56A] uppercase mb-3">
          Stay connected
        </p>
        <h2 className="font-serif text-4xl font-light text-[#29231F] mb-4">
          Be the first to know.
        </h2>
        <p className="text-sm text-[#29231F]/70 mb-8">
          New products, restocks, and thoughtful notes — sent occasionally.
        </p>

        {status === "success" ? (
          <p className="text-sm text-[#29231F]/80 py-3">
            Thank you — you&apos;re on the list.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="input-refora flex-1"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              className="btn btn-primary flex-shrink-0"
              disabled={status === "loading"}
            >
              {status === "loading" ? "…" : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-red-600 mt-3" role="alert">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="text-xs text-[#29231F]/40 mt-4">
          You can unsubscribe at any time. No spam, ever.
        </p>
      </div>
    </section>
  );
}
