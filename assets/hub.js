// ==========================================================================
// Roadmap hub. Renders the 10 nodes, wires filters / expand / mastery, and
// derives each node's exam button purely from exams/manifest.js — no
// per-node hardcoding.
// ==========================================================================

import MANIFEST from "../exams/manifest.js";
import { roadmapTweetUrl } from "./share.js";

const MASTERED_KEY = "roadmap:mastered";

/* ---------- roadmap content ---------- */
const DATA = [
  {
    n:"01", title:"AMM / Spot DEX", backbone:"Uniswap (v2 &rarr; v3)",
    arch:"v2 is constant product (<code>x&middot;y=k</code>) with pair reserves and LP tokens. v3 adds <b>concentrated liquidity</b> via ticks and sqrtPrice &mdash; the single most reused idea in modern DeFi (perps, RWAs, v4 hooks all build on it).",
    econ:"LP return = fees &minus; impermanent loss. v3 turns LPing into an active, options-like position.",
    bug:"Rounding direction, reserve-vs-balance divergence, fee-on-transfer &amp; reentrancy in swaps, sandwich/MEV, TWAP manipulability.",
    res:[
      {t:"doc", l:"Uniswap docs (v2, v3, v4)", u:"https://docs.uniswap.org", h:"docs.uniswap.org"},
      {t:"book", l:"RareSkills Uniswap V2 Book", u:"https://rareskills.io/uniswap-v2-book", h:"rareskills.io"},
      {t:"book", l:"RareSkills Uniswap V3 Book", u:"https://rareskills.io/uniswap-v3-book", h:"rareskills.io"},
      {t:"book", l:"Jeiwan &mdash; Uniswap V3 Development Book", u:"https://uniswapv3book.com", h:"uniswapv3book.com"},
      {t:"video", l:"Cyfrin Updraft &mdash; Uniswap V2 &amp; V3 courses", u:"https://updraft.cyfrin.io/courses", h:"updraft.cyfrin.io"},
      {t:"lab", l:"Build your own Uniswap V2 (checklist)", u:"https://rareskills.io/post/build-your-own-uniswap", h:"rareskills.io"}
    ]
  },
  {
    n:"02", title:"Oracles", backbone:"Chainlink feeds + Uniswap TWAP",
    arch:"Two paradigms: <b>push</b> (Chainlink aggregator, <code>latestRoundData</code>, heartbeat/deviation) vs. <b>on-chain derived</b> (TWAP cumulative-price accumulator). Nearly every oracle bug is a variant of one of these.",
    econ:"Cost of manipulation vs. value extractable &mdash; why raw spot price is never safe as collateral pricing.",
    bug:"Stale/negative price, missing round validation, L2 sequencer downtime, low-liquidity TWAP manipulation. A top-3 historical exploit root cause.",
    res:[
      {t:"doc", l:"Chainlink Data Feeds docs", u:"https://docs.chain.link/data-feeds", h:"docs.chain.link"},
      {t:"doc", l:"Uniswap V3 oracle docs", u:"https://docs.uniswap.org/concepts/protocol/oracle", h:"docs.uniswap.org"},
      {t:"lab", l:"Solodit &mdash; search 'oracle' findings", u:"https://solodit.cyfrin.io", h:"solodit.cyfrin.io"},
      {t:"lab", l:"Solodit audit checklist (oracle items)", u:"https://solodit.cyfrin.io/checklist", h:"solodit.cyfrin.io"}
    ]
  },
  {
    n:"03", title:"Lending", backbone:"Compound v2 (learn) &rarr; Aave v3 (standard)",
    arch:"Interest-bearing receipt tokens (cToken/aToken), utilization-based rate model, collateral factor, health factor, liquidation-with-bonus. Compound v2 is the cleanest read; Aave v3 is what everyone forks.",
    econ:"Rate curves with a kink at optimal utilization; liquidation incentive is the solvency backstop.",
    bug:"Liquidation math, health-factor rounding, interest-accrual timing, bad-debt / socialized-loss handling, oracle dependence (see 02).",
    res:[
      {t:"doc", l:"Compound v2 docs", u:"https://docs.compound.finance", h:"docs.compound.finance"},
      {t:"doc", l:"Aave v3 docs", u:"https://docs.aave.com", h:"docs.aave.com"},
      {t:"book", l:"RareSkills lending / Compound series", u:"https://rareskills.io/blog", h:"rareskills.io"},
      {t:"video", l:"Cyfrin Updraft &mdash; DeFi track", u:"https://updraft.cyfrin.io/career-tracks", h:"updraft.cyfrin.io"}
    ]
  },
  {
    n:"04", title:"Flash Loans", backbone:"Aave flash loans + Uniswap flash swaps",
    arch:"A primitive, not a product: atomic uncollateralized borrow that must repay in-tx. Aave = <code>flashLoan</code> callback + fee. Uniswap = optimistic transfer, then invariant check at end of swap.",
    econ:"Collapses the capital barrier for arbitrage &mdash; and for attacks.",
    bug:"Flash loans don't cause bugs; they amortize capital to weaponize existing ones (oracle manipulation, governance capture, reentrancy). Always ask: does this hold if the attacker has infinite atomic capital?",
    res:[
      {t:"doc", l:"Aave flash loans docs", u:"https://docs.aave.com/developers/guides/flash-loans", h:"docs.aave.com"},
      {t:"doc", l:"Uniswap flash swaps docs", u:"https://docs.uniswap.org", h:"docs.uniswap.org"},
      {t:"lab", l:"Damn Vulnerable DeFi (flash-loan levels)", u:"https://www.damnvulnerabledefi.xyz", h:"damnvulnerabledefi.xyz"}
    ]
  },
  {
    n:"05", title:"Stablecoins &amp; CDPs", backbone:"MakerDAO / Sky (DAI)",
    arch:"Reference over-collateralized debt system. Core: <code>Vat</code> (accounting), <code>Jug</code> (fees), <code>Dog</code> (liquidations), <code>Vow</code> (surplus/debt), <code>Pot</code> (DSR). Every CDP stablecoin &mdash; crvUSD, GHO, LUSD &mdash; is a Maker diff.",
    econ:"Stability fee vs. DSR, peg-arbitrage, collateral risk params, and the algorithmic-vs-collateralized spectrum (contrast Terra's collapse).",
    bug:"Liquidation-auction mechanics, peg-stability-module arbitrage, debt-ceiling &amp; rounding, oracle-security-module delay bypass.",
    res:[
      {t:"doc", l:"MakerDAO protocol docs (DSS)", u:"https://docs.makerdao.com", h:"docs.makerdao.com"},
      {t:"doc", l:"Liquity (LUSD) &mdash; minimal contrast", u:"https://docs.liquity.org", h:"docs.liquity.org"},
      {t:"doc", l:"Curve resources &mdash; crvUSD / LLAMMA", u:"https://resources.curve.finance", h:"resources.curve.finance"},
      {t:"lab", l:"Rekt &mdash; Terra/UST postmortem", u:"https://rekt.news", h:"rekt.news"}
    ]
  },
  {
    n:"06", title:"Yield Vaults &amp; Aggregators", backbone:"ERC-4626 + Yearn",
    arch:"<code>assets &harr; shares</code> conversion, strategy allocation, harvest/compound, fee accrual. ERC-4626 is the standard almost all vaults now conform to.",
    econ:"Yield sourcing, performance/management fees, autocompounding.",
    bug:"First-depositor inflation / donation attack, rounding direction on convertToShares/Assets, <code>totalAssets</code>-vs-real-balance divergence, deposit/withdraw share-price sandwiching.",
    res:[
      {t:"doc", l:"EIP-4626 specification", u:"https://eips.ethereum.org/EIPS/eip-4626", h:"eips.ethereum.org"},
      {t:"book", l:"RareSkills &mdash; ERC-4626 explainer", u:"https://rareskills.io/post/erc4626", h:"rareskills.io"},
      {t:"doc", l:"OpenZeppelin ERC4626 (inflation mitigation)", u:"https://docs.openzeppelin.com/contracts/5.x/erc4626", h:"docs.openzeppelin.com"},
      {t:"doc", l:"Yearn v3 docs", u:"https://docs.yearn.fi", h:"docs.yearn.fi"}
    ]
  },
  {
    n:"07", title:"Liquid Staking &amp; Restaking", backbone:"Lido (stETH) + EigenLayer",
    arch:"Lido = rebasing (stETH) vs. wrapped (wstETH) share accounting, validator set, withdrawal queue. EigenLayer = restaking, operators, AVSs, slashing.",
    econ:"Staking yield, LST depeg dynamics, restaking's pooled-security &amp; rehypothecation risk.",
    bug:"Rebasing-token integration bugs (protocols assuming balances are static), withdrawal-queue accounting, LST/underlying price assumptions, slashing-cascade risk.",
    res:[
      {t:"doc", l:"Lido docs (rebase vs. wrapped)", u:"https://docs.lido.fi", h:"docs.lido.fi"},
      {t:"doc", l:"EigenLayer docs", u:"https://docs.eigenlayer.xyz", h:"docs.eigenlayer.xyz"},
      {t:"lab", l:"Solodit &mdash; rebasing-token integration bugs", u:"https://solodit.cyfrin.io", h:"solodit.cyfrin.io"}
    ]
  },
  {
    n:"08", title:"Perps &amp; Derivatives", backbone:"GMX (pool) + dYdX (orderbook)",
    arch:"Two opposite designs: GMX = shared liquidity pool as trader counterparty (GLP/GM), oracle-priced execution, funding. dYdX = off-chain matching engine, on-chain settlement. Together they cover the space.",
    econ:"Funding rates, open-interest caps, the LP-is-the-house model and its risks.",
    bug:"Oracle-price execution windows, funding manipulation, liquidation &amp; ADL logic, PnL rounding. High-value, subtle surface.",
    res:[
      {t:"doc", l:"GMX docs (v1 then v2)", u:"https://docs.gmx.io", h:"docs.gmx.io"},
      {t:"doc", l:"dYdX docs", u:"https://docs.dydx.xyz", h:"docs.dydx.xyz"},
      {t:"video", l:"DeFiHackLabs &mdash; exploit reenactments", u:"https://www.youtube.com/@DeFiHackLabs", h:"youtube.com"}
    ]
  },
  {
    n:"09", title:"ve-Tokenomics &amp; Governance", backbone:"Curve (veCRV + gauges)",
    arch:"StableSwap invariant (amplified constant-sum/product hybrid) + vote-locked tokens &rarr; gauge weights &rarr; emissions. Governor + Timelock is the orthogonal on-chain governance pattern.",
    econ:"The Curve wars: bribes, emissions-directed liquidity &mdash; a masterclass in mechanism design.",
    bug:"Governance capture (esp. flash-loan-assisted), gauge/emission accounting, timelock bypass, StableSwap rounding at imbalance.",
    res:[
      {t:"doc", l:"Curve resources &amp; whitepapers", u:"https://resources.curve.finance", h:"resources.curve.finance"},
      {t:"video", l:"Cyfrin Updraft &mdash; Curve V1 course", u:"https://updraft.cyfrin.io/courses", h:"updraft.cyfrin.io"},
      {t:"doc", l:"OpenZeppelin Governor docs", u:"https://docs.openzeppelin.com/contracts/5.x/governance", h:"docs.openzeppelin.com"}
    ]
  },
  {
    n:"10", title:"Cross-chain Bridges", backbone:"LayerZero + lock-mint canonical",
    arch:"Two trust models: canonical lock-and-mint / burn-and-release, vs. generalized messaging (LayerZero endpoint + DVN, or Chainlink CCIP). Verification is where trust lives.",
    econ:"Liquidity fragmentation, wrapped-asset risk, validator/relayer trust assumptions.",
    bug:"Message replay, verification-signature bugs, mint-without-lock &mdash; the highest-severity, highest-loss category in DeFi history.",
    res:[
      {t:"doc", l:"LayerZero docs", u:"https://docs.layerzero.network", h:"docs.layerzero.network"},
      {t:"doc", l:"Chainlink CCIP docs (contrast)", u:"https://docs.chain.link/ccip", h:"docs.chain.link"},
      {t:"lab", l:"Rekt &mdash; Ronin / Wormhole / Nomad postmortems", u:"https://rekt.news", h:"rekt.news"}
    ]
  }
];

