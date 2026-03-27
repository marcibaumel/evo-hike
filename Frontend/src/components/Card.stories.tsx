import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
    title: 'Components/Common/Card',
    component: Card,
    args: {
        children: 'Card content goes here',
    },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Glass: Story = { args: { variant: 'glass' } };
export const Solid: Story = { args: { variant: 'solid' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const WithHoverEffect: Story = { args: { variant: 'glass', hoverEffect: true } };