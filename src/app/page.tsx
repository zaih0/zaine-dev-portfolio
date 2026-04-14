import Link from "next/link";
import { getProjects } from "@/lib/projects";

export const revalidate = 300;

const statusColor: Record<string, string> = {
  "In Progress": "text-[var(--vsc-keyword)]",
  Planned: "text-[var(--vsc-muted)]",
  Live: "text-[var(--vsc-comment)]",
};

const navItems = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const services = [
  {
    label: "Web Applications",
    desc: "Full-stack apps built to perform and scale.",
  },
  {
    label: "Automation",
    desc: "Cut down repetitive work with smart, custom tooling.",
  },
  {
    label: "Dashboards & Data",
    desc: "Visualise the numbers that actually matter.",
  },
  {
    label: "AI Integration",
    desc: "Add practical AI features that genuinely help users.",
  },
];

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--vsc-bg)] text-[var(--vsc-text)]">
      {/* Title bar */}
      <header className="editor-topbar flex shrink-0 items-center gap-3 border-b border-[var(--vsc-border)] px-4 py-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="hidden font-mono text-xs text-[var(--vsc-muted)] sm:block">
          ~/zaine-dev
        </span>
        <nav className="ml-auto flex items-center">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1 text-xs text-[var(--vsc-muted)] transition-colors hover:text-[var(--vsc-text)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar — desktop only */}
        <aside className="hidden w-52 shrink-0 flex-col border-r border-[var(--vsc-border)] bg-[var(--vsc-sidebar)] lg:flex">
          <p className="border-b border-[var(--vsc-border)] px-4 py-3 text-[10px] font-semibold tracking-widest text-[var(--vsc-muted)] uppercase">
            Navigation
          </p>
          <ul className="flex-1">
            {[
              { file: "about.md", href: "#about", active: true },
              { file: "projects.json", href: "#projects", active: false },
              { file: "contact.ts", href: "#contact", active: false },
            ].map((item) => (
              <li key={item.file}>
                <a
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors hover:bg-[var(--vsc-panel)] ${
                    item.active
                      ? "bg-[var(--vsc-panel)] text-[var(--vsc-text)]"
                      : "text-[var(--vsc-muted)]"
                  }`}
                >
                  <span className="text-[var(--vsc-accent)]">›</span>
                  {item.file}
                </a>
              </li>
            ))}
          </ul>
          <p className="border-t border-[var(--vsc-border)] px-4 py-3 text-[10px] text-[var(--vsc-muted)]">
            <span className="text-[var(--vsc-comment)]">●</span> Git: main
          </p>
        </aside>

        {/* Main editor area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex shrink-0 overflow-x-auto border-b border-[var(--vsc-border)] bg-[var(--vsc-tab)] text-xs">
            <div className="flex shrink-0 items-center gap-2 border-r border-[var(--vsc-border)] bg-[var(--vsc-bg)] px-4 py-2 text-[var(--vsc-text)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--vsc-accent)]" />
              about.md
            </div>
            <div className="flex shrink-0 items-center gap-2 border-r border-[var(--vsc-border)] px-4 py-2 text-[var(--vsc-muted)]">
              projects.json
            </div>
            <div className="flex shrink-0 items-center gap-2 px-4 py-2 text-[var(--vsc-muted)]">
              contact.ts
            </div>
          </div>

          {/* Two-panel content */}
          <div className="flex min-h-0 flex-1 flex-col overflow-auto xl:flex-row xl:overflow-hidden">
            {/* Left: About */}
            <section id="about" className="overflow-auto p-6 xl:flex-1 xl:p-10">
              <div className="max-w-xl space-y-8">
                <div>
                  <p className="mb-3 font-mono text-xs text-[var(--vsc-comment)]">
                    {"// about.md"}
                  </p>
                  <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                    Hi, I'm Zaine.
                  </h1>
                  <p className="mt-4 text-lg leading-8 text-[var(--vsc-text)]">
                    I'm a full-stack developer who builds clean, fast web apps
                    and tools. My work focuses on making things simple to use,
                    easy to maintain, and enjoyable to work with.
                  </p>
                  <p className="mt-3 text-base leading-7 text-[var(--vsc-muted)]">
                    Whether you need a product built from scratch, an existing
                    app improved, or a process automated — I can help you ship
                    it.
                  </p>
                </div>

                <div>
                  <h2 className="mb-4 text-lg font-semibold text-white">
                    What I can help with
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {services.map((item) => (
                      <div
                        key={item.label}
                        className="border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-4"
                      >
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-sm text-[var(--vsc-muted)]">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="contact">
                  <h2 className="mb-3 text-lg font-semibold text-white">
                    Get in touch
                  </h2>
                  <p className="text-base leading-7 text-[var(--vsc-text)]">
                    Open to freelance work, collaborations, and full-time
                    opportunities. Reach out and let's talk.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-block border border-[var(--vsc-accent)] px-5 py-2.5 text-sm font-medium text-[var(--vsc-accent)] transition-colors hover:bg-[var(--vsc-accent)] hover:text-[var(--vsc-bg)]"
                  >
                    Say hello →
                  </Link>
                </div>
              </div>
            </section>

            {/* Right: Projects */}
            <aside
              id="projects"
              className="shrink-0 border-t border-[var(--vsc-border)] p-6 xl:w-[400px] xl:overflow-auto xl:border-l xl:border-t-0"
            >
              <p className="mb-1 font-mono text-xs text-[var(--vsc-accent)]">
                {"// projects.json"}
              </p>
              <h2 className="mb-5 text-lg font-semibold text-white">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="block border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-4 transition-colors hover:bg-[var(--vsc-tab)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white">
                        {project.title}
                      </h3>
                      <span
                        className={`shrink-0 font-mono text-xs ${
                          statusColor[project.status] ??
                          "text-[var(--vsc-muted)]"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--vsc-muted)]">
                      {project.stack}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--vsc-text)]">
                      {project.summary}
                    </p>
                    <p className="mt-3 font-mono text-xs text-[var(--vsc-accent)]">
                      Open project details →
                    </p>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <footer className="flex shrink-0 items-center justify-between border-t border-[var(--vsc-border)] bg-[var(--vsc-accent)] px-4 py-1 font-mono text-[10px] text-[var(--vsc-bg)]">
        <span>⎇ main</span>
        <span>Full-Stack Developer · Open to Work</span>
        <span>UTF-8</span>
      </footer>
    </div>
  );
}