const CROSS = [
  {t:"lab", l:"Damn Vulnerable DeFi &mdash; attack construction challenges", u:"https://www.damnvulnerabledefi.xyz", h:"damnvulnerabledefi.xyz"},
  {t:"lab", l:"Solodit &mdash; searchable audit-finding corpus + checklist", u:"https://solodit.cyfrin.io", h:"solodit.cyfrin.io"},
  {t:"lab", l:"Rekt.news &mdash; production exploit postmortems", u:"https://rekt.news", h:"rekt.news"},
  {t:"video", l:"Cyfrin Updraft &mdash; security &amp; auditing track (free)", u:"https://updraft.cyfrin.io/career-tracks", h:"updraft.cyfrin.io"}
];

const TYPE_LABEL = { doc:"DOC", book:"DEEP", video:"VIDEO", lab:"LAB" };
let activeFilter = "all";
const track = document.getElementById("track");

/* ---------- storage (never let it throw) ---------- */
function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* no-op */ }
}

/* ---------- exam button, derived from the manifest ---------- */
const EXAMS_BY_NODE = new Map();
MANIFEST.forEach((exam) => {
  const exams = EXAMS_BY_NODE.get(exam.roadmapNode) || [];
  exams.push(exam);
  EXAMS_BY_NODE.set(exam.roadmapNode, exams);
});

