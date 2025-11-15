import type { Meta, StoryObj } from '@storybook/react';
import LuckyCard from './LuckyCard';

const meta = {
  title: 'Components/LuckyCard',
  component: LuckyCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem'
      }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LuckyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePrizes = [
  '10% Off Coupon',
  'Free Shipping',
  'Mystery Gift',
  '$25 Gift Card',
  'VIP Access',
  'Double Points',
  'Free Product Sample',
  'Exclusive Merchandise',
];

export const Default: Story = {
  args: {
    prizes: samplePrizes,
  },
};

export const FewPrizes: Story = {
  args: {
    prizes: [
      'Grand Prize',
      'Second Place',
      'Third Place',
      'Consolation Prize',
    ],
  },
};

export const ManyPrizes: Story = {
  args: {
    prizes: [
      '1st Prize: Laptop',
      '2nd Prize: Tablet',
      '3rd Prize: Headphones',
      '4th Prize: Gift Card',
      '5th Prize: T-Shirt',
      '6th Prize: Mug',
      '7th Prize: Stickers',
      '8th Prize: Pen',
      '9th Prize: Keychain',
      '10th Prize: Badge',
    ],
  },
};

export const TechPrizes: Story = {
  args: {
    prizes: [
      'MacBook Pro',
      'iPad Air',
      'AirPods Pro',
      'Apple Watch',
      'iPhone 15',
      'Magic Keyboard',
      'HomePod Mini',
      'AirTag 4-Pack',
    ],
  },
};
