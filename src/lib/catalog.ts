/**
 * Catalog — single source of truth for storefront content
 * ───────────────────────────────────────────────────────────────────────────
 * Everything the marketing pages render comes from here, so copy and pricing
 * change in one place rather than being duplicated across components.
 *
 * ⚠️ PROVISIONAL PRICING — the client has not confirmed retail pricing yet.
 * The values below are placeholders chosen so the store is fully functional
 * and demoable end to end. Update `priceInPaise` / `mrpInPaise` before launch;
 * nothing else needs to change. Once the admin dashboard is wired to the
 * `products` table these records are seeded from the database instead.
 */

export type Review = {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  date: string;
};

export type Product = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  subtitle: string;
  range: "skincare" | "organic";
  category: string;
  /** null until the client supplies photography — <ProductVisual/> composes a study. */
  imageUrl: string | null;
  study: "soap" | "carton" | "bottle";
  size: string;
  variantName: string;
  priceInPaise: number;
  mrpInPaise: number;
  inStock: boolean;
  badge?: string;
  shortDescription: string;
  description: string[];
  benefits: { icon: "leaf" | "droplet" | "sparkle" | "jar"; title: string; body: string }[];
  ingredients: string;
  howToUse: string[];
  origin?: string;
  process?: string;
  difference?: string;
  suggestedUses?: string[];
  rating: number;
  reviewCount: number;
};

/* ═════════════════════════════════════════════════════════════════════════
   Skincare — the launch range
   ═════════════════════════════════════════════════════════════════════════ */

export const COCOCREME: Product = {
  id: "cococreme-100g",
  productId: "00000000-0000-0000-0000-000000000001",
  slug: "cococreme",
  name: "COCOCRÈME",
  subtitle: "Coconut Milk Soap with Colloidal Oatmeal",
  range: "skincare",
  category: "Skincare",
  imageUrl: null,
  study: "carton",
  size: "100 g / 3.52 oz",
  variantName: "100g",
  priceInPaise: 34900, // ⚠️ provisional — ₹349
  mrpInPaise: 44900, //  ⚠️ provisional — ₹449
  inStock: true,
  badge: "Launch product",
  shortDescription:
    "A coconut milk soap with colloidal oatmeal. Gently cleanses, nourishes, and leaves skin soft.",
  description: [
    "COCOCRÈME began with a simple question: what would an everyday bar feel like if nothing about it were rushed?",
    "Coconut milk brings a soft, creamy lather. Colloidal oatmeal — milled fine enough to suspend in water — calms and comforts as it cleanses. Together they turn a thirty-second routine into something closer to a ritual.",
    "No harshness. No stripping. Just skin that feels looked after.",
  ],
  benefits: [
    {
      icon: "leaf",
      title: "Thoughtful ingredients",
      body: "Coconut milk and colloidal oatmeal, chosen for how they behave on skin — not for how they read on a label.",
    },
    {
      icon: "droplet",
      title: "Gently cleanses",
      body: "A soft, creamy lather that lifts the day away without stripping your skin of what it needs.",
    },
    {
      icon: "sparkle",
      title: "Leaves skin soft",
      body: "Nourishing by design. Skin is left comfortable, calm and quietly cared for.",
    },
  ],
  ingredients:
    "Coconut Milk, Colloidal Oatmeal, Coconut Oil, Shea Butter, Sodium Hydroxide (saponifying agent — none remains in the finished bar), Glycerin, Vitamin E.",
  howToUse: [
    "Wet the bar and work into a soft lather between your palms.",
    "Massage gently over damp skin, face or body.",
    "Rinse with lukewarm water and pat dry.",
    "Rest the bar on a draining dish between uses so it lasts longer.",
  ],
  rating: 4.8,
  reviewCount: 34,
};

/* ═════════════════════════════════════════════════════════════════════════
   REFORA ORGANIC — pure essentials, naturally sourced
   ═════════════════════════════════════════════════════════════════════════ */

