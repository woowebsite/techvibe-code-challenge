import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionHistoryModal } from '@/components/TransactionHistoryModal';
import { SwapTransaction } from '@/types/token';

const mockTxList: SwapTransaction[] = [
  {
    id: 'tx-1',
    timestamp: 1693300000000,
    fromCurrency: 'ETH',
    fromAmount: 1.5,
    toCurrency: 'USDC',
    toAmount: 3000,
    rate: 2000,
    slippage: 0.5,
    status: 'completed',
    txHash: '0x1234567890abcdef1234567890abcdef',
  },
];

describe('TransactionHistoryModal Component', () => {
  it('displays empty placeholder when there are no transactions', () => {
    render(
      <TransactionHistoryModal
        isOpen={true}
        onClose={vi.fn()}
        transactions={[]}
        onClearHistory={vi.fn()}
      />
    );

    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    expect(screen.getByText('Your completed swaps will appear here')).toBeInTheDocument();
  });

  it('renders list of transactions with token amounts and tx hashes', () => {
    render(
      <TransactionHistoryModal
        isOpen={true}
        onClose={vi.fn()}
        transactions={mockTxList}
        onClearHistory={vi.fn()}
      />
    );

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
    expect(screen.getByText('3,000 USDC')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('0x1234...cdef')).toBeInTheDocument();
  });

  it('calls onClearHistory when trash button is clicked', () => {
    const handleClear = vi.fn();
    render(
      <TransactionHistoryModal
        isOpen={true}
        onClose={vi.fn()}
        transactions={mockTxList}
        onClearHistory={handleClear}
      />
    );

    const clearBtn = screen.getByTitle('Clear History');
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalled();
  });
});
