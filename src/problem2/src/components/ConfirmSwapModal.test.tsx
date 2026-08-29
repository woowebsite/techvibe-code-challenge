import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfirmSwapModal } from '@/components/ConfirmSwapModal';
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

describe('ConfirmSwapModal Component', () => {
  it('renders review step and allows user to confirm transaction', async () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ConfirmSwapModal
        isOpen={true}
        onClose={handleClose}
        fromToken={mockEth}
        toToken={mockUsdc}
        fromAmount="1.5"
        toAmount="3000"
        slippage={0.5}
        onConfirm={handleConfirm}
      />
    );

    expect(
      screen.getByRole('heading', { name: /Confirm Swap/i })
    ).toBeInTheDocument();
    expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
    expect(screen.getByText('3,000 USDC')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Confirm Swap/i });
    fireEvent.click(confirmBtn);

    // Should transition to submitting state
    expect(screen.getByText(/Swapping Assets.../i)).toBeInTheDocument();

    // Wait for simulation completion
    await waitFor(
      () => {
        expect(screen.getByText(/Swap Successful!/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(handleConfirm).toHaveBeenCalledWith(
      expect.stringMatching(/^0x[0-9a-f]{64}$/)
    );
  });
});
