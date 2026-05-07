# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is set up. The app requires Chrome or Edge to use the Web Speech API.

## Current State (as of last session)

The app is **live in production** at `https://memento-ai-delta.vercel.app`.

What is fully built and deployed:
- Auth (email+password + Google OAuth, password reset flow)
- Signup redirects directly to `/app` — no email confirmation (confirmations disabled in Supabase, will stay disabled)
- Logged-in users redirected to `/app` from `/` and `/auth/*` (middleware)
- Logout redirects to `/` (landing page) with `router.refresh()` to invalidate session
- Multi-tab logout detection via `onAuthStateChange` listener in AppShell
- Supabase DB with session limits per plan
- Lemon Squeezy payment (checkout + webhook) — Pro and ISEP CTAs on landing page wired to checkout
- Responsive design (mobile + desktop)
- Security hardening (RLS, headers, CSP without `unsafe-eval`, rate limiting)
- `supabaseAdmin` client (`utils/supabase/admin.ts`) using `SUPABASE_SERVICE_ROLE_KEY` — used by webhook and feedback routes
- Atomic session consumption via SQL function `try_consume_session` (migration 003 applied)
- Rate limiter (`lib/rate-limit.ts`) — in-memory sliding window, 10 req/min/user on `/api/feedback`
- Onboarding modal on first `/app` visit (stored in `localStorage` key `memento_onboarded`)
- SEO meta tags + Open Graph in `app/layout.tsx`
- Vercel Analytics (`@vercel/analytics`) active in production
- AI disclaimer at bottom of feedback screen (SVG icon, no emojis)
- Custom favicon (replaced in `public/`)
- PDF upload validation (max 60 MB server-side)
- Performance optimizations: `next/font` self-hosted fonts, code splitting via `next/dynamic`, `<main>` landmark, preconnect hints
- README.md with project overview, setup instructions, and architecture summary

Nothing critical remains to build. Optional future work:
- Custom SMTP for transactional emails (password reset currently uses Supabase default SMTP)
- Account deletion flow (GDPR)
- ErrorBoundary wrapping AppShell

## Architecture

**Routes:**
- `/` — Landing page (`app/page.tsx`): assembler component (~58 lines). `Nav` and `Hero` are eagerly loaded; `HowItWorks`, `Features`, `Pricing`, `Footer` are lazy-loaded via `next/dynamic` (SSR enabled). Section components live in `components/landing/`.
- `/app` — The application (`app/app/page.tsx`): wrapped in `AppProvider`, manages the 3-step flow (input → recording → feedback). Requires auth — middleware redirects to `/auth/login` if not authenticated.
- `/app/history` — Session history (`app/app/history/page.tsx`): last 50 recitations, expandable cards. Bilingual (FR/EN via local COPY object reading `uiLang` from localStorage).
- `/auth/login` — Login/signup page with email+password and Google OAuth.
- `/auth/reset-password` — Send password reset email.
- `/auth/update-password` — Set new password (Supabase redirects here after reset link click).
- `/auth/callback` — OAuth callback route.
- `POST /api/feedback` — Calls Claude API. Rate-limited (10 req/min/user). Uses `try_consume_session` RPC for atomic session check+increment. Saves recitation via `supabaseAdmin`. Accepts `{ courseText, transcript, feedbackLang, mode }`, returns `{ feedback, sessionsUsed, sessionsLimit }`.
- `POST /api/extract-pdf` — Server-side PDF text extraction via `pdf-parse` (dynamic import required — see `next.config.js`). Max file size: 60 MB.
- `POST /api/checkout` — Creates a Lemon Squeezy checkout URL for Pro or ISEP plan upgrade. Returns 401 if not authenticated (client redirects to `/auth/login`).
- `POST /api/webhooks/lemonsqueezy` — Receives `subscription_created` / `subscription_updated` events, verifies HMAC signature, updates `users.plan` via `supabaseAdmin`.

**Core loop:** User logs in → onboarding modal (first time only) → inputs course text → records voice via Web Speech API → transcript + course text sent to `/api/feedback` → rate limit checked → session limit checked atomically → Claude returns 4-section markdown → `FeedbackScreen` parses and renders it (memoized) → recitation saved to DB.

