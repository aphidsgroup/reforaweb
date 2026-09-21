"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger in ms, applied as a CSS custom property. */
  delay?: number;
  /** How much of the element must be visible before it animates in. */
  threshold?: number;
  className?: string;
  as?: ElementType;
};

/**
 * Fades and lifts content into view once, on first intersection.
 *
 * The `data-reveal` attribute is attached imperatively after mount rather than
 * rendered, for two reasons: server-rendered HTML stays visible (crawlers and
 * no-JS visitors never see a blank page), and toggling it on the node avoids
 * a second React render per element — there are dozens on the homepage.
 */
export function Reveal({
  children,
  delay = 0,
  threshold = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hide, then reveal on intersection. The rAF gap gives the browser a frame
    // to register the starting style so the transition actually plays for
    // elements that are already in view at mount.
    node.dataset.reveal = "";

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        frame = requestAnimationFrame(() => {
          node.dataset.reveal = "shown";
        });
        observer.disconnect();
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
