# DeFi Journey

A static, no-build-step site pairing a **DeFi architecture roadmap** (the hub) with a
growing **library of auditor-grade protocol exams**.

- **Hub** — `index.html`: the 10-node dependency-ordered roadmap. Each node shows a
  live *Take exam →* button if an exam is registered for it, otherwise a disabled
  *Exam coming soon* pill.
- **Exams** — `exams/<slug>/`: one folder per exam. All content lives in `data.js`;
  the quiz logic is shared in `assets/engine.js`.

No npm, no framework, no bundler, no backend, no analytics. All state is `localStorage`.

---

## Run it locally

ES modules are subject to CORS, so browsers block them on `file://`. Serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000            the roadmap hub
# → http://localhost:8000/exams/uniswap-v2/   the first exam
```

(The hub's exam links do fall back to `exams/<id>/index.html` under `file://`, but the
module imports themselves still need a server. Any static server works.)

## Deploy

Push the folder. `netlify.toml` publishes the repo root with no build command, which
gives clean `/exams/<slug>/` URLs natively. `_redirects` sends unknown paths to the hub
with a 404 status.

**Before the first deploy**, set the real values in `assets/config.js`:

```js
export const SITE_URL = "https://defijourney.netlify.app"; // <- your Netlify URL
export const X_HANDLE = "@NAsaturyan";
export const SITE_NAME = "DeFi Journey";
```

Nothing else hardcodes the URL or the handle — share links and canonical tags all read
from here.

---

## How to add an exam

1. **Copy the template.**

   ```bash
   cp -r exams/_template exams/<slug>
   ```

2. **Fill in `exams/<slug>/data.js`** — meta (`id` must equal the folder name),
   optional `theme`, `cats`, `questions`, and set `roadmapNode` to the hub node
   ("01".."10") the exam belongs to. Optionally update the `<title>` in
   `exams/<slug>/index.html`; the engine sets it at runtime either way.

3. **Add one line to `exams/manifest.js`.**

   ```js
   export default [
     { id: "uniswap-v2", roadmapNode: "01", protocol: "Uniswap V2", status: "live" },
     { id: "aave-v3",    roadmapNode: "03", protocol: "Aave v3",    status: "live" }  // <- new
   ];
   ```

4. **Commit and push.** Netlify redeploys; the matching hub node switches from
   *Exam coming soon* to *Take exam →* automatically. No hub code changes, ever.

Use `status: "soon"` to register a planned exam without exposing a link yet.

### Exam data schema

`exams/<slug>/data.js` default-exports one object. Required:

| key | what it is |
|---|---|
| `id` | URL slug, must match the folder name |
| `number` | display badge, e.g. `"01"` → *protocol exam 01* |
| `protocol` | short name, used in the title and share text |
| `title`, `subtitle` | header copy (HTML allowed) |
| `roadmapNode` | `"01"`..`"10"` — ties the exam to a hub node |
| `cats` | category names; a question's `c` is an index into this array |
| `questions` | `{ c, q, opts, a, exp, code? }` — `a` is the correct option index |

Optional, with engine defaults: `theme`, `hero`, `verdictTiers`, `gapNotes`, `nextUp`.

- **`theme`** overrides CSS custom properties on `<body>`. Recognised keys: `bg`,
  `panel`, `panel2`, `line`, `lineSoft`, `ink`, `dim`, `faint`, `accent`, `accent2`,
  `ok`, `bad`, `code`. Omit it entirely for the neutral navy/gold default.
- **`hero`** is an SVG string. Omit it and the engine draws a default progress curve
  labelled with the protocol name. A custom hero animates with progress if it contains
  elements marked `[data-hero-path]`, `[data-hero-glow]` and `[data-hero-dot]` (the ids
  `#hyp`, `#hypGlow`, `#dot` also work).
- **`gapNotes`** is one note per category, shown when that category scores under 80%.
- `q`, `subtitle` and `exp` render as HTML (so `<b>…</b>` works). `opts` and `code` are
  escaped and render literally.

Questions may have any number of options — they don't all need four.

---

## Layout

```
index.html              roadmap hub = landing page
assets/
  config.js             SITE_URL, X_HANDLE, SITE_NAME — the only place they appear
                        (SITE_NAME drives the wordmark and the exam eyebrow)
  base.css              design system: tokens, layout, hub + exam styles
  engine.js             shared exam engine — renders any exam from its data
  hub.js                roadmap rendering, exam buttons, mastery persistence
  share.js              X-share helper (tweet text + intent URL)
exams/
  manifest.js           the registry the hub reads
  uniswap-v2/           index.html (thin shell) + data.js (content)
  _template/            copy-paste starting point
netlify.toml            publish = "." , no build command
_redirects              branded 404 fallback
```

## Stored state

| key | value |
|---|---|
| `exam:<id>:best` | `{ score, total, pct, dateISO }` — overwritten only on a higher `pct` |
| `roadmap:mastered` | array of mastered node numbers, e.g. `["01","03"]` |

The hub reads `exam:<id>:best` to append *· Best x/N* next to a live exam button.
Nothing leaves the browser; there is no backend and no analytics.
