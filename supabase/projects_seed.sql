insert into public.projects (
  slug,
  title,
  stack,
  status,
  summary,
  details,
  demo_url,
  repo_url,
  local_only_note,
  sort_order,
  is_published
)
values
  (
    'ai-workflow-engine',
    'AI Workflow Engine',
    'Next.js · TypeScript · Supabase',
    'In Progress',
    'A visual tool that lets teams build and run automated workflows — no coding needed.',
    'This project helps teams automate repeat tasks with reusable AI workflows, human approval steps, and activity logs.',
    null,
    null,
    'Private local project. Live demo is not public yet, but a full walkthrough can be provided.',
    1,
    true
  ),
  (
    'developer-analytics-kit',
    'Analytics Dashboard',
    'React · PostgreSQL · Chart.js',
    'Planned',
    'A personal dashboard for tracking work habits, goals, and progress over time.',
    'Designed to make progress visible with clean charts, focus trends, and week-over-week performance snapshots.',
    null,
    null,
    'Not deployed yet. Currently running as a local development build.',
    2,
    true
  ),
  (
    'portfolio-v2',
    'This Portfolio',
    'Next.js · Tailwind CSS · Docker',
    'Live',
    'A fast, fully editable portfolio site — the one you are looking at right now.',
    'Built with a code-editor aesthetic and ready for Supabase-backed project content.',
    null,
    null,
    null,
    3,
    true
  )
on conflict (slug)
do update set
  title = excluded.title,
  stack = excluded.stack,
  status = excluded.status,
  summary = excluded.summary,
  details = excluded.details,
  demo_url = excluded.demo_url,
  repo_url = excluded.repo_url,
  local_only_note = excluded.local_only_note,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();
