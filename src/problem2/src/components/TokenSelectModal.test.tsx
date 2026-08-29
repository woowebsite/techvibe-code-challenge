import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TokenSelectModal } from '@/components/TokenSelectModal';
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
  {
    currency: 'ATOM',
    symbol: 'ATOM',
    name: 'Cosmos Hub',
    price: 8.0,
    date: '2023-08-29T07:10:50.000Z',
    iconUrl: '',
    popular: false,
  },
];

describe('TokenSelectModal Component', () => {
  it('renders modal with token list and search input when open', () => {
    render(
      <TokenSelectModal
        isOpen={true}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        tokens={mockTokens}
        getBalance={() => 5}
      />
    );

    expect(screen.getByText('Select a token')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('USD Coin')).toBeInTheDocument();
    expect(screen.getByText('Cosmos Hub')).toBeInTheDocument();
  });

  it('filters tokens when searching by symbol or name', () => {
    render(
      <TokenSelectModal
        isOpen={true}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        tokens={mockTokens}
        getBalance={() => 5}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search by name or symbol...');
    fireEvent.change(searchInput, { target: { value: 'cosmos' } });

    expect(screen.getByText('Cosmos Hub')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  it('calls onSelect and onClose when a token is clicked', () => {
    const handleSelect = vi.fn();
    const handleClose = vi.fn();

    render(
      <TokenSelectModal
        isOpen={true}
        onClose={handleClose}
        onSelect={handleSelect}
        tokens={mockTokens}
        getBalance={() => 5}
      />
    );

    const ethOption = screen.getByText('Ethereum');
    fireEvent.click(ethOption);

    expect(handleSelect).toHaveBeenCalledWith(mockTokens[0]);
    expect(handleClose).toHaveBeenCalled();
  });
});
