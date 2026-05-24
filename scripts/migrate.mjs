#!/usr/bin/env node
/**
 * Apply Supabase database migration
 * 
 * Usage:
 *   SUPABASE_DB_PASSWORD="your-password" node scripts/migrate.mjs
 * 
 * Get the DB password from:
 *   Supabase Dashboard → Project Settings → Database → Connection string
 *   The password is the part after "postgres://postgres:" and before "@"
 */
import pg from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = "bfernoltlgadixahvtca";
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!DB_PASSWORD) {
  console.error("Missing database password.");
  console.error("");
  console.error("1. Open Supabase Dashboard: https://supabase.com/dashboard/project/bfernoltlgadixahvtca");
  console.error("2. Go to Project Settings → Database");
  console.error("3. Copy the DB password from the Connection string");
  console.error("4. Run: SUPABASE_DB_PASSWORD='your-password' node scripts/migrate.mjs");
  process.exit(1);
}

const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`;

async function migrate() {
  const pool = new pg.Pool({ connectionString });
  const sql = readFileSync(join(__dirname, "..", "supabase", "migrations", "00001_initial_schema.sql"), "utf-8");

  console.log("Connecting to database...");
  const client = await pool.connect();

  try {
    console.log("Applying migration...");
    await client.query(sql);
    console.log("Migration applied successfully!");
    console.log("Tables created: users, courts, games, match_requests, tournaments, registrations, brackets");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
