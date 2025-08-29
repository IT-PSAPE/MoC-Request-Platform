## MOC Request Platform

Next.js + Tailwind app to submit, track, and process requests. Frontend only for now using localStorage as a mock backend. No shadcn components.

## Quickstart

1. Install deps

```bash
npm install
```

```markdown
# MOC Request Platform

Next.js (App Router) + Tailwind CSS demo app for submitting, tracking and processing requests. The project is frontend-only and uses localStorage as a mock backend and a demo auth flag for the admin area.

## Quickstart

1. Install deps

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open http://localhost:3000

## Routes (current)

- `/` Home / navigation
- `/form` Public form to create a request (5W1H, priority, attachments)
- `/requests` Public list of requests with simple filters
- `/login` Dedicated admin login page (demo auth)
- `/admin` Admin dashboard (protected client-side; redirects to `/login?next=/admin` when unauthenticated)

> Note: the admin area uses a demo auth helper stored in `localStorage` (password: `admin`). This is for demo/dev only.

## Key folders & files

- `src/app/` – Next.js App Router pages and layout (includes `admin`, `login`, `form`, `requests`)
- `src/components/ui/` – Reusable UI components (Button, Card, Textarea, Select, LoginForm, LoginFormContainer, etc.)
- `src/features/auth/auth.ts` – Demo auth helper (reads/writes an auth flag to `localStorage`)
- `src/features/admin/useAdminController.ts` – Admin UI controller (auth state, item loading, actions)
- `src/features/requests/` – Request-related services and controllers (`service.ts`, `formController.ts`, `catalog.ts`, etc.)
- `src/lib/store.ts` – LocalStorage-backed mock store used by `RequestService`
- `src/types/request.ts` – Request domain types (RequestItem, RequestStatus, attachments, notes, event flow)

## Auth & routing behavior

- A dedicated `GET /login` page exists at `src/app/login/page.tsx`. It accepts an optional `next` query parameter (e.g. `/login?next=/admin`).
- The login UI is implemented as a small client container component `src/components/ui/LoginFormContainer.tsx` which calls `Auth.login(password)` and redirects client-side to the provided `next` path on success.
- The admin page (`src/app/admin/page.tsx`) reads auth state from `useAdminController()` and only redirects to `/login?next=/admin` when the auth state is explicitly `false`. While the client checks `localStorage` the page shows a short loading placeholder to avoid redirect races.

## Data model summary

- `RequestItem` (defined in `src/types/request.ts`) contains the 5W1H fields (who/what/when/where/why/how), `additionalInfo`, `priority`, `attachments`, `status`, optional scheduling (`dueAt`, `kind`) and optional `eventFlow` (sequence of segments/songs).
- Event flow steps are represented as `EventFlowStep` objects (id, order, type, label, optional songId) and used in the form and details UI.

## Mock persistence

- All data is persisted to `localStorage` via the local store (`src/lib/store.ts`) and surfaced through `RequestService` (`src/features/requests/service.ts`). This is intentionally simple for the demo.

## UI patterns and styling

- Tailwind CSS is used for styling. UI components live under `src/components/ui/` and follow small, composable patterns (Card, Button, Input, Textarea, Select, Sheet, ScrollArea, etc.).
- The admin uses a kanban-like board built with `RequestCard` items and a details `Sheet` for editing notes and checklists.

## Development notes & next steps

- This repo uses a demo auth flow (password stored in `src/config.ts` as `CONFIG.demo.adminPassword`). For production replace with a server-side session or third-party auth (NextAuth, Clerk, etc.).
- Replace `localStorage` persistence with API routes + a database for multi-user consistency and server-side protection.
- Add server-side validation and secure file storage for attachments.
- Consider feature tests for the login redirect flow and admin actions.

``` 
