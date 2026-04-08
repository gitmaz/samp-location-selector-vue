# Location selector (Vue + Vuex + Node)

Sample full-stack app: pick a point on an OpenStreetMap-based map (Sydney CBD by default), save the resolved address to SQLite, and browse past selections.

- **Frontend:** Vue 3, Vuex 4, Vue Router, Vite, Leaflet  
- **Backend:** Express (MVC-style layout), `better-sqlite3`, reverse geocoding via [Nominatim](https://nominatim.org/)

## Prerequisites

- **Node.js** 18+ (includes `fetch` used by the server for geocoding)
- **npm** (comes with Node)

## Install

From this directory (`samp-location-selector-vue`):

```bash
npm install
npm run install:all
```

This installs the root dev dependency (`concurrently`), then dependencies for `server/` and `client/`.

## Run (development)

Start the API and the Vite dev server together:

```bash
npm run dev
```

- **Web UI:** [http://localhost:5173](http://localhost:5173)  
- **API:** [http://localhost:3001](http://localhost:3001) (Vite proxies `/api` to this port)

Run the API alone (from `server/`):

```bash
cd server && npm run dev
```

Run the client alone (from `client/`):

```bash
cd client && npm run dev
```

## Using the app

1. Open **Map** in the header (home). The map centers on Sydney CBD; click anywhere to place the marker.
2. Click **Save location**. The server reverse-geocodes the coordinates (unless you extend the client to send an `address` field) and stores **address**, **latitude**, **longitude**, and a timestamp in `server/data/locations.db`.
3. Open **Past locations** to see every saved row, newest first. Use **Refresh** to reload from the server.

## Production-style build

Build the client and serve it from the API (optional):

```bash
npm run build
npm start
```

`npm start` runs `node server/src/app.js` from the **repository root**. The server serves `client/dist` when that folder exists. For database paths, run processes from the same working directory you use in development, or set paths via environment variables as needed.

## Environment variables

| Variable | Where | Description |
|----------|--------|-------------|
| `PORT` | Server | API port (default **3001**). |
| `CORS_ORIGIN` | Server | CORS origin(s); default allows any origin in development. |
| `NOMINATIM_USER_AGENT` | Server | Identifies your app to Nominatim (recommended for production). |
| `NODE_ENV` | Server | If not `production`, error responses may include stack traces. |

You can place a `server/.env` file (loaded via `dotenv`) for local overrides.

## API (quick reference)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Liveness check |
| GET | `/api/locations` | List all saved locations |
| POST | `/api/locations` | Body: `{ "latitude": number, "longitude": number, "address"?: string }` |

## Project layout

- `client/` — Vite + Vue SPA  
- `server/` — Express app (`src/config`, `src/controllers`, `src/models`, `src/routes`, `src/services`, `src/middleware`)  
- `server/data/` — SQLite file `locations.db` (created on first run; ignored by git when listed in `.gitignore`)

## Troubleshooting

### Windows install errors (SQLite / `better-sqlite3`)

`better-sqlite3` is a native addon. If `npm install` in `server/` fails on Windows:

- Install [Build Tools for Visual Studio](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (C++ workload)
- Install Python 3 and ensure it is available on PATH (used by `node-gyp` when a prebuilt binary is not available)
- Then retry:

```bash
cd server
npm install
```

