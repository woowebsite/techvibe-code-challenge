import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '@/App';
import * as priceService from '@/services/priceService';
import { Token } from '@/types/token';

const mockTokens: Token[] = [
  {
    currency: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 1650,
    date: '2023-08-29T07:10:52.000Z',
    iconUrl: '',
    popular: true,
  },
  {
    currency: 'USDC',
    symbol: 'USDC',
    name: 'USD Coin',
    price: 1.0,
    date: '2023-08-29T07:10:40.000Z',
    iconUrl: '',
    popular: true,
  },
];

describe('App Integration Test', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the complete application shell with header, swap form, and value props', async () => {
    vi.spyOn(priceService, 'fetchTokenPrices').mockResolvedValueOnce(mockTokens);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // Verify Header
    expect(screen.getByText('Omni')).toBeInTheDocument();
    expect(screen.getByText('Swap')).toBeInTheDocument();

    // Verify Main Swap Card
    expect(screen.getByText('Swap Assets')).toBeInTheDocument();

    // Verify Value Props footer cards
    expect(screen.getByText('Instant Execution')).toBeInTheDocument();
    expect(screen.getByText('Slippage Guard')).toBeInTheDocument();
    expect(screen.getByText('Best Rates')).toBeInTheDocument();

    // Wait for tokens to populate
    await waitFor(() => {
      expect(screen.getAllByText('ETH').length).toBeGreaterThan(0);
    });
  });
});
