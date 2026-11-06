<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` (Turbopack dev server), `npm run build`, `npm run lint`.
- No tests, no CI, no pre-commit hooks in this repo. Verify changes with `npm run lint` (bare `eslint`, whole repo) and `npm run build`.

## Toolchain quirks

- Tailwind v4 with **no `tailwind.config`**: theme/design tokens live in `src/app/globals.css`. Tailwind is wired through a Turbopack rule (`@tailwindcss/turbopack`) in `next.config.ts` — don't remove that rule or CSS imports break.
- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`). Write hooks/components according to the Rules of React; don't add `useMemo`/`useCallback`/`React.memo` for optimization.

## shadcn/ui

- Style is `base-nova` (see `components.json`): UI primitives come from **`@base-ui/react`, not Radix** — don't import Radix in new components.
- `src/components/ui/` already contains the full installed component set (many not yet used by app code).
- To add more: `npx shadcn@latest add <component>`; aliases are `@/components`, `@/lib`, `@/hooks`, `@/lib/utils` (`cn` re-exported from the `cn` package in `src/lib/utils.ts`).
- Code highlighting uses Shiki with the JS regex engine and per-language lazy imports — register new languages in `src/lib/highlighter.tsx`.

## Structure

- App code lives in `src/app` (App Router). Right now it contains only the scaffold home page (`page.tsx`) and `layout.tsx`; `src/components/ui`, `src/hooks`, `src/lib` are library code.
- `better-auth` is in `package.json` but is not wired up anywhere — don't assume auth exists yet.
