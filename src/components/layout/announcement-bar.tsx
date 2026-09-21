"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useHydrated } from "@/lib/use-hydrated";
import { LAUNCH_OFFER } from "@/lib/catalog";

const DISMISS_KEY = "refora-announcement-dismissed";

function readDismissed(): string | null {
  try {
    return window.localStorage.getItem(DISMISS_KEY);
  } catch {
    // Private browsing or blocked storage — treat as not dismissed.
    return null;
  }
}

/**
 * Launch offer bar. Presented as an invitation rather than a sale shout —
 * the client was explicit that offers should not make the brand read as a
 * discount store. Dismissal is remembered per browser.
 */
export function AnnouncementBar() {
  const hydrated = useHydrated();
  const [dismissed, setDismissed] = useState(false);

  // Only read storage once hydration has happened, so server and client agree
  // on the first paint.
  const previouslyDismissed = useMemo(
    () => (hydrated ? readDismissed() === LAUNCH_OFFER.code : false),
    [hydrated]
  );

  const visible = LAUNCH_OFFER.enabled && hydrated && !dismissed && !previouslyDismissed;

  if (!visible) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, LAUNCH_OFFER.code);
    } catch {
      /* nothing to persist to — dismissal lasts for this page view only */
    }
  };

  return (
    <div className="announcement-bar relative">
      <p className="px-8">
        <span className="text-gold tracking-[0.18em] uppercase text-[0.6875rem]">
          {LAUNCH_OFFER.label}
        </span>
        <span className="mx-2.5 opacity-40" aria-hidden="true">
          ·
        </span>
        <span className="text-cream/90">{LAUNCH_OFFER.detail}</span>
        <span className="mx-2.5 opacity-40" aria-hidden="true">
          ·
        </span>
        <span className="text-cream tracking-[0.16em]">{LAUNCH_OFFER.code}</span>
      </p>

      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cream/55 hover:text-cream transition-colors"
      >
        <X size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
