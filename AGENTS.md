# Wecacha Project Coding Guide

This file is the local working guide for coding agents in this repository. Read it before making changes.

## Project Shape

- Framework: Next.js App Router, TypeScript, React.
- Styling: Tailwind CSS, with existing color tokens and utility classes.
- Motion: `framer-motion`.
- Icons: `lucide-react` when an icon exists in the library.
- Internationalization: `next-intl` with locale routes under `app/[locale]`.
- Data/backend: Supabase clients live under `lib/supabase*`; server actions live under `actions/`.

## Code Style

- Follow the existing file style: named exports, compact imports, existing Tailwind patterns, and current component structure.
- Add `"use client"` only for components that need client APIs such as state, effects, browser events, animation state, or form interaction.
- Prefer existing components and helpers before creating new abstractions.
- Keep edits scoped. Do not refactor unrelated files while fixing a focused issue.
- Avoid hardcoded user-facing copy inside components when the text is locale-dependent.
- Keep comments rare and useful. Do not add comments that restate obvious code.

## i18n Rules

- All user-facing multilingual copy must go through `next-intl`.
- When adding a new translation key, update both:
  - `messages/vi.json`
  - `messages/en.json`
- Use the existing namespace for the surface being edited, for example `Nav`, `Common`, `Home`, `ExperienceForm`, or page-specific namespaces.
- Do not add Vietnamese-only UI text unless the component is intentionally not localized.

## UI Rules

- Match the current Wecacha visual system: warm earth accent, forest/parchment tones, rounded controls, restrained shadows, cinematic but practical motion.
- Use Tailwind classes in the same style as surrounding components.
- Use `framer-motion` for animated show/hide states when nearby UI already uses it.
- Use `lucide-react` icons for buttons and controls when possible.
- Floating controls should be compact by default; expanded labels should appear only when interaction makes them useful.
- Check mobile behavior when changing fixed, sticky, absolute, or floating UI.

## Supabase Rules

- Supabase public URL must use `.supabase.co`, not `.supabase.com`.
- Do not hardcode Supabase keys in source files. Use environment variables.
- For public form inserts, confirm table columns, RLS state, and insert policy.
- Existing experience registration insert uses:
  - table: `experience_registrations`
  - columns: `name`, `phone`, `address`, `note`

## Git And Deploy Rules

- Do not commit, push, or deploy unless the user explicitly asks.
- Before committing, inspect `git status --short` and avoid staging unrelated local changes.
- If a file contains both requested and unrelated edits, stage only the relevant hunks.
- Do not commit generated local tool metadata such as `.antigravitycli/` unless the user explicitly asks.
- Prefer separate commits for separate user requests.
- Deploy production with Vercel only after the requested commit is pushed and the user asked for deploy.

## Verification

- For app changes, run `pnpm build` before commit/deploy when feasible.
- Avoid running `pnpm build` while `next dev` is active because both write to `.next`.
- If `.next` becomes inconsistent, stop Next processes and rebuild:
  - `pkill -f "next"`
  - `rm -rf .next`
  - `pnpm dev` or `pnpm build`
- Use `pnpm` commands because this repo has `pnpm-lock.yaml`.

## Current Production

- GitHub remote: `origin` points to `https://github.com/Duong-Anh-Duc/Wecacha.git`.
- Main branch: `main`.
- Vercel project is linked in `.vercel/project.json`.
- Production domain: `https://sonlaspecialtycoffee.vn`.
