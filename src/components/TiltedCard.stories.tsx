import type { Meta, StoryObj } from '@storybook/react';
import TiltedCard from './TiltedCard';
import reactLogo from '../assets/react.svg';

const meta = {
  title: 'Components/TiltedCard',
  component: TiltedCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    imageSrc: { control: 'text' },
    altText: { control: 'text' },
    captionText: { control: 'text' },
    containerHeight: { control: 'text' },
    containerWidth: { control: 'text' },
    imageHeight: { control: 'text' },
    imageWidth: { control: 'text' },
    scaleOnHover: { control: { type: 'number', min: 1, max: 2, step: 0.1 } },
    rotateAmplitude: { control: { type: 'number', min: 0, max: 30, step: 1 } },
    showMobileWarning: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    displayOverlayContent: { control: 'boolean' },
  },
} satisfies Meta<typeof TiltedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSrc: reactLogo,
    altText: 'React Logo',
    captionText: 'Hover to see the tilt effect!',
    containerHeight: '400px',
    containerWidth: '400px',
    imageHeight: '300px',
    imageWidth: '300px',
    scaleOnHover: 1.1,
    rotateAmplitude: 14,
    showMobileWarning: true,
    showTooltip: true,
    displayOverlayContent: false,
  },
};

export const LargeScale: Story = {
  args: {
    ...Default.args,
    scaleOnHover: 1.3,
    captionText: 'Large scale on hover',
  },
};

export const HighRotation: Story = {
  args: {
    ...Default.args,
    rotateAmplitude: 25,
    captionText: 'High rotation amplitude',
  },
};

export const WithoutTooltip: Story = {
  args: {
    ...Default.args,
    showTooltip: false,
  },
};

export const WithoutMobileWarning: Story = {
  args: {
    ...Default.args,
    showMobileWarning: false,
  },
};

export const WithOverlay: Story = {
  args: {
    ...Default.args,
    displayOverlayContent: true,
    overlayContent: (
      <div style={{ 
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Overlay Content
      </div>
    ),
  },
};
