// Run a SQL migration file against the Supabase database
// Usage: node scripts/apply-migration.mjs supabase/migrations/00002_notifications.sql

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const sql = readFileSync(process.argv[2], "utf-8");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: "public" },
});

async function run() {
  // Try via exec_sql RPC (available on Supabase projects with the SQL enabling extension)
  const { error } = await supabase.rpc("exec_sql", { sql }).maybeSingle();
  if (!error) {
    console.log("Migration applied via exec_sql RPC");
    return;
  }

  // Fallback: try via raw SQL query on the REST API
  // PostgREST supports raw SQL via the /rest/v1/rpc/ endpoint when using service_role
  const url = `${supabaseUrl}/rest/v1/rpc/`;
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({ sql: stmt + ";" }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Statement failed:\n  ${stmt.slice(0, 80)}...\n  ${text}`);
      process.exit(1);
    }
  }

  console.log("Migration applied via REST API");
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
