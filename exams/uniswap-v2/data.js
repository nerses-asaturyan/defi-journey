// Uniswap V2 Deep-Dive Exam — content ported verbatim from the original
// standalone exam. Do not paraphrase: the wording is deliberately precise.

export default {
  id: "uniswap-v2",
  number: "01",
  protocol: "Uniswap V2",
  title: "Uniswap V2 Deep-Dive Exam",
  subtitle:
    "24 questions across core math, flash swaps &amp; TWAP, LP mechanics, and attack vectors. Auditor-grade: numbers, code paths, edge cases. No partial credit.",
  roadmapNode: "01",
  nextUp: "Uniswap V3 concentrated liquidity math",

  theme: {
    bg: "#0E0B1E",
    panel: "#181231",
    panel2: "#211A42",
    line: "#332A5C",
    ink: "#EDEAF7",
    dim: "#9C93C4",
    accent: "#FF007A",   // Uniswap pink
    accent2: "#7B61FF",  // violet
    code: "#0A0818"
  },

  hero:
    '<svg class="curve" viewBox="0 0 700 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path id="hyp" d="M 30 8 C 90 8, 110 20, 160 45 C 230 80, 380 98, 670 102" fill="none" stroke="#332A5C" stroke-width="2"/>' +
    '<path id="hypGlow" d="M 30 8 C 90 8, 110 20, 160 45 C 230 80, 380 98, 670 102" fill="none" stroke="#FF007A" stroke-width="2.5" stroke-dasharray="1000" stroke-dashoffset="1000"/>' +
    '<circle id="dot" r="6" fill="#FF007A" cx="30" cy="8"/>' +
    '<text x="640" y="90" fill="#9C93C4" font-family="IBM Plex Mono" font-size="12">x·y=k</text>' +
    "</svg>",

  cats: ["Core AMM math", "Flash swaps & TWAP", "LP mint / burn", "Attack vectors"],

  questions: [
    // ---------- CORE AMM MATH ----------
    {
      c: 0,
      q: "The router computes output amounts with getAmountOut. Which formula is exactly correct?",
      opts: [
        "amountOut = amountIn · reserveOut / reserveIn · 0.997",
        "amountOut = (amountIn·997·reserveOut) / (reserveIn·1000 + amountIn·997)",
        "amountOut = (amountIn·reserveOut·1000) / (reserveIn·997 + amountIn)",
        "amountOut = reserveOut − k / (reserveIn + amountIn·0.997)"
      ],
      a: 1,
      exp: "<b>The 0.3% fee is applied to the input</b> before the constant-product calc: effective input = amountIn·997/1000. Then out = Δy = (Δx'·y)/(x+Δx'). Multiplying through by 1000 gives the integer form in option B. Option A is a linear price approximation — it ignores price impact entirely."
    },
    {
      c: 0,
      q: "Pool: 100 WETH / 200,000 USDC. You swap exactly 1 WETH in. Roughly how much USDC comes out?",
      opts: ["2,000.0 USDC", "1,980.2 USDC", "1,974.3 USDC", "1,940.0 USDC"],
      a: 2,
      exp: "out = 1·997·200000 / (100·1000 + 997) = 199,400,000 / 100,997 ≈ <b>1,974.3</b>. You lose ~2000·0.3% ≈ 6 to the fee and ~19.7 to price impact (you moved the pool ~1%). If you answered 1,980 you applied the fee but forgot price impact."
    },
    {
      c: 0,
      q: "Inside Pair.swap(), the invariant check is: balance0Adjusted · balance1Adjusted >= reserve0 · reserve1 · 1000². Why the 1000² factor?",
      opts: [
        "To prevent uint overflow in the multiplication",
        "Because adjusted balances were scaled by 1000 to apply the 3/1000 fee in integer math",
        "It normalizes for tokens with fewer than 18 decimals",
        "It's the MINIMUM_LIQUIDITY constant applied to both sides"
      ],
      a: 1,
      exp: "balanceAdjusted = balance·1000 − amountIn·3, i.e. balances scaled ×1000 with the fee subtracted. Since the left side is scaled by 1000 per token, the right side must be scaled by <b>1000²</b> to compare like with like. This is how the pair enforces the fee without floating point."
    },
    {
      c: 0,
      q: "After a normal (non-flash) swap completes, what happens to k = reserve0·reserve1?",
      opts: [
        "It stays exactly constant — that's the invariant",
        "It strictly increases, because the 0.3% fee stays in the reserves",
        "It decreases by the fee amount",
        "It changes only if feeTo is set"
      ],
      a: 1,
      exp: "The 'constant' product is a floor, not an equality. The check is <b>>=</b>, and fees remain in the pool, so k grows with every trade. That growth is exactly what LPs earn — and what _mintFee measures via √k vs √kLast."
    },
    {
      c: 0,
      q: "Pair.swap(amount0Out, amount1Out, to, data) — can a caller request BOTH outputs to be non-zero in one call?",
      opts: [
        "No — the pair reverts with INSUFFICIENT_OUTPUT_AMOUNT",
        "No — the router blocks it before reaching the pair",
        "Yes — any combination is fine as long as the adjusted-k check passes at the end",
        "Yes, but only when data.length > 0 (flash swap mode)"
      ],
      a: 2,
      exp: "The pair is deliberately minimal: it optimistically sends whatever you ask for, then checks adjusted k. Withdrawing both tokens is legal if you pay enough back. The router never does this, but <b>direct integrators can</b> — a detail that matters when auditing custom pair callers."
    },
    {
      c: 0,
      q: "Where does slippage protection (amountOutMin) actually live?",
      opts: [
        "In the pair's swap() — it reverts if output < minimum",
        "In the router only; the pair has zero slippage protection",
        "In the factory's fee logic",
        "In the ERC-20 transfer hook"
      ],
      a: 1,
      exp: "The pair only knows k. <b>amountOutMin and deadline are router-level guards</b>. Any contract that calls a pair directly and forgets its own min-out check is sandwichable by design — a classic finding in protocols that 'save gas' by skipping the router."
    },

    // ---------- FLASH SWAPS & TWAP ----------
    {
      c: 1,
      q: "What is the exact sequencing inside swap() that makes flash swaps possible?",
      opts: [
        "Tokens are transferred out only after the k-check passes",
        "Tokens are transferred out first, then the callback runs, then the k-check runs on final balances",
        "The callback runs first to collect payment, then tokens are sent",
        "A separate flashSwap() function handles it with its own invariant"
      ],
      a: 1,
      exp: "<b>Optimistic transfer</b>: (1) send amountOut to `to`, (2) if data.length > 0 call IUniswapV2Callee(to).uniswapV2Call(...), (3) read balances and enforce adjusted-k. The borrower can do anything mid-callback as long as the pool ends up whole. Same function, same invariant — no special code path."
    },
    {
      c: 1,
      q: "You flash-borrow 1,000 DAI and repay in DAI in the same call. Minimum repayment?",
      opts: [
        "1,000 DAI — flash swaps are free",
        "1,003.0 DAI (0.30%)",
        "1,003.01 DAI (≈0.3009%, i.e. amount·1000/997 rounded up)",
        "1,005 DAI (0.5%)"
      ],
      a: 2,
      exp: "The k-check treats your repayment as a new input with the 3/1000 fee on it. To restore k you need repay ≥ amount·1000/997, i.e. a fee of <b>3/997 ≈ 0.3009%</b>, not 0.300%. Off-by-a-hair errors here are a recurring bug in flash-swap arbitrage bots."
    },
    {
      c: 1,
      q: "price0CumulativeLast is updated in _update(). Which reserves does the accumulator use, and when?",
      opts: [
        "Post-trade reserves, on every swap",
        "Pre-trade reserves, but only on the first interaction in each block",
        "Post-trade reserves, once per block at block end",
        "An average of pre- and post-trade reserves"
      ],
      a: 1,
      exp: "_update adds price·timeElapsed only when blockTimestamp != blockTimestampLast — i.e. <b>once per block, using the reserves as they stood at the end of the previous block</b>. So manipulating the price and reading the oracle in the same block does nothing; an attacker must hold the skewed price across a block boundary, exposing themselves to arbitrage."
    },
    {
      c: 1,
      q: "Why are reserves stored as uint112 instead of uint256?",
      opts: [
        "Gas: uint112 + uint112 + uint32 timestamp pack into a single storage slot",
        "To prevent overflow in price math",
        "ERC-20 balances can't exceed 2^112",
        "To make the UQ112x112 library work"
      ],
      a: 0,
      exp: "112 + 112 + 32 = 256: both reserves and blockTimestampLast live in <b>one SLOAD</b>. UQ112x112 fixed-point is a consequence of that choice, not the cause. Side effect worth knowing: balances above 2^112−1 brick swaps until someone calls skim()."
    },
    {
      c: 1,
      q: "price0CumulativeLast and the block timestamp both overflow eventually. The V2 design treats this as:",
      opts: [
        "A known bug patched in V2.1",
        "Safe by design — TWAP is a difference of accumulators, and modular arithmetic makes the subtraction correct across one overflow",
        "Safe only because reserves are capped at uint112",
        "A reason all V2 oracles must use windows under 1 hour"
      ],
      a: 1,
      exp: "The accumulator is <b>meant to overflow</b> (it's unchecked). TWAP = (cum2 − cum1)/(t2 − t1), and uint wraparound cancels in the subtraction as long as your window is shorter than the full overflow period. Integrators who 'fix' this with SafeMath actually break the oracle."
    },
    {
      c: 1,
      q: "A lending protocol prices collateral with getReserves() spot price on a V2 pair. The core problem:",
      opts: [
        "getReserves is not view, so it can't be used in oracles",
        "Spot price can be moved arbitrarily within one transaction (e.g. flash loan), letting an attacker mint bad debt against a fake price",
        "Reserves are uint112, so precision is too low for pricing",
        "getReserves returns stale values until sync() is called"
      ],
      a: 1,
      exp: "Spot reserves are <b>attacker-writable state within a single tx</b>: flash-loan → dump into pool → borrow against inflated collateral → swap back. This killed bZx, Harvest, Cheese Bank and many others. The mitigation V2 itself ships is the cumulative-price TWAP, which can't be moved intra-block."
    },

    // ---------- LP MINT / BURN ----------
    {
      c: 2,
      q: "On the very first mint, liquidity = √(amount0·amount1) − MINIMUM_LIQUIDITY. Where do the 1000 units go and why?",
      opts: [
        "To the factory's feeTo address as a protocol fee",
        "Permanently minted to address(0), to make inflating the share price of the first LP position expensive",
        "Returned to the first depositor after the second deposit",
        "Burned only if feeTo is unset"
      ],
      a: 1,
      exp: "1000 wei of LP is <b>locked at address(0) forever</b>. It sets a floor on totalSupply so the classic 'deposit 1 wei, donate tokens, round out the next depositor' inflation attack costs ~1000× more per doubling of share price. Note: this protects the pair itself; vaults built on top of LP tokens must implement their own defense."
    },
    {
      c: 2,
      q: "Subsequent mints use liquidity = min(amount0·totalSupply/reserve0, amount1·totalSupply/reserve1). What happens if you deposit in the wrong ratio?",
      opts: [
        "The transaction reverts with INVALID_RATIO",
        "You get LP based on the smaller side; the excess of the other token is silently donated to all existing LPs",
        "The pair refunds the excess automatically",
        "You get the average of the two ratios"
      ],
      a: 1,
      exp: "The <b>min()</b> means the limiting token defines your share, and your surplus of the other token just raises reserves for everyone. The router protects users by quoting the correct ratio first; direct pair callers who skip that quietly gift value to the pool."
    },
    {
      c: 2,
      q: "burn() calculates amounts as liquidity·balance/totalSupply. Balance, not reserve — why does that distinction matter?",
      opts: [
        "It doesn't; balance always equals reserve inside burn",
        "Tokens donated or accidentally sent to the pair are distributed pro-rata to whoever burns, so burn also 'sweeps' un-skimmed excess",
        "It makes burn immune to reentrancy",
        "Reserves can't be read during burn due to the lock modifier"
      ],
      a: 1,
      exp: "Using live <b>token.balanceOf(pair)</b> means any un-skimmed surplus flows to burners pro-rata. Auditor angle: if your protocol sends tokens to a pair expecting to skim() later, anyone burning LP in between captures a share of it."
    },
    {
      c: 2,
      q: "When feeTo is set, the protocol fee is:",
      opts: [
        "0.05% taken from every swap's output, transferred immediately",
        "1/6 of the growth in √k since kLast, minted lazily as new LP tokens on the next mint/burn",
        "0.3% of the input, split 5:1 between LPs and the protocol",
        "A fixed 1000 wei per swap"
      ],
      a: 1,
      exp: "Fees stay in the reserves; the protocol's cut is realized <b>lazily</b>. _mintFee compares √k to √kLast and mints LP to feeTo equal to 1/6 of the growth — economically ≈ 0.05% of volume (a sixth of 0.3%). No per-swap transfer, so swaps stay cheap."
    },
    {
      c: 2,
      q: "skim() vs sync() — pick the correct pairing:",
      opts: [
        "skim: force reserves = balances · sync: send excess balance to caller",
        "skim: send (balance − reserve) of each token to a chosen address · sync: force reserves = current balances",
        "Both do the same thing; sync is the deprecated alias",
        "skim burns excess · sync mints it to feeTo"
      ],
      a: 1,
      exp: "<b>skim</b> is the recovery valve for tokens sent directly to the pair (anyone can claim the excess — never 'pre-fund' a pair!). <b>sync</b> re-anchors reserves to balances, e.g. after a rebasing token contracts, or when balance > uint112 max has bricked _update."
    },
    {
      c: 2,
      q: "Why does the pair need the `lock` reentrancy modifier at all?",
      opts: [
        "Solidity 0.5.16 had no built-in reentrancy protection for view functions",
        "swap() makes external calls (token transfers + uniswapV2Call callback) before the invariant check, so a reentrant call would read stale reserves mid-flight",
        "It prevents two different users swapping in the same block",
        "It's only there to protect mint() from ERC-777 hooks"
      ],
      a: 1,
      exp: "During swap, tokens with hooks (ERC-777) or the flash-swap callback hand execution to arbitrary code <b>while reserves are stale</b>. Re-entering mint/burn/swap at that moment would use pre-trade reserves against post-trade balances. The single `unlocked` flag guards every state-mutating function."
    },

    // ---------- ATTACK VECTORS ----------
    {
      c: 3,
      q: "A vault accepts UNI-V2 LP tokens and mints shares = deposit·totalShares/totalAssets. First depositor attack: what's the move?",
      opts: [
        "Flash-loan LP tokens and vote with them",
        "Deposit 1 wei of LP to mint 1 share, then transfer LP directly to the vault to inflate assets-per-share so the next depositor's shares round to 0",
        "Call skim() on the vault",
        "Mint LP with unbalanced amounts to break the vault's accounting"
      ],
      a: 1,
      exp: "The V2 pair defends <b>itself</b> with MINIMUM_LIQUIDITY, but vaults on top recreate the vulnerability: 1-wei deposit + direct donation makes 1 share worth more than the victim's whole deposit, which then <b>rounds down to 0 shares</b>. Fixes: virtual shares/assets offset (ERC-4626 style), dead shares, or internal balance accounting."
    },
    {
      c: 3,
      q: "Standard swapExactTokensForTokens breaks with fee-on-transfer tokens. Why, and what's the correct variant?",
      opts: [
        "The pair rejects FoT tokens at the factory level; no variant exists",
        "The router pre-computes amounts from reserves, but fewer tokens arrive than sent; the ...SupportingFeeOnTransferTokens variants measure actual balance deltas instead",
        "FoT tokens overflow uint112; use swapTokensForExactTokens",
        "The fee makes k decrease, which the pair forbids"
      ],
      a: 1,
      exp: "getAmountsOut assumes amountIn arrives in full; with FoT the pair receives less and the k-check reverts (or the user is overcharged). The <b>SupportingFeeOnTransferTokens</b> functions compute amountInput from balanceOf(pair) − reserve after transfer — the pair itself always worked this way; only the router's precomputation was wrong."
    },
    {
      c: 3,
      q: "Why does the pair use a low-level call pattern (_safeTransfer) instead of plain IERC20.transfer?",
      opts: [
        "Gas optimization only",
        "Tokens like USDT return no boolean; _safeTransfer accepts either no return data or an ABI-encoded true, so non-standard ERC-20s don't brick the pool",
        "To bypass the token's transfer hooks",
        "To support ERC-721 in the same pool"
      ],
      a: 1,
      exp: "require(success && (data.length == 0 || abi.decode(data,(bool)))) — the canonical fix for <b>missing-return-value tokens</b> (USDT, BNB). A naive interface call would revert on decode and permanently trap funds. Any contract you audit that does raw .transfer() on arbitrary tokens has this bug."
    },
    {
      c: 3,
      q: "A user's swap gets sandwiched. Which two router parameters are their only protection, and what does each stop?",
      opts: [
        "amountOutMin caps loss from price movement; deadline stops the tx being held and executed later at a worse price",
        "gasPrice and nonce",
        "amountInMax prevents the frontrun; path prevents the backrun",
        "There is no protection; sandwiching is unavoidable on V2"
      ],
      a: 0,
      exp: "<b>amountOutMin</b> bounds how bad the fill can be — a tight value shrinks the sandwich's profit window to nothing. <b>deadline</b> prevents a validator/mempool from parking your signed tx and executing it much later when the price has drifted. Setting minOut = 0 or deadline = max uint (both common in the wild) hands MEV bots free money."
    },
    {
      c: 3,
      q: "Router's pairFor() computes the pair address off-chain-style with CREATE2 instead of asking the factory. The classic integration bug on forks:",
      opts: [
        "CREATE2 addresses differ per chain, so pairs can't exist on L2s",
        "Hardcoded init code hash: forks with modified pair bytecode have a different hash, so pairFor derives a wrong address and swaps hit a non-existent or attacker-deployed contract",
        "pairFor sorts tokens incorrectly on forks",
        "The salt uses block.timestamp, which miners manipulate"
      ],
      a: 1,
      exp: "address = keccak256(0xff, factory, keccak256(token0,token1), <b>initCodeHash</b>). Anyone forking V2 with even a comment change in the pair contract gets a new hash — and copy-pasted routers then compute addresses where <b>no pair exists</b> (or worse, where someone deployed a trap). Always verify the hash against the fork's actual pair creation code."
    },
    {
      c: 3,
      q: "Which statement about manipulating the V2 TWAP oracle is accurate?",
      opts: [
        "It's free with a flash loan, same as spot",
        "Impossible under any circumstances",
        "The attacker must hold a skewed price across ≥1 block boundary, paying real capital and eating arbitrage losses that scale with pool depth and window length",
        "Only the pair deployer can influence the accumulator"
      ],
      a: 2,
      exp: "Because the accumulator snapshots <b>pre-trade reserves once per block</b>, a flash loan (which must repay intra-tx) can't touch it. The attacker must actually move the price and leave it exposed to arbitrageurs for at least a block — cost ∝ pool liquidity × how far × how long. Deep pool + long window = economically prohibitive; shallow pool + short window = still very attackable."
    }
  ],

  verdictTiers: [
    { minPct: 100, text: "Flawless. Go break some invariants." },
    { minPct: 85, text: "Auditor-grade. Your gaps are minor." },
    { minPct: 65, text: "Solid core, but the edges are where bugs live." },
    { minPct: 45, text: "You know the shape of V2 — now learn its sharp corners." },
    { minPct: 0, text: "Reread the Pair contract line by line. It's only ~300 lines." }
  ],

  gapNotes: [
    "Re-derive getAmountOut from x·y=k by hand and trace swap()’s adjusted-balance check in the Pair source.",
    "Read _update() and the flash-swap path in swap(). Key facts: pre-trade reserves, once per block, fee = 3/997, intentional overflow.",
    "Trace mint(), burn() and _mintFee(). Know: MINIMUM_LIQUIDITY, min() ratio punishment, balance-vs-reserve in burn, lazy 1/6 protocol fee.",
    "Study real incidents: spot-oracle flash-loan attacks, ERC-4626 first-depositor inflation, FoT router bugs, forked-init-code-hash routers."
  ]
};
