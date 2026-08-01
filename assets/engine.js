// ==========================================================================
// Shared exam engine. Renders ANY exam from its data module — see
// exams/_template/data.js for the schema. Extracted from the original
// standalone Uniswap V2 exam so a new exam is data-only.
// ==========================================================================

import { SITE_NAME } from "./config.js";
import { examUrl, examTweetUrl } from "./share.js";

/* --- data.theme key -> CSS custom property ------------------------------ */
const THEME_VARS = {
  bg: "--bg",
  panel: "--panel",
  panel2: "--panel-2",
  line: "--line",
  lineSoft: "--line-soft",
  ink: "--ink",
  dim: "--dim",
  faint: "--faint",
  accent: "--accent",
  accent2: "--accent-2",
  ok: "--ok",
  bad: "--bad",
  code: "--code-bg"
};

const DEFAULT_TIERS = [
  { minPct: 100, text: "Flawless. Go break some invariants." },
  { minPct: 85, text: "Auditor-grade. Your gaps are minor." },
  { minPct: 65, text: "Solid core, but the edges are where bugs live." },
  { minPct: 45, text: "You know the shape of it — now learn its sharp corners." },
  { minPct: 0, text: "Back to the source contracts. Read them line by line." }
];

const DEFAULT_GAP = "Revisit this category in the protocol's source and in real audit findings.";

/* --- tiny helpers ------------------------------------------------------- */

// Matches the original exam's escaping: only & and < need neutralising, so
// prose like "data.length > 0" renders exactly as written.
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

// localStorage can throw (private mode, file://, disabled storage). Never let
// persistence break the exam itself.
function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — scores just don't persist */
  }
}

/* --- default hero ------------------------------------------------------- */
// Same element ids as a custom hero so the progress animation is identical.
function defaultHero(label) {
  const d = "M 30 96 C 140 92, 240 74, 340 50 C 440 26, 560 12, 670 8";
  return (
    '<svg class="hero" viewBox="0 0 700 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    `<path id="hyp" d="${d}" fill="none" stroke="var(--line)" stroke-width="2"/>` +
    `<path id="hypGlow" d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="1000" stroke-dashoffset="1000"/>` +
    '<circle id="dot" r="6" fill="var(--accent)" cx="30" cy="96"/>' +
    `<text x="670" y="104" text-anchor="end" fill="var(--dim)" font-family="IBM Plex Mono" font-size="12">${esc(label)}</text>` +
    "</svg>"
  );
}

/* --- theme -------------------------------------------------------------- */
function applyTheme(theme) {
  if (!theme) return;
  for (const [key, value] of Object.entries(theme)) {
    const cssVar = THEME_VARS[key];
    if (cssVar) document.body.style.setProperty(cssVar, value);
  }
}

/* --- head metadata ------------------------------------------------------ */
function applyHead(data) {
  document.title = `${data.protocol} Deep-Dive Exam · ${SITE_NAME}`;
  const url = examUrl(data.id);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;

  let desc = document.querySelector('meta[name="description"]');
  if (!desc) {
    desc = document.createElement("meta");
    desc.name = "description";
    document.head.appendChild(desc);
  }
  desc.content = data.subtitle || `${data.protocol} deep-dive exam · ${SITE_NAME}`;
}

/* ========================================================================== */