**Landing page components** (`components/landing/`):
- `types.ts` — `COPY`, `MOCK_CONTENT`, `Lang`, `CopyType` exports
- `Nav.tsx` — Fixed navbar with scroll effect
- `Hero.tsx` — Hero section with mock UI preview
- `HowItWorks.tsx` — 3-step explanation cards
- `Features.tsx` — Feature cards (Course mode, Code mode, Languages)
- `Pricing.tsx` — Free vs Pro pricing cards + ISEP note
- `Footer.tsx` — Footer with social links
- `Reveal.tsx` — Scroll-triggered reveal animation wrapper
- `LangToggle.tsx` — FR/EN language switcher button group
- `index.ts` — Barrel export

## Auth & Middleware

`middleware.ts` (root) calls `utils/supabase/middleware.ts` on every request:
- `/app/*` — requires auth, redirects to `/auth/login` if not authenticated.
- `/auth/*` — redirects to `/app` if already authenticated (except `/auth/update-password`).
- `/` — redirects to `/app` if already authenticated (handles post-OAuth landing on root).
- Sessions are refreshed automatically via cookie on every request.

Supabase clients:
- `utils/supabase/server.ts` — server-side (API routes, Server Components).
- `utils/supabase/client.ts` — browser-side (Client Components).
- `utils/supabase/admin.ts` — lazy singleton using `SUPABASE_SERVICE_ROLE_KEY`, bypasses RLS. Used in `/api/feedback` and `/api/webhooks/lemonsqueezy`.

**Logout behavior:**
- `handleSignOut` in AppShell calls `supabase.auth.signOut()` then `router.push('/') + router.refresh()`
- `onAuthStateChange` listener catches `SIGNED_OUT` events (covers multi-tab, expired sessions)
- If `getUser()` returns null on mount, user is redirected to `/`

**Deleting test users:** Always delete from Supabase dashboard → Authentication → Users (not from Table Editor). This removes both `auth.users` and `public.users`. Deleting only from `public.users` leaves the auth record and blocks re-signup with the same email.

## Translations — two separate systems

The project has **two independent translation systems** that must not be confused:

1. **App UI** (`lib/i18n.ts`) — used inside `/app` via `AppContext`. Exports `getT(lang)`, `TranslationKey`, and `FEEDBACK_LANGUAGES`. Adding a string requires updating both `fr` and `en` objects. `feedbackLang` values are passed directly to Claude as English language names (e.g. `"French"`, `"Arabic"`).

2. **Landing page** (`components/landing/types.ts`) — a standalone `COPY = { fr: {...}, en: {...} }` object. Lang state (`useState<Lang>`) lives in `LandingPage` (`app/page.tsx`) and is passed as props to each section component. The mock feedback labels in the hero also translate via `MOCK_CONTENT[lang]`.

3. **History page** (`app/app/history/page.tsx`) — local `COPY = { fr, en }` object, reads `uiLang` from `localStorage`.

Auth pages (`/auth/*`) each have their own local `COPY = { fr, en }` object. Lang is stored in `localStorage` under key `uiLang`.

## State Management

Single `AppContext` (`context/AppContext.tsx`) holds global app state: `uiLang` (fr/en), `feedbackLang` (11 languages + auto), `mode` (course/code), and the `t(key)` translation function. `uiLang` is loaded from `localStorage` on mount and persisted on change. Local state for the session flow (step, courseText, transcript, feedback) lives in `AppShell` inside `app/app/page.tsx`. User profile (plan, sessions_today) is fetched in `AppShell` via Supabase client and passed down as props.

## Supabase Schema

```sql
-- users (extends auth.users)
users(id, email, plan, sessions_today, last_reset_date, created_at)

-- recitations
recitations(id, user_id, mode, course_text, transcript, feedback, created_at)
```

Plans: `'free'` | `'pro'` | `'isep'`

**RLS policies (migration 002 applied):**
- `users_select_own` — SELECT only own row
- `users_update_sessions_only` — UPDATE own row but WITH CHECK prevents changing `plan`
- `recitations_select_own` — SELECT only own recitations
- `recitations_insert_own` — INSERT only for own user_id

A Postgres trigger (`handle_new_user`) auto-creates a `users` row on signup and sets `plan = 'isep'` if email ends with `@eleve.isep.fr`.

