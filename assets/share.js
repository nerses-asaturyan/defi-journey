// X (Twitter) share helper. Every share links back to the site and tags the
// handle — both pulled from config.js, never hardcoded here.

import { SITE_URL, X_HANDLE } from "./config.js";

const INTENT = "https://twitter.com/intent/tweet?text=";

/** Canonical deep link for an exam, e.g. https://site/exams/uniswap-v2 */
export function examUrl(id) {
  return `${SITE_URL.replace(/\/+$/, "")}/exams/${id}`;
}

/** Tweet text + intent URL for a completed exam result. */
export function examTweetUrl({ protocol, score, total, pct, examUrl: url }) {
  const text =
    `I scored ${score}/${total} (${pct}%) on the ${protocol} Deep-Dive Exam` +
    `\n— auditor-grade DeFi questions on math, mechanics & attack vectors.` +
    `\n\nThink you actually understand it? Prove it: ${url}` +
    `\n\n${X_HANDLE}`;
  return INTENT + encodeURIComponent(text);
}

/** Lighter share for the roadmap hub itself. */
export function roadmapTweetUrl() {
  const text =
    `DeFi is a small set of primitives — every "new" protocol is a diff against a backbone.` +
    `\n\nA 10-node architecture roadmap plus auditor-grade protocol exams: ${SITE_URL.replace(/\/+$/, "")}` +
    `\n\n${X_HANDLE}`;
  return INTENT + encodeURIComponent(text);
}
