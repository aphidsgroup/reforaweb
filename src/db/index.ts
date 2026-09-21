import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// DATABASE_URL is required at runtime. During static build it may be absent
// — pages that call db() will still work at request time on Vercel.
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@placeholder.neon.tech/neondb?sslmode=require";

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export type DB = typeof db;
