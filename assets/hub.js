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
    n:"01", title:"AMM / Spot DEX", backbone:"Uniswap (v2 &rarr; v3 &rarr; v4)",
    arch:"v2 is constant product (<code>x&middot;y=k</code>) with pair reserves and LP tokens. v3 adds <b>concentrated liquidity</b> via ticks and sqrtPrice &mdash; the single most reused idea in modern DeFi (perps, RWAs, v4 hooks all build on it). v4 puts every pool in one <code>PoolManager</code> singleton with flash accounting and per-pool <b>hooks</b>.",
    econ:"LP return = fees &minus; impermanent loss. v3 turns LPing into an active, options-like position.",
    bug:"Rounding direction, reserve-vs-balance divergence, fee-on-transfer &amp; reentrancy in swaps, sandwich/MEV, TWAP manipulability. v4 adds hook risks: callbacks not restricted to the <code>PoolManager</code>, hooks that hold user funds or change swap deltas, native-ETH handling.",
    res:[
      {t:"doc", l:"Uniswap v2 docs", u:"https://developers.uniswap.org/docs/protocols/v2/overview", h:"developers.uniswap.org"},
      {t:"doc", l:"Uniswap v3 docs", u:"https://developers.uniswap.org/docs/protocols/v3/overview", h:"developers.uniswap.org"},
      {t:"doc", l:"Uniswap v4 docs (singleton, hooks, flash accounting)", u:"https://developers.uniswap.org/docs/protocols/v4/overview", h:"developers.uniswap.org"},
      {t:"doc", l:"Uniswap v4 Security Framework (hook risks)", u:"https://developers.uniswap.org/docs/protocols/v4/security", h:"developers.uniswap.org"},
      {t:"book", l:"Uniswap V2 whitepaper", u:"https://app.uniswap.org/whitepaper.pdf", h:"app.uniswap.org"},
      {t:"book", l:"Uniswap V3 whitepaper", u:"https://app.uniswap.org/whitepaper-v3.pdf", h:"app.uniswap.org"},
      {t:"book", l:"RareSkills Uniswap V2 Book", u:"https://rareskills.io/uniswap-v2-book", h:"rareskills.io"},
      {t:"book", l:"RareSkills Uniswap V3 Book", u:"https://rareskills.io/uniswap-v3-book", h:"rareskills.io"},
      {t:"book", l:"Jeiwan &mdash; Uniswap V3 Development Book", u:"https://uniswapv3book.com", h:"uniswapv3book.com"},
      {t:"video", l:"Cyfrin Updraft &mdash; Uniswap V2 course", u:"https://updraft.cyfrin.io/courses/uniswap-v2", h:"updraft.cyfrin.io"},
      {t:"video", l:"Cyfrin Updraft &mdash; Uniswap V3 course", u:"https://updraft.cyfrin.io/courses/uniswap-v3", h:"updraft.cyfrin.io"},
      {t:"video", l:"Cyfrin Updraft &mdash; Uniswap v4 course (hooks, flash accounting)", u:"https://updraft.cyfrin.io/courses/uniswap-v4", h:"updraft.cyfrin.io"},
      {t:"lab", l:"Build your own Uniswap V2 (checklist)", u:"https://rareskills.io/post/build-your-own-uniswap", h:"rareskills.io"}
    ]
  },
  {
    n:"02", title:"Oracles", backbone:"Chainlink feeds + Uniswap TWAP + Pyth (pull)",
    arch:"Three paradigms: <b>push</b> (Chainlink aggregator, <code>latestRoundData</code>, heartbeat/deviation), <b>on-chain derived</b> (TWAP cumulative-price accumulator), and <b>pull</b> (Pyth, Chainlink Data Streams &mdash; the caller brings a signed price update into the tx that uses it). Nearly every oracle bug is a variant of one of these.",
    econ:"Cost of manipulation vs. value extractable &mdash; why raw spot price is never safe as collateral pricing.",
    bug:"Stale/negative price, missing round validation, min/max answer bounds, wrong decimals, L2 sequencer downtime, low-liquidity or multi-block TWAP manipulation, ignored Pyth confidence/exponent/<code>publishTime</code>, LP or vault share prices read mid-callback (read-only reentrancy) or inflated by donation. A top-3 historical exploit root cause.",
    res:[
      {t:"doc", l:"Chainlink Data Feeds docs", u:"https://docs.chain.link/data-feeds", h:"docs.chain.link"},
      {t:"doc", l:"Chainlink L2 Sequencer Uptime Feeds (grace period)", u:"https://docs.chain.link/data-feeds/l2-sequencer-feeds", h:"docs.chain.link"},
      {t:"doc", l:"Uniswap V3 price oracle docs", u:"https://developers.uniswap.org/docs/protocols/v3/concepts/price-oracles", h:"developers.uniswap.org"},
      {t:"doc", l:"Pyth &mdash; price feed best practices (pull oracle)", u:"https://docs.pyth.network/price-feeds/core/best-practices", h:"docs.pyth.network"},
      {t:"book", l:"samczsun &mdash; So you want to use a price oracle", u:"https://samczsun.com/so-you-want-to-use-a-price-oracle", h:"samczsun.com"},
      {t:"book", l:"Dacian &mdash; Chainlink Oracle Security Considerations", u:"https://medium.com/cyfrin/chainlink-oracle-defi-attacks-93b6cb6541bf", h:"medium.com"},
      {t:"book", l:"RareSkills &mdash; How the TWAP oracle in Uniswap V2 works", u:"https://rareskills.io/post/twap-uniswap-v2", h:"rareskills.io"},
      {t:"book", l:"Jeiwan &mdash; Uniswap V3 Price Oracle chapter", u:"https://uniswapv3book.com/milestone_5/price-oracle.html", h:"uniswapv3book.com"},
      {t:"book", l:"Uniswap &mdash; V3 TWAP oracles in Proof of Stake", u:"https://blog.uniswap.org/uniswap-v3-oracles", h:"blog.uniswap.org"},
      {t:"book", l:"ChainSecurity &mdash; Curve LP oracle manipulation post-mortem", u:"https://www.chainsecurity.com/blog/curve-lp-oracle-manipulation-post-mortem", h:"chainsecurity.com"},
      {t:"video", l:"Cyfrin Updraft &mdash; Chainlink Fundamentals (Data Feeds, Data Streams)", u:"https://updraft.cyfrin.io/courses/chainlink-fundamentals", h:"updraft.cyfrin.io"},
      {t:"lab", l:"Damn Vulnerable DeFi &mdash; Compromised, Puppet V1&ndash;V3, Curvy Puppet", u:"https://www.damnvulnerabledefi.xyz", h:"damnvulnerabledefi.xyz"},
      {t:"lab", l:"Solodit &mdash; search 'oracle' findings", u:"https://solodit.cyfrin.io", h:"solodit.cyfrin.io"},
      {t:"lab", l:"Solodit audit checklist (oracle items)", u:"https://solodit.cyfrin.io/checklist", h:"solodit.cyfrin.io"}
    ]
  },
  {
    n:"03", title:"Lending", backbone:"Compound v2 / v3 (learn) &rarr; Aave v3 (standard)",
    arch:"Interest-bearing receipt tokens (cToken/aToken), utilization-based rate model, collateral factor, health factor, liquidation-with-bonus. Compound v2 is the cleanest read and the most forked; Compound v3 (Comet) narrows each market to one borrowable asset; Aave v3 is what everyone forks; Morpho Blue goes minimal with isolated, immutable markets.",
    econ:"Rate curves with a kink at optimal utilization; liquidation incentive is the solvency backstop.",
    bug:"Liquidation math, health-factor rounding, interest-accrual timing, bad-debt / socialized-loss handling, empty-market exchange-rate inflation in Compound v2 forks (Hundred, Onyx), oracle dependence (see 02).",
    res:[
      {t:"doc", l:"Compound v2 docs", u:"https://docs.compound.xyz/v2/", h:"docs.compound.xyz"},
      {t:"doc", l:"Compound v3 (Comet) docs", u:"https://docs.compound.xyz/", h:"docs.compound.xyz"},
      {t:"doc", l:"Aave v3 docs", u:"https://aave.com/docs", h:"aave.com"},
      {t:"doc", l:"Morpho docs &mdash; Morpho Blue, a very small lending core", u:"https://docs.morpho.org", h:"docs.morpho.org"},
      {t:"book", l:"Aave V3 technical paper", u:"https://github.com/aave/aave-v3-core/blob/master/techpaper/Aave_V3_Technical_Paper.pdf", h:"github.com"},
      {t:"book", l:"RareSkills Compound V3 Book", u:"https://rareskills.io/compound-v3-book", h:"rareskills.io"},
      {t:"book", l:"Dacian &mdash; Lending/Borrowing DeFi Attacks", u:"https://dacian.me/lending-borrowing-defi-attacks", h:"dacian.me"},
      {t:"video", l:"Cyfrin Updraft &mdash; Aave V3 course", u:"https://updraft.cyfrin.io/courses/aave-v3", h:"updraft.cyfrin.io"},
      {t:"lab", l:"Compound v2 source &mdash; the learn-first read", u:"https://github.com/compound-finance/compound-protocol", h:"github.com"},
      {t:"lab", l:"Morpho Blue source", u:"https://github.com/morpho-org/morpho-blue", h:"github.com"}
    ]
  },
  {
    n:"04", title:"Flash Loans", backbone:"Aave flash loans + Uniswap flash swaps + ERC-3156",
    arch:"A primitive, not a product: atomic uncollateralized borrow that must repay in-tx. Aave = <code>flashLoan</code> callback + fee. Uniswap = optimistic transfer, then invariant check at end of swap. ERC-3156 standardizes the lender/receiver interface.",
    econ:"Collapses the capital barrier for arbitrage &mdash; and for attacks.",
    bug:"Flash loans don't cause bugs; they amortize capital to weaponize existing ones (oracle manipulation, governance capture, reentrancy). Always ask: does this hold if the attacker has infinite atomic capital? Direct bugs: receivers that don't check the caller/initiator, lenders that make arbitrary calls, balance-based accounting that counts the loan as a deposit, voting power read without a snapshot.",
    res:[
      {t:"doc", l:"Aave v3 flash loans docs", u:"https://aave.com/docs/aave-v3/guides/flash-loans", h:"aave.com"},
      {t:"doc", l:"Uniswap v2 flash swaps", u:"https://developers.uniswap.org/docs/protocols/v2/guides/flash-swaps", h:"developers.uniswap.org"},
      {t:"doc", l:"Uniswap v3 flash swaps", u:"https://developers.uniswap.org/docs/protocols/v3/guides/flash-swaps/getting-started", h:"developers.uniswap.org"},
      {t:"doc", l:"EIP-3156 &mdash; flash loan standard", u:"https://eips.ethereum.org/EIPS/eip-3156", h:"eips.ethereum.org"},
      {t:"book", l:"RareSkills &mdash; Flash loans and how to hack them (ERC-3156)", u:"https://rareskills.io/post/erc-3156", h:"rareskills.io"},
      {t:"lab", l:"Damn Vulnerable DeFi &mdash; Unstoppable, Naive Receiver, Truster, Side Entrance, Selfie", u:"https://www.damnvulnerabledefi.xyz", h:"damnvulnerabledefi.xyz"},
      {t:"lab", l:"Rekt &mdash; Euler Finance (flash loan + donation into bad debt)", u:"https://rekt.news/euler-rekt", h:"rekt.news"}
    ]
  },
  {
    n:"05", title:"Stablecoins &amp; CDPs", backbone:"MakerDAO / Sky (DAI &rarr; USDS)",
    arch:"Reference over-collateralized debt system. Core: <code>Vat</code> (accounting), <code>Jug</code> (fees), <code>Dog</code> (liquidations), <code>Vow</code> (surplus/debt), <code>Pot</code> (DSR). Every CDP stablecoin &mdash; crvUSD, GHO, LUSD &mdash; is a Maker diff: Liquity is the minimal, immutable contrast; crvUSD swaps auctions for soft liquidation inside an AMM (LLAMMA).",
    econ:"Stability fee vs. DSR, peg-arbitrage, collateral risk params, and the algorithmic-vs-collateralized spectrum (contrast Terra's collapse).",
    bug:"Liquidation-auction mechanics, peg-stability-module arbitrage, debt-ceiling &amp; rounding, oracle-security-module delay bypass, redemption ordering (Liquity v1: lowest collateral ratio first; v2: lowest interest rate first), soft-liquidation band math (LLAMMA).",
    res:[
      {t:"doc", l:"Sky docs &mdash; Vat (core accounting)", u:"https://developers.skyeco.com/protocol/core/vat/", h:"developers.skyeco.com"},
      {t:"doc", l:"Sky docs &mdash; collateral liquidation", u:"https://developers.skyeco.com/protocol/vaults/collateral-liquidation/", h:"developers.skyeco.com"},
      {t:"doc", l:"Sky docs &mdash; OSM (oracle security module)", u:"https://developers.skyeco.com/protocol/core/osm/", h:"developers.skyeco.com"},
      {t:"doc", l:"Liquity V2 docs", u:"https://docs.liquity.org", h:"docs.liquity.org"},
      {t:"doc", l:"Curve &mdash; crvUSD LLAMMA explainer", u:"https://docs.curve.finance/developer/crvusd/llamma-explainer", h:"docs.curve.finance"},
      {t:"video", l:"Cyfrin Updraft &mdash; Advanced Foundry (build a stablecoin)", u:"https://updraft.cyfrin.io/courses/advanced-foundry", h:"updraft.cyfrin.io"},
      {t:"lab", l:"Maker DSS source (Vat, Jug, Dog, Vow, Pot)", u:"https://github.com/makerdao/dss", h:"github.com"},
      {t:"lab", l:"Liquity v1 source &mdash; minimal contrast, detailed README", u:"https://github.com/liquity/dev", h:"github.com"},
      {t:"lab", l:"Rekt &mdash; Terra/UST postmortem", u:"https://rekt.news/luna-rekt", h:"rekt.news"}
    ]
  },
  {
    n:"06", title:"Yield Vaults &amp; Aggregators", backbone:"ERC-4626 + Yearn",
    arch:"<code>assets &harr; shares</code> conversion, strategy allocation, harvest/compound, fee accrual. ERC-4626 is the standard almost all vaults now conform to.",
    econ:"Yield sourcing, performance/management fees, autocompounding.",
    bug:"First-depositor inflation / donation attack, rounding direction on convertToShares/Assets, <code>totalAssets</code>-vs-real-balance divergence, deposit/withdraw share-price sandwiching, spec non-compliance (<code>max*</code>/<code>preview*</code> rounding), strategy losses not reflected in the share price.",
    res:[
      {t:"doc", l:"EIP-4626 specification", u:"https://eips.ethereum.org/EIPS/eip-4626", h:"eips.ethereum.org"},
      {t:"doc", l:"OpenZeppelin ERC4626 (inflation mitigation)", u:"https://docs.openzeppelin.com/contracts/5.x/erc4626", h:"docs.openzeppelin.com"},
      {t:"doc", l:"Yearn v3 docs", u:"https://docs.yearn.fi", h:"docs.yearn.fi"},
      {t:"book", l:"RareSkills &mdash; ERC-4626 explainer", u:"https://rareskills.io/post/erc4626", h:"rareskills.io"},
      {t:"book", l:"OpenZeppelin &mdash; A Novel Defense Against ERC4626 Inflation Attacks", u:"https://www.openzeppelin.com/news/a-novel-defense-against-erc4626-inflation-attacks", h:"openzeppelin.com"},
      {t:"lab", l:"a16z &mdash; ERC-4626 property tests", u:"https://github.com/a16z/erc4626-tests", h:"github.com"},
      {t:"lab", l:"Yearn v3 tokenized strategy source", u:"https://github.com/yearn/tokenized-strategy", h:"github.com"},
      {t:"lab", l:"Damn Vulnerable DeFi &mdash; Unstoppable (ERC-4626 vault)", u:"https://www.damnvulnerabledefi.xyz/challenges/unstoppable/", h:"damnvulnerabledefi.xyz"}
    ]
  },
  {
    n:"07", title:"Liquid Staking &amp; Restaking", backbone:"Lido (stETH) + EigenLayer",
    arch:"Lido = rebasing (stETH) vs. wrapped (wstETH) share accounting, validator set, withdrawal queue. Rocket Pool rETH is the exchange-rate contrast. EigenLayer = restaking, operators, operator sets, AVSs, slashing.",
    econ:"Staking yield, LST depeg dynamics, restaking's pooled-security &amp; rehypothecation risk.",
    bug:"Rebasing-token integration bugs (protocols assuming balances are static), stETH transfers that move 1&ndash;2 wei less than asked, withdrawal-queue accounting, LST/underlying price assumptions, slashing-cascade risk.",
    res:[
      {t:"doc", l:"Lido &mdash; tokens integration guide (stETH vs. wstETH, 1&ndash;2 wei case)", u:"https://docs.lido.fi/guides/lido-tokens-integration-guide/", h:"docs.lido.fi"},
      {t:"doc", l:"Lido &mdash; withdrawal queue", u:"https://docs.lido.fi/contracts/withdrawal-queue-erc721/", h:"docs.lido.fi"},
      {t:"doc", l:"EigenLayer overview", u:"https://docs.eigencloud.xyz/eigenlayer/concepts/eigenlayer-overview", h:"docs.eigencloud.xyz"},
      {t:"doc", l:"EigenLayer slashing concepts", u:"https://docs.eigencloud.xyz/eigenlayer/concepts/slashing/slashing-concept", h:"docs.eigencloud.xyz"},
      {t:"doc", l:"Rocket Pool docs (rETH)", u:"https://docs.rocketpool.net", h:"docs.rocketpool.net"},
      {t:"video", l:"Cyfrin Updraft &mdash; Rocket Pool rETH integration", u:"https://updraft.cyfrin.io/courses/rocket-pool-reth-integration", h:"updraft.cyfrin.io"},
      {t:"lab", l:"EigenLayer contracts &mdash; technical docs", u:"https://github.com/Layr-Labs/eigenlayer-contracts/tree/main/docs", h:"github.com"},
      {t:"lab", l:"Solodit &mdash; rebasing-token integration bugs", u:"https://solodit.cyfrin.io", h:"solodit.cyfrin.io"}
    ]
  },
  {
    n:"08", title:"Perps &amp; Derivatives", backbone:"GMX v2 (pool-based perps)",
    arch:"GMX = shared liquidity pool as trader counterparty (GLP in v1, GM pools in v2), oracle-priced execution by keepers, funding. Orderbook perps (dYdX v4, Hyperliquid) run on their own app-chains, so for EVM audits the pool model is the one to master.",
    econ:"Funding rates, open-interest caps, the LP-is-the-house model and its risks.",
    bug:"Oracle-price execution windows, funding manipulation, liquidation &amp; ADL logic, PnL rounding, reentrancy through execution refunds (GMX v1, July 2025). High-value, subtle surface.",
    res:[
      {t:"doc", l:"GMX docs", u:"https://docs.gmx.io/docs/intro/", h:"docs.gmx.io"},
      {t:"doc", l:"GMX v2 contract architecture", u:"https://docs.gmx.io/docs/api/contracts/architecture/", h:"docs.gmx.io"},
      {t:"doc", l:"GMX v2 known issues (written for auditors)", u:"https://docs.gmx.io/docs/api/contracts/known-issues/", h:"docs.gmx.io"},
      {t:"doc", l:"GMX liquidations", u:"https://docs.gmx.io/docs/trading/liquidations/", h:"docs.gmx.io"},
      {t:"book", l:"Sherlock &mdash; GMX hack explained (v1, July 2025)", u:"https://sherlock.xyz/post/gmx-exchange-hack-explained", h:"sherlock.xyz"},
      {t:"video", l:"Cyfrin Updraft &mdash; GMX Perpetuals Trading course", u:"https://updraft.cyfrin.io/courses/gmx-perpetuals-trading", h:"updraft.cyfrin.io"},
      {t:"lab", l:"GMX v2 source &mdash; gmx-synthetics", u:"https://github.com/gmx-io/gmx-synthetics", h:"github.com"}
    ]
  },
  {
    n:"09", title:"ve-Tokenomics &amp; Governance", backbone:"Curve (veCRV + gauges)",
    arch:"StableSwap invariant (amplified constant-sum/product hybrid) + vote-locked tokens &rarr; gauge weights &rarr; emissions. Governor + Timelock is the orthogonal on-chain governance pattern.",
    econ:"The Curve wars: bribes, emissions-directed liquidity &mdash; a masterclass in mechanism design.",
    bug:"Governance capture (esp. flash-loan-assisted), gauge/emission accounting, voting-escrow checkpoint &amp; decay math, timelock bypass, StableSwap rounding at imbalance.",
    res:[
      {t:"doc", l:"Curve &mdash; Voting Escrow (veCRV)", u:"https://docs.curve.finance/developer/curve-dao/voting-escrow/", h:"docs.curve.finance"},
      {t:"doc", l:"Curve &mdash; gauges and the GaugeController", u:"https://docs.curve.finance/developer/gauges/overview", h:"docs.curve.finance"},
      {t:"doc", l:"Curve whitepapers", u:"https://docs.curve.finance/user/reference/whitepapers", h:"docs.curve.finance"},
      {t:"doc", l:"OpenZeppelin Governor docs", u:"https://docs.openzeppelin.com/contracts/5.x/governance", h:"docs.openzeppelin.com"},
      {t:"book", l:"StableSwap whitepaper", u:"https://classic.curve.finance/files/stableswap-paper.pdf", h:"classic.curve.finance"},
      {t:"book", l:"RareSkills &mdash; get_D() and get_y() in Curve StableSwap", u:"https://rareskills.io/post/curve-get-d-get-y", h:"rareskills.io"},
      {t:"video", l:"Cyfrin Updraft &mdash; Curve StableSwap course", u:"https://updraft.cyfrin.io/courses/curve-v1", h:"updraft.cyfrin.io"},
      {t:"video", l:"Cyfrin Updraft &mdash; Curve Cryptoswap course", u:"https://updraft.cyfrin.io/courses/curve-cryptoswap", h:"updraft.cyfrin.io"},
      {t:"lab", l:"Rekt &mdash; Beanstalk (flash-loan governance capture)", u:"https://rekt.news/beanstalk-rekt", h:"rekt.news"}
    ]
  },
  {
    n:"10", title:"Cross-chain Bridges", backbone:"LayerZero + lock-mint canonical",
    arch:"Two trust models: canonical lock-and-mint / burn-and-release, vs. generalized messaging (LayerZero endpoint + DVN, or Chainlink CCIP). Verification is where trust lives.",
    econ:"Liquidity fragmentation, wrapped-asset risk, validator/relayer trust assumptions.",
    bug:"Message replay, verification-signature bugs, mint-without-lock, unconfigured peers or DVNs, OFT decimal-conversion dust, messages that fail on the destination and strand funds &mdash; the highest-severity, highest-loss category in DeFi history.",
    res:[
      {t:"doc", l:"LayerZero V2 &mdash; OApp overview", u:"https://docs.layerzero.network/v2/developers/evm/oapp/overview", h:"docs.layerzero.network"},
      {t:"doc", l:"LayerZero V2 &mdash; message security", u:"https://docs.layerzero.network/v2/concepts/protocol/message-security", h:"docs.layerzero.network"},
      {t:"doc", l:"LayerZero V2 &mdash; integration checklist", u:"https://docs.layerzero.network/v2/tools/integration-checklist", h:"docs.layerzero.network"},
      {t:"doc", l:"Chainlink CCIP architecture (contrast)", u:"https://docs.chain.link/ccip/concepts/architecture/overview", h:"docs.chain.link"},
      {t:"doc", l:"OP Stack Standard Bridge (canonical lock-and-mint)", u:"https://docs.optimism.io/app-developers/guides/bridging/standard-bridge", h:"docs.optimism.io"},
      {t:"video", l:"Cyfrin Updraft &mdash; Chainlink Fundamentals (CCIP tokens &amp; messages)", u:"https://updraft.cyfrin.io/courses/chainlink-fundamentals", h:"updraft.cyfrin.io"},
      {t:"lab", l:"Damn Vulnerable DeFi &mdash; Withdrawal (L1/L2 bridge)", u:"https://www.damnvulnerabledefi.xyz/challenges/withdrawal/", h:"damnvulnerabledefi.xyz"},
      {t:"lab", l:"Rekt &mdash; Ronin (validator keys)", u:"https://rekt.news/ronin-rekt", h:"rekt.news"},
      {t:"lab", l:"Rekt &mdash; Wormhole (signature verification)", u:"https://rekt.news/wormhole-rekt", h:"rekt.news"},
      {t:"lab", l:"Rekt &mdash; Nomad (any message accepted)", u:"https://rekt.news/nomad-rekt", h:"rekt.news"}
    ]
  }
];

