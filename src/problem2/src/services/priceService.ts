import { RawPriceItem, Token } from '../types/token';
import { TOKEN_NAMES, POPULAR_TOKENS } from '../utils/formatters';

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json';
export const TOKEN_ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export function getTokenIconUrl(currency: string): string {
  return `${TOKEN_ICON_BASE_URL}/${currency}.svg`;
}

// Fallback prices in case of network issues
const FALLBACK_PRICES: RawPriceItem[] = [
  { currency: 'ETH', date: '2023-08-29T07:10:52.000Z', price: 1645.93 },
  { currency: 'WBTC', date: '2023-08-29T07:10:52.000Z', price: 26002.82 },
  { currency: 'USDC', date: '2023-08-29T07:10:40.000Z', price: 1.0 },
  { currency: 'BUSD', date: '2023-08-29T07:10:40.000Z', price: 0.9998 },
  { currency: 'ATOM', date: '2023-08-29T07:10:50.000Z', price: 7.186 },
  { currency: 'OSMO', date: '2023-08-29T07:10:50.000Z', price: 0.377 },
  { currency: 'SWTH', date: '2023-08-29T07:10:45.000Z', price: 0.00404 },
  { currency: 'GMX', date: '2023-08-29T07:10:40.000Z', price: 36.34 },
  { currency: 'BLUR', date: '2023-08-29T07:10:40.000Z', price: 0.208 },
  { currency: 'bNEO', date: '2023-08-29T07:10:50.000Z', price: 7.128 },
  { currency: 'KUJI', date: '2023-08-29T07:10:45.000Z', price: 0.675 },
  { currency: 'OKB', date: '2023-08-29T07:10:40.000Z', price: 42.97 },
  { currency: 'ZIL', date: '2023-08-29T07:10:50.000Z', price: 0.0165 },
];

export async function fetchTokenPrices(): Promise<Token[]> {
  try {
    const response = await fetch(PRICES_API_URL, {
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.statusText}`);
    }

    const rawData: RawPriceItem[] = await response.json();
    return processRawPrices(rawData);
  } catch (error) {
    console.warn('Could not fetch latest prices from API, using fallback data:', error);
    return processRawPrices(FALLBACK_PRICES);
  }
}

export function processRawPrices(rawData: RawPriceItem[]): Token[] {
  // Deduplicate by taking the latest price item per currency
  const tokenMap = new Map<string, RawPriceItem>();

  for (const item of rawData) {
    if (!item.currency || typeof item.price !== 'number' || item.price <= 0) {
      continue;
    }

    const existing = tokenMap.get(item.currency);
    if (!existing) {
      tokenMap.set(item.currency, item);
    } else {
      // Compare timestamp date to keep latest
      const currentDate = new Date(item.date).getTime();
      const existingDate = new Date(existing.date).getTime();
      if (currentDate >= existingDate) {
        tokenMap.set(item.currency, item);
      }
    }
  }

  // Convert to Token array
  const tokens: Token[] = Array.from(tokenMap.values()).map((item) => {
    const isPopular = POPULAR_TOKENS.includes(item.currency);
    return {
      currency: item.currency,
      symbol: item.currency,
      name: TOKEN_NAMES[item.currency] || item.currency,
      price: item.price,
      date: item.date,
      iconUrl: getTokenIconUrl(item.currency),
      popular: isPopular,
    };
  });

  // Sort: Popular tokens first, then alphabetically by currency symbol
  tokens.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.currency.localeCompare(b.currency);
  });

  return tokens;
}
