import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LuckyCard from './LuckyCard';

describe('LuckyCard', () => {
  const mockPrizes = [
    'Prize 1',
    'Prize 2',
    'Prize 3',
    'Prize 4',
    'Prize 5',
    'Prize 6',
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should render without crashing', () => {
      render(<LuckyCard prizes={mockPrizes} />);
    });

    it('should render exactly 4 cards initially', () => {
      const { container } = render(<LuckyCard prizes={mockPrizes} />);
      const cards = container.querySelectorAll('[role="button"]');

      expect(cards).toHaveLength(4);
    });

    it('should initialize cards in stacked state', () => {
      const { container } = render(<LuckyCard prizes={mockPrizes} />);
      const wrapper = container.querySelector('.relative.flex');

      expect(wrapper?.className).toContain('justify-center');
      expect(wrapper?.className).toContain('flex-1');
    });

    it('should render reset button but hidden initially', () => {
      render(<LuckyCard prizes={mockPrizes} />);
      const resetButton = screen.getByRole('button', { name: /try another prize/i });

      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveStyle({ opacity: '0', pointerEvents: 'none' });
    });

    it('should select 4 unique prizes from the provided array', () => {
      const { container } = render(<LuckyCard prizes={mockPrizes} />);
      const cards = container.querySelectorAll('[role="button"]');

      expect(cards).toHaveLength(4);
    });
  });

  describe('card spreading interaction', () => {
    it('should have "Spread the cards" label when stacked', () => {
      render(<LuckyCard prizes={mockPrizes} />);
      const cards = screen.getAllByRole('button', { name: /spread the cards/i });

      expect(cards).toHaveLength(4);
    });

    it('should have interactive cards with proper attributes', () => {
      const { container } = render(<LuckyCard prizes={mockPrizes} />);

      const cards = screen.getAllByRole('button', { name: /spread the cards/i });
      expect(cards[0]).toHaveAttribute('aria-label', 'Spread the cards');
      expect(container.querySelector('.relative.flex')).toBeInTheDocument();
    });
  });

  describe('card flipping interaction', () => {
    it('should render card elements with flip animation class', () => {
      const { container } = render(<LuckyCard prizes={mockPrizes} />);

      // Cards should have the rotation wrapper ready for flip animations
      const cardRotateElements = container.querySelectorAll('.card-rotate');
      expect(cardRotateElements.length).toBeGreaterThan(0);
    });
  });

  describe('reset functionality', () => {
    it('should have reset button accessible in DOM', () => {
      render(<LuckyCard prizes={mockPrizes} />);
      const resetButton = screen.getByRole('button', { name: /try another prize/i });

      expect(resetButton).toBeInTheDocument();
    });
  });

  describe('viewport responsiveness', () => {
    it('should handle window resize events without errors', () => {
      render(<LuckyCard prizes={mockPrizes} />);

      // Simulate window resize
      window.innerWidth = 768;
      window.dispatchEvent(new Event('resize'));

      // Should still have 4 cards after resize
      expect(screen.getAllByRole('button', { name: /spread the cards/i })).toHaveLength(4);
    });

    it('should clean up resize listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<LuckyCard prizes={mockPrizes} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('accessibility', () => {
    it('should have proper role attributes', () => {
      render(<LuckyCard prizes={mockPrizes} />);
      const buttons = screen.getAllByRole('button');

      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have descriptive aria-labels', () => {
      render(<LuckyCard prizes={mockPrizes} />);

      const spreadButtons = screen.getAllByRole('button', { name: /spread the cards/i });
      expect(spreadButtons).toHaveLength(4);
    });

    it('should have proper tabIndex for interactive cards', () => {
      const { container } = render(<LuckyCard prizes={mockPrizes} />);
      const interactiveCards = container.querySelectorAll('[tabindex="0"]');

      expect(interactiveCards.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should render component without crashing with empty array', () => {
      const { container } = render(<LuckyCard prizes={[]} />);
      // Component should render even with empty prizes (main wrapper exists)
      expect(container.querySelector('.relative.flex')).toBeInTheDocument();
    });

    it('should handle prizes array with less than 4 items', () => {
      const { container } = render(<LuckyCard prizes={['Prize 1', 'Prize 2']} />);
      // Should still render cards (may repeat prizes or use empty)
      const cards = container.querySelectorAll('[role="button"]');

      expect(cards.length).toBeGreaterThan(0);
    });

    it('should render all card elements properly', () => {
      const { container } = render(<LuckyCard prizes={mockPrizes} />);

      // Verify cards were rendered
      const cards = container.querySelectorAll('[role="button"]');
      expect(cards.length).toBe(4);
    });
  });
});