const CROSS = [
  {t:"lab", l:"Damn Vulnerable DeFi &mdash; attack construction challenges", u:"https://www.damnvulnerabledefi.xyz", h:"damnvulnerabledefi.xyz"},
  {t:"lab", l:"Solodit &mdash; searchable audit-finding corpus + checklist", u:"https://solodit.cyfrin.io", h:"solodit.cyfrin.io"},
  {t:"lab", l:"Rekt.news &mdash; production exploit postmortems", u:"https://rekt.news", h:"rekt.news"},
  {t:"lab", l:"DeFiHackLabs &mdash; replay real hacks on a Foundry fork", u:"https://github.com/SunWeb3Sec/DeFiHackLabs", h:"github.com"},
  {t:"lab", l:"Code4rena &mdash; public contest reports", u:"https://code4rena.com/reports", h:"code4rena.com"},
  {t:"book", l:"Secureum &mdash; Security Pitfalls &amp; Best Practices 101 / 201", u:"https://secureum.substack.com", h:"secureum.substack.com"},
  {t:"book", l:"Dacian &mdash; DeFi attack deep dives", u:"https://dacian.me", h:"dacian.me"},
  {t:"video", l:"Cyfrin Updraft &mdash; Smart Contract Security course (free)", u:"https://updraft.cyfrin.io/courses/security", h:"updraft.cyfrin.io"},
  {t:"video", l:"DeFiHackLabs &mdash; exploit walkthrough videos", u:"https://www.youtube.com/@DeFiHackLabs", h:"youtube.com"}
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
