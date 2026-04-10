# Fetch a Friend — Frontend

React single-page app for **Fetch a Friend**, a marketplace that connects pet owners with pet sitters. Users can browse and manage jobs, profiles, bookmarks, zip-based sitter search, file uploads, and real-time chat (STOMP over SockJS).

The API lives in the companion repo **[fetch-a-friend-backend](https://github.com/ArielleWaks/fetch-a-friend-backend)** (Spring Boot on **http://localhost:8080** in development). If you clone both next to each other, the backend path is `../fetch-a-friend-backend` relative to this repository.

## Stack

| Area | Technology |
|------|------------|
| UI | React 18, Vite 6 |
| Routing | React Router 6 |
| HTTP | Axios (relative `/api/...` URLs in development) |
| Styling & components | Bootstrap 5, React Bootstrap, MUI (Emotion, icons, date pickers), MDB React UI Kit |
| Real-time chat | `sockjs-client`, `stompjs` → `/ws` (proxied to the backend in dev) |

## Prerequisites

- **Node.js** — **20+** recommended (see `engines` in `package.json`).
- **Running backend** — MySQL (e.g. Docker Compose in the backend repo) and `./gradlew bootRun` so the API is available on port **8080** before you rely on auth, jobs, chat, or uploads.

## Quick start

```bash
npm install
npm start
```

The dev server defaults to **http://localhost:3000**.

### Order of operations (full stack locally)

1. In **fetch-a-friend-backend**: start MySQL (`docker compose up -d` if you use the provided Compose file), then `./gradlew bootRun`.
2. In **fetch-a-friend-frontend**: `npm install` and `npm start`.

## Environment variables

No environment variables are required for the default UI. You can still add a root **`.env`** (gitignored) if you introduce optional `VITE_*` settings later.

## How the frontend talks to the API

In development, **Vite** (`vite.config.js`) proxies API traffic to the backend. With `npm start` or `npm run dev`, that means:

- Calls like `/api/auth/signin`, `/api/jobs`, `/file/...`, and **`/ws`** for SockJS reach Spring Boot on **8080**.
- You normally **do not** need to set a separate API base URL for local development.

For a **production** build, configure your host or reverse proxy so the same paths resolve to your deployed API (or set a build-time base URL and update services if you move away from same-origin deployment).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server with hot reload (port 3000) |
| `npm run build` | Optimized production bundle in `dist/` |
| `npm test` | Vitest (watch mode) |
| `npm run test:run` | Vitest single run (CI-friendly) |

## Project layout (high level)

- `src/App.jsx` — nav shell; routes live under `src/app/routes.jsx` with providers in `src/app/providers.jsx`
- `src/pages/` — screens (auth, jobs, profile, chat, bookmarks, etc.)
- `src/components/` — shared UI (navbar, job cards, footer, …)
- `src/services/` — Axios-based auth, user, and file helpers
- `public/` — static assets; root `index.html` is the Vite entry template

## Tests

```bash
npm test
```

## Related repository

- **Backend (API, security, WebSocket, persistence):** [fetch-a-friend-backend](https://github.com/ArielleWaks/fetch-a-friend-backend) — or locally: `../fetch-a-friend-backend` when both repos share a parent folder.

For API paths, Postman, and security rules, see that repo’s README and `postman/fancyrats.postman_collection.json`.
