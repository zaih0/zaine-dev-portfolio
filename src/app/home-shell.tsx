"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { PortfolioProject } from "@/lib/projects";

type HomeShellProps = {
  projects: PortfolioProject[];
};

type TabKey = "about" | "projects" | "contact";

const statusColor: Record<string, string> = {
  "In Progress": "text-[var(--vsc-keyword)]",
  Planned: "text-[var(--vsc-muted)]",
  Live: "text-[var(--vsc-comment)]",
};

const navItems: Array<{ key: TabKey; label: string }> = [
  { key: "about", label: "About" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

const fileTabs: Array<{ key: TabKey; label: string }> = [
  { key: "about", label: "about.md" },
  { key: "projects", label: "projects.json" },
  { key: "contact", label: "contact.ts" },
];

const services = [
  {
    label: "Frontend Development",
    desc: "Building clean interfaces with HTML, JavaScript, Tailwind CSS, Next.js, TypeScript and modern web tools.",
  },
  {
    label: "Backend Foundations",
    desc: "Working with PHP, SQL, Supabase, and practical full-stack development fundamentals.",
  },
  {
    label: "Python & Linux",
    desc: "Comfortable building, learning, and experimenting in Python-based environments.",
  },
  {
    label: "AI Training Experience",
    desc: "Experienced in reviewing prompts, responses, and language-focused AI work.",
  },
];

function tabButtonClass(isActive: boolean) {
  return isActive
    ? "bg-[var(--vsc-bg)] text-[var(--vsc-text)]"
    : "text-[var(--vsc-muted)] hover:bg-[var(--vsc-panel)] hover:text-[var(--vsc-text)]";
}

function AboutPanel() {
  return (
    <section id="about" className="scrollbar-hidden overflow-auto p-6 xl:flex-1 xl:p-10">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div>
          <p className="mb-3 font-mono text-xs text-[var(--vsc-accent)]">
            {"// about.md"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Hi, I&apos;m Zaine.
          </h1>
          <p className="mt-4 text-lg leading-8 text-[var(--vsc-text)]">
            I&apos;m a software development student at Vista College who enjoys
            building practical web projects and improving my skills across the
            full stack.
          </p>
          <p className="mt-3 text-base leading-7 text-[var(--vsc-muted)]">
            I work with{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">Python</strong>,{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">HTML</strong>,{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">JavaScript</strong>,{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">PHP</strong>,{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">Linux</strong>,{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">SQL</strong>,{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">Next.js</strong>,{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">Tailwind CSS</strong>,
            and{" "}
            <strong className="font-semibold text-[var(--vsc-muted)]">Supabase</strong>,
            and I&apos;m currently continuing to grow my skills through hands-on
            projects and real-world experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-4">
            <p className="font-mono text-xs text-[var(--vsc-accent)]">
              {"// education.json"}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              Education
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--vsc-text)]">
              MBO Software Development at Vista College
            </p>
            <p className="text-sm text-[var(--vsc-muted)]">2024 — </p>
          </div>

          <div className="border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-4">
            <p className="font-mono text-xs text-[var(--vsc-accent)]">
              {"// experience.json"}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              Experience
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--vsc-text)]">
              Outlier AI Trainer
            </p>
            <p className="text-sm text-[var(--vsc-muted)]">2024 — 2025</p>
            <p className="mt-2 text-sm leading-6 text-[var(--vsc-muted)]">
              Worked on prompt and response evaluation, language quality, and
              project-based AI training tasks.
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Technical strengths
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

        <div
          id="contact"
          className="border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-5"
        >
          <p className="font-mono text-xs text-[var(--vsc-accent)]">
            {"// contact.ts"}
          </p>
          <h2 className="mt-3 text-lg font-semibold text-white">
            Get in touch
          </h2>
          <p className="mt-2 text-base leading-7 text-[var(--vsc-text)]">
            Open to developer opportunities, internships, collaborations, and
            project work. Reach out and let&apos;s talk.
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
  );
}

function ProjectsPanel({ projects }: HomeShellProps) {
  return (
    <aside
      id="projects"
      className="min-h-0 shrink-0 overflow-y-auto scrollbar-hidden border-t border-[var(--vsc-border)] p-6 xl:w-[400px] xl:border-l xl:border-t-0"
    >
      <p className="mb-1 font-mono text-xs text-[var(--vsc-accent)]">
        {"// projects.json"}
      </p>
      <h2 className="mb-5 text-lg font-semibold text-white">Projects</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-4 transition-colors hover:bg-[var(--vsc-tab)]"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white">{project.title}</h3>
              <span
                className={`shrink-0 font-mono text-xs ${
                  statusColor[project.status] ?? "text-[var(--vsc-muted)]"
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
  );
}

function ContactPanel() {
  return (
    <section className="scrollbar-hidden overflow-auto p-6 xl:flex-1 xl:p-10">
      <div className="mx-auto max-w-xl border border-[var(--vsc-border)] bg-[var(--vsc-panel)] p-5 md:p-8">
        <p className="font-mono text-xs text-[var(--vsc-accent)]">
          {"// contact.ts"}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
          Contact me
        </h2>
        <p className="mt-3 text-base leading-7 text-[var(--vsc-text)]">
          Tell me about your project, collaboration idea, or role. I made the
          contact page simple so you can send a message quickly from any device.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="border border-[var(--vsc-accent)] px-5 py-2.5 text-sm font-medium text-[var(--vsc-accent)] transition-colors hover:bg-[var(--vsc-accent)] hover:text-[var(--vsc-bg)]"
          >
            Open contact form
          </Link>
          <a
            href="mailto:zainedeveloper@gmail.com"
            className="border border-[var(--vsc-border)] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[var(--vsc-bg)]"
          >
            zainedeveloper@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomeShell({ projects }: HomeShellProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const selectTab = useCallback((tab: TabKey) => {
    setActiveTab(tab);

    if (typeof window === "undefined") {
      return;
    }

    if (window.innerWidth >= 1280) {
      const target = document.getElementById(tab);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--vsc-bg)] text-[var(--vsc-text)]">
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
            <button
              key={item.key}
              type="button"
              onClick={() => selectTab(item.key)}
              className={`px-3 py-1 text-xs transition-colors ${
                activeTab === item.key
                  ? "text-[var(--vsc-text)]"
                  : "text-[var(--vsc-muted)] hover:text-[var(--vsc-text)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-52 shrink-0 flex-col border-r border-[var(--vsc-border)] bg-[var(--vsc-sidebar)] lg:flex">
          <p className="border-b border-[var(--vsc-border)] px-4 py-3 text-[10px] font-semibold tracking-widest text-[var(--vsc-muted)] uppercase">
            Navigation
          </p>
          <ul className="flex-1">
            {fileTabs.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => selectTab(item.key)}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left text-xs transition-colors ${tabButtonClass(activeTab === item.key)}`}
                >
                  <span className="text-[var(--vsc-accent)]">›</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="border-t border-[var(--vsc-border)] px-4 py-3 text-[10px] text-[var(--vsc-muted)]">
            <span className="text-[var(--vsc-comment)]">●</span> Git: main
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 overflow-x-auto border-b border-[var(--vsc-border)] bg-[var(--vsc-tab)] text-xs">
            {fileTabs.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => selectTab(item.key)}
                className={`flex shrink-0 items-center gap-2 border-r border-[var(--vsc-border)] px-4 py-2 transition-colors ${tabButtonClass(activeTab === item.key)}`}
              >
                {activeTab === item.key ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--vsc-accent)]" />
                ) : null}
                {item.label}
              </button>
            ))}
          </div>

          <div className="scrollbar-hidden hidden min-h-0 flex-1 overflow-auto xl:flex xl:flex-row xl:overflow-hidden">
            <AboutPanel />
            <ProjectsPanel projects={projects} />
          </div>

          <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto xl:hidden">
            {activeTab === "about" ? <AboutPanel /> : null}
            {activeTab === "projects" ? (
              <ProjectsPanel projects={projects} />
            ) : null}
            {activeTab === "contact" ? <ContactPanel /> : null}
          </div>
        </div>
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t border-[var(--vsc-border)] bg-[var(--vsc-accent)] px-4 py-1 font-mono text-[10px] text-[var(--vsc-bg)]">
        <span>⎇ main</span>
        <span>Full-Stack Developer · Open to Work</span>
        <span>UTF-8</span>
      </footer>
    </div>
  );
}
