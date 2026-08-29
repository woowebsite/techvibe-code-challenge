import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getTokenIconUrl,
  processRawPrices,
  fetchTokenPrices,
} from '@/services/priceService';
import { apiClient } from '@/services/apiClient';
import { RawPriceItem } from '@/types/token';

describe('Price Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTokenIconUrl', () => {
    it('returns SVG url based on symbol and environment base url', () => {
      const url = getTokenIconUrl('ETH');
      expect(url).toContain('/ETH.svg');
    });
  });

  describe('processRawPrices', () => {
    it('deduplicates multiple entries for the same currency by keeping the newest date', () => {
      const rawData: RawPriceItem[] = [
        { currency: 'USDC', date: '2023-08-29T07:10:30.000Z', price: 0.98 },
        { currency: 'USDC', date: '2023-08-29T07:10:45.000Z', price: 1.0 },
        { currency: 'USDC', date: '2023-08-29T07:10:40.000Z', price: 0.99 },
      ];

      const tokens = processRawPrices(rawData);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].currency).toBe('USDC');
      expect(tokens[0].price).toBe(1.0);
      expect(tokens[0].date).toBe('2023-08-29T07:10:45.000Z');
    });

    it('filters out items with invalid or zero/negative prices', () => {
      const rawData: RawPriceItem[] = [
        { currency: 'VALID', date: '2023-08-29T07:10:00.000Z', price: 10.5 },
        { currency: 'ZERO', date: '2023-08-29T07:10:00.000Z', price: 0 },
        { currency: 'NEGATIVE', date: '2023-08-29T07:10:00.000Z', price: -5 },
        { currency: '', date: '2023-08-29T07:10:00.000Z', price: 100 },
      ];

      const tokens = processRawPrices(rawData);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].currency).toBe('VALID');
    });

    it('sorts popular tokens first (ETH, WBTC, USDC, ATOM, etc.) then alphabetically', () => {
      const rawData: RawPriceItem[] = [
        { currency: 'ZIL', date: '2023-08-29T07:10:00.000Z', price: 0.02 },
        { currency: 'ETH', date: '2023-08-29T07:10:00.000Z', price: 1650 },
        { currency: 'BLUR', date: '2023-08-29T07:10:00.000Z', price: 0.2 },
        { currency: 'USDC', date: '2023-08-29T07:10:00.000Z', price: 1.0 },
      ];

      const tokens = processRawPrices(rawData);
      const currencies = tokens.map((t) => t.currency);
      // Popular (ETH, USDC) should precede Non-popular (BLUR, ZIL)
      expect(tokens.filter((t) => t.popular).map((t) => t.currency)).toEqual(
        expect.arrayContaining(['ETH', 'USDC'])
      );
      expect(currencies.indexOf('ETH')).toBeLessThan(currencies.indexOf('BLUR'));
    });
  });

  describe('fetchTokenPrices', () => {
    it('fetches from apiClient and returns processed tokens', async () => {
      const mockData: RawPriceItem[] = [
        { currency: 'ETH', date: '2023-08-29T07:10:52.000Z', price: 1645.93 },
      ];

      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: mockData });

      const tokens = await fetchTokenPrices();
      expect(tokens).toHaveLength(1);
      expect(tokens[0].currency).toBe('ETH');
      expect(tokens[0].name).toBe('Ethereum');
    });

    it('falls back gracefully to fallback prices when API call fails', async () => {
      vi.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('Network error'));

      const tokens = await fetchTokenPrices();
      expect(tokens.length).toBeGreaterThan(5);
      const ethToken = tokens.find((t) => t.currency === 'ETH');
      expect(ethToken).toBeDefined();
    });
  });
});