// Directory URLs are clean when served; file:// needs the explicit filename.
const isFile = location.protocol === "file:";
const examHref = (id) => `exams/${id}/${isFile ? "index.html" : ""}`;

function examFoot(nodeNumber) {
  const exams = (EXAMS_BY_NODE.get(nodeNumber) || []).filter((exam) => exam.status === "live");
  if (!exams.length) {
    return '<div class="card-foot"><button class="exam-pill" disabled>Exam coming soon</button></div>';
  }
  return '<div class="card-foot">' + exams.map((exam) => {
    const best = readJSON(`exam:${exam.id}:best`);
    const bestLabel = best
      ? `<span class="exam-best">&middot; Best ${best.score}/${best.total}</span>`
      : "";
    return '<div class="exam-entry">' +
      `<a class="exam-pill" href="${examHref(exam.id)}">${exam.protocol} exam &rarr;</a>` +
      bestLabel + "</div>";
  }).join("") + "</div>";
}

function resItem(r) {
  return '<a class="res-item" href="' + r.u + '" target="_blank" rel="noopener" data-rtype="' + r.t + '">'
    + '<span class="rtype ' + r.t + '">' + TYPE_LABEL[r.t] + '</span>'
    + '<span class="res-label">' + r.l + '</span>'
    + '<span class="res-host">' + r.h + '</span>'
    + '<span class="arrow">&#8599;</span></a>';
}

