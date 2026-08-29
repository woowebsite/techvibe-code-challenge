import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Token } from '@/types/token';
import { fetchTokenPrices } from '@/services/priceService';
import { ENV } from '@/config/env';

export function usePrices() {
  const {
    data: tokens = [],
    isLoading,
    isFetching,
    isError,
    error,
    dataUpdatedAt,
    refetch,
  } = useQuery<Token[], Error>({
    queryKey: ['token-prices'],
    queryFn: fetchTokenPrices,
    refetchInterval: ENV.PRICE_REFETCH_INTERVAL_MS,
    staleTime: ENV.PRICE_STALE_TIME_MS,
    retry: 2,
    refetchOnWindowFocus: true,
  });

  const lastUpdated = useMemo(
    () => (dataUpdatedAt ? new Date(dataUpdatedAt) : null),
    [dataUpdatedAt]
  );

  const getTokenByCurrency = useCallback(
    (currency: string): Token | undefined => {
      return tokens.find((t) => t.currency.toLowerCase() === currency.toLowerCase());
    },
    [tokens]
  );

  return {
    tokens,
    isLoading: isLoading || isFetching,
    isInitialLoading: isLoading,
    isFetching,
    isError,
    error: isError ? error?.message || 'Error loading prices' : null,
    lastUpdated,
    refreshPrices: () => refetch(),
    getTokenByCurrency,
  };
}
