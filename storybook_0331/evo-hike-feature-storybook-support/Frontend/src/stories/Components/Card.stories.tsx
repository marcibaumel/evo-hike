import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../components/Card';

const meta: Meta<typeof Card> = {
    title: 'Components/Common/Card',
    component: Card,
    argTypes: {
        variant: {
            control: 'select',
            options: ['glass', 'solid', 'ghost'],
            description: 'Card visual style'
        },
        hoverEffect: {
            control: 'boolean',
            description: 'Enable hover animation'
        },
        children: {
            control: 'text',
            description: 'Card content'
        }
    },
    args: {
        variant: 'glass',
        hoverEffect: false,
        children: 'Card content goes here'
    }
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Playground: Story = {};

export const Variants: Story = {
    render: (args) => (
        <div className="flex gap-4 flex-wrap">
            <Card {...args} variant="glass">Glass</Card>
            <Card {...args} variant="solid">Solid</Card>
            <Card {...args} variant="ghost">Ghost</Card>
        </div>
    )
};

export const HoverStates: Story = {
    render: (args) => (
        <div className="flex gap-4 flex-wrap">
            <Card {...args} hoverEffect={false}>
                No Hover
            </Card>
            <Card {...args} hoverEffect>
                Hover Enabled
            </Card>
        </div>
    )
};

export const Glass: Story = {
    args: {
        variant: 'glass'
    }
};

export const Solid: Story = {
    args: {
        variant: 'solid'
    }
};

export const Ghost: Story = {
    args: {
        variant: 'ghost'
    }
};

export const WithHoverEffect: Story = {
    args: {
        hoverEffect: true
    }
};