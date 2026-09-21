import { EditorialVisual, SocialIcon } from "@/components/ui/brand-art";
import { Reveal } from "@/components/ui/reveal";

const INSTAGRAM_HANDLE = "refora";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

/**
 * Instagram grid.
 *
 * Renders composed tiles until the feed is connected. To go live, fetch the
 * Instagram Basic Display / Graph API in a server component and pass real
 * posts as `src` — the grid and hover treatment stay exactly as they are.
 */
const TILES = [
  { tone: "warm", motif: "leaf", caption: "The bar, unwrapped" },
  { tone: "glow", motif: "oat", caption: "Colloidal oatmeal, milled fine" },
  { tone: "dark", motif: "leaf", caption: "Morning light, wash-day" },
  { tone: "glow", motif: "none", caption: "Restore · Renew · Refora." },
  { tone: "warm", motif: "oat", caption: "Behind the formulation" },
  { tone: "dark", motif: "none", caption: "Coming soon — REFORA ORGANIC" },
] as const;

export function InstagramSection() {
  return (
    <section className="section bg-soft-white" aria-label="REFORA on Instagram">
      <div className="container-refora">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 md:mb-12">
          <div>
            <p className="eyebrow mb-4">Follow along</p>
            <h2
              className="font-serif font-light text-espresso leading-[1.08] text-balance"
              style={{ fontSize: "var(--text-headline)" }}
            >
              @{INSTAGRAM_HANDLE}
            </h2>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm self-start sm:self-auto"
          >
            <SocialIcon name="instagram" className="w-3.5 h-3.5" />
            <span>Follow on Instagram</span>
          </a>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {TILES.map((tile, i) => (
            <Reveal key={i} delay={i * 70}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-sm"
                aria-label={`${tile.caption} — open Instagram in a new tab`}
              >
                <EditorialVisual
                  tone={tile.tone}
                  motif={tile.motif}
                  alt={tile.caption}
                  className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.07]"
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                />
                <span className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/45 transition-colors duration-500 flex items-center justify-center">
                  <SocialIcon
                    name="instagram"
                    className="w-5 h-5 text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {process.env.NODE_ENV !== "production" && (
          <p className="mt-8 text-center text-xs text-clay">
            Placeholder tiles — connect the Instagram feed to replace these with real posts.
          </p>
        )}
      </div>
    </section>
  );
}
