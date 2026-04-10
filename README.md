# Fetch a Friend — Frontend

React single-page app for **Fetch a Friend**, a marketplace that connects pet owners with pet sitters. Users can browse and manage jobs, profiles, bookmarks, maps-based search, file uploads, and real-time chat (STOMP over SockJS).

The API lives in the companion repo **[fetch-a-friend-backend](https://github.com/ArielleWaks/fetch-a-friend-backend)** (Spring Boot on **http://localhost:8080** in development). If you clone both next to each other, the backend path is `../fetch-a-friend-backend` relative to this repository.

## Stack

| Area | Technology |
|------|------------|
| UI | React 18, Create React App (`react-scripts` 5) |
| Routing | React Router 6 |
| HTTP | Axios (relative `/api/...` URLs in development) |
| Styling & components | Bootstrap 5, React Bootstrap, MUI (Emotion, icons, date pickers), MDB React UI Kit |
| Maps | Google Maps / Places (`@react-google-maps/api`, `@vis.gl/react-google-maps`, `use-places-autocomplete`) |
| Real-time chat | `sockjs-client`, `stompjs` → `/ws` (proxied to the backend in dev) |

## Prerequisites

- **Node.js** — LTS recommended (this project uses `react-scripts` with `--openssl-legacy-provider` for webpack on newer OpenSSL; if `npm start` fails on an older setup, upgrade Node or adjust per CRA/OpenSSL guidance).
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

Create a **`.env`** file in this project root (it is gitignored). Create React App only exposes variables prefixed with `REACT_APP_`.

| Variable | Required for | Notes |
|----------|----------------|-------|
| `REACT_APP_GOOGLE_MAP_API` | Map / geocoding screens | Google Maps JavaScript API key. Do not commit real keys. |

Example:

```bash
REACT_APP_GOOGLE_MAP_API=your-key-here
```

## How the frontend talks to the API

`package.json` sets:

```json
"proxy": "http://localhost:8080"
```

During `npm start`, the CRA dev server forwards unknown requests to the backend. That means:

- Calls like `/api/auth/signin`, `/api/jobs`, `/file/...`, and **`/ws`** for SockJS reach Spring Boot on **8080**.
- You normally **do not** need to set a separate API base URL for local development.

For a **production** build, configure your host or reverse proxy so the same paths resolve to your deployed API (or set a build-time base URL and update services if you move away from same-origin deployment).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server with hot reload (port 3000) |
| `npm run build` | Optimized production bundle in `build/` |
| `npm test` | Jest / React Testing Library (`react-scripts test`) |

## Project layout (high level)

- `src/App.js` — routes, nav shell, localization (Dayjs + MUI pickers)
- `src/pages/` — screens (auth, jobs, profile, chat, bookmarks, etc.)
- `src/components/` — shared UI (navbar, maps, job cards, footer, …)
- `src/services/` — Axios-based auth, user, and file helpers
- `public/` — static assets and HTML shell

## Tests

```bash
npm test
```

## Related repository

- **Backend (API, security, WebSocket, persistence):** [fetch-a-friend-backend](https://github.com/ArielleWaks/fetch-a-friend-backend) — or locally: `../fetch-a-friend-backend` when both repos share a parent folder.

For API paths, Postman, and security rules, see that repo’s README and `postman/fancyrats.postman_collection.json`.