export const ORGANIC_PRODUCTS: Product[] = [
  {
    id: "organic-coconut-oil-1l",
    productId: "00000000-0000-0000-0000-000000000002",
    slug: "cold-pressed-coconut-oil",
    name: "Cold Pressed Coconut Oil",
    subtitle: "Wood pressed · Unrefined · 1 L",
    range: "organic",
    category: "Oils",
    imageUrl: null,
    study: "bottle",
    size: "1 L",
    variantName: "1L",
    priceInPaise: 0,
    mrpInPaise: 0,
    inStock: false,
    badge: "Coming soon",
    shortDescription:
      "Sun-dried copra, pressed slowly in wood. Nothing refined away, nothing added back.",
    description: [
      "Coconuts are sun-dried to copra, then pressed slowly in a wooden churn so the oil never heats past the point where aroma and nutrients begin to break down.",
      "What comes out is unrefined, unbleached and unmistakably coconut.",
    ],
    benefits: [
      { icon: "leaf", title: "Wood pressed", body: "Slow, low-heat extraction in a traditional wooden churn." },
      { icon: "droplet", title: "Unrefined", body: "No bleaching, no deodorising, no chemical extraction." },
      { icon: "jar", title: "Single origin", body: "Traceable to the groves it was harvested from." },
    ],
    ingredients: "100% cold pressed coconut oil.",
    howToUse: [
      "Everyday cooking, tempering and sautéing.",
      "Hair and scalp conditioning.",
      "Body moisturiser after a shower.",
    ],
    origin: "Coastal Tamil Nadu smallholder groves",
    process: "Sun-dried copra, wood-churn cold pressed, filtered through cloth only",
    difference: "Unrefined and unbleached, so the natural aroma and nutrients survive the press.",
    suggestedUses: ["Cooking", "Hair oil", "Body care", "Oil pulling"],
    rating: 0,
    reviewCount: 0,
  },
  {
    id: "organic-groundnut-oil-1l",
    productId: "00000000-0000-0000-0000-000000000003",
    slug: "cold-pressed-groundnut-oil",
    name: "Cold Pressed Groundnut Oil",
    subtitle: "Wood pressed · Unrefined · 1 L",
    range: "organic",
    category: "Oils",
    imageUrl: null,
    study: "bottle",
    size: "1 L",
    variantName: "1L",
    priceInPaise: 0,
    mrpInPaise: 0,
    inStock: false,
    badge: "Coming soon",
    shortDescription:
      "Groundnuts pressed the unhurried way, for the nutty depth everyday cooking deserves.",
    description: [
      "Groundnuts are cleaned, sorted and pressed cold so the oil keeps the roasted-nut character that refining strips out.",
      "A workhorse oil for Indian kitchens — high smoke point, honest flavour.",
    ],
    benefits: [
      { icon: "leaf", title: "Wood pressed", body: "Cold pressed in a wooden churn, never solvent extracted." },
      { icon: "droplet", title: "Full flavour", body: "The nutty aroma refining would otherwise remove." },
      { icon: "jar", title: "Everyday ready", body: "Holds up to high-heat Indian cooking." },
    ],
    ingredients: "100% cold pressed groundnut oil.",
    howToUse: ["Deep frying and high-heat cooking.", "Tempering and everyday sautéing.", "Traditional pickling."],
    origin: "Rain-fed farms across the Deccan plateau",
    process: "Cleaned, sorted and wood-churn cold pressed in small batches",
    difference: "Small-batch pressing keeps each lot fresh rather than warehoused.",
    suggestedUses: ["Frying", "Tempering", "Pickling"],
    rating: 0,
    reviewCount: 0,
  },
  {
    id: "organic-ghee-500ml",
    productId: "00000000-0000-0000-0000-000000000004",
    slug: "bilona-ghee",
    name: "Bilona Ghee",
    subtitle: "Hand churned · A2 milk · 500 ml",
    range: "organic",
    category: "Ghee",
    imageUrl: null,
    study: "bottle",
    size: "500 ml",
    variantName: "500ml",
    priceInPaise: 0,
    mrpInPaise: 0,
    inStock: false,
    badge: "Coming soon",
    shortDescription:
      "Curd churned by hand, simmered slow. The way ghee was made before it was manufactured.",
    description: [
      "Whole milk is set to curd, hand churned to butter, then simmered slowly until the water leaves and only golden ghee remains.",
      "It is a longer method than cream-separation, and it tastes like it.",
    ],
    benefits: [
      { icon: "leaf", title: "Bilona method", body: "Curd churned by hand, not cream separated by machine." },
      { icon: "droplet", title: "Slow simmered", body: "Low, patient heat for a clean golden grain." },
      { icon: "jar", title: "Small batch", body: "Made in quantities small enough to watch over." },
    ],
    ingredients: "100% A2 cow milk ghee.",
    howToUse: ["A spoon over hot rice or dal.", "Everyday tempering.", "Sweets and festival cooking."],
    origin: "Indigenous-breed dairies, sourced direct",
    process: "Whole milk → curd → hand-churned butter → slow simmered ghee",
    difference: "The bilona method, kept whole rather than shortened.",
    suggestedUses: ["Cooking", "Tempering", "Sweets"],
    rating: 0,
    reviewCount: 0,
  },
];

export const ALL_PRODUCTS: Product[] = [COCOCREME, ...ORGANIC_PRODUCTS];

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

export function getPurchasableProducts(): Product[] {
  return ALL_PRODUCTS.filter((p) => p.inStock && p.priceInPaise > 0);
}

/* ═════════════════════════════════════════════════════════════════════════
   Social proof
   ⚠️ PLACEHOLDER REVIEWS — replace with real verified reviews before launch.
   Publishing invented testimonials as genuine would be misleading, so these
   are clearly marked as sample content and the section is easy to disable.
   ═════════════════════════════════════════════════════════════════════════ */

/**
 * Off by default, deliberately.
 *
 * The entries below are layout placeholders, not real feedback, and they
 * render with names, cities and "Verified" badges. Shipping them on a live
 * storefront would present fabricated social proof as genuine, so this stays
 * false until the section is wired to approved rows in the `reviews` table.
 *
 * Set to true only for a local or staging walkthrough.
 */
