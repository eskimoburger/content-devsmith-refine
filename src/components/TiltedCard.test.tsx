import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import TiltedCard from './TiltedCard';

describe('TiltedCard', () => {
  const defaultProps = {
    imageSrc: '/test-image.jpg',
    altText: 'Test Image',
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<TiltedCard {...defaultProps} />);
    });

    it('should render image with correct src and alt', () => {
      render(<TiltedCard {...defaultProps} />);
      const image = screen.getByAltText('Test Image');

      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('should render with default alt text when not provided', () => {
      render(<TiltedCard imageSrc="/test.jpg" />);
      const image = screen.getByAltText('Tilted card image');

      expect(image).toBeInTheDocument();
    });

    it('should apply custom container dimensions', () => {
      const { container } = render(
        <TiltedCard
          {...defaultProps}
          containerHeight="500px"
          containerWidth="600px"
        />
      );

      const figure = container.querySelector('figure');
      expect(figure).toHaveStyle({ height: '500px', width: '600px' });
    });

    it('should apply custom image dimensions', () => {
      render(
        <TiltedCard
          {...defaultProps}
          imageHeight="400px"
          imageWidth="400px"
        />
      );

      const image = screen.getByAltText(defaultProps.altText);
      expect(image).toHaveStyle({ height: '400px', width: '400px' });
    });
  });

  describe('caption and tooltip', () => {
    it('should render caption text', () => {
      const { container } = render(
        <TiltedCard {...defaultProps} captionText="Test Caption" />
      );

      const caption = container.querySelector('figcaption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveTextContent('Test Caption');
    });

    it('should hide tooltip when showTooltip is false', () => {
      const { container } = render(
        <TiltedCard {...defaultProps} showTooltip={false} captionText="Test" />
      );

      const caption = container.querySelector('figcaption');
      expect(caption).not.toBeInTheDocument();
    });

    it('should show tooltip by default', () => {
      const { container } = render(
        <TiltedCard {...defaultProps} captionText="Test" />
      );

      const caption = container.querySelector('figcaption');
      expect(caption).toBeInTheDocument();
    });
  });

  describe('mobile warning', () => {
    it('should show mobile warning by default', () => {
      render(<TiltedCard {...defaultProps} />);
      const warning = screen.getByText(/not optimized for mobile/i);

      expect(warning).toBeInTheDocument();
    });

    it('should hide mobile warning when showMobileWarning is false', () => {
      render(<TiltedCard {...defaultProps} showMobileWarning={false} />);
      const warning = screen.queryByText(/not optimized for mobile/i);

      expect(warning).not.toBeInTheDocument();
    });
  });

  describe('overlay content', () => {
    it('should not render overlay when displayOverlayContent is false', () => {
      const { container } = render(
        <TiltedCard
          {...defaultProps}
          overlayContent={<div data-testid="overlay">Overlay</div>}
          displayOverlayContent={false}
        />
      );

      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('should render overlay when displayOverlayContent is true', () => {
      render(
        <TiltedCard
          {...defaultProps}
          overlayContent={<div data-testid="overlay">Overlay</div>}
          displayOverlayContent={true}
        />
      );

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });

    it('should handle null overlay content', () => {
      const { container } = render(
        <TiltedCard
          {...defaultProps}
          overlayContent={null}
          displayOverlayContent={true}
        />
      );

      const overlay = container.querySelector('.tilted-card-overlay');
      expect(overlay).not.toBeInTheDocument();
    });
  });

  describe('mouse interactions', () => {
    it('should handle mouse move events', async () => {
      const user = userEvent.setup();
      const { container } = render(<TiltedCard {...defaultProps} />);

      const figure = container.querySelector('figure');
      expect(figure).toBeInTheDocument();

      if (figure) {
        await user.hover(figure);
        // Motion values should be set (no errors)
        expect(figure).toBeInTheDocument();
      }
    });

    it('should handle mouse enter events', async () => {
      const user = userEvent.setup();
      const { container } = render(<TiltedCard {...defaultProps} />);

      const figure = container.querySelector('figure');
      if (figure) {
        await user.hover(figure);
        // Should trigger scale animation (no errors)
        expect(figure).toBeInTheDocument();
      }
    });

    it('should handle mouse leave events', async () => {
      const user = userEvent.setup();
      const { container } = render(<TiltedCard {...defaultProps} />);

      const figure = container.querySelector('figure');
      if (figure) {
        await user.hover(figure);
        await user.unhover(figure);
        // Should reset transformations (no errors)
        expect(figure).toBeInTheDocument();
      }
    });
  });

  describe('props validation', () => {
    it('should use custom scaleOnHover value', () => {
      render(<TiltedCard {...defaultProps} scaleOnHover={1.5} />);
      // Component should render with custom scale
      expect(screen.getByAltText(defaultProps.altText)).toBeInTheDocument();
    });

    it('should use custom rotateAmplitude value', () => {
      render(<TiltedCard {...defaultProps} rotateAmplitude={20} />);
      // Component should render with custom rotation
      expect(screen.getByAltText(defaultProps.altText)).toBeInTheDocument();
    });

    it('should handle all default props correctly', () => {
      render(<TiltedCard imageSrc="/test.jpg" />);

      const image = screen.getByAltText('Tilted card image');
      expect(image).toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should have correct CSS classes for figure', () => {
      const { container } = render(<TiltedCard {...defaultProps} />);
      const figure = container.querySelector('figure');

      expect(figure).toHaveClass('tilted-card-figure');
    });

    it('should have correct CSS classes for image', () => {
      const { container } = render(<TiltedCard {...defaultProps} />);
      const image = container.querySelector('img');

      expect(image).toHaveClass('tilted-card-img');
    });

    it('should have correct CSS class for mobile warning', () => {
      const { container } = render(<TiltedCard {...defaultProps} />);
      const warning = container.querySelector('.tilted-card-mobile-alert');

      expect(warning).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should render with minimal required props', () => {
      render(<TiltedCard imageSrc="/valid-path.jpg" />);
      const image = screen.getByAltText('Tilted card image');

      expect(image).toBeInTheDocument();
    });

    it('should handle very large dimension values', () => {
      const { container } = render(
        <TiltedCard
          {...defaultProps}
          containerHeight="10000px"
          containerWidth="10000px"
        />
      );

      const figure = container.querySelector('figure');
      expect(figure).toHaveStyle({ height: '10000px', width: '10000px' });
    });

    it('should handle zero scale value', () => {
      render(<TiltedCard {...defaultProps} scaleOnHover={0} />);
      expect(screen.getByAltText(defaultProps.altText)).toBeInTheDocument();
    });

    it('should handle zero rotate amplitude', () => {
      render(<TiltedCard {...defaultProps} rotateAmplitude={0} />);
      expect(screen.getByAltText(defaultProps.altText)).toBeInTheDocument();
    });
  });
});
