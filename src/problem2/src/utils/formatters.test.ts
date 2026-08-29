import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatAmount,
  formatNumberInput,
  generateTxHash,
  truncateHash,
} from '@/utils/formatters';

describe('Formatters Utility', () => {
  describe('formatCurrency', () => {
    it('formats standard positive numbers to USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1)).toBe('$1.00');
    });

    it('handles 0 and NaN gracefully', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(NaN)).toBe('$0.00');
    });

    it('formats small values < 0.01 with 6 decimals', () => {
      expect(formatCurrency(0.00404)).toBe('$0.004040');
    });

    it('formats very tiny values < 0.000001 with indicator', () => {
      expect(formatCurrency(0.0000005)).toBe('< $0.000001');
    });
  });

  describe('formatAmount', () => {
    it('formats token amounts cleanly without trailing unnecessary zeros', () => {
      expect(formatAmount(100)).toBe('100');
      expect(formatAmount(10.5)).toBe('10.5');
      expect(formatAmount(0)).toBe('0');
      expect(formatAmount(NaN)).toBe('0');
    });

    it('formats tiny token amounts', () => {
      expect(formatAmount(0.0000001)).toBe('< 0.000001');
      expect(formatAmount(0.000123)).toBe('0.000123');
    });
  });

  describe('formatNumberInput', () => {
    it('strips non-numeric characters except single decimal point', () => {
      expect(formatNumberInput('abc123def')).toBe('123');
      expect(formatNumberInput('12.34.56')).toBe('12.3456');
      expect(formatNumberInput('$500.25')).toBe('500.25');
      expect(formatNumberInput('-42')).toBe('42');
    });

    it('handles valid clean decimal strings', () => {
      expect(formatNumberInput('10.5')).toBe('10.5');
      expect(formatNumberInput('0.001')).toBe('0.001');
    });
  });

  describe('generateTxHash and truncateHash', () => {
    it('generates a 66-character hex hash starting with 0x', () => {
      const hash = generateTxHash();
      expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    });

    it('truncates hash to 0x1234...5678 format', () => {
      const hash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      expect(truncateHash(hash)).toBe('0x1234...cdef');
      expect(truncateHash('')).toBe('');
      expect(truncateHash('short')).toBe('short');
    });
  });
});
