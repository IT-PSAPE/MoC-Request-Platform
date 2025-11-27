# moc-request-platform agent guide

## Mission & stack awareness
- Next.js 15 App Router + TypeScript + Tailwind v4. UI lives under `src/app` and `src/components`.
- Supabase is the data layer. The client is created via `useSupabaseClient` and injected through `RootProvider` (`src/providers/root-provider.tsx`) which wraps `QueryProvider`, `AuthContext`, `CacheSyncProvider`, and `DefaultContext`.
- React Query handles fetching/caching; real-time invalidation is wired in `useRealtimeSubscriptions`.
- Domain types are global in `src/lib/type.ts` and UI/system enums in `src/types/system-types.ts`. Reuse these instead of creating new interfaces.
- README still references a legacy localStorage flow; the live code uses Supabase and contexts—follow this guide, not the README, for implementation details.

## Styling, tokens, and primitives
- Tailwind classes map to tokens in `src/styles/colors-*.css`, `src/styles/tokens.css`, and spacing tokens. Use semantic utilities like `bg-brand-solid`, `text-primary`, `paragraph-sm`, or the `Text` component (`src/components/common/text.tsx`); never hard-code colors or font sizes.
- Merge classes with `cn` (`src/lib/cn.ts`) so variants stay composable. Add new tokens once (with `@theme` conventions) instead of embedding hex values.
- Reuse primitives from `src/components/common`: `button.tsx`/`IconButton`, `badge.tsx`, form inputs (`forms/input.tsx`, `forms/select.tsx`, etc.), `checkbox.tsx`, `switch.tsx`, `tabs`, `sheet`, `popover`, `cards/*`, `loader`, `inline-alert`, and typography via `Text`.
- Request UI building blocks already exist (`request-list` + `request-list-item`, cards, sheets). Prefer extending them over creating new patterns.

## Data, services, and state
- Long-lived state comes from contexts: `AuthContext`, `DefaultContext` (statuses/priorities/types/list view + supabase), `FormContext`, `BoardContext`, and `AdminContext` (cached and non-cached variants). Use their hooks instead of new global stores.
- Supabase interactions belong in services (`src/services/*.ts`) or table helpers (`src/lib/database.ts`). Extend these or the cached hooks in `src/hooks` rather than sprinkling `supabase.from(...)` in components.
- Cached hooks (`use-cached-requests`, `use-cached-defaults`, `use-cached-storage`) pair with `QueryKeys` (`src/lib/query-keys.ts`) for consistent cache keys, optimistic updates, and invalidation. Let `CacheSyncProvider` manage real-time invalidation.
- Status color rules live in `src/features/defaults.ts` and badge components—reuse them for consistent chips/indicators.

## Auth and routing
- Middleware (`middleware.ts`) uses `@supabase/ssr` to guard `/admin` routes server-side and redirects authenticated users away from `/login`.
- Client protection uses `AuthGuard` (`src/components/common/auth-guard.tsx`) and the Supabase-backed `AuthContext`. `LoginForm` already wires to `login`; use it rather than rolling your own auth calls.
- `SmartRedirect` gives a safe loading gate for pages that branch on auth.

## Implementation workflow
1) Read the relevant page in `src/app/**` plus its provider/service. Align with current Supabase + React Query flow rather than the legacy README.
2) Inventory existing components under `src/components/common` (cards, sheets, lists, nav) before authoring new JSX. Keep new pieces colocated with their feature.
3) Design with tokens and semantic classes; add tokens instead of raw values. Use `cn` for variants and add `'use client'` only when needed.
4) For data, favor the cached hooks and service helpers; wire cache keys/invalidation via `QueryKeys` and let `CacheSyncProvider` handle live updates.
5) Keep files focused: declare prop types at the top, extract subcomponents when JSX mixes concerns, and document only non-obvious logic.
6) Verify with `npm run lint` when changing logic/JSX. Ensure Supabase env vars are present if running locally.

## Do’s
- Favor existing primitives/contexts/hooks; extend them via props or small variants before adding new files.
- Keep types explicit using the shared domain definitions.
- Split multi-section UIs into purposeful children and, when they share state (filters/drag counts), add a colocated provider.
- Reference token files for colors/typography/spacing; keep class names semantic.
- Leave short comments only where behavior is non-obvious.
- Keep diffs narrow and compatible with server/client boundaries.

## Don’ts
- Don’t add new UI kits, raw CSS files, or inline styles; avoid third-party component libs.
- Don’t hard-code colors, spacing, or fonts—map to existing Tailwind token classes instead.
- Don’t bypass services/hooks/contexts to talk to Supabase directly from components.
- Don’t duplicate state that a context already exposes.
- Don’t add dependencies, env vars, or Tailwind plugins without approval.
- Don’t leave large anonymous JSX blobs—factor subcomponents.

## Quick references
- Tokens & typography: `src/styles/colors-primitive.css`, `colors-token.css`, `colors-utility.css`, `spac-primitive.css`, `tokens.css`
- Primitives: `src/components/common/*` (forms, tabs, sheet, popover, cards, loaders, text)
- Feature composites: `src/components/admin/*`, `src/components/common/request-list/*`, `src/app/**`
- Supabase helpers & caching: `src/hooks/use-supabase-client.ts`, `src/hooks/use-cached-*.ts`, `src/lib/query-keys.ts`, `src/services/*.ts`, `src/lib/database.ts`
- Context providers: `src/providers/root-provider.tsx`, `src/contexts/*.tsx`
- Auth flow: `middleware.ts`, `src/components/common/auth-guard.tsx`, `src/components/common/login-form.tsx`


Dry Run Notes 

MoC:
- Background welcome music
- Taking event pictures:
- Arrival downstairs/upstairs
- Worship Song: Wahamba Nathi

- Background lunch music:

- Presentations
- Taking leaders group picture after each presentation. 
- Worship Song: (to be confirmed) 
- Pledge Pictures 
- Chant Pictures 
- Closing Group Picture
- Praise Song: (to be confirmed) while pastors gather themselves for the picture. 

Required:
- 1 Wired Mic
- (Maybe Amen mic)
- Performance (Skirt) 2 Mics
- Presentations (clicker - maybe)
- Video edited for Saturday morning
- Walk up background music, each time a pastor is called up for presentation.