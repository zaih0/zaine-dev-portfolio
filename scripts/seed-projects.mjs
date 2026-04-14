import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY exist in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function loadProjectsFromSeedFile() {
  const seedPath = path.resolve(process.cwd(), "supabase/projects.seed.json");
  const raw = await readFile(seedPath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("Seed file must contain a JSON array.");
  }

  return parsed;
}

async function main() {
  const projects = await loadProjectsFromSeedFile();

  if (!projects.length) {
    console.error("No projects found in supabase/projects.seed.json");
    process.exit(1);
  }

  const probe = await supabase.from("projects").select("slug").limit(1);

  if (probe.error) {
    console.error("Could not access table 'projects'.");
    console.error("Error:", probe.error.message);
    if (probe.error.message.includes("column projects.slug does not exist")) {
      console.error(
        "Your existing projects table has a different schema. Run supabase/projects_reset_schema.sql, then run this command again.",
      );
    } else {
      console.error(
        "Create it first by running SQL from supabase/projects_schema.sql in your Supabase SQL editor.",
      );
    }
    process.exit(1);
  }

  const { data, error } = await supabase
    .from("projects")
    .upsert(projects, { onConflict: "slug" })
    .select("slug,title,status,is_published");

  if (error) {
    console.error("Failed to upsert projects.");
    console.error("Error:", error.message);
    process.exit(1);
  }

  console.log("Projects upserted successfully:");
  console.table(data);
}

main().catch((error) => {
  console.error("Unexpected failure:", error);
  process.exit(1);
});
