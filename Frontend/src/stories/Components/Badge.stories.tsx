import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../components/Badge';

const meta: Meta<typeof Badge> = {
    title: 'Components/Common/Badge',
    component: Badge,
    argTypes: {
        showExamples: {
            control: 'boolean',
            description: 'Show additional example badges'
        },
        variant: {
            control: 'select',
            options: ['accent', 'blue', 'orange', 'neutral', 'outline'],
            description: 'Badge visual style'
        },
        children: {
            control: 'text',
            description: 'Badge label'
        },
        className: {
            control: 'text',
            description: 'Additional Tailwind classes'
        }
    },
    args: {
        showExamples: false,
        variant: 'neutral',
        children: 'Badge'
    }
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
    render: (args) => (
        <div className="flex gap-3 flex-wrap items-center">
            <Badge {...args} />

            {args.showExamples && (
                <>
                    <Badge {...args}>🔔 Notifications</Badge>
                    <Badge {...args}>New</Badge>
                </>
            )}
        </div>
    )
};

export const Variants: Story = {
    render: (args) => (
        <div className="flex gap-3 flex-wrap">
            <Badge {...args} variant="accent">Accent</Badge>
            <Badge {...args} variant="blue">Blue</Badge>
            <Badge {...args} variant="orange">Orange</Badge>
            <Badge {...args} variant="neutral">Neutral</Badge>
            <Badge {...args} variant="outline">Outline</Badge>
        </div>
    )
};

export const WithCustomContent: Story = {
    render: (args) => (
        <div className="flex gap-3 flex-wrap items-center">
            <Badge {...args}>Default</Badge>
            <Badge {...args}>
                🔔 Notifications
            </Badge>
            <Badge {...args}>
                New
            </Badge>
        </div>
    )
};

export const Accent: Story = {
    args: {
        variant: 'accent',
        children: 'Accent'
    }
};

export const Blue: Story = {
    args: {
        variant: 'blue',
        children: 'Blue'
    }
};

export const Orange: Story = {
    args: {
        variant: 'orange',
        children: 'Orange'
    }
};

export const Neutral: Story = {
    args: {
        variant: 'neutral',
        children: 'Neutral'
    }
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline'
    }
};