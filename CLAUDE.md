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
- `/app` — The application (`app/app/page.tsx`): wrapped in `AppProvider`, manages the 3-step flow (input → recording → feedback).
- `POST /api/feedback` — Calls Claude API. Accepts `{ courseText, transcript, feedbackLang, mode }`, returns `{ feedback: string }`.
- `POST /api/extract-pdf` — Server-side PDF text extraction via `pdf-parse` (dynamic import required — see `next.config.js`).

**Core loop:** User inputs course text → records voice via Web Speech API → transcript + course text sent to `/api/feedback` → Claude returns 4-section markdown → `FeedbackScreen` parses and renders it.

## Translations — two separate systems

The project has **two independent translation systems** that must not be confused:

1. **App UI** (`lib/i18n.ts`) — used inside `/app` via `AppContext`. Exports `getT(lang)`, `TranslationKey`, and `FEEDBACK_LANGUAGES`. Adding a string requires updating both `fr` and `en` objects. `feedbackLang` values are passed directly to Claude as English language names (e.g. `"French"`, `"Arabic"`).

2. **Landing page** (`app/page.tsx`, top of file) — a standalone `COPY = { fr: {...}, en: {...} }` object. Lang state (`useState<Lang>`) lives in `LandingPage` and is passed as props to each section component. The mock feedback labels in the hero also translate via `MOCK_CONTENT[lang]`.

## State Management

Single `AppContext` (`context/AppContext.tsx`) holds global app state: `uiLang` (fr/en), `feedbackLang` (11 languages + auto), `mode` (course/code), and the `t(key)` translation function. Local state for the session flow (step, courseText, transcript, feedback) lives in `AppShell` inside `app/app/page.tsx`.

## Claude Prompts

`lib/claude.ts` exports two builders:
- `buildCoursePrompt(courseText, transcript, feedbackLang)` — instructs Claude to output exactly 4 markdown sections (`## Bien couvert`, `## Points manquants`, `## Imprécisions`, `## Conseil`). Language instruction is appended to the system prompt; `feedbackLang = 'auto'` tells Claude to detect from the transcript.
- `buildCodePrompt(code, transcript)` — same 4-section structure in English only (`## Well covered`, `## Missing points`, `## Imprecisions`, `## Advice`), truncates code to 50 lines. Always responds in English.

`FeedbackScreen` parses Claude's response by matching `## heading` lines against known section keys (multilingual-aware via `matchKeys` arrays).

## Input Limits

| Plan | Course mode | Code mode | Sessions/day |
|---|---|---|---|
| Free | 15,000 chars | 50 lines | 3 |
| Pro | 25,000 chars | 50 lines | Unlimited |
| ISEP (5€/mois) | 25,000 chars | 50 lines | Unlimited |

Constants in `components/InputScreen.tsx`: `MAX_CODE_LINES = 50`, `WARN_COURSE_CHARS = 12000`, `MAX_COURSE_CHARS = 15000`. The Pro limit (25,000) is not yet enforced in code — it will be applied once Supabase auth is integrated. ISEP students are identified by `@eleve.isep.fr` email suffix (to be handled via a Supabase trigger setting `plan = 'isep'` on signup).

## Speech Recognition

`hooks/useSpeechRecognition.ts` wraps the browser Web Speech API. Key detail: `getFullTranscript()` reads `finalRef.current` synchronously — use this instead of the `transcript` state when stopping, because React state updates are asynchronous and the value may lag behind. Language is fixed to `fr-FR` in the hook.

## Styling Conventions

The app uses **inline styles** (not CSS modules or Tailwind component classes) for all component-level styling. Tailwind is used only for global utilities (`animate-fade-up`) and responsive helpers. Design tokens live in CSS variables in `app/globals.css`:

```
--bg, --surface, --text, --muted, --border
--accent (#1A3880), --accent-hover, --accent-light
--green/--green-bg/--green-border   (feedback: well covered)
--red/--red-bg/--red-border         (feedback: missing)
--orange/--orange-bg/--orange-border (feedback: imprecisions)
--blue/--blue-bg/--blue-border      (feedback: advice)
```

Fonts: `Cormorant` (serif, headings) and `DM Sans` (body), loaded via Google Fonts in `globals.css`. The landing page hero uses `#0C1420` as its dark background (not a CSS variable).

## Environment

`ANTHROPIC_API_KEY` must be set in `.env.local` (dev) or in the hosting platform's environment variables (production). The key is consumed server-side only in `/api/feedback/route.ts`. Never import the Anthropic client in client components.

## Planned integrations (not yet built)

- **Supabase**: auth + `users` table (id, email, plan, sessions_today) + `recitations` table (id, user_id, mode, transcript, feedback, created_at).
- **Lemon Squeezy**: payment for Pro (8€/mois) and ISEP (5€/mois) plans. Webhook on `order_created` updates `plan` in Supabase.
- **Session enforcement**: free plan limited to 3 sessions/day, tracked in `users.sessions_today`, reset daily.