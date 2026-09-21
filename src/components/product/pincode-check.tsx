"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { isValidPincode } from "@/lib/utils";

type Result = {
  serviceable: boolean;
  codAvailable: boolean;
  estimatedDays: number | null;
};

/** Pincode serviceability, COD availability and delivery estimate. */
export function PincodeCheck() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const check = async () => {
    if (!isValidPincode(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/shipping/check-pincode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      if (!res.ok) throw new Error("request failed");
      setResult((await res.json()) as Result);
    } catch {
      setError("Could not check right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-sand rounded-sm p-5 bg-soft-white">
      <p className="label-refora">Check delivery</p>

      <div className="flex gap-2">
        <label htmlFor="pincode" className="sr-only">
          Delivery pincode
        </label>
        <input
          id="pincode"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ""));
            setResult(null);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="6-digit pincode"
          aria-invalid={error ? "true" : undefined}
          className="input-refora flex-1 text-sm tnum"
        />
        <button
          onClick={check}
          disabled={loading || pincode.length !== 6}
          className="btn btn-secondary btn-sm shrink-0"
        >
          {loading ? (
            <Loader2 size={14} strokeWidth={1.6} className="animate-spin" aria-hidden="true" />
          ) : (
            <span>Check</span>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose mt-2.5" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-3.5 space-y-1.5 text-sm" role="status">
          {result.serviceable ? (
            <>
              <p className="flex items-center gap-2 text-espresso">
                <Check size={14} strokeWidth={2} className="text-gold shrink-0" aria-hidden="true" />
                Delivers to {pincode}
                {result.estimatedDays ? ` in about ${result.estimatedDays} days` : ""}
              </p>
              <p className="flex items-center gap-2 text-espresso/65">
                {result.codAvailable ? (
                  <Check size={14} strokeWidth={2} className="text-gold shrink-0" aria-hidden="true" />
                ) : (
                  <X size={14} strokeWidth={2} className="text-clay shrink-0" aria-hidden="true" />
                )}
                Cash on delivery {result.codAvailable ? "available" : "not available here"}
              </p>
            </>
          ) : (
            <p className="flex items-center gap-2 text-espresso/70">
              <X size={14} strokeWidth={2} className="text-clay shrink-0" aria-hidden="true" />
              We do not deliver to {pincode} yet. Message us on WhatsApp and we will try to
              help.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
