## MOC Request Platform

Next.js + Tailwind app to submit, track, and process requests. Frontend only for now using localStorage as a mock backend. No shadcn components.

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

## Routes

- `/` Home and navigation
- `/submit` Public form to create a request (5W1H, priority, attachments with 5MB cap)
- `/requests` Public list of all requests with search and status filter
- `/admin` Admin dashboard with columns per status, drag-and-drop, status dropdown, detail/notes panel
  - Demo auth: password `admin`

## Data model

Defined in `src/types/request.ts`:

- `RequestItem` with 5W1H fields, `priority`, `attachments`, `status`, timestamps, and `notes`
- `RequestStatus`: `pending | not_started | in_progress | paused | completed | dropped`

## Mock store

`src/lib/store.ts` persists to `localStorage` with basic CRUD and status updates. Replace with real API later.

## UI

Custom components in `src/components/ui/` (Button, Input, Textarea, Select, Badge, Card, Dropzone) built from scratch with Tailwind.

## Notes and next steps

- Replace mock auth with real auth (e.g., NextAuth or custom)
- Replace localStorage with API routes + database
- Add server-side validation and file storage
