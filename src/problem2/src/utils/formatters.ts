export const TOKEN_NAMES: Record<string, string> = {
  BLUR: 'Blur',
  bNEO: 'Burger NEO',
  BUSD: 'Binance USD',
  USD: 'US Dollar',
  ETH: 'Ethereum',
  GMX: 'GMX Token',
  STEVMOS: 'Stride Staked EVMOS',
  LUNA: 'Terra Luna',
  RATOM: 'StaFi Staked ATOM',
  STRD: 'Stride',
  EVMOS: 'Evmos',
  IBCX: 'IBC Index',
  IRIS: 'IRISnet',
  ampLUNA: 'Amplified LUNA',
  KUJI: 'Kujira',
  STOSMO: 'Stride Staked OSMO',
  USDC: 'USD Coin',
  axlUSDC: 'Axelar USD Coin',
  ATOM: 'Cosmos Hub',
  STATOM: 'Stride Staked ATOM',
  OSMO: 'Osmosis',
  rSWTH: 'Reward SWTH',
  STLUNA: 'Stride Staked LUNA',
  LSI: 'Liquid Staking Index',
  OKB: 'OKB Token',
  OKT: 'OKC Token',
  SWTH: 'Switcheo',
  USC: 'Carbon USD',
  WBTC: 'Wrapped Bitcoin',
  wstETH: 'Wrapped Lido Staked ETH',
  YieldUSD: 'Yield USD',
  ZIL: 'Zilliqa',
};

export const POPULAR_TOKENS = ['ETH', 'WBTC', 'USDC', 'ATOM', 'OSMO', 'SWTH', 'BUSD'];

export function formatCurrency(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '$0.00';
  if (value === 0) return '$0.00';
  if (value < 0.000001) return `< $0.000001`;
  if (value < 0.01) {
    return `$${value.toFixed(6)}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatAmount(value: number, maxDecimals: number = 6): string {
  if (isNaN(value) || value === 0) return '0';
  if (value < 0.000001) return '< 0.000001';

  // Strip trailing zeros if integer or clean decimal
  const formatted = value.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
  });
  return formatted;
}

export function formatNumberInput(value: string): string {
  // Allow only numbers and one decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('')}`;
  }
  return cleaned;
}

export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function truncateHash(hash: string): string {
  if (!hash || hash.length < 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}