**Atomic session function (migration 004 applied — replaces 003):**
`try_consume_session(p_user_id UUID)` — locks the row, resets counter if 12 hours have passed since `last_reset_date`, checks limit, increments. Returns `'ok'` | `'limit_reached'` | `'user_not_found'`. Called via `supabaseAdmin.rpc(...)` in `/api/feedback`. The `last_reset_date` column is `TIMESTAMPTZ` (not `DATE`).

**Session counter display fix:** `AppShell.loadProfile` fetches `last_reset_date` alongside `sessions_today` and computes the effective count client-side (shows 0 if 12h have elapsed since last reset). This keeps the UI in sync with the SQL reset logic that only fires on the next `try_consume_session` call.

To manually upgrade a user to Pro, run in Supabase SQL Editor:
```sql
SELECT upgrade_to_pro('email@example.com');
```

## Claude Prompts

`lib/claude.ts` exports two builders:
- `buildCoursePrompt(courseText, transcript, feedbackLang)` — instructs Claude to output exactly 4 markdown sections (`## Bien couvert`, `## Points manquants`, `## Imprécisions`, `## Conseil`). Language instruction is appended to the system prompt; `feedbackLang = 'auto'` tells Claude to detect from the transcript.
- `buildCodePrompt(code, transcript)` — same 4-section structure in English only (`## Well covered`, `## Missing points`, `## Imprecisions`, `## Advice`), truncates code to 50 lines. Always responds in English.

`FeedbackScreen` parses Claude's response by matching `## heading` lines against known section keys (multilingual-aware via `matchKeys` arrays). Parsing is memoized with `useMemo` on `feedback` prop.

## Rate Limiting

`lib/rate-limit.ts` — in-memory sliding-window rate limiter. Not globally consistent across Vercel instances (best-effort), but catches rapid-fire abuse effectively. Used in `/api/feedback`: max 10 requests per minute per authenticated user ID. Returns 429 if exceeded. This is separate from the daily session limit (which is enforced atomically in the DB).

## Input Limits

| Plan | Course mode | Code mode | Sessions/12h |
|---|---|---|---|
| Free | 15,000 chars | 50 lines | 3 |
| Pro | 25,000 chars | 50 lines | 20 |
| ISEP (5€/mois) | 25,000 chars | 50 lines | 10 |

Limits are enforced both client-side (`components/InputScreen.tsx`) and server-side (`/api/feedback`). `InputScreen` receives `userPlan` as a prop from `AppShell` to compute the correct char limit dynamically. `MAX_CODE_LINES = 50` is constant for all plans.

## Lemon Squeezy

- Store: `mementoai-app.lemonsqueezy.com` — Store ID: `365953`
- Pro variant ID: `1614994` (8€/mois)
- ISEP variant ID: `1614998` (5€/mois)
- Checkout flow: client calls `POST /api/checkout` → server creates checkout via LS API → returns URL → client redirects. If not authenticated, returns 401 and client redirects to `/auth/login`.
- Webhook URL (prod): `https://memento-ai-delta.vercel.app/api/webhooks/lemonsqueezy`
- Webhook: `POST /api/webhooks/lemonsqueezy` — verifies `x-signature` (HMAC SHA256), handles `subscription_created` and `subscription_updated`, updates `users.plan` via `supabaseAdmin`.
- After successful payment, user is redirected to `/app?upgraded=1` which shows a prominent blue banner with plan details.

## Speech Recognition

`hooks/useSpeechRecognition.ts` wraps the browser Web Speech API. Key detail: `getFullTranscript()` reads `finalRef.current` synchronously — use this instead of the `transcript` state when stopping, because React state updates are asynchronous and the value may lag behind. Language is fixed to `fr-FR` in the hook. Browser types (`SpeechRecognition`, `SpeechRecognitionEvent`) are cast via `any` to avoid TypeScript errors in the Vercel build environment.

## Responsive Design

`hooks/useIsMobile.ts` — returns `true` if viewport ≤ 640px. Used in `AppShell` to adapt the header layout (single row on mobile with a progress bar below, full header on desktop). CSS utility classes `.hide-mobile` / `.show-mobile` are defined in `globals.css` and used on the landing page. Breakpoint: 640px.

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

Fonts: `Cormorant` (serif, headings) and `DM Sans` (body), loaded via `next/font/google` in `app/layout.tsx` (self-hosted, no external Google Fonts requests). CSS variables `--font-cormorant` and `--font-dm-sans` are set on `<html>`. Two convenience aliases defined in `globals.css`:
- `--heading-font` → `var(--font-cormorant), Georgia, serif`
- `--body-font` → `var(--font-dm-sans), system-ui, sans-serif`