export function runExam(data) {
  const CATS = data.cats || [];
  const Q = data.questions || [];
  const TIERS = (data.verdictTiers || DEFAULT_TIERS)
    .slice()
    .sort((a, b) => b.minPct - a.minPct);
  const GAPS = data.gapNotes || [];
  const BEST_KEY = `exam:${data.id}:best`;

  applyTheme(data.theme);
  applyHead(data);

  /* ---------- header ---------- */
  const headerEl = document.getElementById("exam-header");
  headerEl.innerHTML =
    `<div class="eyebrow"><a class="wm-link" href="../../">${esc(SITE_NAME)}</a> &middot; protocol exam ${esc(data.number || "")}</div>` +
    `<h1>${data.title}</h1>` +
    `<p class="sub">${data.subtitle || ""}</p>` +
    `<div class="hero-wrap">${data.hero || defaultHero(data.protocol)}</div>` +
    '<div class="progress-label"><span id="plabel"></span><span id="pscore"></span></div>';

  const stage = document.getElementById("stage");
  const plabel = document.getElementById("plabel");
  const pscore = document.getElementById("pscore");

  /* ---------- hero progress animation ---------- */
  const heroWrap = headerEl.querySelector(".hero-wrap");
  const hyp = heroWrap.querySelector("[data-hero-path], #hyp");
  const glow = heroWrap.querySelector("[data-hero-glow], #hypGlow");
  const dot = heroWrap.querySelector("[data-hero-dot], #dot");

  let pathLen = 0;
  if (hyp && typeof hyp.getTotalLength === "function") {
    try {
      pathLen = hyp.getTotalLength();
    } catch {
      pathLen = 0;
    }
  }
  if (glow && pathLen) {
    glow.style.strokeDasharray = pathLen;
    glow.style.strokeDashoffset = pathLen;
  }

  function setProgress(n) {
    if (!pathLen || !Q.length) return;
    const t = n / Q.length;
    if (dot) {
      const pt = hyp.getPointAtLength(pathLen * t);
      dot.setAttribute("cx", pt.x);
      dot.setAttribute("cy", pt.y);
    }
    if (glow) glow.style.strokeDashoffset = pathLen * (1 - t);
  }

  /* ---------- state ---------- */
  const catTotal = CATS.map(() => 0);
  Q.forEach((q) => {
    catTotal[q.c]++;
  });

  let idx = 0;
  let score = 0;
  let catScore = CATS.map(() => 0);

  /* ---------- question view ---------- */
  function render() {
    const q = Q[idx];
    plabel.textContent = `Question ${idx + 1} / ${Q.length}`;
    pscore.textContent = `Score ${score}`;

    stage.innerHTML =
      '<div class="card">' +
      `<div class="qcat">${CATS[q.c]}</div>` +
      `<div class="q">${q.q}</div>` +
      (q.code ? `<pre>${esc(q.code)}</pre>` : "") +
      q.opts
        .map(
          (o, i) =>
            `<button class="opt" data-i="${i}">${String.fromCharCode(65 + i)}&nbsp;&middot;&nbsp;${esc(o)}</button>`
        )
        .join("") +
      `<div class="exp" id="exp" role="status">${q.exp}</div>` +
      `<div class="nav"><button class="next" id="next">${idx === Q.length - 1 ? "See results" : "Next"}</button></div>` +
      "</div>";

    stage.querySelectorAll(".opt").forEach((b) => {
      b.addEventListener("click", () => answer(+b.dataset.i));
    });
  }

  function answer(i) {
    const q = Q[idx];
    const opts = stage.querySelectorAll(".opt");
    opts.forEach((b) => {
      b.disabled = true;
    });
    opts[q.a].classList.add("correct");
    if (i === q.a) {
      score++;
      catScore[q.c]++;
    } else {
      opts[i].classList.add("wrong");
    }
    pscore.textContent = `Score ${score}`;
    document.getElementById("exp").classList.add("show");

    const n = document.getElementById("next");
    n.classList.add("show");
    // Disabling the options drops keyboard focus to <body>; hand it to Next.
    n.focus();
    n.addEventListener("click", () => {
      idx++;
      setProgress(idx);
      idx < Q.length ? render() : results();
    });
  }

  /* ---------- results view ---------- */
  function results() {
    plabel.textContent = "Complete";
    const pct = Math.round((score / Q.length) * 100);

    const tier = TIERS.find((t) => pct >= t.minPct);
    const verdict = tier ? tier.text : "";

    // Read the prior best BEFORE recording this run, so "Best" only shows
    // when there genuinely was an earlier attempt.
    const prior = readJSON(BEST_KEY);
    if (!prior || pct > prior.pct) {
      writeJSON(BEST_KEY, {
        score,
        total: Q.length,
        pct,
        dateISO: new Date().toISOString()
      });
    }
    const bestShown = prior
      ? prior.pct >= pct
        ? prior
        : { score, total: Q.length, pct }
      : null;

    let bars = "";
    let gaps = "";
    for (let c = 0; c < CATS.length; c++) {
      const p = catTotal[c] ? Math.round((catScore[c] / catTotal[c]) * 100) : 0;
      bars +=
        '<div class="bar-row"><div class="bar-head">' +
        `<span>${CATS[c]}</span><span>${catScore[c]}/${catTotal[c]}</span>` +
        `</div><div class="cbar"><i style="width:${p}%"></i></div></div>`;
      if (p < 80) {
        gaps += `<p><b>${CATS[c]} (${catScore[c]}/${catTotal[c]}):</b> ${GAPS[c] || DEFAULT_GAP}</p>`;
      }
    }
    if (!gaps) {
      gaps = `<p>No weak categories.${data.nextUp ? " Next stop: " + data.nextUp + "." : ""}</p>`;
    }

    const tweet = examTweetUrl({
      protocol: data.protocol,
      score,
      total: Q.length,
      pct,
      examUrl: examUrl(data.id)
    });

    stage.innerHTML =
      '<div class="card">' +
      '<div class="qcat">Results</div>' +
      `<div class="score-big">${score}<span>/${Q.length}</span></div>` +
      `<div class="verdict">${verdict}</div>` +
      (bestShown ? `<div class="best">Best: ${bestShown.score}/${bestShown.total} (${bestShown.pct}%)</div>` : "") +
      bars +
      `<div class="gaps"><h3>Where to focus</h3>${gaps}</div>` +
      '<div class="actions">' +
      `<a class="share" href="${tweet}" target="_blank" rel="noopener">Share score on X</a>` +
      '<button class="retry" id="retry">Retake exam</button>' +
      "</div></div>";

    document.getElementById("retry").addEventListener("click", () => {
      idx = 0;
      score = 0;
      catScore = CATS.map(() => 0);
      setProgress(0);
      render();
    });
  }

  render();
}
