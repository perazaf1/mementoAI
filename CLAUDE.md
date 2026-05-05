# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is set up. The app requires Chrome or Edge to use the Web Speech API.

## Architecture

**Routes:**
- `/` — Landing page (`app/page.tsx`): hero, how it works, features, pricing. Self-contained with its own FR/EN translation object (`COPY`). No AppContext — lang state is local to `LandingPage`.
- `/app` — The application (`app/app/page.tsx`): wrapped in `AppProvider`, manages the 3-step flow (input → recording → feedback). Requires auth — middleware redirects to `/auth/login` if not authenticated.
- `/app/history` — Session history (`app/app/history/page.tsx`): last 50 recitations, expandable cards.
- `/auth/login` — Login/signup page with email+password and Google OAuth.
- `/auth/reset-password` — Send password reset email.
- `/auth/update-password` — Set new password (Supabase redirects here after reset link click).
- `/auth/callback` — OAuth callback route.
- `POST /api/feedback` — Calls Claude API. Checks auth + session limits, saves recitation, increments sessions_today. Accepts `{ courseText, transcript, feedbackLang, mode }`, returns `{ feedback, sessionsUsed, sessionsLimit }`.
- `POST /api/extract-pdf` — Server-side PDF text extraction via `pdf-parse` (dynamic import required — see `next.config.js`).
- `POST /api/checkout` — Creates a Lemon Squeezy checkout URL for Pro or ISEP plan upgrade.
- `POST /api/webhooks/lemonsqueezy` — Receives `subscription_created` / `subscription_updated` events, verifies HMAC signature, updates `users.plan` in Supabase.

**Core loop:** User logs in → inputs course text → records voice via Web Speech API → transcript + course text sent to `/api/feedback` → session limit checked → Claude returns 4-section markdown → `FeedbackScreen` parses and renders it → recitation saved to DB.

## Auth & Middleware

`middleware.ts` (root) calls `utils/supabase/middleware.ts` on every request:
- `/app/*` — requires auth, redirects to `/auth/login` if not authenticated.
- `/auth/*` — redirects to `/app` if already authenticated (except `/auth/update-password`).
- Sessions are refreshed automatically via cookie on every request.

Supabase clients:
- `utils/supabase/server.ts` — server-side (API routes, Server Components).
- `utils/supabase/client.ts` — browser-side (Client Components).

## Translations — two separate systems

The project has **two independent translation systems** that must not be confused:

1. **App UI** (`lib/i18n.ts`) — used inside `/app` via `AppContext`. Exports `getT(lang)`, `TranslationKey`, and `FEEDBACK_LANGUAGES`. Adding a string requires updating both `fr` and `en` objects. `feedbackLang` values are passed directly to Claude as English language names (e.g. `"French"`, `"Arabic"`).

2. **Landing page** (`app/page.tsx`, top of file) — a standalone `COPY = { fr: {...}, en: {...} }` object. Lang state (`useState<Lang>`) lives in `LandingPage` and is passed as props to each section component. The mock feedback labels in the hero also translate via `MOCK_CONTENT[lang]`.

Auth pages (`/auth/*`) each have their own local `COPY = { fr, en }` object. Lang is stored in `localStorage` under key `uiLang`.

## State Management

Single `AppContext` (`context/AppContext.tsx`) holds global app state: `uiLang` (fr/en), `feedbackLang` (11 languages + auto), `mode` (course/code), and the `t(key)` translation function. Local state for the session flow (step, courseText, transcript, feedback) lives in `AppShell` inside `app/app/page.tsx`. User profile (plan, sessions_today) is fetched in `AppShell` via Supabase client and passed down as props.

## Supabase Schema

```sql
-- users (extends auth.users)
users(id, email, plan, sessions_today, last_reset_date, created_at)

-- recitations
recitations(id, user_id, mode, course_text, transcript, feedback, created_at)
```

Plans: `'free'` | `'pro'` | `'isep'`

A Postgres trigger (`handle_new_user`) auto-creates a `users` row on signup and sets `plan = 'isep'` if email ends with `@eleve.isep.fr`.

To manually upgrade a user to Pro, run in Supabase SQL Editor:
```sql
SELECT upgrade_to_pro('email@example.com');
```

## Claude Prompts

