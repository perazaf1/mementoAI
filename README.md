# Memento AI

**Recite your course. Actually remember it.**

Memento is a web app that helps students retain knowledge through active recall. Speak out loud, and Memento analyses your recitation using AI to give you structured feedback on what you know, what's missing, and how to improve.

Live at **[memento-ai-delta.vercel.app](https://memento-ai-delta.vercel.app)**

## Features

- **Course mode** — Paste or upload (PDF) your course material, recite it out loud, and get a detailed 4-section feedback powered by Claude
- **Code mode** — Explain code verbally and receive feedback on your understanding
- **11 feedback languages** — French, English, Arabic, Spanish, German, and more
- **Session history** — Review your past recitations with expandable cards
- **Bilingual UI** — Full French / English interface
- **Plans** — Free (3 sessions/12h), Pro (20 sessions/12h), ISEP (10 sessions/12h)

## Tech Stack

- **Framework** — [Next.js 14](https://nextjs.org) (App Router)
- **Auth & Database** — [Supabase](https://supabase.com) (PostgreSQL, RLS, Auth with email + Google OAuth)
- **AI** — [Claude API](https://docs.anthropic.com) (Anthropic SDK)
- **Payments** — [Lemon Squeezy](https://lemonsqueezy.com) (subscriptions + webhooks)
- **Speech** — Web Speech API (Chrome / Edge)
- **Hosting** — [Vercel](https://vercel.com)
- **Analytics** — Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- An Anthropic API key
- A Lemon Squeezy store (for payments)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/perazaf1/memorAI.git
   cd memorAI
   npm install
   ```

2. Create a `.env.local` file with the required environment variables:
   ```
   ANTHROPIC_API_KEY=
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   LEMONSQUEEZY_API_KEY=
   LEMONSQUEEZY_WEBHOOK_SECRET=
   LEMONSQUEEZY_STORE_ID=
   LEMONSQUEEZY_PRO_VARIANT_ID=
   LEMONSQUEEZY_ISEP_VARIANT_ID=
   ```

3. Apply the Supabase migrations in `supabase/migrations/` in order.

4. Start the dev server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Requires Chrome or Edge for speech recognition.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

## Architecture

```
app/
  page.tsx              # Landing page
  app/page.tsx          # Main app (input -> recording -> feedback)
  app/history/page.tsx  # Session history
  auth/                 # Login, signup, password reset
  api/
    feedback/           # Claude API + session management
    extract-pdf/        # PDF text extraction
    checkout/           # Lemon Squeezy checkout
    webhooks/           # Payment webhooks
components/
  landing/              # Landing page sections
  InputScreen.tsx       # Course/code input step
  RecordingScreen.tsx   # Voice recording step
  FeedbackScreen.tsx    # AI feedback display
lib/
  claude.ts             # Prompt builders
  i18n.ts               # App translations
  rate-limit.ts         # In-memory rate limiter
```

## License

All rights reserved.
