/**
 * Art direction layer
 * ───────────────────────────────────────────────────────────────────────────
 * REFORA has not supplied product photography yet. Instead of shipping grey
 * boxes stamped "[photography needed]", these components compose the brand
 * palette into lit, textured product studies so every layout reads as
 * finished work.
 *
 * Each accepts an optional `src`. The moment a real photograph exists, pass
 * it — the composed study is dropped and <Image/> takes over, with no other
 * change to the calling page.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

/* ═════════════════════════════════════════════════════════════════════════
   Botanical motifs — drawn from the brand board's leaf / droplet language
   ═════════════════════════════════════════════════════════════════════════ */

export function LeafMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 320" fill="none" className={className} aria-hidden="true">
      <path
        d="M100 312C100 312 100 196 100 150C100 74 148 20 186 8C186 8 190 108 154 166C126 212 100 220 100 220"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M100 244C100 244 74 234 50 196C16 142 14 48 14 48C50 62 92 112 98 182"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path d="M100 312V150" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function OatSprigMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 300" fill="none" className={className} aria-hidden="true">
      <path d="M60 296V70" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 92 + i * 42;
        return (
          <g key={i}>
            <ellipse
              cx={38}
              cy={y}
              rx="13"
              ry="24"
              transform={`rotate(-28 38 ${y})`}
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <ellipse
              cx={82}
              cy={y + 18}
              rx="13"
              ry="24"
              transform={`rotate(28 82 ${y + 18})`}
              stroke="currentColor"
              strokeWidth="1.1"
            />
          </g>
        );
      })}
      <path d="M60 70C60 52 52 38 40 30" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   Thin-line feature icons — matching the brand board's circular icon set
   ═════════════════════════════════════════════════════════════════════════ */

const iconPaths = {
  leaf: (
    <>
      <path d="M7 25C7 15 14 8 25 7c0 11-7 18-18 18Z" />
      <path d="M7 25c4-6 9-10 14-12" />
    </>
  ),
  droplet: (
    <>
      <path d="M16 6c4 6 7 10 7 14a7 7 0 1 1-14 0c0-4 3-8 7-14Z" />
      <path d="M12 20a4 4 0 0 0 4 4" />
    </>
  ),
  sparkle: (
    <>
      <path d="M16 6c1 5 4 8 9 9-5 1-8 4-9 9-1-5-4-8-9-9 5-1 8-4 9-9Z" />
      <path d="M24 20c.4 2 1.5 3 3.5 3.5-2 .5-3.1 1.5-3.5 3.5-.4-2-1.5-3-3.5-3.5 2-.5 3.1-1.5 3.5-3.5Z" />
    </>
  ),
  jar: (
    <>
      <rect x="8" y="12" width="16" height="14" rx="2" />
      <path d="M11 12V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
      <path d="M8 17h16" />
    </>
  ),
  shield: (
    <>
      <path d="M16 6l9 3v8c0 5-4 8-9 10-5-2-9-5-9-10V9l9-3Z" />
      <path d="M12 16l3 3 5-5" />
    </>
  ),
  truck: (
    <>
      <path d="M4 10h13v11H4z" />
      <path d="M17 14h5l3 3v4h-8z" />
      <circle cx="9" cy="23" r="2" />
      <circle cx="21" cy="23" r="2" />
    </>
  ),
} as const;

export type BrandIconName = keyof typeof iconPaths;

