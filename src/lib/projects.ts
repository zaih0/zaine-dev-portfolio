import { unstable_cache } from "next/cache";
import { getSupabaseServiceClient } from "@/lib/supabase";

export type LocalRunConfig = {
  repoSubdir: string;
  branch: string;
  installCommand: string;
  devCommand: string;
  note?: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  stack: string;
  status: string;
  summary: string;
  details: string;
  demoUrl: string | null;
  repoUrl: string | null;
  localOnlyNote: string | null;
  sortOrder: number;
  localRun: LocalRunConfig | null;
};

const localRunConfigBySlug: Record<string, LocalRunConfig> = {
  "Exten-project": {
    repoSubdir: "kunstkwartiertje",
    branch: "main",
    installCommand: "npm install",
    devCommand: "npm run dev",
    note: "Make sure your .env.local is set before starting the app.",
  },
};

const demoUrlBySlug: Record<string, string> = {
  "Exten-project": "https://exten-project.vercel.app",
};

export const fallbackProjects: PortfolioProject[] = [
  {
    slug: "ai-workflow-engine",
    title: "AI Workflow Engine",
    stack: "Next.js · TypeScript · Supabase",
    status: "In Progress",
    summary:
      "A visual tool that lets teams build and run automated workflows — no coding needed.",
    details:
      "This project helps teams automate repeat tasks with reusable AI workflows, human approval steps, and activity logs.",
    demoUrl: null,
    repoUrl: null,
    localOnlyNote:
      "Private local project. Live demo is not public yet, but a full walkthrough can be provided.",
    sortOrder: 1,
    localRun: null,
  },
  {
    slug: "developer-analytics-kit",
    title: "Analytics Dashboard",
    stack: "React · PostgreSQL · Chart.js",
    status: "Planned",
    summary:
      "A personal dashboard for tracking work habits, goals, and progress over time.",
    details:
      "Designed to make progress visible with clean charts, focus trends, and week-over-week performance snapshots.",
    demoUrl: null,
    repoUrl: null,
    localOnlyNote:
      "Not deployed yet. Currently running as a local development build.",
    sortOrder: 2,
    localRun: null,
  },
  {
    slug: "portfolio-v2",
    title: "This Portfolio",
    stack: "Next.js · Tailwind CSS · Docker",
    status: "Live",
    summary:
      "A fast, fully editable portfolio site — the one you're looking at right now.",
    details:
      "Built with a code-editor aesthetic and ready for Supabase-backed project content.",
    demoUrl: null,
    repoUrl: null,
    localOnlyNote: null,
    sortOrder: 3,
    localRun: null,
  },
];

function mapProjectRow(row: Record<string, unknown>): PortfolioProject {
  const slug = String(row.slug ?? "");
  const localRun = localRunConfigBySlug[slug] ?? null;
  const repoUrl = row.repo_url ? String(row.repo_url) : null;
  const demoUrl = demoUrlBySlug[slug] ?? (row.demo_url ? String(row.demo_url) : null);

  return {
    slug,
    title: String(row.title ?? "Untitled Project"),
    stack: String(row.stack ?? ""),
    status: String(row.status ?? "Planned"),
    summary: String(row.summary ?? ""),
    details: String(row.details ?? row.summary ?? ""),
    demoUrl,
    repoUrl,
    localOnlyNote: row.local_only_note ? String(row.local_only_note) : null,
    sortOrder: Number(row.sort_order ?? 999),
    localRun,
  };
}

const getProjectsUncached = async (): Promise<PortfolioProject[]> => {
  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "slug,title,stack,status,summary,details,demo_url,repo_url,local_only_note,sort_order,is_published",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return fallbackProjects;
    }

    return data.map((row) => mapProjectRow(row as Record<string, unknown>));
  } catch {
    return fallbackProjects;
  }
};

const getProjectsCached = unstable_cache(
  getProjectsUncached,
  ["projects-list"],
  {
    revalidate: 300,
    tags: ["projects"],
  },
);

export async function getProjects(): Promise<PortfolioProject[]> {
  return getProjectsCached();
}

export async function getProjectBySlug(
  slug: string,
): Promise<PortfolioProject | null> {
  const projects = await getProjectsCached();
  return projects.find((project) => project.slug === slug) ?? null;
}