/* ---------- render ---------- */
const mastered = new Set(readJSON(MASTERED_KEY) || []);

DATA.forEach((c, i) => {
  const el = document.createElement("div");
  const isDone = mastered.has(c.n);
  el.className = "cat" + (i === 0 ? " open" : "") + (isDone ? " done" : "");
  el.dataset.node = c.n;
  el.innerHTML =
    '<div class="rail"><div class="node">' + c.n + '</div><div class="line"></div></div>'
    + '<div class="card">'
    + '<button class="card-head" aria-expanded="' + (i === 0) + '">'
    + '<span class="done-box" role="checkbox" aria-checked="' + isDone + '" title="Mark mastered" tabindex="0"></span>'
    + '<span class="head-main"><span class="cat-title">' + c.title + '</span>'
    + '<span class="backbone">' + c.backbone + '</span></span>'
    + '<span class="toggle">+</span></button>'
    + '<div class="body"><div class="body-inner">'
    + '<div class="facet"><span class="tag arch">Arch</span><p>' + c.arch + '</p></div>'
    + '<div class="facet"><span class="tag econ">Econ</span><p>' + c.econ + '</p></div>'
    + '<div class="facet"><span class="tag bug">Bug class</span><p>' + c.bug + '</p></div>'
    + '<div class="res"><div class="res-h">Learning materials</div>'
    + '<div class="res-list">' + c.res.map(resItem).join("") + '</div></div>'
    + '</div></div>'
    + examFoot(c.n)
    + '</div>';
  track.appendChild(el);
});

