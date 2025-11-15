import { describe, it, expect, vi } from 'vitest';
import { calculateCardMetrics, getInitialViewportWidth } from './cardMetrics';

describe('calculateCardMetrics', () => {
  describe('viewport-based card dimensions', () => {
    it('should return correct dimensions for extra small mobile viewport (≤360px)', () => {
      const metrics = calculateCardMetrics(360);

      expect(metrics.cardWidth).toBe(138);
      expect(metrics.gap).toBe(14);
      expect(metrics.cardHeight).toBe(Math.round(138 * 1.34)); // 185
    });

    it('should return correct dimensions for small mobile viewport (361-480px)', () => {
      const metrics = calculateCardMetrics(480);

      expect(metrics.cardWidth).toBe(168);
      expect(metrics.gap).toBe(18);
      expect(metrics.cardHeight).toBe(Math.round(168 * 1.34)); // 225
    });

    it('should return correct dimensions for tablet viewport (481-768px)', () => {
      const metrics = calculateCardMetrics(768);

      expect(metrics.cardWidth).toBe(208);
      expect(metrics.gap).toBe(22);
      expect(metrics.cardHeight).toBe(Math.round(208 * 1.34)); // 279
    });

    it('should return correct dimensions for desktop viewport (>768px)', () => {
      const metrics = calculateCardMetrics(1024);

      expect(metrics.cardWidth).toBe(240);
      expect(metrics.gap).toBe(24);
      expect(metrics.cardHeight).toBe(Math.round(240 * 1.34)); // 322
    });
  });

  describe('edge cases', () => {
    it('should handle viewport width of 0', () => {
      const metrics = calculateCardMetrics(0);

      expect(metrics.cardWidth).toBe(138);
      expect(metrics.gap).toBe(14);
    });

    it('should handle NaN viewport width (defaults to desktop)', () => {
      const metrics = calculateCardMetrics(NaN);

      expect(metrics.cardWidth).toBe(240);
      expect(metrics.gap).toBe(24);
    });

    it('should handle Infinity viewport width', () => {
      const metrics = calculateCardMetrics(Infinity);

      // Infinity is not finite, so defaults to 1024
      expect(metrics.cardWidth).toBe(240);
      expect(metrics.gap).toBe(24);
    });

    it('should handle negative viewport width', () => {
      const metrics = calculateCardMetrics(-100);

      // Negative width should use ≤360 breakpoint
      expect(metrics.cardWidth).toBe(138);
      expect(metrics.gap).toBe(14);
    });
  });

  describe('container calculations', () => {
    it('should calculate container dimensions correctly', () => {
      const metrics = calculateCardMetrics(1024);
      const { cardWidth, cardHeight, gap } = metrics;

      expect(metrics.containerHeight).toBe(cardHeight * 2 + gap + 48);
      expect(metrics.containerMaxWidth).toBeLessThanOrEqual(1024 - 16);
    });

    it('should respect viewport constraints for container width', () => {
      const smallViewport = calculateCardMetrics(320);

      // Container should not exceed viewport - 16px
      expect(smallViewport.containerMaxWidth).toBeLessThanOrEqual(320 - 16);
    });

    it('should calculate wrapper max width correctly', () => {
      const metrics = calculateCardMetrics(1024);

      expect(metrics.wrapperMaxWidth).toBe(
        Math.min(1024, metrics.containerMaxWidth + 72)
      );
    });
  });

  describe('stacked configurations', () => {
    it('should return exactly 4 stacked configurations', () => {
      const metrics = calculateCardMetrics(1024);

      expect(metrics.stackedConfigs).toHaveLength(4);
    });

    it('should have correct structure for each configuration', () => {
      const metrics = calculateCardMetrics(1024);

      metrics.stackedConfigs.forEach((config) => {
        expect(config).toHaveProperty('translate');
        expect(config).toHaveProperty('rotate');
        expect(config).toHaveProperty('scale');
        expect(config).toHaveProperty('shadow');
        expect(config.translate).toHaveLength(2);
        expect(typeof config.rotate).toBe('number');
        expect(typeof config.scale).toBe('number');
        expect(typeof config.shadow).toBe('string');
      });
    });

    it('should have default/top card with no transformations', () => {
      const metrics = calculateCardMetrics(1024);
      const topCard = metrics.stackedConfigs[3];

      expect(topCard.translate).toEqual([0, 0]);
      expect(topCard.rotate).toBe(0);
      expect(topCard.scale).toBe(1);
    });

    it('should have increasing scale values from bottom to top', () => {
      const metrics = calculateCardMetrics(1024);

      expect(metrics.stackedConfigs[0].scale).toBe(0.92);
      expect(metrics.stackedConfigs[1].scale).toBe(0.94);
      expect(metrics.stackedConfigs[2].scale).toBe(0.96);
      expect(metrics.stackedConfigs[3].scale).toBe(1);
    });

    it('should calculate translate values relative to card dimensions', () => {
      const metrics = calculateCardMetrics(1024);
      const { cardWidth, cardHeight, stackedConfigs } = metrics;

      // First card
      expect(stackedConfigs[0].translate[0]).toBe(-cardWidth * 0.15);
      expect(stackedConfigs[0].translate[1]).toBe(cardHeight * 0.18);

      // Second card
      expect(stackedConfigs[1].translate[0]).toBe(cardWidth * 0.15);
      expect(stackedConfigs[1].translate[1]).toBe(cardHeight * 0.16);
    });
  });

  describe('responsive breakpoints', () => {
    it('should use different dimensions at exact breakpoint boundaries', () => {
      const at360 = calculateCardMetrics(360);
      const at361 = calculateCardMetrics(361);

      expect(at360.cardWidth).toBe(138);
      expect(at361.cardWidth).toBe(168);
    });

    it('should transition at 480px breakpoint', () => {
      const at480 = calculateCardMetrics(480);
      const at481 = calculateCardMetrics(481);

      expect(at480.cardWidth).toBe(168);
      expect(at481.cardWidth).toBe(208);
    });

    it('should transition at 768px breakpoint', () => {
      const at768 = calculateCardMetrics(768);
      const at769 = calculateCardMetrics(769);

      expect(at768.cardWidth).toBe(208);
      expect(at769.cardWidth).toBe(240);
    });
  });
});

describe('getInitialViewportWidth', () => {
  it('should return window.innerWidth when window is defined', () => {
    // jsdom provides window object
    expect(getInitialViewportWidth()).toBe(window.innerWidth);
  });

  it('should return default value when window is undefined (SSR)', () => {
    // Save original window
    const originalWindow = global.window;

    // Mock SSR environment
    // @ts-expect-error - Testing SSR scenario
    delete global.window;

    expect(getInitialViewportWidth()).toBe(1024);

    // Restore window
    global.window = originalWindow;
  });
});
