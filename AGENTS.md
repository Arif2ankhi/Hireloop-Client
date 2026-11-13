<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` (Turbopack dev server), `npm run build`, `npm run lint`.
- No tests, no CI, no pre-commit hooks. Verify changes with `npm run lint` (bare `eslint`, whole repo) and `npm run build`.

## Architecture: separate Express backend

- This Next.js app is frontend-only. All job/application data comes from an **external Express backend**, default `http://localhost:5000`, set via `NEXT_PUBLIC_API_BASE_URL` in `.env`. If fetches fail with ECONNREFUSED, that backend isn't running — it is not part of this repo.
- All backend fetches go through `src/lib/api/*` (reads) and `src/lib/actions/*` (writes), sharing `API_BASE_URL` from `src/lib/api/config.ts`. New endpoints belong there too.
- Convention in these wrappers: **read** fetchers (`getJobs`, `getApplications`, `getJobById`) catch errors and return `[]`/`null` so a stopped backend renders an empty page instead of crashing the route, with a 3s `AbortSignal.timeout`; **write** fetchers (`createJob`, `deleteJob`, `createApplication`) throw on non-ok with a 5s timeout. Follow the same pattern.
- `getJobById` falls back to scanning the full `getJobs()` list because backend `GET /jobs/:id` may not exist yet.
- Exception: `better-auth` connects directly to the Atlas cluster (`BETTER_AUTH_DB_URI`) via `@better-auth/mongo-adapter` — it does not go through the Express backend.

## Toolchain quirks

- Tailwind v4 with **no `tailwind.config`**: theme/design tokens live in `src/app/globals.css`. Tailwind is wired through a Turbopack rule (`@tailwindcss/turbopack`) in `next.config.ts` — don't remove that rule or CSS imports break.
- **React Compiler is enabled** (`reactCompiler: true`). Write hooks/components per the Rules of React; don't add `useMemo`/`useCallback`/`React.memo` for optimization.
- shadcn style is `base-nova` (see `components.json`): UI primitives are **`@base-ui/react`, not Radix** — never import Radix. Consequence: composition uses the `render` prop, e.g. `<Button render={<Link href="..." />} nativeButton={false}>`. `src/components/ui/` holds the full installed set; add more with `npx shadcn@latest add <component>`.
- Toasts: `toast.add({ title, description })` from `@/components/ui/toast` (base-ui manager); the `<Toaster />` is mounted in `src/app/dashboard/layout.tsx`, so toasts only work on dashboard routes.
- Code highlighting uses Shiki with the JS regex engine and per-language lazy imports — register new languages in `src/lib/highlighter.tsx`.

## Types & helpers (single sources of truth)

- `JobFormData` in `src/lib/types/job-form-data.ts` is the canonical job document shape (as the Express backend stores it). All values are strings on purpose (FormData); `isRemote` is `"on" | "off"` **never a boolean**; compare `type` case-insensitively (legacy docs may say "Full-Time"). Its exported `JOB_TYPES` / `JOB_CATEGORIES` / `PAY_FREQUENCIES` option lists are shared by the New Job form and browse filters.
- `JobPostRow` (manage-jobs table row) lives in `src/types/jobs.ts`; `JobApplication` in `src/types/applications.ts`.
- Display helpers (dept icons, currency symbols, deadline/frequency/time-ago/compact formatting) live in `src/lib/jobs/display.ts` — reuse instead of re-implementing.
- `DarkPage` + `PageHeader` (dark shell + breadcrumb/heading block) in `src/components/layout/page.tsx` are the shared wrappers for dashboard job pages.

## Pages

- Routes: `/` (home, dark), `(auth)/sign-in` + `sign-up`, `/browse-jobs` + `/browse-jobs/[id]`, `/dashboard/{seeker,recruiter,admin}` (seeker also has `applications`; recruiter has `jobs` and `jobs/new`).
- `src/app/dashboard/layout.tsx` wraps every dashboard route in `SidebarProvider` + `DashboardSidebar` + `Toaster`; its `<main>` is `flex min-w-0 flex-1` so pages fill the width next to the sidebar.
- `/browse-jobs` is a server component driven by searchParams: everything except `page`/`salary`/`sort` is forwarded to `GET /jobs` (multi-value params flattened); those three are applied client-side (slice of 5, string-salary filter, sort) and never sent to the backend.
- Recruiter Manage Jobs (`/dashboard/recruiter/jobs`) is a server component fetching `getJobs()`; 8-column table in an `overflow-x-auto` with `min-w-[960px]`. Row actions: View (`ViewJobDialog`, eye icon, reads the row object — no extra fetch) → Update (Link to `/dashboard/recruiter/jobs/new?edit=<id>`, form does NOT pre-fill yet) → Delete (`DeleteJobDialog` → `deleteJob` → `router.refresh()`). Dialogs are client components because the page is a server component.
- New Job form (`/dashboard/recruiter/jobs/new`, client): shared inputs in `src/components/jobs/form-fields.tsx`; collects one `FormData` → `Object.fromEntries` → `createJob` (POST /jobs) → toast + redirect to Manage Jobs. Publish button is at the **bottom**, not top-right.
- Seeker My Applications is a client page reading `getApplications(session.user.id)` paginated client-side (5 per page).

## Auth

- Server: `src/lib/auth.ts` (email+password + google provider). `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are unset in `.env`, so Google sign-in cannot work until they are (redirect URI: `http://localhost:3000/api/auth/callback/google`).
- User records carry `role` ("seeker" | "recruiter" | "admin", default "seeker") settable at sign-up — `additionalFields.role` with `input: true` (documented security caveat: anyone can register as admin; tighten before production).
- Client: single `authClient` in `src/lib/auth-client.ts` (handlers re-exported; don't create a second client). The `inferAdditionalFields` plugin makes `session.user.role` typed everywhere.
- Auth pages render `AuthCard` (`src/components/auth/auth-card.tsx`, client) for both modes. Contract: on success it waits 1.5s then `router.push("/")`; a page-level `onSubmit` signals failure by **throwing** (real better-auth message shows in the red banner) or returning `false`. The Google button is a placeholder (logs only) — the session token lives only in the response object / httpOnly `better-auth.session_token` cookie.

## Sidebar

- `src/app/components/DashboardSidebar.tsx`: `menuItemsByRole: Record<UserRole, MenuItem[]>` picks the menu from `session.user.role` (MongoDB). Per user decision: no role group labels, no public-links section — role menu only. Footer: initials avatar, name, email · role, Logout (`signOut()` → `/`). `role` is `undefined` while `isPending`, so the menu renders empty briefly.

## Design

- Design is screenshot/Figma-driven: home page is dark with **page-mounted** navbar (`page.tsx` renders `<SiteNavbar />` inside `<main className="dark">` — not in the root layout; other pages must mount it themselves inside their theme wrapper). The navbar is deliberately near-full-bleed (`px-4 sm:px-6 xl:px-10`), NOT the shared `Container` (`max-w-7xl px-4 sm:px-6`, for centered sections like the hero); full-bleed visuals (hero globe, `max-w-[90rem]`) sit outside it.
- Dashboard: main area pages use the shared dark shell (`#0b0b0f`, panels `#131317`, inputs `#1a1a20`) via `DarkPage`; the sidebar is dark. Brand violet tokens (`brand`) live in `globals.css`. Logo: `public/images/logo.png` via `Logo` (`src/components/layout/logo.tsx`).
- Project requirements + Framer Motion conventions live in `c:\Projects\Hireloop resources\hireloop-resources\` (outside the repo).
