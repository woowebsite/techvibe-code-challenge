import axios from 'axios';
import { RawPriceItem, Token } from '@/types/token';
import { TOKEN_NAMES, POPULAR_TOKENS, FALLBACK_PRICES } from '@/constants/tokens';
import { ENV } from '@/config/env';
import { apiClient } from '@/services/apiClient';

/**
 * Constructs the absolute SVG URL for a given currency symbol.
 */
export function getTokenIconUrl(currency: string): string {
  return `${ENV.TOKEN_ICON_BASE_URL}/${currency}.svg`;
}

/**
 * Fetches real-time token prices from the configured Oracle endpoint.
 * Returns processed & deduplicated token list with fallback handling.
 */
export async function fetchTokenPrices(): Promise<Token[]> {
  try {
    const response = await apiClient.get<RawPriceItem[]>('');
    return processRawPrices(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn(`[PriceOracle] Failed to fetch prices (${error.message}), using fallback dataset.`);
    } else {
      console.warn('[PriceOracle] Unexpected error encountered:', error);
    }
    return processRawPrices(FALLBACK_PRICES);
  }
}

/**
 * Deduplicates raw price feed entries by retaining the newest timestamp entry per currency.
 */
export function processRawPrices(rawData: RawPriceItem[]): Token[] {
  const tokenMap = new Map<string, RawPriceItem>();

  for (const item of rawData) {
    if (!item.currency || typeof item.price !== 'number' || item.price <= 0) {
      continue;
    }

    const existing = tokenMap.get(item.currency);
    if (!existing) {
      tokenMap.set(item.currency, item);
    } else {
      const currentDate = new Date(item.date).getTime();
      const existingDate = new Date(existing.date).getTime();
      if (currentDate >= existingDate) {
        tokenMap.set(item.currency, item);
      }
    }
  }

  // Map to structured Token domain entities
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

  // Sort: Popular tokens first, then alphabetically by symbol
  tokens.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.currency.localeCompare(b.currency);
  });

  return tokens;
}
