#!/usr/bin/env node
/**
 * Seeds the launch catalog into the database.
 *
 *   npm run db:seed
 *
 * Idempotent: products are upserted by slug, so re-running updates the seeded
 * rows rather than duplicating them.
 *
 * It deliberately does NOT overwrite price, MRP or stock on rows that already
 * exist — once the catalog is live those belong to whoever is using /admin,
 * and a re-run must never silently undo their pricing. Pass --force-prices to
 * override that.
 *
 * It also never seeds reviews. Ratings on the storefront are computed from
 * approved rows in the reviews table, and inventing them would put fabricated
 * social proof on a live shop.
 */

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadEnv() {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  } catch {
    /* fall back to the ambient environment */
  }
}

/* ── The launch catalog ───────────────────────────────────────────────────
   Mirrors src/lib/catalog.ts. Kept as plain data here so this script has no
   TypeScript build step and can run with bare node.                        */

const CATALOG = [
  {
    slug: "cococreme",
    name: "COCOCRÈME",
    sku: "REF-CC-100",
    status: "published",
    isFeatured: true,
    priceInPaise: 34900,
    mrpInPaise: 44900,
    weight: 100,
    stock: 100,
    shortDescription:
      "A coconut milk soap with colloidal oatmeal. Gently cleanses, nourishes, and leaves skin soft.",
    description: [
      "COCOCRÈME began with a simple question: what would an everyday bar feel like if nothing about it were rushed?",
      "Coconut milk brings a soft, creamy lather. Colloidal oatmeal — milled fine enough to suspend in water — calms and comforts as it cleanses. Together they turn a thirty-second routine into something closer to a ritual.",
      "No harshness. No stripping. Just skin that feels looked after.",
    ].join("\n\n"),
    ingredients:
      "Coconut Milk, Colloidal Oatmeal, Coconut Oil, Shea Butter, Sodium Hydroxide (saponifying agent — none remains in the finished bar), Glycerin, Vitamin E.",
    howToUse: [
      "Wet the bar and work into a soft lather between your palms.",
      "Massage gently over damp skin, face or body.",
      "Rinse with lukewarm water and pat dry.",
      "Rest the bar on a draining dish between uses so it lasts longer.",
    ].join("\n"),
    metaTitle: "COCOCRÈME — Coconut Milk Soap with Colloidal Oatmeal",
    metaDescription:
      "Meet COCOCRÈME — coconut milk soap with colloidal oatmeal that gently cleanses, nourishes and leaves skin soft.",
    specifications: {
      subtitle: "Coconut Milk Soap with Colloidal Oatmeal",
      range: "skincare",
      category: "Skincare",
      study: "carton",
      size: "100 g / 3.52 oz",
      variantName: "100g",
      badge: "Launch product",
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
    },
  },
  {
    slug: "cold-pressed-coconut-oil",
    name: "Cold Pressed Coconut Oil",
    sku: "REF-OIL-CO-1L",
    status: "upcoming",
    isFeatured: false,
    priceInPaise: 0,
    mrpInPaise: 0,
    weight: 1000,
    stock: 0,
    shortDescription:
      "Sun-dried copra, pressed slowly in wood. Nothing refined away, nothing added back.",
    description: [
      "Coconuts are sun-dried to copra, then pressed slowly in a wooden churn so the oil never heats past the point where aroma and nutrients begin to break down.",
      "What comes out is unrefined, unbleached and unmistakably coconut.",
    ].join("\n\n"),
    ingredients: "100% cold pressed coconut oil.",
    howToUse: [
      "Everyday cooking, tempering and sautéing.",
      "Hair and scalp conditioning.",
      "Body moisturiser after a shower.",
    ].join("\n"),
    metaTitle: "Cold Pressed Coconut Oil — REFORA ORGANIC",
    metaDescription:
      "Wood pressed, unrefined coconut oil from coastal Tamil Nadu groves. Pure essentials, naturally sourced.",
    specifications: {
      subtitle: "Wood pressed · Unrefined · 1 L",
      range: "organic",
      category: "Oils",
      study: "bottle",
      size: "1 L",
      variantName: "1L",
      badge: "Coming soon",
      benefits: [
        { icon: "leaf", title: "Wood pressed", body: "Slow, low-heat extraction in a traditional wooden churn." },
        { icon: "droplet", title: "Unrefined", body: "No bleaching, no deodorising, no chemical extraction." },
        { icon: "jar", title: "Single origin", body: "Traceable to the groves it was harvested from." },
      ],
      origin: "Coastal Tamil Nadu smallholder groves",
      process: "Sun-dried copra, wood-churn cold pressed, filtered through cloth only",
      difference:
        "Unrefined and unbleached, so the natural aroma and nutrients survive the press.",
      suggestedUses: ["Cooking", "Hair oil", "Body care", "Oil pulling"],
    },
  },
  {
    slug: "cold-pressed-groundnut-oil",
    name: "Cold Pressed Groundnut Oil",
    sku: "REF-OIL-GN-1L",
    status: "upcoming",
    isFeatured: false,
    priceInPaise: 0,
    mrpInPaise: 0,
    weight: 1000,
    stock: 0,
    shortDescription:
      "Groundnuts pressed the unhurried way, for the nutty depth everyday cooking deserves.",
    description: [
      "Groundnuts are cleaned, sorted and pressed cold so the oil keeps the roasted-nut character that refining strips out.",
      "A workhorse oil for Indian kitchens — high smoke point, honest flavour.",
    ].join("\n\n"),
    ingredients: "100% cold pressed groundnut oil.",
    howToUse: [
      "Deep frying and high-heat cooking.",
      "Tempering and everyday sautéing.",
      "Traditional pickling.",
    ].join("\n"),
    metaTitle: "Cold Pressed Groundnut Oil — REFORA ORGANIC",
    metaDescription:
      "Wood pressed, unrefined groundnut oil in small batches. Pure essentials, naturally sourced.",
    specifications: {
      subtitle: "Wood pressed · Unrefined · 1 L",
      range: "organic",
      category: "Oils",
      study: "bottle",
      size: "1 L",
      variantName: "1L",
      badge: "Coming soon",
      benefits: [
        { icon: "leaf", title: "Wood pressed", body: "Cold pressed in a wooden churn, never solvent extracted." },
        { icon: "droplet", title: "Full flavour", body: "The nutty aroma refining would otherwise remove." },
        { icon: "jar", title: "Everyday ready", body: "Holds up to high-heat Indian cooking." },
      ],
      origin: "Rain-fed farms across the Deccan plateau",
      process: "Cleaned, sorted and wood-churn cold pressed in small batches",
      difference: "Small-batch pressing keeps each lot fresh rather than warehoused.",
      suggestedUses: ["Frying", "Tempering", "Pickling"],
    },
  },
  {
    slug: "bilona-ghee",
    name: "Bilona Ghee",
    sku: "REF-GHEE-500",
    status: "upcoming",
    isFeatured: false,
    priceInPaise: 0,
    mrpInPaise: 0,
    weight: 500,
    stock: 0,
    shortDescription:
      "Curd churned by hand, simmered slow. The way ghee was made before it was manufactured.",
    description: [
      "Whole milk is set to curd, hand churned to butter, then simmered slowly until the water leaves and only golden ghee remains.",
      "It is a longer method than cream-separation, and it tastes like it.",
    ].join("\n\n"),
    ingredients: "100% A2 cow milk ghee.",
    howToUse: [
      "A spoon over hot rice or dal.",
      "Everyday tempering.",
      "Sweets and festival cooking.",
    ].join("\n"),
    metaTitle: "Bilona Ghee — REFORA ORGANIC",
    metaDescription:
      "Hand-churned bilona ghee from A2 milk, simmered slow in small batches. Pure essentials, naturally sourced.",
    specifications: {
      subtitle: "Hand churned · A2 milk · 500 ml",
      range: "organic",
      category: "Ghee",
      study: "bottle",
      size: "500 ml",
      variantName: "500ml",
      badge: "Coming soon",
      benefits: [
        { icon: "leaf", title: "Bilona method", body: "Curd churned by hand, not cream separated by machine." },
        { icon: "droplet", title: "Slow simmered", body: "Low, patient heat for a clean golden grain." },
        { icon: "jar", title: "Small batch", body: "Made in quantities small enough to watch over." },
      ],
      origin: "Indigenous-breed dairies, sourced direct",
      process: "Whole milk → curd → hand-churned butter → slow simmered ghee",
      difference: "The bilona method, kept whole rather than shortened.",
      suggestedUses: ["Cooking", "Tempering", "Sweets"],
    },
  },
];

