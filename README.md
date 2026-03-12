# Duty — AI Phone Agent for Small Businesses

AI phone agent that answers calls, collects customer info, creates leads, and sends them to Telegram/dashboard. First verticals: taxi and car service.

## Tech Stack

- **Next.js 16** (App Router, RSC, Server Actions)
- **TypeScript** everywhere
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** (Postgres, Auth, Realtime)
- **Zustand** for client state
- **Telegram Bot API** for lead notifications

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.local.example .env.local

# Run Supabase migration (via Supabase Dashboard or CLI)
# See supabase/migrations/001_initial.sql

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, Toaster)
│   ├── page.tsx                  # Root redirect (→ /leads or /login)
│   ├── globals.css               # Tailwind + shadcn theme
│   ├── (auth)/                   # Auth route group (no sidebar)
│   │   ├── layout.tsx            # Centered card layout
│   │   └── login/page.tsx        # Login form
│   ├── (dashboard)/              # Dashboard route group (with sidebar)
│   │   ├── layout.tsx            # Sidebar + header shell
│   │   ├── leads/page.tsx        # Leads list page
│   │   └── settings/page.tsx     # Business settings page
│   └── api/webhooks/voice/       # API routes
│       └── route.ts              # Voice server webhook (creates leads)
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (auto-managed)
│   ├── layout/                   # App shell components
│   │   ├── sidebar.tsx           # Dashboard sidebar navigation
│   │   └── header.tsx            # Top bar with sign-out
│   └── leads/                    # Lead-specific components
│       ├── lead-card.tsx         # Single lead card
│       └── lead-list.tsx         # Lead grid with realtime updates
│
├── lib/                          # Shared utilities
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server-side Supabase client (RSC/Actions)
│   │   └── middleware.ts         # Auth session refresh logic
│   ├── telegram.ts               # Telegram bot message helpers
│   └── utils.ts                  # cn() and general utilities
│
├── hooks/                        # React hooks
│   └── use-leads.ts              # Fetch + realtime subscribe to leads
│
├── stores/                       # Zustand stores
│   └── app-store.ts              # Leads, business, loading state
│
├── types/                        # Shared TypeScript types
│   ├── database.ts               # Supabase Database type (matches schema)
│   ├── lead.ts                   # Domain types derived from DB types
│   └── index.ts                  # Barrel re-exports
│
├── server/                       # Server-only code
│   └── actions/
│       └── leads.ts              # Server actions (create, update, list)
│
└── middleware.ts                  # Next.js middleware (auth guard)

supabase/
└── migrations/
    └── 001_initial.sql           # Schema: businesses, leads, RLS, indexes
```

## Key Design Decisions

**Route groups** — `(auth)` and `(dashboard)` share different layouts without nesting URLs. Login has a centered card; dashboard has sidebar + header.

**Supabase clients** — Separate browser (`createBrowserClient`) and server (`createServerClient`) clients. The server client handles cookie-based auth in RSC and Server Actions.

**Type safety** — `src/types/database.ts` mirrors the Supabase schema. All other types derive from it. When you later run `supabase gen types`, replace this file.

**Zustand** — Lightweight client state for leads and current business. No over-abstraction; one flat store is enough for MVP.

**Server Actions** — `createLead` handles insert + Telegram notification in one call. The voice webhook calls this same action.

**Realtime** — `use-leads` hook subscribes to Postgres changes so new leads appear instantly without polling.

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Supabase anonymous key |
| `TELEGRAM_BOT_TOKEN` | Server only | Telegram bot for notifications |
| `TELEGRAM_CHAT_ID` | Server only | Default Telegram chat (fallback) |
| `VOICE_SERVER_URL` | Server only | Voice server base URL |
| `VOICE_SERVER_API_KEY` | Server only | API key for webhook auth |
| `NEXT_PUBLIC_APP_URL` | Client + Server | App base URL |

## Next Steps

- [ ] Set up Supabase project and run migration
- [ ] Create first user via Supabase Dashboard
- [ ] Add business creation flow in Settings
- [ ] Build voice server (Node.js + TypeScript, separate repo)
- [ ] Add lead detail view / status update UI
- [ ] Add Telegram bot setup wizard
