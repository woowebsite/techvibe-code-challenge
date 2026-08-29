import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TokenInput } from '@/components/TokenInput';
import { Token } from '@/types/token';

const mockEthToken: Token = {
  currency: 'ETH',
  symbol: 'ETH',
  name: 'Ethereum',
  price: 2000,
  date: '2023-08-29T07:10:52.000Z',
  iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg',
  popular: true,
};

describe('TokenInput Component', () => {
  it('renders label, token symbol, balance, and calculated USD value', () => {
    render(
      <TokenInput
        label="You Pay"
        token={mockEthToken}
        amount="2.5"
        balance={10}
        onSelectTokenClick={vi.fn()}
      />
    );

    expect(screen.getByText('You Pay')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    // 2.5 * 2000 = $5,000.00
    expect(screen.getByText('≈ $5,000.00')).toBeInTheDocument();
  });

  it('triggers onChangeAmount when user types numbers', () => {
    const handleChange = vi.fn();
    render(
      <TokenInput
        label="You Pay"
        token={mockEthToken}
        amount=""
        balance={10}
        onChangeAmount={handleChange}
        onSelectTokenClick={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('0.0');
    fireEvent.change(input, { target: { value: '3.75' } });
    expect(handleChange).toHaveBeenCalledWith('3.75');
  });

  it('handles quick MAX and 50% buttons for pay field', () => {
    const handleChange = vi.fn();
    render(
      <TokenInput
        label="You Pay"
        token={mockEthToken}
        amount=""
        balance={8.4}
        isPayField={true}
        onChangeAmount={handleChange}
        onSelectTokenClick={vi.fn()}
      />
    );

    const halfButton = screen.getByText('50%');
    fireEvent.click(halfButton);
    expect(handleChange).toHaveBeenCalledWith('4.2');

    const maxButton = screen.getByText('MAX');
    fireEvent.click(maxButton);
    expect(handleChange).toHaveBeenCalledWith('8.4');
  });

  it('displays error message when provided', () => {
    render(
      <TokenInput
        label="You Pay"
        token={mockEthToken}
        amount="20"
        balance={5}
        error="Insufficient balance"
        onSelectTokenClick={vi.fn()}
      />
    );

    expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
  });
});