All inline `fontFamily` references across components use `var(--heading-font)` or `var(--body-font)` — never hardcoded font names. The landing page hero uses `#0C1420` as its dark background (not a CSS variable).

Landing page keyframe animations (`lp-pulse-ring`, `lp-pulse-dot`) and mobile overrides (`.lp-mock`, `.lp-hero-text`, etc.) live in `globals.css`, not inline `<style>` tags.

**No emojis in UI.** Always use SVG icons that match the design tokens. The user dislikes emojis in components.

## Security

Applied hardening (all in production):
- **RLS** — `users_update_sessions_only` prevents users from self-upgrading their plan (migration `002_fix_rls.sql`)
- **supabaseAdmin** — service role client used for webhook and feedback routes, bypasses RLS safely
- **Atomic sessions** — `try_consume_session` SQL function prevents race conditions (migration `003_try_consume_session.sql`)
- **Rate limiting** — in-memory sliding window (10 req/min/user) on `/api/feedback` (`lib/rate-limit.ts`)
- **PDF size validation** — max 60 MB enforced server-side in `/api/extract-pdf`
- **Security headers** — X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP (in `next.config.js`)
- **CSP** — `unsafe-eval` removed; whitelists `*.supabase.co`, `*.lemonsqueezy.com`, `api.anthropic.com`, `va.vercel-scripts.com` (Google Fonts origins removed — fonts are self-hosted via `next/font`)
- **Webhook signature** — HMAC SHA256 verified on every Lemon Squeezy webhook
- **No error detail leakage** — API routes return generic error messages to the client

## Environment Variables

All secrets are server-side only except Supabase public keys.

```
ANTHROPIC_API_KEY                    # Claude API
NEXT_PUBLIC_SUPABASE_URL             # Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY # Supabase anon/publishable key
SUPABASE_SERVICE_ROLE_KEY            # Supabase service role key (used by supabaseAdmin)
LEMONSQUEEZY_API_KEY                 # Lemon Squeezy API key
LEMONSQUEEZY_WEBHOOK_SECRET          # Lemon Squeezy webhook signing secret
LEMONSQUEEZY_STORE_ID                # 365953
LEMONSQUEEZY_PRO_VARIANT_ID          # 1614994
LEMONSQUEEZY_ISEP_VARIANT_ID         # 1614998
```

Never import Anthropic or Lemon Squeezy clients in client components. Supabase browser client (`utils/supabase/client.ts`) is the only external SDK allowed client-side.

## Performance

Optimizations applied for PageSpeed / Core Web Vitals:

- **Font loading** — `next/font/google` in `layout.tsx` self-hosts Cormorant and DM Sans. Eliminates render-blocking `@import` to Google Fonts. Fonts are served from `/_next/static` (same origin, zero extra DNS lookups).
- **Code splitting** — Below-fold landing page components (`HowItWorks`, `Features`, `Pricing`, `Footer`) are lazy-loaded via `next/dynamic({ ssr: true })`. Reduces initial JS payload while preserving SSR HTML.
- **Semantic HTML** — `<main>` landmark wraps all page content in `layout.tsx`. Required for accessibility (screen readers).
- **Preconnect** — `<link rel="preconnect" href="https://va.vercel-scripts.com" />` in `layout.tsx` for Vercel Analytics.
- **No inline `<style>` blocks** — All keyframes and media queries live in `globals.css`, processed by PostCSS at build time.
- **CSP tightened** — `fonts.googleapis.com` and `fonts.gstatic.com` removed from CSP since fonts are now self-hosted.

When adding new landing page sections: use `next/dynamic` for anything below the fold. Keep `Nav` and `Hero` eagerly loaded (above-the-fold / LCP).

## Deployment

- **Production URL**: `https://memento-ai-delta.vercel.app`
- Hosted on Vercel. Each push to `main` triggers an automatic redeploy.
- **Supabase redirect URLs configured**: `/auth/callback` and `/auth/update-password`
- **Lemon Squeezy webhook configured** pointing to production URL
- Email confirmations are **disabled** in Supabase (intentional — no custom SMTP planned)
- Vercel Analytics active — stats available in Vercel dashboard
