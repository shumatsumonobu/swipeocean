# Changelog

## 2026-06-08

A Big Five (OCEAN) personality check built around a single, honest one-shot
experience — "affirm today's you; revisit whenever you like." No retention
pressure, no streaks, no nudges.

### Features
- Personality check by swiping images: 10 cards, balanced across the 5 traits (high/low per trait)
- 8 personality types, each with its own character, accent color, description, and advice
- Radar chart of the 5 trait scores
- Randomized relatable moments and recommendations — the picks change on every view
- Type reveal animation: type-colored glow, name pop, and subtle particles (respects `prefers-reduced-motion`)
- Bilingual (Japanese / English) via the `?l=` query parameter
- Static OGP images per type and per language, plus a top page and an about page
- Social sharing to X, with a "try it yourself" entry point for people arriving from a shared link
- About page explaining Big Five, the 8 types, and how scoring works
- Dev Mode (`?dev=1`) for switching types on the result page

### Tech
- Next.js 16 (App Router) + React 19 + Tailwind CSS 3 + TypeScript (strict)
- Deployed to Cloudflare Workers via `@opennextjs/cloudflare` and `wrangler`
- Scoring and type determination run entirely client side; no backend, no analytics
- State is React hooks + `localStorage` (`swipeResults` / `selectedImages`) — no state library
- 80 swipe images (5 traits × 2 directions × 8 images)
- Image assets generated locally through `scripts/gen-*.mjs`, with prompts tracked in `scripts/prompts/`
