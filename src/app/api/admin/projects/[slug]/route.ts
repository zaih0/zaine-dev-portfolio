import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAdminAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { slug } = await context.params;
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

    const payload: Record<string, unknown> = {
      slug: body.slug?.trim() || slug,
      title: body.title?.trim() ?? "Untitled Project",
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

    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("slug", slug)
      .select(
        "slug,title,stack,status,summary,details,demo_url,repo_url,local_only_note,sort_order,is_published,created_at",
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({ project: data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update project.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAdminAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { slug } = await context.params;
    const supabase = getSupabaseServiceClient();

    const { error } = await supabase.from("projects").delete().eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete project.",
      },
      { status: 500 },
    );
  }
}
