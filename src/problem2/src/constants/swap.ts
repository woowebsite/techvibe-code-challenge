export const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0] as const;

export const DEFAULT_SLIPPAGE = 0.5;

export const HIGH_SLIPPAGE_THRESHOLD = 5.0;
export const LOW_SLIPPAGE_THRESHOLD = 0.1;

export const ESTIMATED_GAS_FEE_USD = 1.35;

export const DEFAULT_QUICK_PAIRS: [string, string][] = [
  ['ETH', 'USDC'],
  ['WBTC', 'USDC'],
  ['ATOM', 'OSMO'],
  ['SWTH', 'USDC'],
];
