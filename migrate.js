const { neon } = require("@neondatabase/serverless");
const fs = require("fs");

const DB_URL = "postgresql://neondb_owner:npg_0DFwCeRtgl6K@ep-withered-butterfly-azdhe1sz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DB_URL);

async function main() {
  // Apply migration
  const migration = fs.readFileSync("src/db/migrations/0000_chunky_doorman.sql", "utf8");
  const statements = migration.split("-->statement-breakpoint").map((s) => s.trim()).filter(Boolean);
  
  console.log(`Applying migration...`);
  
  // Split on Drizzle's statement breakpoint marker AND semicolons
  const raw = migration
    .replace(/-->\s*statement-breakpoint/g, ";")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
  
  console.log(`Found ${raw.length} statements`);
  let ok = 0, skip = 0, err = 0;
  for (const stmt of raw) {
    try {
      await sql.query(stmt + ";");
      ok++;
      process.stdout.write(".");
    } catch (e) {
      if (e.message.includes("already exists") || e.message.includes("duplicate")) {
        skip++;
        process.stdout.write("s");
      } else {
        err++;
        console.error("\nERROR:", e.message.substring(0, 140));
      }
    }
  }
  console.log(`\nApplied: ${ok}, Skipped: ${skip}, Errors: ${err}`);
  
  // Verify tables
  const rows = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
  console.log("\n\nTables in Neon:");
  rows.forEach((r) => console.log(" -", r.table_name));
  console.log("Total:", rows.length, "tables");
}

main().catch(console.error);
