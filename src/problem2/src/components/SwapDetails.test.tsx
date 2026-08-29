import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SwapDetails } from '@/components/SwapDetails';
import { Token } from '@/types/token';

const mockEth: Token = {
  currency: 'ETH',
  symbol: 'ETH',
  name: 'Ethereum',
  price: 2000,
  date: '',
  iconUrl: '',
};

const mockUsdc: Token = {
  currency: 'USDC',
  symbol: 'USDC',
  name: 'USD Coin',
  price: 1.0,
  date: '',
  iconUrl: '',
};

describe('SwapDetails Component', () => {
  it('renders exchange rate and inverts rate on click', () => {
    render(
      <SwapDetails
        fromToken={mockEth}
        toToken={mockUsdc}
        fromAmount="1"
        toAmount="2000"
        slippage={0.5}
      />
    );

    // Initial rate: 1 ETH ≈ 2,000 USDC
    expect(screen.getByText(/1 ETH ≈ 2,000 USDC/i)).toBeInTheDocument();

    // Click to invert
    const rateBtn = screen.getByText(/1 ETH ≈ 2,000 USDC/i);
    fireEvent.click(rateBtn);

    // Inverted rate: 1 USDC ≈ 0.0005 ETH
    expect(screen.getByText(/1 USDC ≈ 0.0005 ETH/i)).toBeInTheDocument();
  });

  it('expands details accordion to show minimum received and routing', () => {
    render(
      <SwapDetails
        fromToken={mockEth}
        toToken={mockUsdc}
        fromAmount="1"
        toAmount="2000"
        slippage={0.5}
      />
    );

    const detailsToggle = screen.getByText('Details');
    fireEvent.click(detailsToggle);

    expect(screen.getByText('Minimum Received')).toBeInTheDocument();
    // 2000 * 0.995 = 1990 USDC
    expect(screen.getByText(/1,990 USDC/i)).toBeInTheDocument();
    expect(screen.getByText(/Uniswap V3/i)).toBeInTheDocument();
  });
});
