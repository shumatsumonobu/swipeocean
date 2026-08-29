# Contributing to Swipe Ocean

Thanks for your interest. Common contributions include fixing translations, improving type descriptions, reporting bugs, and updating personality data -- all of which live in simple data files.

## Prerequisites

- Node.js 20.9+
- npm

## Development Setup

Works on Windows, Mac, and Linux. No WSL required for local development.

```bash
npm install

npm run dev          # http://localhost:3000
npm run lint         # ESLint
```

> **Dev Mode:** Add `?dev=1` to the URL to show a type switcher dropdown on the result page -- useful for checking all 8 types without re-swiping.

## How to Submit a PR

1. Fork the repo and create a branch
2. Make your changes
3. Run `npm run lint`
4. Open a PR with a short description of what changed and why

No strict branch naming rules. Just keep it descriptive.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Top page
│   ├── HomeClient.tsx        # Top page client component
│   ├── swipe/page.tsx        # Swipe screen
│   ├── result/page.tsx       # Score calculation -> redirect
│   ├── result/[type]/        # Result detail page + OGP metadata
│   ├── about/                # Landing page (LP)
├── data/
│   ├── images.json           # 80 swipe images metadata (id, src, trait, direction)
│   └── personalityTypes.ts   # 8 type definitions + scoring logic
└── types/
    └── index.ts              # TypeScript type definitions
public/
├── images/swipe/          # Swipe images (80)
├── images/characters/     # Type character illustrations (8 types + backgrounds)
├── images/ogp/            # OGP images (type-specific, per language)
├── images/traits/         # Big Five trait icons (5)
scripts/
├── .env.example              # Vertex AI credentials path template
├── gen-*.mjs                 # Image generation scripts (Vertex AI)
├── prompts/                  # Generation prompts (JSON)
└── utils/                    # Post-processing utilities
```

## Data Guide

Most contributions touch `src/data/`. Here's what to edit for each type of change.

### Fixing translations / type descriptions

Edit `src/data/personalityTypes.ts`:

| Field | Description |
|---|---|
| `nameJa` / `nameEn` | Type name |
| `descriptionJa` / `descriptionEn` | Type description (2-3 sentences) |
| `adviceJa` / `adviceEn` | "Hidden side" advice text |
| `scenariosJa` / `scenariosEn` | "Relatable moments" list |
| `recommendationsJa` / `recommendationsEn` | Activity / song / book recommendations |

All text follows the [UI tone guidelines](CLAUDE.md) -- casual, friendly, punchy. Japanese uses a declarative, close-friend tone — short, no soft sentence-enders (言い切りのタメ口). English uses an SNS-style tone.

### Updating swipe images metadata

Edit `src/data/images.json`. Each entry has:

- `id` -- unique identifier (e.g. `img_o_h_01`)
- `src` -- image filename in `public/images/swipe/`
- `trait` -- one of: `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism`
- `direction` -- `high` or `low`

### Updating scoring logic

Edit `determinePersonalityType()` in `src/data/personalityTypes.ts`. Threshold-based mapping from 5 trait scores (0-1) to one of 8 type IDs.

## Scripts

```bash
npm run dev           # Dev server (HMR)
npm run lint          # ESLint
npm run cf:preview    # Build + local Workers preview (via WSL on Windows)
npm run cf:deploy     # Build + deploy to Cloudflare Workers (via WSL on Windows)
```

## Deployment

Deployment to Cloudflare Workers is documented in [docs/deploy.md](docs/deploy.md). This is typically done by the maintainer.

## Image Generation

All visual assets (characters, swipe images, icons, OGP) are generated with Vertex AI. Scripts, prompts, and workflows are documented in [docs/design.md](docs/design.md).

## Language

- UI defaults to Japanese (`?l=ja`). Switch to English with `?l=en`
- Landing page (`/about`) defaults to English
- All code comments and console logs are in English