async function main() {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env.local first.");
    process.exit(1);
  }

  const forcePrices = process.argv.includes("--force-prices");
  const sql = neon(process.env.DATABASE_URL);

  console.log(`Seeding ${CATALOG.length} products…\n`);

  for (const item of CATALOG) {
    const [existing] = await sql`
      select id, price_in_paise from products where slug = ${item.slug} limit 1
    `;

    let productId;

    if (existing) {
      // Content is refreshed; commercial fields are left to the admin panel.
      await sql`
        update products set
          name               = ${item.name},
          sku                = ${item.sku},
          short_description  = ${item.shortDescription},
          description        = ${item.description},
          ingredients        = ${item.ingredients},
          how_to_use         = ${item.howToUse},
          specifications     = ${JSON.stringify(item.specifications)}::jsonb,
          meta_title         = ${item.metaTitle},
          meta_description   = ${item.metaDescription},
          weight             = ${item.weight},
          updated_at         = now()
        where id = ${existing.id}
      `;

      if (forcePrices) {
        await sql`
          update products
          set price_in_paise = ${item.priceInPaise},
              mrp_in_paise   = ${item.mrpInPaise || null},
              status         = ${item.status},
              is_featured    = ${item.isFeatured},
              updated_at     = now()
          where id = ${existing.id}
        `;
      }

      productId = existing.id;
      console.log(
        `  ~ ${item.slug} — updated content${forcePrices ? " and pricing" : " (pricing left as-is)"}`
      );
    } else {
      const [created] = await sql`
        insert into products (
          name, slug, sku, short_description, description, ingredients, how_to_use,
          specifications, price_in_paise, mrp_in_paise, weight, status, is_featured,
          meta_title, meta_description
        ) values (
          ${item.name}, ${item.slug}, ${item.sku}, ${item.shortDescription},
          ${item.description}, ${item.ingredients}, ${item.howToUse},
          ${JSON.stringify(item.specifications)}::jsonb,
          ${item.priceInPaise}, ${item.mrpInPaise || null}, ${item.weight},
          ${item.status}, ${item.isFeatured}, ${item.metaTitle}, ${item.metaDescription}
        )
        returning id
      `;
      productId = created.id;
      console.log(`  + ${item.slug} — created`);
    }

    const [stockRow] = await sql`
      select id from inventory where product_id = ${productId} limit 1
    `;
    if (!stockRow) {
      await sql`
        insert into inventory (product_id, quantity) values (${productId}, ${item.stock})
      `;
      console.log(`      stock set to ${item.stock}`);
    }
  }

  const [{ count }] = await sql`select count(*)::int as count from products`;
  console.log(`\n✓ Done. ${count} products in the database.`);
  console.log("  The storefront now reads from the database rather than catalog.ts.");
  if (!forcePrices) {
    console.log("  Re-run with --force-prices to reset prices and status to the seed values.");
  }
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
