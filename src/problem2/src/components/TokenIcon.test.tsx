import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TokenIcon } from '@/components/TokenIcon';

describe('TokenIcon Component', () => {
  it('renders image with proper alt tag and src', () => {
    render(<TokenIcon symbol="ETH" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'ETH');
    expect(img).toHaveAttribute('src', expect.stringContaining('/ETH.svg'));
  });

  it('renders fallback badge when image onError triggers', () => {
    render(<TokenIcon symbol="UNKNOWN" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);

    // After error, should render fallback div containing initials
    expect(screen.getByText('UNK')).toBeInTheDocument();
  });
});
