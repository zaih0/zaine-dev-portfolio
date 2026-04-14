# Zaine Dev Portfolio

Code-editor styled portfolio built with Next.js 16, React 19, and Tailwind CSS v4.

## 1) Local setup

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Start dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## 2) Supabase environment variables

This project uses:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Where to get them:

1. Open your Supabase project dashboard.
2. Go to **Settings** -> **API**.
3. Copy:
	- **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
	- **anon public** key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- **service_role secret** key -> `SUPABASE_SERVICE_ROLE_KEY`

Important:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in client components.
- Keep `.env.local` private and never commit it.

## 3) Docker + Docker Compose

Build and run with Compose:

```bash
docker compose up --build
```

Run in background:

```bash
docker compose up --build -d
```

Stop:

```bash
docker compose down
```

The app will be available at http://localhost:3000.

## 4) Project structure notes

- `src/app/page.tsx`: editor-style homepage UI
- `src/app/globals.css`: theme color tokens and global styles
- `src/lib/supabase.ts`: helper functions for Supabase clients
- `Dockerfile` + `compose.yaml`: containerized deployment setup

## 5) Next steps

- Add a real projects table in Supabase.
- Fetch project data in server components.
- Add admin/editor workflow for quick content updates.
