import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sql = readFileSync(resolve(process.argv[2]), "utf-8");

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const { error } = await supabase.rpc("exec_sql", { query: sql }).maybeSingle();

  if (error && error.message.includes("function exec_sql")) {
    // fallback: run statement by statement via raw query
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      const { error: stmtErr } = await supabase.from("_sql_exec").insert({ query: stmt + ";" }).select().maybeSingle();
      if (stmtErr) {
        console.error("Statement failed:", stmt, stmtErr.message);
        process.exit(1);
      }
    }
    console.log("Migration applied (fallback)");
  } else if (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  } else {
    console.log("Migration applied successfully");
  }
}

main();
