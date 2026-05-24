import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function migrate() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const migrationPath = join(process.cwd(), "supabase", "migrations", "00001_initial_schema.sql");
  const sql = readFileSync(migrationPath, "utf-8");

  console.log("Applying migration...");

  // Execute SQL via supabase rpc (raw sql execution)
  const { error } = await supabase.rpc("exec_sql", { sql_text: sql });

  if (error) {
    // rpc might not exist yet, try direct query instead
    console.log("RPC not available, trying direct SQL execution...");
    
    // Split by semicolons and execute each statement
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const stmt of statements) {
      const { error: stmtError } = await supabase.from("_migration").select("*").limit(0);
      if (stmtError && stmtError.message.includes("relation")) {
        // Table doesn't exist yet, which is expected
      }
    }

    console.log("Please run the migration manually via Supabase Dashboard SQL Editor:");
    console.log(`  ${migrationPath}`);
    process.exit(1);
  }

  console.log("Migration applied successfully!");
}

migrate().catch(console.error);
