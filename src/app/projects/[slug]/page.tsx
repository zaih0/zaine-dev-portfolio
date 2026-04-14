import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/projects";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

function toGitHubFolderUrl(
  repoUrl: string | null,
  folderName: string,
  branch = "main",
): string | null {
  if (!repoUrl || !repoUrl.includes("github.com")) {
    return null;
  }

  return `${repoUrl.replace(/\/$/, "")}/tree/${branch}/${encodeURIComponent(folderName)}`;
}

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const repoFolderName =
    project.slug === "Exten-project" ? "kunstkwartiertje" : project.title;
  const githubFolderUrl = toGitHubFolderUrl(project.repoUrl, repoFolderName);
  const isGameProject =
    /game/i.test(project.title) || /pygame|python game/i.test(project.stack);

  return (
    <div className="min-h-screen bg-[var(--vsc-bg)] text-[var(--vsc-text)]">
      <main className="mx-auto w-full max-w-4xl p-6 md:p-10">
        <Link
          href="/"
          className="mb-8 inline-block border border-[var(--vsc-border)] px-3 py-1 font-mono text-xs text-[var(--vsc-accent)] hover:bg-[var(--vsc-panel)]"
        >
          ← Back to portfolio
        </Link>

        <article className="border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-5 md:p-8">
          <p className="font-mono text-xs text-[var(--vsc-muted)]">
            project.md
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            {project.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--vsc-muted)]">
            {project.stack}
          </p>

          <div className="mt-6 space-y-4 text-base leading-7">
            <p>{project.summary}</p>
            <p>{project.details}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-[var(--vsc-accent)] px-4 py-2 text-sm text-[var(--vsc-accent)] hover:bg-[var(--vsc-accent)] hover:text-[var(--vsc-bg)]"
              >
                {isGameProject ? "Play game" : "Open live demo"}
              </a>
            ) : null}

            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-[var(--vsc-border)] px-4 py-2 text-sm text-white hover:bg-[var(--vsc-bg)]"
              >
                View code
              </a>
            ) : null}
            {!project.demoUrl && githubFolderUrl ? (
              <a
                href={githubFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-[var(--vsc-border)] px-4 py-2 text-sm text-white hover:bg-[var(--vsc-bg)]"
              >
                Open project folder
              </a>
            ) : null}
          </div>

          {!project.demoUrl ? (
            <div className="mt-6 border border-[var(--vsc-border)] bg-[var(--vsc-bg)] p-4 text-sm leading-6">
              <p className="font-semibold text-white">
                Not publicly hosted yet
              </p>
              <p className="mt-1 text-[var(--vsc-muted)]">
                {project.localOnlyNote ??
                  "This project currently runs locally. A hosted demo link will be added soon."}
              </p>

              {project.repoUrl ? (
                <div className="mt-4 border-t border-[var(--vsc-border)] pt-4">
                  <p className="font-semibold text-white">How to run it</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-[var(--vsc-muted)]">
                    <li>
                      Open the repository and go to the {repoFolderName} folder.
                    </li>
                    <li>Install dependencies.</li>
                    <li>Create the env file with Supabase keys.</li>
                    <li>Run the app and open localhost.</li>
                  </ol>
                </div>
              ) : null}
            </div>
          ) : null}
        </article>
      </main>
    </div>
  );
}
