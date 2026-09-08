// Original questions, ordered from the RareSkills math chapters through the
// Development Book milestones, then checked against production V3 semantics.
// P = raw token1/token0 price; s = sqrt(P); a/b in formulas are sqrt bounds.
// References are appended to explanations without changing the shared engine.
const CORE = "https://github.com/Uniswap/v3-core/blob/v1.0.0/contracts/";
const PERIPHERY = "https://github.com/Uniswap/v3-periphery/blob/v1.3.0/contracts/";
const BOOK = "https://uniswapv3book.com/";
const RARE = "https://rareskills.io/post/";
const sources = {
  qformat: ["RareSkills: Q numbers", RARE + "q-number-format"],
  sqrt: ["RareSkills: sqrtPriceX96", RARE + "uniswap-v3-sqrtpricex96"],
  ticks: ["RareSkills: ticks", RARE + "uniswap-v3-ticks"],
  limits: ["RareSkills: tick limits", RARE + "uniswap-v3-min-max-tick"],
  spacing: ["RareSkills: fees and spacing", RARE + "uniswap-v3-tick-spacing"],
  priceTick: ["RareSkills: price to tick", RARE + "uniswap-v3-price-to-tick"],
  ratioTick: ["RareSkills: TickMath", RARE + "uniswap-v3-getsqrtratioattick"],
  concentrated: ["RareSkills: concentrated liquidity", RARE + "uniswap-v3-concentrated-liquidity"],
  virtual: ["RareSkills: virtual reserves", RARE + "uniswap-v3-virtual-reserves"],
  real: ["RareSkills: real reserves", RARE + "uniswap-v3-real-reserves"],
  invariant: ["RareSkills: V3 invariant", RARE + "uniswap-v3-constant-product"],
  deltas: ["RareSkills: amount deltas", RARE + "uniswap-v3-getAmountDelta"],
  positions: ["RareSkills: positions", RARE + "uniswap-v3-positions"],
  liquidityBook: ["V3 Book: calculating liquidity", BOOK + "milestone_1/calculating-liquidity.html"],
  mintBook: ["V3 Book: providing liquidity", BOOK + "milestone_1/providing-liquidity.html"],
  bitmapBook: ["V3 Book: tick bitmap", BOOK + "milestone_2/tick-bitmap-index.html"],
  crossingBook: ["V3 Book: cross-tick swaps", BOOK + "milestone_3/cross-tick-swaps.html"],
  slippageBook: ["V3 Book: slippage protection", BOOK + "milestone_3/slippage-protection.html"],
  liquidityCalc: ["V3 Book: liquidity calculation", BOOK + "milestone_3/liquidity-calculation.html"],
  flashBook: ["V3 Book: flash loans", BOOK + "milestone_3/flash-loans.html"],
  pathBook: ["V3 Book: swap paths", BOOK + "milestone_4/path.html"],
  multiBook: ["V3 Book: multi-pool swaps", BOOK + "milestone_4/multi-pool-swaps.html"],
  feesBook: ["V3 Book: swap fees", BOOK + "milestone_5/swap-fees.html"],
  flashFeesBook: ["V3 Book: flash fees", BOOK + "milestone_5/flash-loan-fees.html"],
  protocolBook: ["V3 Book: protocol fees", BOOK + "milestone_5/protocol-fees.html"],
  oracleBook: ["V3 Book: price oracle", BOOK + "milestone_5/price-oracle.html"],
  nftBook: ["V3 Book: NFT manager", BOOK + "milestone_6/nft-manager.html"],
  pool: ["Core: UniswapV3Pool", CORE + "UniswapV3Pool.sol"],
  factory: ["Core: UniswapV3Factory", CORE + "UniswapV3Factory.sol"],
  tickMath: ["Core: TickMath", CORE + "libraries/TickMath.sol"],
  bitmap: ["Core: TickBitmap", CORE + "libraries/TickBitmap.sol"],
  tick: ["Core: Tick", CORE + "libraries/Tick.sol"],
  position: ["Core: Position", CORE + "libraries/Position.sol"],
  sqrtMath: ["Core: SqrtPriceMath", CORE + "libraries/SqrtPriceMath.sol"],
  swapMath: ["Core: SwapMath", CORE + "libraries/SwapMath.sol"],
  fullMath: ["Core: FullMath", CORE + "libraries/FullMath.sol"],
  oracle: ["Core: Oracle", CORE + "libraries/Oracle.sol"],
  oracleLibrary: ["Periphery: OracleLibrary", PERIPHERY + "libraries/OracleLibrary.sol"],
  liquidityAmounts: ["Periphery: LiquidityAmounts", PERIPHERY + "libraries/LiquidityAmounts.sol"],
  callback: ["Periphery: CallbackValidation", PERIPHERY + "libraries/CallbackValidation.sol"],
  router: ["Periphery: SwapRouter", PERIPHERY + "SwapRouter.sol"],
  path: ["Periphery: Path", PERIPHERY + "libraries/Path.sol"],
  nft: ["Periphery: NonfungiblePositionManager", PERIPHERY + "NonfungiblePositionManager.sol"],
  quoter: ["Periphery: Quoter", PERIPHERY + "lens/Quoter.sol"]
};

function explain(html, ...keys) {
  const links = keys.map((key) => {
    const [label, url] = sources[key];
    return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
  });
  return html + `<span class="reading">Revisit: ${links.join(" · ")}</span>`;
}

