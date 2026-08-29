import { useState, useEffect, useCallback } from 'react';
import { Token } from '../types/token';
import { fetchTokenPrices } from '../services/priceService';

export function usePrices() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTokenPrices();
      setTokens(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading prices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrices();
    // Auto-refresh prices every 60 seconds
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, [loadPrices]);

  const getTokenByCurrency = useCallback(
    (currency: string): Token | undefined => {
      return tokens.find((t) => t.currency.toLowerCase() === currency.toLowerCase());
    },
    [tokens]
  );

  return {
    tokens,
    isLoading,
    error,
    lastUpdated,
    refreshPrices: loadPrices,
    getTokenByCurrency,
  };
}
