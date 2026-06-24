# Surround Workbench — Landing Site

The marketing / download page that lives at
`https://<your-username>.github.io/<your-repo>/` (default GitHub Pages URL).
Built with Vite + React + Tailwind v3, no JavaScript framework dependencies
beyond `react`, `react-dom` and `lucide-react`.

## Quick edits before you publish

Open **`src/config.ts`** and replace the placeholders:

```ts
export const GITHUB_REPO  = 'https://github.com/YOUR-USERNAME/surround-workbench'
export const DOWNLOAD_URL = 'https://github.com/YOUR-USERNAME/surround-workbench/releases/latest/download/SurroundWorkbench-standalone.zip'
export const VERSION      = 'v1.0.0'
export const AUTHOR       = 'You'
```

Everything else (screenshots, copy, FAQ) reads from those four constants where
it needs to.

## Run it locally

```bash
cd landing
yarn install     # or pnpm install / npm install
yarn dev         # http://127.0.0.1:4174/
```

## Build the static site

```bash
yarn build       # output goes to ./dist (fully relative paths, ready for any static host)
yarn preview     # serve the built site on http://127.0.0.1:4173/
```

## Deploy

### A. GitHub Pages — automatic (recommended)

This repo ships a workflow at **`.github/workflows/deploy-landing.yml`** that
rebuilds and publishes the site on every push to `main`.

One-time setup:

1. Push the repo to GitHub.
2. In the repo go to **Settings → Pages → Build and deployment → Source** and
   pick **"GitHub Actions"**.
3. Push to `main`. The workflow runs, the site goes live at
   `https://<your-username>.github.io/<your-repo>/`.

### B. GitHub Pages — manual (zero CI)

```bash
cd landing && yarn build
# Publish dist/ to the gh-pages branch with the tool of your choice, e.g.:
npx gh-pages -d dist -b gh-pages
```

Then in **Settings → Pages → Source** select the `gh-pages` branch.

### C. Anywhere else (Netlify / Vercel / Cloudflare Pages)

- **Root directory:** `landing`
- **Build command:** `yarn install && yarn build`
- **Publish directory:** `landing/dist`

No environment variables required.

## Replacing the screenshots

Drop new JPEG/PNG files into `public/screenshots/` keeping these filenames:

```
hero.jpg        — used inside the framed window chrome at the top of the hero
routing.jpg     — Routing tab in the gallery
equalizer.jpg   — Equalizer tab in the gallery
commands.jpg    — Commands tab in the gallery
notes.jpg       — Notes tab in the gallery
```

Aspect ratio guidance:

- `hero.jpg`: ~2.45:1 (e.g. 1320×540)
- gallery shots: ~1.9:1 (e.g. 1320×700)

## Project structure

```
landing/
├── package.json
├── index.html               # loads Bricolage Grotesque + JetBrains Mono
├── vite.config.ts           # base: './' for GitHub Pages sub-paths
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json / .node.json
├── public/
│   ├── surround-workbench.svg     # app icon (used in nav + footer + favicon)
│   └── screenshots/*.jpg
└── src/
    ├── main.tsx
    ├── App.tsx              # 8 section components in order
    ├── config.ts            # GITHUB_REPO + DOWNLOAD_URL + VERSION + AUTHOR
    ├── index.css            # theme tokens + grain + reveal animations
    └── components/
        ├── Nav.tsx
        ├── Hero.tsx
        ├── TrustStrip.tsx
        ├── Features.tsx
        ├── Install.tsx
        ├── Gallery.tsx
        ├── ConfigPreview.tsx
        ├── Faq.tsx
        └── Footer.tsx
```
