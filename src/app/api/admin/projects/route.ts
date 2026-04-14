import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "slug,title,stack,status,summary,details,demo_url,repo_url,local_only_note,sort_order,is_published,created_at",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load projects.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = (await request.json()) as {
      slug?: string;
      title?: string;
      stack?: string;
      status?: string;
      summary?: string;
      details?: string;
      demo_url?: string | null;
      repo_url?: string | null;
      local_only_note?: string | null;
      sort_order?: number;
      is_published?: boolean;
    };

    const slug = body.slug?.trim();
    const title = body.title?.trim();

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Project slug and title are required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServiceClient();
    const payload = {
      slug,
      title,
      stack: body.stack?.trim() ?? "",
      status: body.status?.trim() ?? "Planned",
      summary: body.summary?.trim() ?? "",
      details: body.details?.trim() ?? "",
      demo_url: body.demo_url?.trim() || null,
      repo_url: body.repo_url?.trim() || null,
      local_only_note: body.local_only_note?.trim() || null,
      sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 999,
      is_published: body.is_published ?? true,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select(
        "slug,title,stack,status,summary,details,demo_url,repo_url,local_only_note,sort_order,is_published,created_at",
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create project.",
      },
      { status: 500 },
    );
  }
}
