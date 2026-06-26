# Dash

Personal infrastructure monitoring dashboard — Render hosting, API usage,
and project status in one place. iOS-inspired, responsive (web shell with
popover settings, mobile shell with bottom tab bar), light/dark themed,
PWA-installable.

## Setup

```bash
npm install
npm run dev
```

Runs against a Flask backend expected at `http://127.0.0.1:5000` (see
`src/hooks/useDashboardData.js` — update `API_BASE` once you deploy your
backend somewhere else).

## Build

```bash
npm run build
```

Outputs to `dist/` — deploy this folder as a static site on Render.

## Project structure

- `src/components/` — all UI components
- `src/hooks/` — data fetching (`useDashboardData`), responsive breakpoint
  (`useIsMobile`), sweep animation (`useCountUp`)
- `src/context/ThemeContext.jsx` — light/dark theme state + localStorage persistence
- `src/styles/theme.css` — every color/spacing/radius token, light + dark variants
- `src/utils/iconMaps.js` — maps project types and API provider names to
  icons/colors. Add new entries here as you add new providers — no other
  code needs to change, the API credits row and project list both already
  render however many items exist in the data.
- `icon-source/dash-icon.svg` — the app icon source, regenerate PNGs with
  cairosvg or any SVG-to-PNG tool if you ever want to tweak it.

## Backend contract

Two endpoints, identical response shape:

- `GET /api/dashboard` — returns cached data
- `POST /api/sync` — re-runs all checks, updates cache, returns fresh data

```json
{
  "last_synced_at": "2026-06-26T13:43:46.471243",
  "hosting": { "hours_used": 497.57, "hours_total": 750, "renews_on": "2026-06-30" },
  "apis": [{ "name": "Tavily api", "used": 295, "total": 1000, "resets_in_seconds": 36972 }],
  "projects": [{ "name": "...", "type": "web_service", "plan": "free", "is_online": true, "render_url": "..." }]
}
```
