import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function ProblemChild(): ReactNode {
  throw new Error('Test Explosion');
}

describe('ErrorBoundary Component', () => {
  it('catches render errors and displays fallback UI', () => {
    // Suppress console.error during expected throw test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test Explosion')).toBeInTheDocument();
    expect(screen.getByText('Reload Application')).toBeInTheDocument();

    spy.mockRestore();
  });
});