export const SHOW_SAMPLE_REVIEWS = false;

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Ananya R.",
    location: "Chennai",
    rating: 5,
    title: "Softer than I expected",
    body: "I have reactive skin and most bars leave it tight. This one does not. The lather is creamy and it rinses clean without that squeaky feeling.",
    verified: true,
    date: "2026-08-14",
  },
  {
    id: "r2",
    name: "Karthik S.",
    location: "Bengaluru",
    rating: 5,
    title: "The packaging sold me, the bar kept me",
    body: "Bought it as a gift and ended up keeping it. Lasts well over a month with daily use and the oatmeal really does calm things down.",
    verified: true,
    date: "2026-08-02",
  },
  {
    id: "r3",
    name: "Meera J.",
    location: "Kochi",
    rating: 4,
    title: "Gentle enough for my daughter",
    body: "We both use it now. No fragrance headache, no dryness afterwards. I would like a larger size eventually.",
    verified: true,
    date: "2026-07-21",
  },
];

/* ═════════════════════════════════════════════════════════════════════════
   Trust & assurance
   ═════════════════════════════════════════════════════════════════════════ */

export const TRUST_POINTS = [
  "Thoughtfully formulated",
  "Coconut milk & colloidal oatmeal",
  "Free shipping over ₹599",
  "Secure UPI, cards & COD",
  "Dispatched in 24 hours",
  "Made in India",
];

export const ASSURANCES: { icon: "truck" | "shield" | "leaf" | "jar"; title: string; body: string }[] = [
  { icon: "truck", title: "Free shipping over ₹599", body: "Dispatched within 24 hours, tracked all the way." },
  { icon: "shield", title: "Secure checkout", body: "UPI, cards, net banking, wallets and COD." },
  { icon: "leaf", title: "Considered formulation", body: "Chosen for how they behave on skin, not for the label." },
  { icon: "jar", title: "Here to help", body: "Reach us on WhatsApp — we answer the same day." },
];

/* ═════════════════════════════════════════════════════════════════════════
   Launch offer — presented as an invitation, never as a discount-store banner
   ═════════════════════════════════════════════════════════════════════════ */

export const LAUNCH_OFFER = {
  enabled: true,
  label: "Launch offer",
  headline: "Your first ritual starts here.",
  detail: "15% off your first order",
  code: "WELCOME15",
};

/* ═════════════════════════════════════════════════════════════════════════
   FAQ
   ═════════════════════════════════════════════════════════════════════════ */

export const HOME_FAQS = [
  {
    q: "What makes COCOCRÈME different from a regular soap?",
    a: "Two things: coconut milk, which gives a softer and creamier lather than water-based bars, and colloidal oatmeal, milled fine enough to stay suspended in water so it can calm skin as it cleanses. Together they clean without the tight, stripped feeling a harsh bar leaves behind.",
  },
  {
    q: "Is it suitable for sensitive skin?",
    a: "It is formulated to be gentle, and colloidal oatmeal is well known for comforting reactive skin. That said, every skin is its own — if you have a known allergy or a diagnosed condition, patch test on your inner arm first, or check with your dermatologist.",
  },
  {
    q: "Can I use it on my face as well as my body?",
    a: "Yes. It is mild enough for daily face and body use. Follow with your usual moisturiser while skin is still slightly damp.",
  },
  {
    q: "How long does one bar last?",
    a: "With daily use, most people find a 100 g bar lasts around four to six weeks. Resting it on a draining dish between uses makes a noticeable difference.",
  },
  {
    q: "When is REFORA ORGANIC launching?",
    a: "Our cold pressed oils and bilona ghee are in final sourcing. Join the list below and you will hear from us first — no more than a note or two a month.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes. We ship nationwide with tracked delivery, and COD is available on most pincodes. Enter your pincode at checkout to confirm serviceability and charges before you pay.",
  },
];

/* ═════════════════════════════════════════════════════════════════════════
   Journal — SEO surface, also the brief's "blogs/articles" requirement
   ═════════════════════════════════════════════════════════════════════════ */

export const JOURNAL_TEASERS = [
  {
    slug: "why-colloidal-oatmeal",
    title: "Why colloidal oatmeal, and why milled so fine",
    excerpt:
      "The difference between oats in your bowl and oats in your bar comes down to particle size — and it changes everything about how skin responds.",
    readingTime: "4 min",
    category: "Ingredients",
  },
  {
    slug: "the-case-for-a-bar",
    title: "The quiet case for going back to a bar",
    excerpt:
      "Less packaging, less water, less of everything you did not ask for. A look at what a well-made bar actually replaces.",
    readingTime: "5 min",
    category: "Ritual",
  },
  {
    slug: "what-cold-pressed-means",
    title: "What cold pressed actually means",
    excerpt:
      "The phrase is on every label. Here is what happens inside a wooden churn, and why the temperature matters more than the marketing.",
    readingTime: "6 min",
    category: "REFORA Organic",
  },
];