export function BrandIcon({
  name,
  className,
}: {
  name: BrandIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   Product studies
   ═════════════════════════════════════════════════════════════════════════ */

/**
 * Caps a line of packaging copy to the width of the panel it sits on.
 *
 * Callers pass product names of wildly different lengths ("Ghee" through
 * "Cold Pressed Groundnut Oil") into fixed-width label panels, so an
 * unconstrained <text> runs straight off the artwork. Returning `textLength`
 * unconditionally is not the answer either — it would stretch a short name to
 * fill the panel.
 *
 * So: estimate the natural width, and only pin `textLength` when the string
 * would actually overflow. The estimate is deliberately slightly generous, so
 * the failure mode is a hair of extra compression rather than an overflow.
 */
function fitText(
  text: string,
  fontSize: number,
  maxWidth: number,
  /** Mean glyph width as a fraction of font size. Caps and serifs run wider. */
  widthRatio = 0.55
): { textLength?: number; lengthAdjust?: "spacingAndGlyphs" } {
  const estimated = text.length * fontSize * widthRatio;
  return estimated > maxWidth
    ? { textLength: maxWidth, lengthAdjust: "spacingAndGlyphs" }
    : {};
}

/** COCOCRÈME — an embossed soap bar resting on a lit plinth. */
function SoapBarStudy({ label = "COCOCRÈME" }: { label?: string }) {
  return (
    <svg viewBox="0 0 420 420" className="w-full h-full" role="img" aria-label={`${label} soap bar`}>
      <defs>
        <linearGradient id="soapFace" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FFFDFC" />
          <stop offset="45%" stopColor="#F4EADA" />
          <stop offset="100%" stopColor="#E4D5C2" />
        </linearGradient>
        <linearGradient id="soapEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0CFB8" />
          <stop offset="100%" stopColor="#C9B599" />
        </linearGradient>
        <radialGradient id="plinthLight" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#FFFDFC" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFDFC" stopOpacity="0" />
        </radialGradient>
        <filter id="soapShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#29231F" floodOpacity="0.20" />
        </filter>
        <filter id="blur18"><feGaussianBlur stdDeviation="18" /></filter>
      </defs>

      {/* Light pool on the surface */}
      <ellipse cx="200" cy="150" rx="190" ry="150" fill="url(#plinthLight)" />

      {/* Cast shadow */}
      <ellipse cx="214" cy="300" rx="128" ry="26" fill="#29231F" opacity="0.14" filter="url(#blur18)" />

      {/* Stone plinth */}
      <g>
        <path d="M78 262h268l-18 44H96z" fill="#DCCBB4" />
        <path d="M78 262h268l-6-14H84z" fill="#E9DCC8" />
      </g>

      {/* Bar — top face + front edge, slight isometric tilt */}
      <g filter="url(#soapShadow)">
        <path d="M112 226l28-16h150l28 16-28 16H140z" fill="url(#soapEdge)" />
        <rect x="112" y="226" width="206" height="40" rx="7" fill="url(#soapEdge)" />
        <rect x="112" y="186" width="206" height="60" rx="8" fill="url(#soapFace)" />
      </g>

      {/* Embossed wordmark */}
      <text
        x="215"
        y="222"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="20"
        textLength="124"
        lengthAdjust="spacing"
        fill="#B39A76"
        opacity="0.85"
      >
        REFORA
      </text>

      {/* Specular highlight along the top edge */}
      <rect x="120" y="190" width="190" height="4" rx="2" fill="#FFFDFC" opacity="0.8" />

      {/* Soap lather */}
      <g fill="#FFFDFC" opacity="0.75">
        <circle cx="92" cy="252" r="16" />
        <circle cx="70" cy="266" r="11" />
        <circle cx="108" cy="272" r="9" />
        <circle cx="344" cy="256" r="13" />
        <circle cx="362" cy="270" r="9" />
      </g>
      <g fill="none" stroke="#E4D5C2" strokeWidth="1">
        <circle cx="92" cy="252" r="16" />
        <circle cx="344" cy="256" r="13" />
      </g>
    </svg>
  );
}

/** COCOCRÈME — the retail carton, as drawn on the brand board. */
function CartonStudy({
  label = "COCOCRÈME",
  sublabel = "Coconut Milk Soap",
}: {
  label?: string;
  sublabel?: string;
}) {
  return (
    <svg viewBox="0 0 420 420" className="w-full h-full" role="img" aria-label={`${label} carton`}>
      <defs>
        <linearGradient id="boxFront" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#FFFDFC" />
          <stop offset="60%" stopColor="#F5ECDD" />
          <stop offset="100%" stopColor="#EADCC7" />
        </linearGradient>
        <linearGradient id="boxSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DCCBB4" />
          <stop offset="100%" stopColor="#C9B599" />
        </linearGradient>
        <linearGradient id="boxTop" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#FFFDFC" />
          <stop offset="100%" stopColor="#EFE2CE" />
        </linearGradient>
        <filter id="boxShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="6" dy="20" stdDeviation="20" floodColor="#29231F" floodOpacity="0.22" />
        </filter>
        <filter id="blur20"><feGaussianBlur stdDeviation="20" /></filter>
      </defs>

      <ellipse cx="200" cy="120" rx="180" ry="130" fill="#FFFDFC" opacity="0.5" />
      <ellipse cx="216" cy="348" rx="118" ry="24" fill="#29231F" opacity="0.16" filter="url(#blur20)" />

      {/* Box geometry — front face spans x 118→234 (116 wide) and shears
          +36y across that width; depth vector is (+78, −36). The typography
          below is placed on that exact plane, so these numbers and the
          skewY angle must change together. */}
      <g filter="url(#boxShadow)">
        {/* Top face */}
        <path d="M118 122L196 86L312 122L234 158Z" fill="url(#boxTop)" />
        {/* Front face */}
        <path d="M118 122V310L234 346V158Z" fill="url(#boxFront)" />
        {/* Right side */}
        <path d="M234 158L312 122V310L234 346Z" fill="url(#boxSide)" />
      </g>

      {/* Front panel typography.
          skewY(17.24°) === atan(36 / 116), so the lines sit parallel to the
          face's top and bottom edges. Every line carries a textLength that is
          comfortably inside the 116-unit face width, which keeps the setting
          on the panel whatever the rendered font's metrics turn out to be. */}
      <g transform="translate(176 234) skewY(17.24)">
        <text
          y="-44"
          textAnchor="middle"
          fontFamily="var(--font-serif)"
          fontSize="12.5"
          textLength="76"
          lengthAdjust="spacing"
          fill="#8F7658"
        >
          REFORA
        </text>

        <line x1="-24" y1="-32" x2="24" y2="-32" stroke="#C7A56A" strokeWidth="0.8" />

        <text
          y="-4"
          textAnchor="middle"
          fontFamily="var(--font-serif)"
          fontSize="14"
          fill="#4A3D35"
          {...fitText(label, 14, 86, 0.72)}
        >
          {label}
        </text>

        <text
          y="16"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="7.5"
          fill="#8F7658"
          {...fitText(sublabel, 7.5, 62)}
        >
          {sublabel}
        </text>

        <text
          y="64"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="6.5"
          textLength="50"
          lengthAdjust="spacingAndGlyphs"
          fill="#A87F68"
        >
          100 g / 3.52 oz
        </text>
      </g>

      {/* Embossed botanical on the side panel — sheared onto the side plane,
          which rises by 36y across its 78-unit depth. */}
      <g transform="translate(252 206) skewY(-24.8) scale(0.22)" opacity="0.3" color="#8F7658">
        <LeafMotif className="w-[200px]" />
      </g>
    </svg>
  );
}

/** REFORA ORGANIC — a cold-pressed oil bottle. */
function BottleStudy({ label = "COCONUT OIL" }: { label?: string }) {
  return (
    <svg viewBox="0 0 420 420" className="w-full h-full" role="img" aria-label={`${label} bottle`}>
      <defs>
        <linearGradient id="glassBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D8C7AC" />
          <stop offset="22%" stopColor="#F6EEE0" />
          <stop offset="55%" stopColor="#E8D9C0" />
          <stop offset="100%" stopColor="#C9B599" />
        </linearGradient>
        <linearGradient id="oilFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D9B678" />
          <stop offset="30%" stopColor="#EFD5A3" />
          <stop offset="100%" stopColor="#C29A5C" />
        </linearGradient>
        <filter id="bottleShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="4" dy="16" stdDeviation="16" floodColor="#29231F" floodOpacity="0.20" />
        </filter>
        <filter id="blur16"><feGaussianBlur stdDeviation="16" /></filter>
      </defs>

      <ellipse cx="200" cy="130" rx="170" ry="120" fill="#FFFDFC" opacity="0.5" />
      <ellipse cx="210" cy="348" rx="92" ry="20" fill="#29231F" opacity="0.16" filter="url(#blur16)" />

      <g filter="url(#bottleShadow)">
        {/* Cap */}
        <rect x="186" y="62" width="48" height="30" rx="4" fill="#3A302A" />
        <rect x="186" y="62" width="48" height="8" rx="4" fill="#4A3D35" />
        {/* Neck */}
        <rect x="194" y="92" width="32" height="34" fill="#DCCBB4" />
        {/* Body */}
        <path d="M194 126c0 14-42 26-42 62v122a18 18 0 0 0 18 18h80a18 18 0 0 0 18-18V188c0-36-42-48-42-62z" fill="url(#glassBody)" />
        {/* Oil */}
        <path d="M156 210v100a14 14 0 0 0 14 14h80a14 14 0 0 0 14-14V210z" fill="url(#oilFill)" opacity="0.92" />
        {/* Meniscus */}
        <path d="M156 210h108" stroke="#FFFDFC" strokeWidth="2" opacity="0.7" />
      </g>

      {/* Label — the 100-unit panel is the hard constraint, so each line is
          pinned with textLength. Callers pass product names of very different
          lengths ("Ghee" through "Cold Pressed Coconut Oil") and without this
          the longer ones run off the bottle. */}
      <g>
        <rect x="160" y="228" width="100" height="72" rx="2" fill="#FFFDFC" opacity="0.94" />
        <text
          x="210"
          y="252"
          textAnchor="middle"
          fontFamily="var(--font-serif)"
          fontSize="12"
          textLength="66"
          lengthAdjust="spacing"
          fill="#8F7658"
        >
          REFORA
        </text>
        <line x1="186" y1="260" x2="234" y2="260" stroke="#C7A56A" strokeWidth="0.8" />
        <text
          x="210"
          y="278"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="8"
          fill="#4A3D35"
          {...fitText(label, 8, 84)}
        >
          {label}
        </text>
        <text
          x="210"
          y="292"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="6.5"
          textLength="58"
          lengthAdjust="spacingAndGlyphs"
          fill="#A87F68"
        >
          COLD PRESSED
        </text>
      </g>

      {/* Glass highlight */}
      <rect x="168" y="200" width="7" height="110" rx="3.5" fill="#FFFDFC" opacity="0.55" />
    </svg>
  );
}

const studies = {
  soap: SoapBarStudy,
  carton: CartonStudy,
  bottle: BottleStudy,
} as const;

export type StudyKind = keyof typeof studies;

/* ═════════════════════════════════════════════════════════════════════════
   ProductVisual — the single entry point used across the site
   ═════════════════════════════════════════════════════════════════════════ */

type ProductVisualProps = {
  /** Real photography. When present it wins and the study is not rendered. */
  src?: string | null;
  alt: string;
  /** Which composed study to fall back to. */
  kind?: StudyKind;
  label?: string;
  sublabel?: string;
  /** Background treatment behind the study. */
  tone?: "warm" | "glow" | "dark";
  className?: string;
  /** Pass for above-the-fold imagery. */
  priority?: boolean;
  sizes?: string;
  /** Adds a slow float to the product. Use sparingly — hero only. */
  animate?: boolean;
};

export function ProductVisual({
  src,
  alt,
  kind = "carton",
  label,
  sublabel,
  tone = "warm",
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  animate = false,
}: ProductVisualProps) {
  const toneClass =
    tone === "dark" ? "surface-dark" : tone === "glow" ? "surface-glow" : "surface-warm";

  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const Study = studies[kind];

  return (
    <div
      className={cn("relative overflow-hidden grain", toneClass, className)}
      role="img"
      aria-label={alt}
    >
      {/* Light sweep across the surface */}
      <div className="absolute inset-0 light-sweep opacity-60 drift-slow" aria-hidden="true" />

      {/* Botanical shadow cast into the corner */}
      <div
        className={cn(
          "absolute -right-10 -top-14 w-1/2 max-w-[260px] opacity-[0.14] rotate-12",
          tone === "dark" ? "text-gold" : "text-espresso"
        )}
        aria-hidden="true"
      >
        <LeafMotif className="w-full h-auto" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-[8%]">
        <div className={cn("w-full h-full max-w-[520px]", animate && "float-soft")}>
          <Study label={label} sublabel={sublabel} />
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   EditorialVisual — tonal, non-product imagery (story, lifestyle, journal)
   ═════════════════════════════════════════════════════════════════════════ */

export function EditorialVisual({
  src,
  alt,
  tone = "warm",
  motif = "leaf",
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  tone?: "warm" | "glow" | "dark";
  motif?: "leaf" | "oat" | "none";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const toneClass =
    tone === "dark" ? "surface-dark" : tone === "glow" ? "surface-glow" : "surface-warm";

  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden grain", toneClass, className)}
      role="img"
      aria-label={alt}
    >
      <div className="absolute inset-0 light-sweep opacity-50 drift-slow" aria-hidden="true" />
      {motif !== "none" && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center opacity-[0.16]",
            tone === "dark" ? "text-gold" : "text-espresso"
          )}
          aria-hidden="true"
        >
          {motif === "leaf" ? (
            <LeafMotif className="h-[78%] w-auto -rotate-6" />
          ) : (
            <OatSprigMotif className="h-[78%] w-auto rotate-3" />
          )}
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   Social glyphs
   lucide-react v1 removed its brand icons, so these are drawn here.
   ═════════════════════════════════════════════════════════════════════════ */

const socialPaths = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5V6.9c0-.8.2-1.2 1.3-1.2h1.4V2.9c-.7-.1-1.5-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v1.7H8.4v3h2.6V21h3.5v-8.5h2.6l.4-3h-3Z" />
  ),
  youtube: (
    <>
      <rect x="2.2" y="5.3" width="19.6" height="13.4" rx="4" />
      <path d="M10.2 9.4v5.2l4.6-2.6-4.6-2.6Z" fill="currentColor" stroke="none" />
    </>
  ),
} as const;

export type SocialName = keyof typeof socialPaths;

export function SocialIcon({ name, className }: { name: SocialName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {socialPaths[name]}
    </svg>
  );
}
