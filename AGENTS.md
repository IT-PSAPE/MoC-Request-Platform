# moc-request-platform agent guide

## Mission & stack awareness
- App: Next.js 15 App Router + TypeScript + Tailwind v4 (`src/app`, `src/components`). Data flows through Supabase via providers (`src/providers/root-provider.tsx`) and contexts under `src/contexts/`.
- Domain types live in `src/lib/type.ts` (declared globally); reuse them instead of inventing new interfaces.
- Services already wrap Supabase access (`src/services/*.ts`, `src/lib/database.ts`). Always extend these helpers instead of sprinkling `supabase.from(...)` calls throughout UI.

## Styling, tokens, and typography
- Tailwind is wired through CSS tokens. Color/typography utilities are defined in `src/styles/global.css`, `src/styles/tokens.css`, and overrides in `src/styles/themes.css`. Use semantic classes such as `bg-brand-solid`, `text-foreground`, `paragraph-sm`, or the `Text` component (`src/components/common/text.tsx`). Never hard-code colors or font sizes; map new styles to an existing CSS variable before use.
- Utility helpers such as `cn` (`src/lib/cn.ts`) must be used to merge class names so variants remain composable.
- If a class is missing, add the token once (matching `@theme` conventions) instead of embedding raw HEX or RGB values.

## Component sourcing & composition rules
1. **Search first.** Before writing JSX, inspect `src/components/common`, `src/components/ui`, and feature-specific folders for an existing building block. Reuse `Button`/`IconButton`, `Badge`, `Input`, `Select`, `Checkbox`, `Switch`, `Sheet`, etc. Example: `RequestList` already imports `Input`, `Select`, and `Badge` to assemble filterable lists (`src/components/common/request-list/request-list.tsx`).
2. **Only create a component when nothing fits.** If you must author a new one, colocate it with related UI (e.g., under `src/components/<feature>/`). Follow the house style: declare `type Props = {...}` (or a named interface) above the component, default-export a function component, and add smaller subcomponents when the parent grows (see `RequestList` + `RequestListItem`).
3. **Break up large UIs.** Multi-section experiences (cards, sheets, multi-step forms) should be split into focused children so logic stays isolated. For example, the admin requests experience separates `RequestsContent`, `RequestList`, and `RequestDetailsSheet`.
4. **Use shared primitives.** When you need badges, statuses, icons, loaders, or text styles, pull from existing components (`src/components/common/badge.tsx`, `.../icon.tsx`, `.../loader.tsx`). Wrap new behavior around them instead of recreating the visuals from scratch.
5. **Stick to Tailwind utilities.** No inline styles or third-party UI libraries (README explicitly forbids shadcn). Compose Tailwind classes with the existing token names.

## Data & state guidelines
- Context providers own long-lived state. Consume `AuthContext`, `AdminContext`, `BoardContext`, `DefaultContext`, or `FormContext` through their hooks rather than instantiating new stores.
- `useSupabaseClient` (`src/hooks/use-supabase-client.ts`) is the single entry point for creating Supabase clients; never call `createClient` elsewhere.
- Business logic that talks to Supabase belongs in services or `src/lib/database.ts` helpers (e.g., `FormService.create`, `admin-service.ts`). Extend these modules to add operations so that components stay declarative.
- Status-to-color rules already exist in `src/features/defaults.ts` and within badges—reuse the mappings so status colors stay consistent.

## Implementation workflow
1. **Understand the feature.** Read the relevant page/component in `src/app` plus any context/service powering it.
2. **Inventory existing parts.** Grep for nouns like “badge”, “card”, or “sheet” to find reusable building blocks before coding.
3. **Design with tokens.** Identify the semantic colors/typography utilities you need from `src/styles/global.css`/`tokens.css`.
4. **Code with composition.** Glue existing components together, only adding the minimal new props/variants required. Use the `cn` helper for class merging.
5. **Keep files tidy.** Extract helper components when JSX exceeds a single concern, colocate them, and keep prop types at the top of the file.
6. **Verify.** Run `npm run lint` locally whenever you introduce logic or JSX changes. Ensure Supabase interactions go through the provided services.

## Do’s
- Do favor existing components, hooks, and contexts; extend them via props/children before adding new files.
- Do keep prop and state types explicit using the shared domain definitions.
- Do split multi-purpose components into smaller, named children to preserve readability.
- Do reference `src/styles/global.css`/`tokens.css` when selecting colors or typography utilities.
- Do document non-obvious logic with short comments (only when the code isn’t self-explanatory).
- Do keep diffs narrow, reference the relevant paths in discussions, and ensure new code stays client/server compatible (add `'use client'` only when you truly need browser APIs).

## Don’ts
- Don’t invent new UI kits, raw CSS files, or duplicate primitives that already live in `src/components/common`.
- Don’t hard-code colors, spacing, or fonts—always use the Tailwind classes bound to our CSS variables.
- Don’t bypass contexts/services to call Supabase directly inside components.
- Don’t store duplicated state when a context already exposes it.
- Don’t add npm dependencies, env vars, or Tailwind plugins without explicit approval.
- Don’t leave large anonymous blobs of JSX; always factor purposeful subcomponents.

## Quick references
- Colors & typography: `src/styles/global.css`, `src/styles/tokens.css`, `src/styles/themes.css`
- Primitive components: `src/components/common/*`
- Feature composites: `src/components/admin/*`, `src/app/**/components`
- Supabase helpers: `src/hooks/use-supabase-client.ts`, `src/lib/database.ts`, `src/services/*.ts`
- Context providers: `src/providers/root-provider.tsx`, `src/contexts/*.tsx`
