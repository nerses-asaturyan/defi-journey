// ===========================================================================
// EXAM TEMPLATE — copy this folder, then edit only this file.
//
//   cp -r exams/_template exams/<slug>
//
// Everything below is either required or has a sane engine default. Delete the
// optional keys you don't need. Content is rendered as HTML, so <b>…</b> works
// in `q`, `subtitle` and `exp`; `opts` and `code` are escaped and render
// literally.
// ===========================================================================

export default {
  /* --- identity (required) --- */
  id: "protocol-slug",              // must match the folder name
  number: "02",                     // display badge: "protocol exam 02"
  protocol: "Protocol Name",        // short name, used in titles + share text
  title: "Protocol Name Deep-Dive Exam",
  subtitle: "N questions across …. Auditor-grade: numbers, code paths, edge cases. No partial credit.",
  roadmapNode: "03",                // ties this exam to a hub node ("01".."10")

  /* --- optional: shown when every category scores >= 80% --- */
  nextUp: "the next protocol in the track",

  /* --- optional: per-protocol accents. Omit for the neutral navy/gold theme.
         Recognised keys: bg, panel, panel2, line, lineSoft, ink, dim, faint,
         accent, accent2, ok, bad, code                                     --- */
  theme: {
    accent: "#E4B15A",
    accent2: "#56C6C0"
  },

  /* --- optional: protocol hero graphic. Omit and the engine draws a default
         progress curve. A custom SVG animates too if it contains elements
         marked [data-hero-path], [data-hero-glow], [data-hero-dot] (or the
         ids #hyp, #hypGlow, #dot).                                        --- */
  // hero: '<svg viewBox="0 0 700 110" …>…</svg>',

  /* --- categories: order defines the index used by question.c and gapNotes --- */
  cats: ["Category one", "Category two", "Category three", "Category four"],

  questions: [
    {
      c: 0,                          // index into cats
      q: "Question text — may contain <b>markup</b>.",
      // code: "optional code block, rendered escaped inside <pre>",
      opts: ["First option", "Second option", "Third option", "Fourth option"],
      a: 1,                          // index of the correct option
      exp: "Why that answer is right, and why the tempting wrong one is wrong."
    }
  ],

  /* --- optional: verdict copy. Engine ships generic defaults. Sorted desc. --- */
  verdictTiers: [
    { minPct: 100, text: "Flawless. Go break some invariants." },
    { minPct: 85, text: "Auditor-grade. Your gaps are minor." },
    { minPct: 65, text: "Solid core, but the edges are where bugs live." },
    { minPct: 45, text: "You know the shape of it — now learn its sharp corners." },
    { minPct: 0, text: "Back to the source contracts. Read them line by line." }
  ],

  /* --- optional: one note per category, shown when that category < 80% --- */
  gapNotes: [
    "What to reread for category one.",
    "What to reread for category two.",
    "What to reread for category three.",
    "What to reread for category four."
  ]
};