`lib/claude.ts` exports two builders:
- `buildCoursePrompt(courseText, transcript, feedbackLang)` — instructs Claude to output exactly 4 markdown sections (`## Bien couvert`, `## Points manquants`, `## Imprécisions`, `## Conseil`). Language instruction is appended to the system prompt; `feedbackLang = 'auto'` tells Claude to detect from the transcript.
- `buildCodePrompt(code, transcript)` — same 4-section structure in English only (`## Well covered`, `## Missing points`, `## Imprecisions`, `## Advice`), truncates code to 50 lines. Always responds in English.

`FeedbackScreen` parses Claude's response by matching `## heading` lines against known section keys (multilingual-aware via `matchKeys` arrays).

## Input Limits

| Plan | Course mode | Code mode | Sessions/day |
|---|---|---|---|
| Free | 15,000 chars | 50 lines | 3 |
| Pro | 25,000 chars | 50 lines | 20 |
| ISEP (5€/mois) | 25,000 chars | 50 lines | 10 |

Limits are enforced both client-side (`components/InputScreen.tsx`) and server-side (`/api/feedback`). `InputScreen` receives `userPlan` as a prop from `AppShell` to compute the correct char limit dynamically. `MAX_CODE_LINES = 50` is constant for all plans.

## Lemon Squeezy

- Store: `mementoai-app.lemonsqueezy.com` — Store ID: `365953`
- Pro variant ID: `1614994` (8€/mois)
- ISEP variant ID: `1614998` (5€/mois)
- Checkout flow: client calls `POST /api/checkout` → server creates checkout via LS API → returns URL → client redirects.
- Webhook: `POST /api/webhooks/lemonsqueezy` — verifies `x-signature` (HMAC SHA256), handles `subscription_created` and `subscription_updated`, updates `users.plan`.
- After successful payment, user is redirected to `/app?upgraded=1` which shows a success banner.

## Speech Recognition

`hooks/useSpeechRecognition.ts` wraps the browser Web Speech API. Key detail: `getFullTranscript()` reads `finalRef.current` synchronously — use this instead of the `transcript` state when stopping, because React state updates are asynchronous and the value may lag behind. Language is fixed to `fr-FR` in the hook.

## Responsive Design

`hooks/useIsMobile.ts` — returns `true` if viewport ≤ 640px. Used in `AppShell` to adapt the header layout. CSS utility classes `.hide-mobile` / `.show-mobile` are defined in `globals.css` and used on the landing page. Breakpoint: 640px.

## Styling Conventions

The app uses **inline styles** (not CSS modules or Tailwind component classes) for all component-level styling. Tailwind is used only for global utilities (`animate-fade-up`, `.hide-mobile`, `.show-mobile`) and responsive helpers. Design tokens live in CSS variables in `app/globals.css`:

```
--bg, --surface, --text, --muted, --border
--accent (#1A3880), --accent-hover, --accent-light
--green/--green-bg/--green-border   (feedback: well covered)
--red/--red-bg/--red-border         (feedback: missing)
--orange/--orange-bg/--orange-border (feedback: imprecisions)
--blue/--blue-bg/--blue-border      (feedback: advice)
```

Fonts: `Cormorant` (serif, headings) and `DM Sans` (body), loaded via Google Fonts in `globals.css`. The landing page hero uses `#0C1420` as its dark background (not a CSS variable).

## Environment Variables

All secrets are server-side only except Supabase public keys.

```
ANTHROPIC_API_KEY                    # Claude API
NEXT_PUBLIC_SUPABASE_URL             # Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY # Supabase anon/publishable key
LEMONSQUEEZY_API_KEY                 # Lemon Squeezy API key
LEMONSQUEEZY_WEBHOOK_SECRET          # Lemon Squeezy webhook signing secret
LEMONSQUEEZY_STORE_ID                # 365953
LEMONSQUEEZY_PRO_VARIANT_ID          # 1614994
LEMONSQUEEZY_ISEP_VARIANT_ID         # 1614998
```

Never import Anthropic or Lemon Squeezy clients in client components. Supabase browser client (`utils/supabase/client.ts`) is the only external SDK allowed client-side.

## Deployment

Hosted on Vercel. Each push to `main` triggers an automatic redeploy. After deploying:
- Add production URL to Supabase → Authentication → URL Configuration (Site URL + Redirect URLs).
- Set Lemon Squeezy webhook URL to `https://<domain>/api/webhooks/lemonsqueezy`.
