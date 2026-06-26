# Dash

A personal infrastructure monitoring dashboard. One place to check on everything before going to sleep — Render hosting usage, API credits across the providers I actually use, and whether my deployed projects are online.

Built because I kept opening five different tabs every night to check the same things. Now it's one tab.

![Status](https://img.shields.io/badge/status-in%20development-orange)

## What it does

- **Render Free Hosting** — tracks free-tier instance hours used out of the monthly 750-hour allowance, with an auto-calculated renewal date (always the last day of the current month, no manual updates needed)
- **API Credits** — live usage for each API provider used across my other projects (Tavily today, more being added over time — see [Roadmap](#roadmap))
- **Render Projects** — live online/offline status for every deployed service, pulled directly from Render's API, each linking out to its real Render dashboard page

The API Credits and Projects sections are both built to render however many entries exist in the data — adding a new API provider or deploying a new project never requires a frontend change.



## Stack

**Frontend** — React + Vite, plain CSS with a custom design-token theme system (light/dark), no UI framework. Installable as a PWA.

**Backend** — Flask, no database. A flat JSON file acts as a cache, refreshed on demand rather than polling continuously — since the backend runs on Render's free tier and isn't always awake.

## Why no database

This is a single-user, personal tool. A database would be solving a problem that doesn't exist here. A cached JSON file on disk does the same job with a fraction of the complexity — read on page load, overwritten when you hit "Sync Now." The tradeoff: Render's free tier has an ephemeral filesystem, so the cache resets on redeploy. That's fine — it just means showing zeros until the next manual sync, which the UI already handles gracefully.

## How sync works

Render's API doesn't expose how many free-tier hours you've used — only the limit, not the usage. The dashboard shows your live usage and project status pulled from real provider APIs, with the hosting-hours figure currently set manually pending a browser-automation step that will fetch it directly from Render's billing page.

There's no background polling. You explicitly trigger a sync, the backend re-checks everything in one pass, caches the result, and the UI animates in the fresh numbers.

## Project structure

```
Dash/
├── frontend/              React + Vite app
│   ├── src/
│   │   ├── components/    UI components
│   │   ├── hooks/         data fetching, theme, animation logic
│   │   ├── context/       theme state
│   │   ├── styles/        design tokens (theme.css), global resets
│   │   └── utils/         formatting, icon/provider mapping
│   └── public/            manifest, app icons
├── main.py                 Flask app — routes, Render API integration
├── requirements.txt
├── .env.example
└── cache.json               generated at runtime, not committed
```

## Running locally

You'll need two terminals.

**Backend**
```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env          # then fill in your own keys
python main.py
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://127.0.0.1:5000` by default.

## API contract

Two endpoints, identical response shape:

- `GET /api/dashboard` — returns cached data (always returns *something*, even before the first sync — zeroed defaults rather than an empty state)
- `POST /api/sync` — re-runs all checks, updates the cache, returns fresh data

```json
{
  "last_synced_at": "2026-06-26T13:43:46.471243",
  "hosting": { "hours_used": 497.6, "hours_total": 750, "renews_on": "2026-06-30" },
  "apis": [
    { "name": "Tavily api", "used": 295, "total": 1000, "resets_in_seconds": 36972 }
  ],
  "projects": [
    {
      "name": "beru_bot",
      "type": "web_service",
      "plan": "free",
      "is_online": true,
      "render_url": "https://dashboard.render.com/web/srv-..."
    }
  ]
}
```

## Roadmap

- [ ] Automate hosting-hours retrieval (currently set manually — Render doesn't expose this via API)
- [ ] Add OpenRouter credit tracking
- [ ] Add Groq usage tracking (via rate-limit response headers, since Groq has no dedicated balance endpoint)
- [ ] Add usage tracking for future TTS/STT providers as they're integrated into other projects