export default {
  id: "uniswap-v3",
  number: "02",
  protocol: "Uniswap V3",
  title: "Uniswap V3 Deep-Dive Exam",
  subtitle: "72 questions across 12 topics. Work through the math, trace the code, and reason about edge cases. Detailed answers after every question; no partial credit.",
  roadmapNode: "01",
  nextUp: "oracle integrations and lending protocols",
  theme: { accent: "#D52B87", accent2: "#75D9CA" },
  hero:
    '<svg viewBox="0 0 700 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M30 96 H180 V66 H300 V22 H420 V54 H540 V82 H670" fill="none" stroke="var(--accent-2)" stroke-width="2" opacity=".35"/>' +
    '<path data-hero-path d="M30 96 H180 V66 H300 V22 H420 V54 H540 V82 H670" fill="none" stroke="var(--line)" stroke-width="2"/>' +
    '<path data-hero-glow d="M30 96 H180 V66 H300 V22 H420 V54 H540 V82 H670" fill="none" stroke="var(--accent)" stroke-width="2.5"/>' +
    '<circle data-hero-dot r="5" fill="var(--accent)" cx="30" cy="96"/>' +
    '<text x="670" y="20" text-anchor="end" fill="var(--dim)" font-family="IBM Plex Mono" font-size="11">active liquidity across ticks</text></svg>',
  cats: [
    "Price & fixed-point math", "Ticks & the bitmap", "Concentrated liquidity math",
    "Mint, burn & positions", "Swap math & rounding", "Crossing ticks",
    "Fee growth accounting", "Callbacks & flash loans", "Factory & pool lifecycle",
    "Oracles & TWAP", "Routing & NFT periphery", "Integration & audit scenarios"
  ],
  questions: [
    // 01–06: Price & fixed-point math.
    {
      c: 0,
      q: "A pool has sqrtPriceX96 = 2 × 2<sup>96</sup>. Both tokens have the same decimals. What is the spot price of token0 in token1?",
      opts: ["2 token1 per token0", "4 token1 per token0", "0.25 token1 per token0", "2^192 token1 per token0"],
      a: 1,
      exp: explain("Decode first: s = sqrtPriceX96 / 2<sup>96</sup> = 2. Then <b>P = s² = 4</b>. The inverse quote is 0.25 token0 per token1. Squaring the encoded integer without also dividing by 2<sup>192</sup> mixes fixed-point and ordinary units. Equal decimals remove the separate human-unit scaling step.", "sqrt", "qformat")
    },
    {
      c: 0,
      q: "token0 has 6 decimals and token1 has 18. The decoded raw price P is 10<sup>12</sup>. What is the human-readable token1-per-token0 price?",
      opts: ["10^24", "10^12", "10^-12", "1"],
      a: 3,
      exp: explain("One whole token0 contains 10<sup>6</sup> raw units. At P = 10<sup>12</sup>, those buy 10<sup>18</sup> raw token1 units, or <b>one whole token1</b>. In general, P<sub>human</sub> = P<sub>raw</sub> × 10<sup>d0−d1</sup>. Reversing that decimal exponent can misprice collateral by many orders of magnitude.", "sqrt")
    },
    {
      c: 0,
      q: "What does Q64.96 mean for the pool's uint160 sqrtPriceX96?",
      opts: ["A binary fixed-point value with 96 fractional bits and 64 integer bits", "A decimal with 96 digits after the point", "A signed value with 64 total bits", "A price multiplied by 10^96"],
      a: 0,
      exp: explain("The stored integer represents s × 2<sup>96</sup>. Its 160 bits divide into <b>64 integer bits and 96 fractional bits</b>; it is unsigned. The spacing between adjacent representable square-root prices is 2<sup>−96</sup>. Token decimals are unrelated to this binary scale and must be handled separately when displaying a quote.", "qformat")
    },
    {
      c: 0,
      q: "Ignoring integer representation error, which relationship correctly connects tick i, price P, and square-root price s?",
      opts: ["P = 1.0001^(i/2), s = 1.0001^i", "P = i × 1.0001, s = √i", "P = 1.0001^i, s = 1.0001^(i/2)", "P = 2^i, s = 2^(i/96)"],
      a: 2,
      exp: explain("Ticks form a <b>geometric price grid</b>: advancing one tick multiplies P by 1.0001, so advancing 100 ticks multiplies it by 1.0001<sup>100</sup>, not exactly 1.01. Taking the square root halves the exponent. Tick zero therefore maps to raw price one, and negative ticks correspond to raw prices below one.", "ticks", "ratioTick")
    },
    {
      c: 0,
      q: "A swap sells token0 to buy token1: zeroForOne = true. Assuming nonzero price movement, what happens to sqrtPriceX96?",
      opts: ["It decreases", "It increases", "It stays fixed until an initialized tick is crossed", "Its direction depends only on the token symbols"],
      a: 0,
      exp: explain("Adding token0 and removing token1 makes token0 cheaper in token1 terms, so <b>P and √P decrease</b>. The reverse swap raises them. Price can move inside a tick interval; initialized ticks mark liquidity-accounting boundaries rather than every permitted price. Direction follows token ordering, not names such as ETH or USDC.", "concentrated", "swapMath")
    },
    {
      c: 0,
      q: "An integration widens sqrtPriceX96 to uint256, squares it, then divides by 2^192. Why can this still fail?",
      code: "uint256 rawPrice = uint256(sqrtPriceX96) * sqrtPriceX96 / (uint256(1) << 192);",
      opts: ["A uint160 value can never be cast to uint256", "The intermediate square can need 320 bits, and early division can also lose precision", "2^192 is too large to fit uint256", "The pool stores a signed square-root price"],
      a: 1,
      exp: explain("The <b>intermediate product</b> can overflow even when a final scaled result would fit. In Solidity 0.8 this multiplication reverts; unchecked arithmetic can silently corrupt it. Production OracleLibrary uses different scaling branches and FullMath.mulDiv for quotes. It also preserves fractional precision until multiplying by the requested base amount; an integer raw price alone can truncate to zero.", "fullMath", "oracleLibrary")
    },
    // 07–12: Ticks & the bitmap.
    {
      c: 1,
      q: "A pool's tickSpacing is 60. Which statement is correct?",
      opts: ["The current price must always equal the price at a multiple of 60", "There are only 60 possible ticks", "Position boundaries must be multiples of 60, but the current tick need not be", "All multiples of 60 are initialized at deployment"],
      a: 2,
      exp: explain("Tick spacing restricts <b>where liquidity boundaries may be initialized</b>. A position such as [−120, 180) is aligned, while [−119, 180) is not. Trading can leave the current tick at 17. A usable tick becomes initialized only when liquidity actually uses it as a boundary; alignment alone does not set its bitmap bit.", "spacing", "bitmap")
    },
    {
      c: 1,
      q: "TickBitmap compresses tick = −1 with tickSpacing = 10. Solidity signed division truncates toward zero. What compressed index must the search use?",
      opts: ["0", "1", "−10", "−1"],
      a: 3,
      exp: explain("The initial quotient is zero, but the bitmap needs <b>floor(−1 / 10) = −1</b>. Because the tick is negative with a nonzero remainder, the implementation decrements the quotient. Without that correction, a leftward search could treat tick zero, which is above the current price, as part of the starting interval. Exact negative multiples need no correction.", "bitmapBook", "bitmap")
    },
    {
      c: 1,
      q: "For compressed tick −1, which bitmap word and bit hold its initialized flag?",
      opts: ["word −1, bit 255", "word 0, bit 0", "word −1, bit 1", "word 1, bit 255"],
      a: 0,
      exp: explain("Each word contains 256 compressed ticks. Word −1 covers indices −256 through −1, so −1 occupies its <b>last bit, 255</b>. The arithmetic shift by eight gives word −1, and the low eight bits give 255. This is why treating the signed tick as a positive array index breaks searches around tick zero.", "bitmapBook", "bitmap")
    },
    {
      c: 1,
      q: "nextInitializedTickWithinOneWord finds no set bit in the searched portion. What should its caller expect?",
      opts: ["An automatic revert proving the entire pool has no liquidity", "A word-edge tick with initialized = false; the swap loop may keep searching", "The globally nearest initialized tick regardless of distance", "A newly initialized tick with zero liquidity"],
      a: 1,
      exp: explain("The search is bounded to a bitmap word; it is <b>not a global liquidity lookup</b>. An empty result still supplies an edge that lets the swap loop advance. The caller must respect the false initialized flag and avoid applying a tick transition there. Liquidity in another word may still be reachable before the user's price limit.", "bitmap", "crossingBook")
    },
    {
      c: 1,
      q: "Which statement about production TickMath bounds is accurate?",
      opts: ["Valid ticks are only 0 through 887272", "getTickAtSqrtRatio accepts MAX_SQRT_RATIO inclusively", "Both conversions accept every uint160 value", "Ticks run from −887272 to 887272; getTickAtSqrtRatio excludes MAX_SQRT_RATIO"],
      a: 3,
      exp: explain("getSqrtRatioAtTick accepts the two endpoint ticks. The inverse accepts <b>MIN_SQRT_RATIO ≤ input &lt; MAX_SQRT_RATIO</b>, with an exclusive upper bound. Usable LP endpoint ticks must additionally satisfy the pool's spacing, so ±887272 are not aligned in every pool. Mixing these two domains is a common source of boundary-test errors.", "limits", "tickMath")
    },
    {
      c: 1,
      q: "Tick 120 is the upper boundary of a position with L = 500 and the lower boundary of another with L = 500. No other positions use this tick. What are its gross and net liquidity?",
      opts: ["gross 0, net 0; clear its bitmap bit", "gross 500, net 1000", "gross 1000, net 0; keep it initialized", "gross 1000, net 1000"],
      a: 2,
      exp: explain("Gross liquidity counts the liquidity attached to either side: 500 + 500 = <b>1000</b>. Net liquidity is the signed change on an upward crossing: −500 + 500 = <b>0</b>. The tick remains initialized because gross liquidity is nonzero. Crossing still changes which positions are active and updates outside accounting, even though total active L is unchanged.", "tick", "positions")
    },
    // 13–18: Concentrated liquidity math (real-number exercises).
    {
      c: 2,
      q: "For active liquidity L = 1000 at square-root price s = 2, what are the virtual reserves, ignoring rounding?",
      opts: ["x = 2000, y = 500", "x = 500, y = 2000", "x = 1000, y = 1000", "x = 250, y = 4000"],
      a: 1,
      exp: explain("The virtual reserves are <b>x = L/s = 500</b> and <b>y = Ls = 2000</b>. Their product is L² = 1,000,000 and y/x = 4 = P. They describe the local constant-product curve. They are not the ERC-20 balances of a finite-range position or of a pool holding many inactive positions and accrued fees.", "virtual")
    },
    {
      c: 2,
      q: "Treat the following as continuous values, ignoring tick discretization and rounding. A position has L = 1200, lower square-root bound a = 1, upper bound b = 3, and current s = 2. What principal does it hold?",
      opts: ["600 token0 and 2400 token1", "400 token0 and 1200 token1", "200 token0 and 2400 token1", "200 token0 and 1200 token1"],
      a: 3,
      exp: explain("Inside the range, x = L(1/s − 1/b) = 1200(1/2 − 1/3) = <b>200</b>; y = L(s − a) = 1200(2 − 1) = <b>1200</b>. These are real principal amounts, excluding fees. The virtual reserves would be 600 and 2400; the finite endpoints subtract the assets that would lie beyond the chosen range.", "real", "liquidityBook")
    },
    {
      c: 2,
      q: "For L = 1200 and square-root bounds [1, 3], what principal remains when s is strictly below 1? Ignore tick discretization and rounding.",
      opts: ["800 token0, zero token1", "Zero token0, 2400 token1", "1200 of each token", "Zero of both tokens because the position is inactive"],
      a: 0,
      exp: explain("Below the range, the position holds only token0: x = L(1/a − 1/b) = 1200(1 − 1/3) = <b>800</b>, y = 0. Being inactive does not destroy the deposit; it means the position contributes no active liquidity and earns no swap fees while price stays below it. Above the upper bound it instead holds only token1.", "real", "liquidityAmounts")
    },
    {
      c: 2,
      q: "A user offers at most 300 token0 and 900 token1. With a = 1, s = 2, b = 3, what liquidity can be minted in continuous math, ignoring rounding?",
      opts: ["L = 1800; use all token0", "L = 2700; add the two liquidity estimates", "L = 900; use 150 token0 and 900 token1", "L = 1200; always split the budget equally"],
      a: 2,
      exp: explain("token0 can support L0 = 300/(1/2 − 1/3) = 1800; token1 supports L1 = 900/(2 − 1) = 900. Select <b>min(L0, L1) = 900</b>, then recalculate token use: x = 150, y = 900. The other 150 token0 is unnecessary. Taking the larger estimate would require token1 beyond the user's budget.", "liquidityBook", "liquidityCalc", "liquidityAmounts")
    },
    {
      c: 2,
      q: "For a single position inside square-root bounds [a, b], which equation relates real principal reserves x and y to liquidity L, ignoring fees and rounding?",
      opts: ["xy = L² for all finite ranges", "(x + L/b)(y + La) = L²", "(x − L/b)(y − La) = L²", "x + y = L²"],
      a: 1,
      exp: explain("Add the virtual offsets: x + L/b = L/s and y + La = Ls. Their product is <b>L²</b>. For the earlier example, (200 + 400)(1200 + 1200) = 1,440,000 = 1200². The real product xy alone is only 240,000. Applying V2's reserve-product equation directly to a finite V3 position misses those offsets.", "invariant")
    },
    {
      c: 2,
      q: "Two positions contain the current price. For the same deposited capital, one uses a much narrower range. Which conclusion is justified?",
      opts: ["The narrow position guarantees a higher net return", "Both must supply the same L because their dollar deposits match", "The narrow position cannot become single-sided", "The narrow range can provide more L locally, but can leave range sooner and stop earning swap fees"],
      a: 3,
      exp: explain("Concentration places more trading depth near the chosen price per unit of capital. That can increase the position's share of fees while active, but it also concentrates inventory exposure. <b>Capital efficiency does not guarantee profit</b>: price movement, time outside the range, adverse selection, and rebalancing costs matter. L is a curve parameter, not a dollar-value balance.", "concentrated", "virtual")
    },
    // 19–24: Mint, burn & positions.
    {
      c: 3,
      q: "Within one core pool, what identifies a position in the positions mapping?",
      opts: ["An ERC-721 tokenId issued by the pool", "Only the two boundary ticks", "The owner address together with tickLower and tickUpper", "The address that last paid its mint callback"],
      a: 2,
      exp: explain("Core uses a hash of <b>(owner, tickLower, tickUpper)</b>. Multiple mints to the same tuple add to that core position. Different owners can have distinct positions with identical ranges. The NFT manager is a separate accounting layer: the pool itself neither issues an ERC-721 nor knows its tokenIds. A payer can fund a position owned by someone else.", "positions", "position")
    },
    {
      c: 3,
      q: "At current tick 0, someone mints L = 700 into an otherwise valid position [120, 240). What changes?",
      opts: ["The position and its boundary ticks gain liquidity, but pool.liquidity stays unchanged", "pool.liquidity immediately increases by 700", "The pool price moves to tick 120", "The mint must revert because the range excludes tick 0"],
      a: 0,
      exp: explain("The new range is above the current price, so it is funded with <b>token0 only</b> and remains inactive. Its lower tick gains +700 net liquidity and its upper tick −700; gross liquidity rises at both. The position owns 700 L, but pool.liquidity measures only the currently active sum. Minting does not move sqrtPriceX96.", "mintBook", "pool")
    },
    {
      c: 3,
      q: "A contract calls pool.mint(recipient, lower, upper, L, data). Who receives the mint callback, and what proves payment?",
      opts: ["recipient receives it; an allowance alone proves payment", "The factory receives it; it checks the ERC-20 total supplies", "Every existing LP receives it; each approves the mint", "The caller receives it; the pool checks required token balance increases afterward"],
      a: 3,
      exp: explain("The callback goes to <b>msg.sender, the contract calling mint</b>, even when recipient is another owner. That caller arranges payment of the computed token amounts. The pool snapshots balances before the callback and verifies sufficient increases after it. An allowance authorizes a transfer but does not itself transfer anything; underpayment reverts the entire mint.", "mintBook", "pool")
    },
    {
      c: 3,
      q: "A direct core position owner calls burn(lower, upper, 100). Does that call transfer the withdrawn principal to their wallet?",
      opts: ["Yes, burn transfers principal and all fees immediately", "No; it reduces liquidity and credits tokensOwed, which collect can transfer", "No; it destroys the principal permanently", "Only if the position is currently in range"],
      a: 1,
      exp: explain("Core <b>burn updates accounting; collect transfers tokens</b>. Burn removes the specified L, calculates principal at the current price, updates accrued fees, and adds withdrawn principal to tokensOwed. The owed balances therefore need not be fees only. The separation works for both active and inactive positions, although the token composition differs by price.", "pool", "position")
    },
    {
      c: 3,
      q: "A direct core position has positive liquidity and has earned new swap fees since its last update. Why might its owner call burn(lower, upper, 0) before collect?",
      opts: ["To reduce its liquidity by one unit", "To change its tick boundaries without withdrawing", "To update fee growth and credit newly accrued fees without removing liquidity", "To bypass the collect ownership check"],
      a: 2,
      exp: explain("A zero-amount burn is a <b>fee-accounting poke</b>: it updates the position's fee-growth snapshots and tokensOwed while preserving L. Core collect only pays already recorded owed amounts; it does not calculate fresh fee growth. The positive-liquidity assumption matters because a zero-liquidity position cannot be poked this way. The NFT manager handles the corresponding refresh inside its own collect flow.", "position", "pool", "nft")
    },
    {
      c: 3,
      q: "A position's liquidity rises from 100 to 150. Its unaccounted fee growth is 2 token units per L, exactly representable in Q128. How many historical token units should this update credit?",
      opts: ["200", "300", "100", "Zero, because adding liquidity resets all earned fees"],
      a: 0,
      exp: explain("Use the <b>old liquidity</b>: 100 × 2 = 200. The added 50 L did not exist while those fees accrued and must not receive them retroactively. The position then records the latest fee-growth snapshot and the new liquidity. Crediting 300 would let newly added capital claim historical fees at the expense of other LPs.", "position", "feesBook")
    },
    // 25–30: Swap math & rounding.
    {
      c: 4,
      q: "Which interpretation of production pool.swap's signed amountSpecified is correct?",
      opts: ["Positive requests exact output; negative requests exact input", "The sign selects token0 versus token1", "Zero means swap the caller's entire balance", "Positive requests exact input; negative requests exact output; zero reverts"],
      a: 3,
      exp: explain("The sign selects <b>input-budget versus output-target accounting</b>; zeroForOne separately selects direction. A negative amount represents the requested output magnitude. These modes do not mean the core must always fill the request: the price limit can stop the loop early. A wrapper requiring complete output must also verify the actual returned amount.", "pool", "swapMath")
    },
    {
      c: 4,
      q: "Ignore fees, rounding, and tick crossings. With L = 1000 and s = 2, a swap pays 100 token1 to buy token0. What are the new s and approximate token0 output?",
      opts: ["s = 1.9; output ≈ 26.316", "s = 2.1; output ≈ 23.810", "s = 2.1; output = 25", "s = 2.2; output ≈ 45.455"],
      a: 1,
      exp: explain("For token1 input, Δy = L(s′ − s), so s′ = 2 + 100/1000 = <b>2.1</b>. Output is Δx = L(1/s − 1/s′) = 1000(1/2 − 1/2.1) ≈ <b>23.810</b>. Using the starting spot price gives 25, which ignores the higher prices paid as the trade moves along the curve.", "deltas", "sqrtMath")
    },
    {
      c: 4,
      q: "Ignore fees, rounding, and tick crossings. With L = 1000 and s = 2, a swap pays 50 token0 to buy token1. What are the new s and approximate token1 output?",
      opts: ["s = 2.1; output = 100", "s = 1.9; output = 100", "s = 20/11 ≈ 1.81818; output ≈ 181.818", "s = 1.8; output = 200"],
      a: 2,
      exp: explain("Here 50 = L(1/s′ − 1/s), so 1/s′ = 50/1000 + 1/2 = 0.55 and <b>s′ = 20/11</b>. The output is L(s − s′) = 1000(2 − 20/11) ≈ <b>181.818</b>. token0 input changes reciprocal square-root price linearly; subtracting amount0/L directly from s uses the wrong formula.", "deltas", "sqrtMath")
    },
    {
      c: 4,
      q: "A swap step reaches its target and consumes amountIn = 997 raw units excluding fees. feePips = 3000. What additional fee does computeSwapStep charge?",
      opts: ["3 raw units", "2 raw units", "2.991 raw units", "3000 raw units"],
      a: 0,
      exp: explain("For a target-reaching step, feeAmount = ceil(amountIn × feePips / (1,000,000 − feePips)). Thus ceil(997 × 3000 / 997000) = <b>3</b>, for total input 1000. The denominator grosses up an amount that already excludes fees. feePips = 3000 means 0.3%, not 3000 basis points.", "swapMath")
    },
    {
      c: 4,
      q: "An exact-input step has amountRemaining = 1000. It does not reach its target, and the final computed amountIn is 996. What feeAmount is returned?",
      opts: ["Always 3 because this must be a 0.3% pool", "0 because the target was not reached", "ceil(996 / 1000)", "4, the remaining budget after the computed amountIn"],
      a: 3,
      exp: explain("In this branch, feeAmount is <b>amountRemaining − amountIn = 4</b>. The step has exhausted the price-moving budget after fee adjustment and rounding; accounting consumes the remainder as fee. This differs from the target-reaching branch's gross-up formula. Reusing one fee formula for every branch can create a residual input mismatch.", "swapMath")
    },
    {
      c: 4,
      q: "In amount-delta calculations used by a swap step, what rounding policy protects the pool?",
      opts: ["Round both required input and paid output down", "Round required input up and paid output down", "Round required input down and paid output up", "Round everything to the nearest integer"],
      a: 1,
      exp: explain("The pool should not receive less than the curve requires or pay more than the curve permits. Therefore <b>input deltas round up and output deltas round down</b>. Minting similarly rounds token amounts owed to the pool up; removing liquidity rounds returned principal down. Price-update functions also choose direction-sensitive rounding, so replacing the libraries with nearest-integer arithmetic is unsafe.", "sqrtMath", "deltas")
    },
    // 31–36: Crossing ticks.
    {
      c: 5,
      q: "Position A supplies L = 500 on [−120, 120), and B supplies L = 800 on [0, 240). The current tick is −1. What is active L before and after crossing tick 0 upward?",
      opts: ["Before 1300; after 800", "Before 800; after 1300", "Before 500; after 1300", "Before 500; after 800"],
      a: 2,
      exp: explain("At tick −1 only A is active, so L = <b>500</b>. Tick zero is B's lower endpoint, with net +800. Crossing upward activates B while A stays active, so L becomes <b>1300</b>. At B's upper endpoint the same position contributes a negative net change instead. Membership uses lower-inclusive, upper-exclusive tick ranges.", "crossingBook", "tick")
    },
    {
      c: 5,
      q: "An initialized tick has liquidityNet = −500. A downward swap crosses it while active L = 800. What is active L afterward?",
      opts: ["1300", "300", "800", "−500"],
      a: 0,
      exp: explain("Stored liquidityNet describes an <b>upward crossing</b>. A downward crossing applies its opposite: 800 − (−500) = <b>1300</b>. This can represent entering a position through its upper boundary while moving left. Always adding the stored signed value would remove liquidity when this direction should add it.", "crossingBook", "pool")
    },
    {
      c: 5,
      q: "A zeroForOne swap lands exactly on the square-root price of tick 120 and processes that tick boundary. What current tick does the swap store?",
      opts: ["120 in every direction", "119", "60 because spacing is always 60", "121"],
      a: 1,
      exp: explain("On the downward boundary path the pool stores <b>tickNext − 1 = 119</b>. That records membership on the lower-price side and prevents applying the same crossing again on the next leftward search. sqrtPriceX96 still equals the boundary price. Consequently slot0.tick can differ from getTickAtSqrtRatio(slot0.sqrtPriceX96) at this exact boundary; recomputing it blindly loses the side information.", "pool", "priceTick")
    },
    {
      c: 5,
      q: "A production core swap reaches an interval with zero active liquidity. Another initialized range exists farther along its direction, before the supplied price limit. Must the swap revert immediately?",
      opts: ["Yes; the core rejects every swap step with L = 0", "Yes; balances must be zero whenever L = 0", "No; it trades through the gap using all inactive token balances", "No; the loop can traverse the empty interval with zero token deltas and resume at active liquidity"],
      a: 3,
      exp: explain("Production core can <b>advance across empty intervals</b>: reaching the next target requires zero token deltas at L = 0, and a later initialized crossing may activate liquidity. No tokens are traded inside the gap. The price limit may stop the swap before liquidity resumes. Some teaching implementations simplify this case with a revert, so check the production loop and the calling wrapper separately.", "pool", "swapMath", "crossingBook")
    },
    {
      c: 5,
      q: "A swap step ends at an initialized boundary. Which liquidity set earns the fees from the trade that moved price to that boundary?",
      opts: ["The liquidity active during that step, before applying the boundary's net change", "Only positions that become active after crossing", "All positions whose tokens sit anywhere in the pool", "No one; boundary-reaching steps are free"],
      a: 0,
      exp: explain("The trade used the <b>pre-crossing active liquidity</b>, so its fee growth is accrued using that L. The tick is then crossed with the updated accumulators and the net liquidity change is applied. Fees from subsequent steps belong to their respective active sets. Crediting the first step after changing L would misattribute fees to entering or departing positions.", "pool", "feesBook")
    },
    {
      c: 5,
      q: "Inside a single active-liquidity interval, why can a large swap not generally be priced with one starting L all the way to its final price?",
      opts: ["Every change of one tick always resets L to zero", "The pool uses constant-sum math after the first step", "Crossing initialized boundaries can change L, so each interval needs its own amount calculation", "V3 forbids swapping across more than one tick"],
      a: 2,
      exp: explain("Each step trades toward the next bitmap boundary or price limit with the <b>currently active L</b>. At an initialized crossing, the liquidity profile can change; the remaining input or output must then be recomputed using the new L. A one-curve estimate may look correct for small trades but fail when a trade crosses into a shallower or deeper range.", "crossingBook", "concentrated")
    },
    // 37–42: Fee growth accounting.
    {
      c: 6,
      q: "A step leaves 300 raw token0 units for LPs after protocol fees, with active L = 1000. What increment belongs in feeGrowthGlobal0X128?",
      opts: ["300 × 1000", "floor(300 × 2^128 / 1000)", "floor(300 × 2^96 / 1000)", "300, independent of active liquidity"],
      a: 1,
      exp: explain("The accumulator records <b>fees per unit of active liquidity</b> in Q128, so divide the LP fee by L and apply the 2<sup>128</sup> scale. A position later multiplies the change in its inside growth by its own L and divides by that same scale. This is not a total-token counter, and it uses Q128 rather than sqrtPriceX96's Q96 format.", "feesBook", "pool")
    },
    {
      c: 6,
      q: "Current tick is inside a position. For one token, decoded fee growth is global = 100, lowerOutside = 20, upperOutside = 30. The position last recorded inside = 40 and has L = 10. Ignore rounding. What newly accrued fees are owed?",
      opts: ["500", "1000", "300", "100"],
      a: 3,
      exp: explain("Inside growth is 100 − 20 − 30 = <b>50</b>. Only the increase since the position's last snapshot counts: (50 − 40) × 10 = <b>100 token units</b>. Multiplying all 50 by L would claim fees already accounted for. The outside values here can be subtracted directly because the current tick is inside the position.", "feesBook", "tick", "position")
    },
    {
      c: 6,
      q: "Current tick is below tickLower. Decoded growth is global = 140, lowerOutside = 80, upperOutside = 20. The last inside snapshot is 55 and L = 100. Ignore rounding. What newly accounted fees result?",
      opts: ["500", "4000", "6500", "Zero, because an inactive position can never collect earlier fees"],
      a: 0,
      exp: explain("Below the lower boundary, growthBelow = global − lowerOutside = <b>60</b>; growthAbove = upperOutside = 20. Therefore growthInside = 140 − 60 − 20 = <b>60</b>. Newly owed = (60 − 55) × 100 = <b>500</b>. An inactive position can still account for fees earned earlier while it was active; inactivity stops new swap-fee accrual during that period.", "tick", "position")
    },
    {
      c: 6,
      q: "At a crossing, one token's feeGrowthOutside is 25 and feeGrowthGlobal is 90, in decoded units. What becomes the outside value?",
      opts: ["115", "25 forever", "65", "Zero"],
      a: 2,
      exp: explain("The crossing complements the tracker: <b>outside′ = global − outside = 65</b>. The stored number changes meaning relative to which side of the tick the price occupies. It is not a counter incremented by the latest swap fee. This complement lets the pool reconstruct inside growth without visiting every position on every trade.", "tick", "feesBook")
    },
    {
      c: 6,
      q: "A uint256 fee-growth snapshot is 2^256 − 5 and its later value is 7 after one wrap. What growth difference must a Solidity 0.8 port preserve?",
      opts: ["A mandatory revert because any wrap is invalid", "12, using the intended modular subtraction", "2, by subtracting the visible decimal suffixes", "Zero, by resetting every position after wrap"],
      a: 1,
      exp: explain("Modulo 2<sup>256</sup>, 7 − (2<sup>256</sup> − 5) = <b>12</b>. The original pre-0.8 accounting intentionally allows fee-growth wraparound. A port must preserve that behavior at the specific accumulator arithmetic sites, while retaining required safety checks elsewhere. Making the entire contract unchecked is not a substitute for understanding which operations intentionally wrap.", "position", "tick")
    },
    {
      c: 6,
      q: "After many fee-earning swaps, does a V3 position's liquidity L automatically increase from those fees?",
      opts: ["Yes; V3 reinvests fees exactly like V2 reserves", "Yes, but only for NFT positions", "Yes, whenever the position crosses a tick", "No; fees accrue separately and compounding requires an explicit liquidity addition"],
      a: 3,
      exp: explain("<b>Accrued fees and liquidity are separate state</b>. Swap fees increase fee growth and eventually tokensOwed, but they do not mint new L for the position. A manager or user can collect and reinvest them, potentially balancing token amounts first. Merely transferring tokens into the pool also does not create a larger position or an automatic entitlement.", "position", "nft")
    },
    // 43–48: Callbacks & flash loans.
    {
      c: 7,
      q: "After authenticating a swap callback, your contract receives amount0Delta = +1000 and amount1Delta = −900. What does it owe for this swap?",
      opts: ["1000 token0 to the pool", "900 token1 to the pool", "Both 1000 token0 and 900 token1", "Nothing; a positive delta means the pool paid you"],
      a: 0,
      exp: explain("The signed deltas are from the <b>pool's perspective</b>: positive means tokens owed to the pool; negative means tokens sent out. Pay 1000 token0. The 900 token1 output went to the swap recipient, which may differ from the callback contract. Converting a negative delta directly to an unsigned transfer amount can produce a huge incorrect value.", "router", "pool")
    },
    {
      c: 7,
      q: "What critical check is missing from this callback before it uses a user's allowance? Assume payer is decoded directly from data.",
      code: "function uniswapV3SwapCallback(int256 d0, int256, bytes calldata data) external {\n    address payer = abi.decode(data, (address));\n    if (d0 > 0) token0.transferFrom(payer, msg.sender, uint256(d0));\n}",
      opts: ["The payer must always equal tx.origin", "The function must be public instead of external", "msg.sender must be the expected pool derived from a trusted factory and the intended token pair / fee", "d0 must be divisible by tickSpacing"],
      a: 2,
      exp: explain("Without <b>pool authentication</b>, an attacker can call the function directly, choose a victim payer, and receive tokens under that victim's allowance. CallbackValidation derives the legitimate pool from a trusted factory and the pool key, then checks msg.sender. A wrapper must also bind payer, tokens, and amounts to the authorized operation; trusting an arbitrary factory supplied by an attacker is insufficient.", "callback", "router")
    },
    {
      c: 7,
      q: "A production V3 pool with fee = 3000 lends 1001 raw token0 units through flash. No token1 is borrowed. What is the minimum token0 repayment?",
      opts: ["1004, because the fee rounds down to 3", "1005, because the fee rounds up to 4", "1001, because flash calls do not charge swap fees", "1008, because the fee is charged on both the loan and its repayment"],
      a: 1,
      exp: explain("V3 flash charges ceil(borrowed × fee / 1,000,000) on each borrowed token. Here ceil(1001 × 3000 / 1,000,000) = <b>4</b>, so repayment is <b>1005</b>. This is a dedicated flash-loan calculation, not V2's fee-adjusted invariant formula. The callback receives fee amounts; the borrower must remember and return the principal too.", "flashFeesBook", "pool")
    },
    {
      c: 7,
      q: "With positive active liquidity, someone calls flash(recipient, 0, 0, data) and transfers 100 token0 to the pool during the callback. Protocol fees are off. What does core do with that payment?",
      opts: ["Reject it because both borrowed amounts are zero", "Mint new liquidity for the donor", "Refund it automatically", "Distribute it through fee growth to liquidity active during the flash call"],
      a: 3,
      exp: explain("The flash callback still runs with zero borrowed amounts. Core measures the balance increase and treats the <b>100-unit payment as fee income</b> for active LPs. This provides an explicit donation route without minting L. A plain ERC-20 transfer outside that accounting flow does not itself update fee growth, and the donor receives no special ownership claim.", "flashFeesBook", "pool")
    },
    {
      c: 7,
      q: "During pool A's swap callback, can a contract call swap again on pool A or call swap on a distinct pool B?",
      opts: ["Same-pool swap is locked; a distinct pool can be called if its own checks pass", "Both are impossible because V3 uses one global lock", "Both always succeed because callbacks bypass locks", "Same-pool swap works only if the second direction is reversed"],
      a: 0,
      exp: explain("The lock belongs to <b>each pool</b>. Reentering A's swap while A is executing fails, regardless of direction. B has separate state and can participate in a multi-pool route if it is not already locked and settlement succeeds. This local lock does not automatically secure a custom router, vault, or other external contract against its own reentrancy bugs.", "pool", "multiBook")
    },
    {
      c: 7,
      q: "A pool has nonzero ERC-20 balances from out-of-range positions but pool.liquidity = 0. Can its production flash function execute a loan?",
      opts: ["Yes; only ERC-20 balances matter", "Yes; flash temporarily activates every position", "No; flash requires positive active liquidity", "Only if the requested loan has zero fee after rounding"],
      a: 2,
      exp: explain("Production flash explicitly requires <b>liquidity &gt; 0</b>. The condition also provides a nonzero active-liquidity denominator for distributing fees. Token balances and active L are different quantities, so an apparently funded pool may still reject flash. This differs from the swap loop's ability to traverse a zero-liquidity gap toward another range.", "pool", "flashBook")
    },
    // 49–54: Factory & pool lifecycle.
    {
      c: 8,
      q: "Within one V3 factory, what uniquely identifies a pool, and how is token0 chosen?",
      opts: ["Token symbols alone; token0 is the more valuable token", "The unordered token pair and fee tier; token0 is the lower address", "The caller and tickSpacing; token0 is chosen by the caller", "The token pair alone; every pair has exactly one possible fee"],
      a: 1,
      exp: explain("The factory sorts the token addresses and permits one pool per <b>(token0, token1, fee)</b>. The same pair can have multiple pools at different enabled fee tiers. Reverse-order getPool lookups return the same address for a given fee. Price direction and callback token ordering must follow addresses, not token names or a front end's display order.", "factory", "spacing")
    },
    {
      c: 8,
      q: "Which fee-to-spacing set is enabled by the original V3 factory constructor, before later owner actions?",
      opts: ["100 → 1 only", "500 → 60, 3000 → 10, 10000 → 200", "Every fee from 1 to 1000000 with spacing 1", "500 → 10, 3000 → 60, 10000 → 200"],
      a: 3,
      exp: explain("The original constructor enables <b>0.05% / 10, 0.3% / 60, and 1% / 200</b>. Additional tiers can be enabled later by the factory owner, so this is not a claim about every live deployment's complete tier list. Integrations should read feeAmountTickSpacing from their target factory rather than treating the constructor list as a universal current registry.", "factory", "spacing")
    },
    {
      c: 8,
      q: "A newly deployed core pool has not been initialized. Who can choose its initial price, and does initialize add liquidity?",
      opts: ["Only the factory owner; it also mints initial L", "Only token0's deployer; it transfers both tokens", "Anyone can initialize it once with an accepted square-root price; initialization alone adds no liquidity", "Every trader can reinitialize it before each swap"],
      a: 2,
      exp: explain("Core initialize is <b>permissionless and one-time</b>. It sets price, tick, the first oracle observation, and the unlocked state; it does not fund a position. The accepted input is checked through TickMath. A liquidity bootstrap integration must validate the actual price it is about to use, including the case where someone initialized the pool before its transaction.", "pool", "tickMath")
    },
    {
      c: 8,
      q: "Can the original factory owner change an existing pool's fee or tickSpacing by enabling another tier?",
      opts: ["No; existing pool fee and spacing are immutable, and an already enabled fee cannot be reassigned", "Yes; all existing pools are updated in a loop", "Yes; the next swap adopts the most recently enabled spacing", "Only if the pool currently has zero active liquidity"],
      a: 0,
      exp: explain("A pool fixes its fee and tickSpacing at deployment. The owner's enableFeeAmount action adds a <b>previously unused fee mapping</b>, subject to bounds, and cannot overwrite an enabled fee's spacing. New pools can then use that tier. The separate protocol-fee setting changes how collected fees are split; it does not change the pool's swap fee tier.", "factory", "pool")
    },
    {
      c: 8,
      q: "slot0.feeProtocol is 0x64. A token0-input swap step charges 120 raw fee units. Under production V3's protocol-fee rules, how is that fee split before Q128 rounding?",
      opts: ["64 units to the protocol, 56 to LPs", "30 units to the protocol, 90 to LPs", "20 units to the protocol, 100 to LPs", "120 units to the protocol, zero to LPs"],
      a: 1,
      exp: explain("The low nibble configures token0: <b>4 means a denominator of four</b>, so protocolFee = floor(120/4) = 30. LPs get the remaining 90. The high nibble is six for token1. Each token's setting is zero (off) or a denominator from 4 through 10. The setting is not a percentage or a replacement swap-fee rate.", "pool", "protocolBook")
    },
    {
      c: 8,
      q: "Why does core enforce maxLiquidityPerTick against a tick's liquidityGross?",
      opts: ["To force every position to hold exactly equal dollar values", "To set a maximum swap input in token units", "To stop tick prices changing by more than one basis point", "To bound liquidity accounting across the available usable ticks and protect its numeric limits"],
      a: 3,
      exp: explain("The cap is derived from tickSpacing and the count of usable ticks, using the uint128 liquidity limit. It constrains <b>total gross liquidity attached to a boundary</b>, even when signed net changes cancel. It is not a token deposit limit or a volatility control. A boundary with net zero can still exceed the cap if its gross liquidity is too large.", "tick", "pool")
    },
    // 55–60: Oracles & TWAP.
    {
      c: 9,
      q: "observe([10, 0]) gives a tick-cumulative difference of −1001. What arithmeticMeanTick should production OracleLibrary.consult return?",
      opts: ["−100", "−100.1 as a fractional int24", "−101", "100"],
      a: 2,
      exp: explain("The real average is −1001/10 = −100.1. Solidity's division initially gives −100, but OracleLibrary corrects negative non-integral results to <b>floor = −101</b>. This preserves the intended tick rounding direction. A hand-written TWAP using signed division alone can be one tick too high for negative averages.", "oracleLibrary")
    },
    {
      c: 9,
      q: "A pool spends 60 seconds at tick 0, then 60 seconds at tick 200. Ignore fixed-point error. What raw price corresponds to its mean tick over the full window?",
      opts: ["1.0001^100, the geometric time-weighted mean of the two prices", "(1 + 1.0001^200) / 2, the arithmetic mean of prices", "1.0001^200, because only the last observation counts", "100 token1 per token0, because the average tick is 100"],
      a: 0,
      exp: explain("The cumulative tick increase is 0 × 60 + 200 × 60 = 12,000. Divide by 120 seconds to get <b>mean tick 100</b>, then convert to P = 1.0001<sup>100</sup>. Averaging logarithmic ticks produces a geometric price mean. It is not the arithmetic price average used by a naive integration or the latest spot price.", "oracleBook", "oracleLibrary")
    },
    {
      c: 9,
      q: "A pool was initialized five minutes ago. You increase observationCardinalityNext to 1024 and immediately request a 30-minute TWAP. What should you expect?",
      opts: ["1024 synthetic historical prices are generated immediately", "The first price is silently extended backward for 30 minutes", "The oracle substitutes a five-minute average without telling you", "The request reverts because increasing capacity does not create older history"],
      a: 3,
      exp: explain("Growing cardinality prepares storage for <b>future observations</b>; it does not manufacture past data. A query older than the oldest available observation fails with OLD. Capacity, initialized observations, and elapsed time are distinct. Consumers need a policy for insufficient history, including newly created or inactive pools, rather than assuming a large capacity proves a long window exists.", "oracle", "oracleBook")
    },
    {
      c: 9,
      q: "The latest stored observation is at timestamp 100. The pool has stayed at tick 20 until now, timestamp 130. What does observe([0]) do for tick cumulative?",
      opts: ["Return the stored value unchanged because no swap happened", "Return stored cumulative + 600 without requiring a storage write", "Write 30 new observations, one per second", "Return sqrtPriceX96 instead of tick cumulative"],
      a: 1,
      exp: explain("The view calculation extends the latest observation using the <b>current tick and elapsed time</b>: 20 × (130 − 100) = 600 tick-seconds. It returns this counterfactual current accumulator without modifying storage. For past times between stored observations, observe can interpolate instead. Reading the latest raw observation slot is therefore not always equivalent to observe([0]).", "oracle")
    },
    {
      c: 9,
      q: "An attacker moves a pool's price and restores it within one transaction, with no time elapsed at the manipulated tick. What happens to a historical tick TWAP solely from that temporary tick?",
      opts: ["It permanently gains the manipulated tick as a full block of history", "It becomes the arithmetic average of all swaps in the transaction", "The temporary tick contributes zero tick-seconds, although spot-price consumers remain exposed", "It is safe against every manipulation lasting more than one block"],
      a: 2,
      exp: explain("Tick accumulation is <b>time weighted, not swap-count weighted</b>. With zero elapsed seconds, the temporary tick has zero duration in the average. Writes at the same timestamp do not add another interval. This does not make every TWAP safe: holding a manipulated price across time, weak liquidity, short windows, or unsafe fallback pricing can still create exploitable quotes.", "oracle", "oracleBook")
    },
    {
      c: 9,
      q: "Active L is 100 for 10 seconds and 300 for the next 10 seconds. Ignoring fixed-point rounding, what harmonic mean liquidity does the seconds-per-liquidity accumulator imply?",
      opts: ["150", "200", "400", "300"],
      a: 0,
      exp: explain("Cumulative seconds per L increase by 10/100 + 10/300 = 2/15. Divide elapsed time by that sum: <b>20 / (2/15) = 150</b>. The arithmetic mean would be 200. Harmonic liquidity gives more influence to periods of low depth, but it is still a historical liquidity measure, not a dollar-denominated TVL or a guarantee of manipulation resistance.", "oracleLibrary", "oracle")
    },
    // 61–66: Routing & NFT periphery.
    {
      c: 10,
      q: "In the production V3 periphery, how many bytes encode a two-hop exact-input path A → B → C?",
      opts: ["60: three addresses only", "96: three padded ABI words", "100: addresses plus two uint160 spacings", "66: address A, uint24 feeAB, address B, uint24 feeBC, address C"],
      a: 3,
      exp: explain("The path is tightly packed: <b>20 + 3 + 20 + 3 + 20 = 66 bytes</b>. Production identifies each hop with a uint24 fee, not a padded 32-byte word. The Development Book's learning implementation uses tick spacing in its path; production uses the fee tier. This difference matters when porting the book's router to deployed V3 pools.", "path", "pathBook")
    },
    {
      c: 10,
      q: "For an exact-output route that spends A to receive C through B, what order does the original SwapRouter expect in its encoded path?",
      opts: ["A, feeAB, B, feeBC, C", "C, feeBC, B, feeAB, A", "B, feeAB, A, feeBC, C", "The addresses sorted globally, regardless of the route"],
      a: 1,
      exp: explain("Exact output starts by requesting the desired final token and works backward to determine the input needed to settle it. Its path is therefore <b>reversed</b>: C → B → A, with each corresponding pool fee. Exact input uses forward order. Sorting the entire route destroys hop direction; address sorting is only for deriving the pool within an individual pair.", "router", "multiBook")
    },
    {
      c: 10,
      q: "Why can the original Quoter return a simulated swap quote without leaving that swap's state changes behind, even though its quote function is not Solidity view?",
      opts: ["It reads only token balances and never calls swap", "The pool recognizes the Quoter and waives settlement", "Its callback reverts with quote data; the Quoter catches that revert and decodes the result", "The EVM automatically discards every transaction from a quote contract"],
      a: 2,
      exp: explain("The Quoter runs a swap to reach the actual calculation path, then <b>reverts from its callback with encoded quote information</b>. The reverted subcall rolls back the pool's changes, and the outer call decodes the data. Clients normally simulate the quote with eth_call. A quote depends on that state snapshot; it does not reserve a future execution price or replace slippage bounds.", "quoter")
    },
    {
      c: 10,
      q: "An original SwapRouter exactInputSingle call reaches its nonzero sqrtPriceLimitX96 before spending its full input budget. The resulting output satisfies amountOutMinimum. What can happen?",
      opts: ["It succeeds with partial input consumption; a wrapper must account for any input it prefunded but did not spend", "It must always revert because exact input means all input is consumed", "The rest of the budget is automatically donated to LPs", "It ignores the limit until the entire budget is consumed"],
      a: 0,
      exp: explain("The core can stop at the limit, and this router path checks the <b>actual output against amountOutMinimum</b>. It does not insist on consuming the entire budget. ERC-20 input pulled only on callback may remain with the payer; a wrapper that prefunds itself or uses native ETH needs appropriate remainder handling. A price limit and a minimum total output protect different aspects of execution.", "router", "slippageBook")
    },
    {
      c: 10,
      q: "Alice and Bob hold different NFTs minted by the same NonfungiblePositionManager for the same pool and tick range. How are their positions represented in core?",
      opts: ["The pool creates a separate core position for each tokenId", "Both NFTs must share one wallet owner", "Each NFT deploys a new pool", "Their liquidity shares the manager-owned core position; the manager tracks each NFT's entitlement separately"],
      a: 3,
      exp: explain("Core's owner is the <b>position manager contract</b>, so identical pool/range tuples aggregate at that layer. The manager separately records each tokenId's L, fee-growth snapshots, and tokens owed, with ERC-721 authorization controlling withdrawal. Core cannot infer NFT ownership from its own position mapping. Aggregation therefore does not make Alice entitled to Bob's fees or principal.", "nft", "nftBook", "position")
    },
    {
      c: 10,
      q: "What is the normal full-exit sequence for an authorized owner of a nonempty V3 position NFT?",
      opts: ["Burn the NFT first; principal is transferred automatically", "Decrease all liquidity, collect owed tokens, then burn the empty NFT if desired", "Transfer the NFT to the pool and call sync", "Call collect once; that always removes all liquidity and destroys the NFT"],
      a: 1,
      exp: explain("<b>decreaseLiquidity</b> converts removed L into owed token amounts; <b>collect</b> transfers amounts within the requested limits. Only after liquidity and both owed balances are zero can <b>burn(tokenId)</b> destroy the NFT. Core burn and NFT burn have different meanings. A complete exit also needs appropriate amount bounds and deadlines on the liquidity change.", "nft", "nftBook")
    },
    // 67–72: Integration & audit scenarios.
    {
      c: 11,
      q: "A vault calls exactInputSingle with amountOutMinimum = 0 and no restrictive price limit. It supplies a valid deadline. Which assessment is correct?",
      opts: ["The deadline guarantees the quoted execution price", "The pool's reentrancy lock prevents sandwiches", "The deadline limits time, but meaningful execution-price protection is still missing", "The 0.3% pool fee caps the vault's possible loss at 0.3%"],
      a: 2,
      exp: explain("A deadline only rejects execution after a time cutoff. It does not reject a bad price <b>within that time</b>. A manipulator can alter pool state before the trade and reverse the move afterward if the economics permit it. The vault needs suitable execution bounds derived from its authorized trade intent; calculating a minimum from the same already manipulated spot price is not independent protection.", "slippageBook", "router")
    },
    {
      c: 11,
      q: "A lending integration correctly decodes slot0.sqrtPriceX96, adjusts decimals, and uses the resulting spot price to value collateral. What major risk remains?",
      opts: ["The spot price can be manipulated; correct unit conversion alone does not make it a safe collateral oracle", "Decimals remove all price-manipulation risk", "Every V3 pool guarantees the fair external market price", "Only a price above tick zero can be manipulated"],
      a: 0,
      exp: explain("Mathematically decoding a quote does not establish its <b>economic reliability</b>. An attacker may move a thin pool's price and borrow against an inflated valuation. A robust design evaluates trusted price sources, manipulation cost, observation history, liquidity, freshness, and exposure limits. A TWAP can improve resistance but is not automatically sufficient for every asset or borrowing capacity.", "oracleBook", "oracleLibrary")
    },
    {
      c: 11,
      q: "A swap callback tries to pay the pool 1000 raw input units, but the token deducts a transfer fee and the pool receives only 990. No other payment occurs. What happens?",
      opts: ["The pool reduces its required payment automatically", "The router mints the missing ten units", "The swap succeeds because transferFrom returned true", "The pool's balance-delta payment check fails and the swap reverts"],
      a: 3,
      exp: explain("Settlement checks the <b>actual pool balance increase</b>, not merely the requested transfer amount or the token's return value. Receiving 990 when 1000 is owed fails the payment check. Standard V3 routing does not automatically support fee-on-transfer behavior. Rebasing and other nonstandard token mechanics also require integration-specific reasoning; an ERC-20-shaped interface does not imply standard balance behavior.", "pool", "router")
    },
    {
      c: 11,
      q: "A vault values every deposited V3 NFT as liquidity × one fixed dollar conversion factor. What is the fundamental accounting mistake?",
      opts: ["All NFTs have identical token composition, so only the fee tier is missing", "L is not a dollar balance; principal depends on price and bounds, and accrued fees require separate accounting", "The NFT's tokenId is the correct dollar value instead", "Out-of-range NFTs have zero principal value"],
      a: 1,
      exp: explain("Use the position's <b>liquidity, lower/upper bounds, and current price</b> to determine token0/token1 principal, with price clamped to the range for amount calculations. Account separately for accrued and recorded owed tokens, avoiding double counting withdrawn principal. Then value those tokens with suitable prices and decimals. Equal L can represent very different inventories and values across pools and ranges.", "liquidityAmounts", "nft", "real")
    },
    {
      c: 11,
      q: "A custom consumer reads pool getters during a swap callback and assumes the pool's lock makes every observable value a settled end-of-transaction snapshot. Why is that assumption unsafe?",
      opts: ["The lock prevents guarded reentry but does not disable public getters; settlement is still in progress during callbacks", "A locked pool always returns zeros from every getter", "All callbacks execute after the pool unlocks", "The compiler automatically makes external consumers share the pool's lock"],
      a: 0,
      exp: explain("The pool updates swap state and performs transfers before callback settlement completes. Public state getters remain readable while it is locked. <b>A reentrancy guard is not a guarantee of a settled cross-contract snapshot</b>. A consumer must reason about the specific fields it combines, observable balances, and callback timing rather than assuming the guard secures its own valuation or accounting decisions.", "pool")
    },
    {
      c: 11,
      q: "You are reviewing a V3-inspired implementation after its single-range happy-path swap passes. Which next test best challenges the coupled liquidity and fee accounting?",
      opts: ["Repeat the same large in-range swap with only a different recipient", "Check only that the contract compiled without warnings", "Use overlapping and adjacent ranges, cross boundaries in both directions, then verify active L and each position's fees before and after collection", "Assert that every pool balance product stays exactly constant"],
      a: 2,
      exp: explain("A useful scenario must change <b>which positions are active</b> and independently predict their entitlements. Include an initialized boundary with net zero, an inactive position that should earn no new fees, tiny amounts that expose rounding, and a price-limit partial fill. Check payment deltas and collection separately. A successful happy-path swap or a V2-style balance-product assertion cannot establish those V3 properties.", "crossingBook", "tick", "position")
    }
  ],
  gapNotes: [
    "Revisit RareSkills' Q Number Format, sqrtPriceX96, and price-to-tick chapters. Practice both quote directions and unequal token decimals before using integer math.",
    "Revisit RareSkills' tick and spacing chapters, then the V3 Book's Tick Bitmap Index. Trace negative compression, word boundaries, and gross versus net liquidity by hand.",
    "Revisit RareSkills' real/virtual reserves and invariant chapters, then the V3 Book's liquidity calculations. Derive principal below, inside, and above a range and identify the limiting token.",
    "Revisit RareSkills' positions and the V3 Book's Providing Liquidity. Follow core mint → callback → balance checks, then distinguish burn, a zero burn, and collect.",
    "Rework both swap-direction examples. Read production SqrtPriceMath and SwapMath with particular attention to exact output, input fees, and each rounding branch.",
    "Revisit the V3 Book's Cross-Tick Swaps alongside production core. Trace each active-liquidity transition, the downward tick convention, and zero-liquidity gaps.",
    "Revisit the V3 Book's Swap Fees, then Tick.getFeeGrowthInside and Position.update. Calculate inside growth in all three price regions and separate Q128 snapshots from token balances.",
    "Revisit the V3 Book's Flash Loans and Flash Loan Fees. Inspect production callback authentication, signed swap deltas, actual payment checks, and per-pool locking.",
    "Revisit RareSkills' factory/spacing chapter and production factory code. Distinguish immutable pool fees from configurable protocol-fee denominators and initialization from funding.",
    "Revisit the V3 Book's Price Oracle and production OracleLibrary. Calculate negative mean ticks and harmonic liquidity, and test insufficient history and same-timestamp behavior.",
    "Revisit the V3 Book's swap paths, multi-pool swaps, and NFT Manager. Compare its teaching interfaces with the original production SwapRouter and NonfungiblePositionManager.",
    "Apply the mechanics to a wrapper or vault: validate callbacks, constrain execution, value principal and fees separately, and test token behavior and observations during callbacks."
  ]
};
