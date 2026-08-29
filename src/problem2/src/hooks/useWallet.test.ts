import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWallet } from '@/hooks/useWallet';

describe('useWallet Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default mock balances for ETH and USDC', () => {
    const { result } = renderHook(() => useWallet());
    expect(result.current.getBalance('ETH')).toBeGreaterThan(0);
    expect(result.current.getBalance('USDC')).toBeGreaterThan(0);
    expect(result.current.getBalance('NON_EXISTENT')).toBe(0);
  });

  it('executes a swap, updating balances and recording a transaction', () => {
    const { result } = renderHook(() => useWallet());

    const initialEth = result.current.getBalance('ETH');
    const initialUsdc = result.current.getBalance('USDC');

    act(() => {
      result.current.executeSwap('ETH', 1, 'USDC', 1600, 1600, 0.5, '0x1234567890abcdef');
    });

    expect(result.current.getBalance('ETH')).toBe(initialEth - 1);
    expect(result.current.getBalance('USDC')).toBe(initialUsdc + 1600);
    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].fromCurrency).toBe('ETH');
    expect(result.current.transactions[0].toCurrency).toBe('USDC');
    expect(result.current.transactions[0].txHash).toBe('0x1234567890abcdef');
  });

  it('resets wallet balances and clears history', () => {
    const { result } = renderHook(() => useWallet());

    act(() => {
      result.current.executeSwap('ETH', 2, 'USDC', 3200, 1600, 0.5, '0xabc');
    });

    expect(result.current.transactions).toHaveLength(1);

    act(() => {
      result.current.resetWallet();
    });

    expect(result.current.transactions).toHaveLength(0);
    expect(result.current.getBalance('ETH')).toBe(4.825);
  });
});
