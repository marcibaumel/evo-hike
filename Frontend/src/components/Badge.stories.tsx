import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Components/Common/Badge',
  component: Badge,
  args: {
    children: 'Badge',
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Accent: Story = { args: { variant: 'accent', children: 'Accent' } };
export const Blue: Story = { args: { variant: 'blue', children: 'Blue' } };
export const Orange: Story = { args: { variant: 'orange', children: 'Orange' } };
export const Neutral: Story = { args: { variant: 'neutral', children: 'Neutral' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } };