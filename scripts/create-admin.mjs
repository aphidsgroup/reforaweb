#!/usr/bin/env node
/**
 * Creates or updates a REFORA admin user.
 *
 *   node scripts/create-admin.mjs "you@refora.in" "Your Name" super_admin
 *
 * The password is read from stdin rather than argv so it never lands in your
 * shell history or the process list. Re-running for an existing email resets
 * that user's password.
 */

import { createInterface } from "node:readline";
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

/* Load .env.local without a dependency. */
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
    // No .env.local — fall back to the ambient environment.
  }
}

/** Must stay byte-identical to hashPassword() in src/lib/admin-auth.ts. */
function hashPassword(password) {
  const N = 16384,
    r = 8,
    p = 1;
  const salt = randomBytes(16);
  const hash = scryptSync(password.normalize("NFKC"), salt, 64, { N, r, p });
  return ["scrypt", N, r, p, salt.toString("base64url"), hash.toString("base64url")].join("$");
}

function prompt(question, { mask = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (mask) {
      // Suppress echo so the password is not shown as it is typed.
      const onData = (char) => {
        if (["\n", "\r", ""].includes(char.toString())) {
          process.stdin.removeListener("data", onData);
          return;
        }
        process.stdout.write("[2K[200D" + question + "*".repeat(rl.line.length));
      };
      process.stdin.on("data", onData);
    }
    rl.question(question, (answer) => {
      rl.close();
      if (mask) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function main() {
  loadEnv();

  const [email, name, role = "super_admin"] = process.argv.slice(2);

  if (!email || !name) {
    console.error('Usage: node scripts/create-admin.mjs "you@refora.in" "Your Name" [role]');
    process.exit(1);
  }
  if (!["super_admin", "admin", "staff"].includes(role)) {
    console.error(`Unknown role "${role}". Use super_admin, admin or staff.`);
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env.local first.");
    process.exit(1);
  }

  const password = await prompt("Password (min 12 chars): ", { mask: true });
  if (password.length < 12) {
    console.error("\nToo short — use at least 12 characters.");
    process.exit(1);
  }
  const confirm = await prompt("Confirm password: ", { mask: true });
  if (password !== confirm) {
    console.error("\nPasswords did not match.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const passwordHash = hashPassword(password);
  const normalisedEmail = email.trim().toLowerCase();

  const [row] = await sql`
    insert into admin_users (email, password_hash, name, role, is_active)
    values (${normalisedEmail}, ${passwordHash}, ${name}, ${role}, true)
    on conflict (email) do update
      set password_hash = excluded.password_hash,
          name          = excluded.name,
          role          = excluded.role,
          is_active     = true
    returning id, email, role
  `;

  console.log(`\n✓ Admin ready: ${row.email} (${row.role})`);
  console.log("  Sign in at /admin/login");
}

main().catch((error) => {
  console.error("\nFailed:", error.message);
  process.exit(1);
});
