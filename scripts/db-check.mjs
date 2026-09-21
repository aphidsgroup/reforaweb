#!/usr/bin/env node
/**
 * Read-only environment and database health check.
 *
 *   npm run db:check
 *
 * Answers the questions that actually block an admin sign-in: is the database
 * reachable, have the migrations run, does an admin account exist, and is
 * AUTH_SECRET long enough to sign a session.
 *
 * Reads .env.local itself and never prints a secret — only whether one is set
 * and how long it is. Performs SELECTs only; it changes nothing.
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
    console.log("No .env.local found — using the ambient environment.\n");
  }
}

const tick = (ok) => (ok ? "✓" : "✗");

async function main() {
  loadEnv();

  const authSecret = process.env.AUTH_SECRET ?? "";
  const secretOk = authSecret.length >= 16;

  console.log("Environment");
  console.log(`  ${tick(Boolean(process.env.DATABASE_URL))} DATABASE_URL`);
  console.log(
    `  ${tick(secretOk)} AUTH_SECRET${
      authSecret ? ` (${authSecret.length} chars)` : " — missing"
    }`
  );
  if (authSecret && !secretOk) {
    console.log("      Too short. Admin sessions cannot be signed with fewer than 16 chars.");
  }

  if (!process.env.DATABASE_URL) {
    console.log("\nCannot check the database without DATABASE_URL.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public'
  `;
  const names = new Set(tables.map((t) => t.table_name));

  console.log("\nDatabase");
  console.log(`  ✓ reachable — ${names.size} tables in public`);

  const required = ["products", "orders", "customers", "discounts", "admin_users", "inventory"];
  const missing = required.filter((t) => !names.has(t));

  for (const table of required) {
    console.log(`  ${tick(names.has(table))} ${table}`);
  }

  if (missing.length) {
    console.log(`\n→ Migrations look incomplete. Run: npm run db:migrate`);
    process.exit(1);
  }

  const [{ count: admins }] = await sql`select count(*)::int as count from admin_users`;
  const [{ count: productCount }] = await sql`select count(*)::int as count from products`;
  const [{ count: orderCount }] = await sql`select count(*)::int as count from orders`;

  console.log("\nContents");
  console.log(`  admin accounts : ${admins}`);
  console.log(`  products       : ${productCount}`);
  console.log(`  orders         : ${orderCount}`);

  if (admins === 0) {
    console.log(
      '\n→ No admin account yet. Run:\n  node scripts/create-admin.mjs "you@refora.in" "Your Name" super_admin'
    );
  } else {
    console.log("\n→ Ready. Sign in at /admin/login");
  }
}

main().catch((error) => {
  console.error("\nCheck failed:", error.message);
  process.exit(1);
});
