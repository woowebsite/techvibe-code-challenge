import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlippageSettings } from '@/components/SlippageSettings';

describe('SlippageSettings Component', () => {
  it('toggles settings popover and changes presets', () => {
    const handleSlippageChange = vi.fn();
    const handleToggle = vi.fn();

    render(
      <SlippageSettings
        slippage={0.5}
        onSlippageChange={handleSlippageChange}
        isOpen={true}
        onToggle={handleToggle}
      />
    );

    expect(screen.getByText('Transaction Settings')).toBeInTheDocument();

    const onePercentBtn = screen.getByText('1%');
    fireEvent.click(onePercentBtn);
    expect(handleSlippageChange).toHaveBeenCalledWith(1.0);
  });

  it('shows warning alert when slippage is high (>5%)', () => {
    render(
      <SlippageSettings
        slippage={6.0}
        onSlippageChange={vi.fn()}
        isOpen={true}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText(/High slippage increase risk/i)).toBeInTheDocument();
  });
});
