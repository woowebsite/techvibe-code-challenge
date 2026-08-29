import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/Header';
import { WalletBalance } from '@/types/token';

const mockBalances: WalletBalance = {
  ETH: 4.5,
  USDC: 2000,
  ATOM: 0,
};

describe('Header Component', () => {
  it('renders application branding and badge', () => {
    render(
      <Header
        onOpenHistory={vi.fn()}
        txCount={2}
        balances={mockBalances}
        onResetWallet={vi.fn()}
        onRefreshPrices={vi.fn()}
        isLoadingPrices={false}
        lastUpdated={new Date()}
      />
    );

    expect(screen.getByText('Omni')).toBeInTheDocument();
    expect(screen.getByText('Swap')).toBeInTheDocument();
    expect(screen.getByText('DeFi v2')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('triggers onRefreshPrices when Live Rates button is clicked', () => {
    const handleRefresh = vi.fn();
    render(
      <Header
        onOpenHistory={vi.fn()}
        txCount={0}
        balances={mockBalances}
        onResetWallet={vi.fn()}
        onRefreshPrices={handleRefresh}
        isLoadingPrices={false}
        lastUpdated={null}
      />
    );

    const refreshBtn = screen.getByText('Live Rates');
    fireEvent.click(refreshBtn);
    expect(handleRefresh).toHaveBeenCalled();
  });

  it('opens wallet balance dropdown and calls onResetWallet', () => {
    const handleReset = vi.fn();
    render(
      <Header
        onOpenHistory={vi.fn()}
        txCount={0}
        balances={mockBalances}
        onResetWallet={handleReset}
        onRefreshPrices={vi.fn()}
        isLoadingPrices={false}
        lastUpdated={null}
      />
    );

    const walletBtn = screen.getByText('Demo Wallet');
    fireEvent.click(walletBtn);

    expect(screen.getByText('Connected Assets')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('2,000')).toBeInTheDocument();

    const resetBtn = screen.getByText('Reset Demo Balances');
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalled();
  });
});
