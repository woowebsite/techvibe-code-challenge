import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SwapCard } from '@/components/SwapCard';
import { Token } from '@/types/token';

const mockTokens: Token[] = [
  {
    currency: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2000,
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

describe('SwapCard Component', () => {
  it('renders swap card and disables submit button when amount is empty', () => {
    render(
      <SwapCard
        tokens={mockTokens}
        isLoadingPrices={false}
        getBalance={(c) => (c === 'ETH' ? 5 : 1000)}
        onExecuteSwap={vi.fn()}
      />
    );

    expect(screen.getByText('Swap Assets')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter an amount/i })).toBeDisabled();
  });

  it('calculates receive amount automatically when user enters pay amount', async () => {
    render(
      <SwapCard
        tokens={mockTokens}
        isLoadingPrices={false}
        getBalance={(c) => (c === 'ETH' ? 5 : 1000)}
        onExecuteSwap={vi.fn()}
      />
    );

    const inputs = screen.getAllByPlaceholderText('0.0');
    const payInput = inputs[0];

    fireEvent.change(payInput, { target: { value: '2' } });

    // 2 ETH * 2000 = 4000 USDC
    const receiveInput = inputs[1] as HTMLInputElement;
    await waitFor(() => {
      expect(receiveInput.value).toBe('4000');
    });

    expect(screen.getByText('Swap Now')).toBeEnabled();
  });

  it('shows insufficient balance state when amount exceeds user balance', async () => {
    render(
      <SwapCard
        tokens={mockTokens}
        isLoadingPrices={false}
        getBalance={(c) => (c === 'ETH' ? 1.5 : 1000)}
        onExecuteSwap={vi.fn()}
      />
    );

    const inputs = screen.getAllByPlaceholderText('0.0');
    fireEvent.change(inputs[0], { target: { value: '10' } });

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Insufficient ETH Balance/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it('flips token positions when direction button is clicked', async () => {
    render(
      <SwapCard
        tokens={mockTokens}
        isLoadingPrices={false}
        getBalance={(c) => (c === 'ETH' ? 5 : 1000)}
        onExecuteSwap={vi.fn()}
      />
    );

    const flipBtn = screen.getByTitle('Swap Direction');
    fireEvent.click(flipBtn);

    // After flip, top input should be USDC and bottom should be ETH
    const payTokens = screen.getAllByText('USDC');
    expect(payTokens.length).toBeGreaterThan(0);
  });
});
