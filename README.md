# DeFi Journey

A static, no-build-step site pairing a **DeFi architecture roadmap** (the hub) with a
growing **library of auditor-grade protocol exams**.

- **Hub** — `index.html`: the 10-node dependency-ordered roadmap. Each node shows a
  live protocol-named exam buttons for its registered exams, otherwise a disabled
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
# → http://localhost:8000/exams/uniswap-v3/   the concentrated-liquidity exam
```

(The hub's exam links do fall back to `exams/<id>/index.html` under `file://`, but the
module imports themselves still need a server. Any static server works.)

## AMM exams

The **AMM / Spot DEX** node contains both exams, with a separate best score for
each. Uniswap V2 has 24 questions. Uniswap V3 has **72 original questions across
12 categories**, with six questions per category, one correct answer per question,
worked explanations, and targeted source links after answering.

The V3 progression follows [RareSkills — Mastering Uniswap V3](https://rareskills.io/uniswap-v3-book)
and the [Uniswap V3 Development Book](https://uniswapv3book.com/):

| Questions | Topic |
|---|---|
| 1–6 | Price direction, Q64.96, decimals, TickMath, and intermediate overflow |
| 7–12 | Tick spacing, negative compression, bitmap words, and gross/net liquidity |
| 13–18 | Virtual and real reserves, range inventory, liquidity budgets, and the invariant |
| 19–24 | Core position identity, mint settlement, burn, collect, and fee snapshots |
| 25–30 | Exact input/output, both swap directions, fee branches, and rounding |
| 31–36 | Active liquidity, directional crossings, exact boundaries, and empty gaps |
| 37–42 | Q128 growth, inside/outside accounting, wraparound, and compounding |
| 43–48 | Callback authentication, payment deltas, flash fees, donations, and locks |
| 49–54 | Pool identity, fee tiers, initialization, protocol fees, and liquidity limits |
| 55–60 | Tick TWAP, negative rounding, observation history, and harmonic liquidity |
| 61–66 | Packed paths, exact-output routing, quotes, partial fills, and NFT exits |
| 67–72 | Slippage, oracle manipulation, nonstandard tokens, valuation, and audit scenarios |

Unless a question explicitly says otherwise, implementation details refer to
[V3 core v1.0.0](https://github.com/Uniswap/v3-core/tree/v1.0.0/contracts) and
[V3 periphery v1.3.0](https://github.com/Uniswap/v3-periphery/tree/v1.3.0/contracts),
including the original SwapRouter and NonfungiblePositionManager. The book's
teaching implementation sometimes differs: the exam calls out production behavior
for empty liquidity gaps and fee-based path encoding. Continuous numerical
exercises explicitly ignore tick discretization or rounding where appropriate.

These are learning assessments, not an executable Solidity contract test suite.
The site keeps its existing static ES-module structure and shared exam engine.
An unfinished attempt resets on reload; completed best scores persist locally.

## Deploy

Push the folder. `netlify.toml` publishes the repo root with no build command, which
gives clean `/exams/<slug>/` URLs natively. `_redirects` sends unknown paths to the hub
with a 404 status.

**Before the first deploy**, set the real values in `assets/config.js`:

```js
export const SITE_URL = "https://defi-journey.netlify.app"; // <- your Netlify URL
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

4. **Commit and push.** Netlify redeploys; the matching hub node shows a named
   exam button automatically. Multiple live exams can share a roadmap node;
   they appear in manifest order with independent best scores. No per-exam hub
   code changes are needed.

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
  logo.svg              the mark (favicon); the header lockup uses a CSS mask
                        of the same shape so it inherits each page's accent
  engine.js             shared exam engine — renders any exam from its data
  hub.js                roadmap rendering, exam buttons, mastery persistence
  share.js              X-share helper (tweet text + intent URL)
exams/
  manifest.js           the registry the hub reads
  uniswap-v2/           index.html (thin shell) + data.js (content)
  uniswap-v3/           72-question exam + reading guide and source links
  _template/            copy-paste starting point
netlify.toml            publish = "." , no build command
_redirects              branded 404 fallback
```

## Stored state

| key | value |
|---|---|
| `exam:<id>:best` | `{ score, total, pct, dateISO }` — overwritten only on a higher `pct` |
| `roadmap:mastered` | array of mastered node numbers, e.g. `["01","03"]` |

The hub reads `exam:<id>:best` to append *· Best x/N* next to each live exam button.
Nothing leaves the browser; there is no backend and no analytics.
