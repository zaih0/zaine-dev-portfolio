"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type AdminProject = {
  slug: string;
  title: string;
  stack: string;
  status: string;
  summary: string;
  details: string;
  demo_url: string | null;
  repo_url: string | null;
  local_only_note: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
};

type AdminProjectsResponse = {
  projects?: AdminProject[];
  error?: string;
};

const emptyProject: AdminProject = {
  slug: "",
  title: "",
  stack: "",
  status: "Planned",
  summary: "",
  details: "",
  demo_url: "",
  repo_url: "",
  local_only_note: "",
  sort_order: 999,
  is_published: true,
};

function normalizeProjectInput(project: AdminProject) {
  return {
    ...project,
    demo_url: project.demo_url?.trim() || null,
    repo_url: project.repo_url?.trim() || null,
    local_only_note: project.local_only_note?.trim() || null,
    slug: project.slug.trim(),
    title: project.title.trim(),
    stack: project.stack.trim(),
    status: project.status.trim(),
    summary: project.summary.trim(),
    details: project.details.trim(),
  };
}

export default function AdminPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [editorProject, setEditorProject] = useState<AdminProject>(emptyProject);
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isEditing = selectedSlug !== null;

  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    setError("");

    try {
      const response = await fetch("/api/admin/projects", {
        method: "GET",
        credentials: "include",
      });

      const data = (await response.json()) as AdminProjectsResponse;

      if (response.status === 401) {
        setIsLoggedIn(false);
        setProjects([]);
        setSelectedSlug(null);
        setEditorProject(emptyProject);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load projects.");
      }

      const loadedProjects = data.projects ?? [];
      setProjects(loadedProjects);
      setIsLoggedIn(true);

      setSelectedSlug((currentSelectedSlug) => {
        if (!currentSelectedSlug) {
          return currentSelectedSlug;
        }

        const current = loadedProjects.find(
          (project) => project.slug === currentSelectedSlug,
        );

        if (current) {
          setEditorProject(current);
          return currentSelectedSlug;
        }

        setEditorProject(emptyProject);
        return null;
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load projects.",
      );
    } finally {
      setIsLoadingProjects(false);
      setIsCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to log in.");
      }

      setLoginPassword("");
      setMessage("Logged in successfully.");
      setIsLoggedIn(true);
      await fetchProjects();
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Failed to log in.",
      );
    }
  }

  async function handleLogout() {
    setError("");
    setMessage("");

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsLoggedIn(false);
      setProjects([]);
      setSelectedSlug(null);
      setEditorProject(emptyProject);
      setMessage("Logged out.");
    }
  }

  function startCreating() {
    setSelectedSlug(null);
    setEditorProject(emptyProject);
    setError("");
    setMessage("");
    setIsModalOpen(true);
  }

  function startEditing(project: AdminProject) {
    setSelectedSlug(project.slug);
    setEditorProject(project);
    setError("");
    setMessage("");
    setIsModalOpen(true);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = normalizeProjectInput(editorProject);

    if (!payload.slug || !payload.title) {
      setError("Project slug and title are required.");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const endpoint = isEditing
        ? `/api/admin/projects/${encodeURIComponent(selectedSlug ?? "")}`
        : "/api/admin/projects";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        project?: AdminProject;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save project.");
      }

      setMessage(isEditing ? "Project updated." : "Project created.");
      setIsModalOpen(false);
      setSelectedSlug(null);
      await fetchProjects();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save project.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSeedDefaults() {
    const confirmed = window.confirm(
      "This will import the default fallback projects into Supabase as unpublished drafts. Projects that already exist (by slug) will be skipped. Continue?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
        credentials: "include",
      });

      const data = (await response.json()) as {
        imported?: number;
        total?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to seed projects.");
      }

      setMessage(
        `Imported ${data.imported ?? 0} of ${data.total ?? 0} default projects. Already-existing slugs were skipped.`,
      );
      await fetchProjects();
    } catch (seedError) {
      setError(
        seedError instanceof Error ? seedError.message : "Failed to seed projects.",
      );
    }
  }

  async function handleDelete(slug: string) {
    const confirmed = window.confirm(
      `Delete project "${slug}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete project.");
      }

      setSelectedSlug(null);
      setEditorProject(emptyProject);
      setIsModalOpen(false);
      setMessage("Project deleted.");
      await fetchProjects();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete project.",
      );
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedSlug(null);
    setEditorProject(emptyProject);
    setError("");
  }

  return (
    <div className="min-h-screen bg-[var(--vsc-bg)] text-[var(--vsc-text)]">
      {/* ── Edit / Create modal ── */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 pt-12">
          {/* Invisible backdrop button to close modal on outside click */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={closeModal}
            className="fixed inset-0 -z-10 h-full w-full cursor-default"
          />
          <div className="w-full max-w-2xl border border-[var(--vsc-border)] bg-[var(--vsc-panel)]">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[var(--vsc-border)] px-5 py-3">
              <h2 className="font-semibold text-white">
                {isEditing
                  ? `Editing: ${editorProject.title || selectedSlug}`
                  : "New project"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-lg leading-none text-[var(--vsc-muted)] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal error */}
            {error ? (
              <div className="mx-5 mt-4 border border-[var(--vsc-string)] bg-[var(--vsc-bg)] p-3 text-sm text-[var(--vsc-string)]">
                {error}
              </div>
            ) : null}

            {/* Modal form */}
            <form onSubmit={handleSave} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="project-slug" className="text-xs text-[var(--vsc-muted)]">
                    Slug
                  </label>
                  <input
                    id="project-slug"
                    value={editorProject.slug}
                    onChange={(e) =>
                      setEditorProject((c) => ({ ...c, slug: e.target.value }))
                    }
                    placeholder="my-project"
                    className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="project-title" className="text-xs text-[var(--vsc-muted)]">
                    Title
                  </label>
                  <input
                    id="project-title"
                    value={editorProject.title}
                    onChange={(e) =>
                      setEditorProject((c) => ({ ...c, title: e.target.value }))
                    }
                    placeholder="My Project"
                    className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="project-status" className="text-xs text-[var(--vsc-muted)]">
                    Status
                  </label>
                  <select
                    id="project-status"
                    value={editorProject.status}
                    onChange={(e) =>
                      setEditorProject((c) => ({ ...c, status: e.target.value }))
                    }
                    className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Live">Live</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="project-sort-order" className="text-xs text-[var(--vsc-muted)]">
                    Sort order
                  </label>
                  <input
                    id="project-sort-order"
                    type="number"
                    value={editorProject.sort_order}
                    onChange={(e) =>
                      setEditorProject((c) => ({
                        ...c,
                        sort_order: Number(e.target.value || 999),
                      }))
                    }
                    className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="project-stack" className="text-xs text-[var(--vsc-muted)]">
                  Stack
                </label>
                <input
                  id="project-stack"
                  value={editorProject.stack}
                  onChange={(e) =>
                    setEditorProject((c) => ({ ...c, stack: e.target.value }))
                  }
                  placeholder="Next.js · Tailwind CSS · Supabase"
                  className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="project-summary" className="text-xs text-[var(--vsc-muted)]">
                  Summary
                </label>
                <textarea
                  id="project-summary"
                  rows={3}
                  value={editorProject.summary}
                  onChange={(e) =>
                    setEditorProject((c) => ({ ...c, summary: e.target.value }))
                  }
                  className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="project-details" className="text-xs text-[var(--vsc-muted)]">
                  Details
                </label>
                <textarea
                  id="project-details"
                  rows={5}
                  value={editorProject.details}
                  onChange={(e) =>
                    setEditorProject((c) => ({ ...c, details: e.target.value }))
                  }
                  className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="project-demo-url" className="text-xs text-[var(--vsc-muted)]">
                    Demo URL
                  </label>
                  <input
                    id="project-demo-url"
                    value={editorProject.demo_url ?? ""}
                    onChange={(e) =>
                      setEditorProject((c) => ({ ...c, demo_url: e.target.value }))
                    }
                    placeholder="https://..."
                    className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label htmlFor="project-repo-url" className="text-xs text-[var(--vsc-muted)]">
                    Repo URL
                  </label>
                  <input
                    id="project-repo-url"
                    value={editorProject.repo_url ?? ""}
                    onChange={(e) =>
                      setEditorProject((c) => ({ ...c, repo_url: e.target.value }))
                    }
                    placeholder="https://github.com/..."
                    className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="project-local-note" className="text-xs text-[var(--vsc-muted)]">
                  Local only note
                </label>
                <textarea
                  id="project-local-note"
                  rows={2}
                  value={editorProject.local_only_note ?? ""}
                  onChange={(e) =>
                    setEditorProject((c) => ({ ...c, local_only_note: e.target.value }))
                  }
                  className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm text-white"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={editorProject.is_published}
                  onChange={(e) =>
                    setEditorProject((c) => ({ ...c, is_published: e.target.checked }))
                  }
                />
                Published
              </label>

              {/* Modal footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--vsc-border)] pt-4">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="border border-[var(--vsc-accent)] px-4 py-2 text-sm text-[var(--vsc-accent)] hover:bg-[var(--vsc-accent)] hover:text-[var(--vsc-bg)] disabled:opacity-60"
                  >
                    {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create project"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="border border-[var(--vsc-border)] px-4 py-2 text-sm text-white hover:bg-[var(--vsc-bg)]"
                  >
                    Cancel
                  </button>
                </div>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => void handleDelete(selectedSlug ?? "")}
                    className="border border-[var(--vsc-string)] px-4 py-2 text-sm text-[var(--vsc-string)] hover:bg-[var(--vsc-string)] hover:text-[var(--vsc-bg)]"
                  >
                    Delete project
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* ── Main page ── */}
      <main className="mx-auto w-full max-w-5xl p-6 md:p-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-block border border-[var(--vsc-border)] px-3 py-1 font-mono text-xs text-[var(--vsc-accent)] hover:bg-[var(--vsc-panel)]"
          >
            ← Back to portfolio
          </Link>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="border border-[var(--vsc-border)] px-3 py-1 text-xs text-white hover:bg-[var(--vsc-panel)]"
            >
              Log out
            </button>
          ) : null}
        </div>

        <article className="border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-5 md:p-8">
          <p className="font-mono text-xs text-[var(--vsc-accent)]">{"// admin.ts"}</p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">Admin panel</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--vsc-muted)]">
            Click any project row to edit it. Use the buttons above the table to add or import projects.
          </p>

          {/* Success message (shown on main page, outside modal) */}
          {message ? (
            <div className="mt-5 border border-[var(--vsc-comment)] bg-[var(--vsc-bg)] p-3 text-sm text-[var(--vsc-comment)]">
              {message}
            </div>
          ) : null}

          {/* Errors outside modal (e.g. seed errors) */}
          {error && !isModalOpen ? (
            <div className="mt-5 border border-[var(--vsc-string)] bg-[var(--vsc-bg)] p-3 text-sm text-[var(--vsc-string)]">
              {error}
            </div>
          ) : null}

          {isCheckingSession ? (
            <p className="mt-6 text-sm text-[var(--vsc-muted)]">Checking session…</p>
          ) : null}

          {/* Login form */}
          {!isCheckingSession && !isLoggedIn ? (
            <form onSubmit={handleLogin} className="mt-6 max-w-md space-y-4">
              <div>
                <label htmlFor="admin-username" className="text-sm text-white">
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="text-sm text-white">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1 w-full border border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-3 py-2 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="border border-[var(--vsc-accent)] px-4 py-2 text-sm text-[var(--vsc-accent)] hover:bg-[var(--vsc-accent)] hover:text-[var(--vsc-bg)]"
              >
                Log in
              </button>
            </form>
          ) : null}

          {/* Projects table */}
          {!isCheckingSession && isLoggedIn ? (
            <div className="mt-8">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-white">Projects</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSeedDefaults}
                    className="border border-[var(--vsc-border)] px-3 py-1 text-xs text-[var(--vsc-muted)] hover:bg-[var(--vsc-bg)]"
                    title="Import hardcoded fallback projects into Supabase as unpublished drafts"
                  >
                    ↓ Import defaults
                  </button>
                  <button
                    type="button"
                    onClick={startCreating}
                    className="border border-[var(--vsc-accent)] px-3 py-1 text-xs text-[var(--vsc-accent)] hover:bg-[var(--vsc-accent)] hover:text-[var(--vsc-bg)]"
                  >
                    + New project
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-[var(--vsc-border)]">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead className="bg-[var(--vsc-bg)] text-xs text-[var(--vsc-muted)]">
                    <tr>
                      <th className="border-b border-[var(--vsc-border)] px-3 py-2 font-medium">Title</th>
                      <th className="border-b border-[var(--vsc-border)] px-3 py-2 font-medium">Status</th>
                      <th className="border-b border-[var(--vsc-border)] px-3 py-2 font-medium hidden sm:table-cell">Stack</th>
                      <th className="border-b border-[var(--vsc-border)] px-3 py-2 font-medium">Pub</th>
                      <th className="border-b border-[var(--vsc-border)] px-3 py-2 font-medium">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingProjects ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-[var(--vsc-muted)]">
                          Loading…
                        </td>
                      </tr>
                    ) : null}

                    {!isLoadingProjects && !projects.length ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-[var(--vsc-muted)]">
                          No projects found. Import defaults or create one.
                        </td>
                      </tr>
                    ) : null}

                    {projects.map((project) => (
                      <tr
                        key={project.slug}
                        onClick={() => startEditing(project)}
                        className="cursor-pointer transition-colors hover:bg-[var(--vsc-bg)]"
                      >
                        <td className="border-b border-[var(--vsc-border)] px-3 py-2">
                          <span className="font-medium text-white">{project.title}</span>
                          <span className="block font-mono text-xs text-[var(--vsc-muted)]">
                            {project.slug}
                          </span>
                        </td>
                        <td className="border-b border-[var(--vsc-border)] px-3 py-2 text-[var(--vsc-muted)]">
                          {project.status}
                        </td>
                        <td className="border-b border-[var(--vsc-border)] px-3 py-2 text-[var(--vsc-muted)] hidden sm:table-cell">
                          <span className="block max-w-[180px] truncate text-xs">
                            {project.stack}
                          </span>
                        </td>
                        <td className="border-b border-[var(--vsc-border)] px-3 py-2">
                          <span
                            className={
                              project.is_published
                                ? "text-[var(--vsc-comment)]"
                                : "text-[var(--vsc-muted)]"
                            }
                          >
                            {project.is_published ? "Yes" : "No"}
                          </span>
                        </td>
                        {/* Stop row click from triggering when hitting Delete */}
                        <td
                          className="border-b border-[var(--vsc-border)] px-3 py-2"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => void handleDelete(project.slug)}
                            className="border border-[var(--vsc-string)] px-2 py-1 text-xs text-[var(--vsc-string)] hover:bg-[var(--vsc-string)] hover:text-[var(--vsc-bg)]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-[var(--vsc-muted)]">
                Click any row to open the editor.
              </p>
            </div>
          ) : null}
        </article>
      </main>
    </div>
  );
}
