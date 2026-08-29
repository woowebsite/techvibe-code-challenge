import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { usePrices } from '@/hooks/usePrices';
import * as priceService from '@/services/priceService';
import { Token } from '@/types/token';

const mockTokens: Token[] = [
  {
    currency: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 1650,
    date: '2023-08-29T07:10:52.000Z',
    iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg',
    popular: true,
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('usePrices Hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches prices and returns token list with helper method', async () => {
    vi.spyOn(priceService, 'fetchTokenPrices').mockResolvedValueOnce(mockTokens);

    const { result } = renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.tokens).toHaveLength(1);
    });

    expect(result.current.tokens[0].currency).toBe('ETH');
    const found = result.current.getTokenByCurrency('eth');
    expect(found?.name).toBe('Ethereum');
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });
});