document.getElementById("crossList").innerHTML = CROSS.map(resItem).join("");

/* ---------- expand / collapse ---------- */
function setBody(cat) {
  const body = cat.querySelector(".body");
  const head = cat.querySelector(".card-head");
  if (cat.classList.contains("open")) {
    body.style.maxHeight = body.scrollHeight + "px";
    head.setAttribute("aria-expanded", "true");
  } else {
    body.style.maxHeight = "0px";
    head.setAttribute("aria-expanded", "false");
  }
}

document.querySelectorAll(".cat").forEach((cat) => {
  const head = cat.querySelector(".card-head");
  const done = cat.querySelector(".done-box");
  head.addEventListener("click", (e) => {
    if (e.target.closest(".done-box")) return;
    cat.classList.toggle("open");
    setBody(cat);
  });
  function toggleDone(e) {
    e.stopPropagation();
    cat.classList.toggle("done");
    const isDone = cat.classList.contains("done");
    done.setAttribute("aria-checked", isDone);
    if (isDone) mastered.add(cat.dataset.node);
    else mastered.delete(cat.dataset.node);
    writeJSON(MASTERED_KEY, [...mastered]);
    updateProgress();
  }
  done.addEventListener("click", toggleDone);
  done.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleDone(e); }
  });
  if (cat.classList.contains("open")) requestAnimationFrame(() => setBody(cat));
});

/* ---------- filters ---------- */
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
    chip.setAttribute("aria-pressed", "true");
    activeFilter = chip.dataset.filter;
    applyFilter();
  });
});

function applyFilter() {
  document.querySelectorAll(".res-item").forEach((item) => {
    const show = activeFilter === "all" || item.dataset.rtype === activeFilter;
    item.style.display = show ? "" : "none";
  });
  document.querySelectorAll(".res .res-list").forEach((list) => {
    const visible = [...list.querySelectorAll(".res-item")].some((i) => i.style.display !== "none");
    let msg = list.nextElementSibling && list.nextElementSibling.classList.contains("no-res")
      ? list.nextElementSibling : null;
    if (!visible) {
      if (!msg) {
        msg = document.createElement("div");
        msg.className = "no-res";
        msg.textContent = "No resource of this type for this backbone.";
        list.after(msg);
      }
    } else if (msg) { msg.remove(); }
  });
  document.querySelectorAll(".cat.open").forEach((cat) => {
    const b = cat.querySelector(".body");
    b.style.maxHeight = b.scrollHeight + "px";
  });
}

/* ---------- expand all ---------- */
let allOpen = false;
const eaBtn = document.getElementById("expandAll");
eaBtn.addEventListener("click", () => {
  allOpen = !allOpen;
  document.querySelectorAll(".cat").forEach((cat) => {
    cat.classList.toggle("open", allOpen);
    setBody(cat);
  });
  eaBtn.textContent = allOpen ? "– Collapse all" : "+ Expand all";
});

/* ---------- mastery progress ---------- */
function updateProgress() {
  const done = document.querySelectorAll(".cat.done").length;
  document.getElementById("pCount").textContent = done + " / " + DATA.length + " mastered";
  document.getElementById("pBar").style.width = (done / DATA.length * 100) + "%";
}
updateProgress();

/* ---------- share the roadmap ---------- */
document.getElementById("shareRoadmap").href = roadmapTweetUrl();
