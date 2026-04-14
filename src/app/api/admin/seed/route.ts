import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { fallbackProjects } from "@/lib/projects";
import { getSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServiceClient();

    const payload = fallbackProjects.map((project) => ({
      slug: project.slug,
      title: project.title,
      stack: project.stack,
      status: project.status,
      summary: project.summary,
      details: project.details,
      demo_url: project.demoUrl,
      repo_url: project.repoUrl,
      local_only_note: project.localOnlyNote,
      sort_order: project.sortOrder,
      is_published: false,
    }));

    // Insert only new rows — skip any slug already in Supabase
    const { data, error } = await supabase
      .from("projects")
      .upsert(payload, { onConflict: "slug", ignoreDuplicates: true })
      .select("slug");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({
      imported: data?.length ?? 0,
      total: payload.length,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to seed projects.",
      },
      { status: 500 },
    );
  }
}
