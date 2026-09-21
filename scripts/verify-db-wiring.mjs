#!/usr/bin/env node
/**
 * Proves the storefront reads product data from the database, not catalog.ts.
 *
 *   node scripts/verify-db-wiring.mjs [baseUrl]
 *
 * Temporarily writes a distinctive price to COCOCRÈME, fetches the rendered
 * product page, asserts the new price appears, then restores the original
 * value. The restore runs in a finally block so an interrupted check still
 * puts the price back.
 *
 * Since catalog.ts and the seeded rows hold identical copy, a price change is
 * the only thing that can tell the two sources apart from the outside.
 */

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const BASE = process.argv[2] ?? "http://localhost:3000";
const SLUG = "cococreme";
const PROBE_PAISE = 12345; // ₹123.45 — appears nowhere in catalog.ts

const sql = neon(process.env.DATABASE_URL);

const fetchPage = async (path) => {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  return { status: res.status, html: await res.text() };
};

const [original] = await sql`
  select price_in_paise from products where slug = ${SLUG} limit 1
`;

if (!original) {
  console.error(`No "${SLUG}" row. Run: npm run db:seed`);
  process.exit(1);
}

console.log(`Original price : ₹${(original.price_in_paise / 100).toFixed(2)}`);

let passed = false;

try {
  await sql`
    update products set price_in_paise = ${PROBE_PAISE}, updated_at = now()
    where slug = ${SLUG}
  `;
  console.log(`Probe price    : ₹${(PROBE_PAISE / 100).toFixed(2)} written to the database`);

  // ISR holds a cached render; ask for a fresh one.
  await new Promise((r) => setTimeout(r, 1500));

  const page = await fetchPage(`/products/${SLUG}`);
  const shop = await fetchPage("/shop");

  // ₹123.45 — the rupee symbol may be HTML-escaped, so match the digits.
  const needle = /123\.45|123,45/;

  const onPdp = needle.test(page.html);
  const onShop = needle.test(shop.html);

  console.log(`\n  product page  : ${page.status} — probe price ${onPdp ? "FOUND ✓" : "not found ✗"}`);
  console.log(`  shop listing  : ${shop.status} — probe price ${onShop ? "FOUND ✓" : "not found ✗"}`);

  passed = onPdp && onShop;
} finally {
  await sql`
    update products set price_in_paise = ${original.price_in_paise}, updated_at = now()
    where slug = ${SLUG}
  `;
  console.log(`\nRestored price : ₹${(original.price_in_paise / 100).toFixed(2)}`);
}

if (passed) {
  console.log("\n✓ The storefront is reading products from the database.");
} else {
  console.log("\n✗ The storefront did not reflect the database change.");
  console.log("  If pages are cached, this can be a stale ISR render rather than bad wiring.");
  process.exit(1);
}
