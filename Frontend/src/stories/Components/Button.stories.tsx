import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';


const meta: Meta<typeof Button> = {
    title: 'Components/Common/Button',
    component: Button,
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost'],
            description: 'Button visual style variant'
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Button size'
        },
        children: {
            control: 'text',
            description: 'Button label text'
        },
        isLoading: {
            control: 'boolean',
            description: 'Show loading spinner'
        },
        disabled: {
            control: 'boolean',
            description: 'Disable the button'
        }
    },
    args: {
        children: 'Click me',
        variant: 'primary',
        size: 'md',
        isLoading: false,
        disabled: false,
        onClick: () => alert('Button clicked!')
    }
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
    render: (args) => (
        <div className="flex gap-3 flex-wrap">
            <Button {...args} variant="primary">
                Primary
            </Button>
            <Button {...args} variant="secondary">
                Secondary
            </Button>
            <Button {...args} variant="outline">
                Outline
            </Button>
            <Button {...args} variant="ghost">
                Ghost
            </Button>
        </div>
    )
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex gap-3 flex-wrap items-center">
            <Button {...args} size="sm">
                Small
            </Button>
            <Button {...args} size="md">
                Medium
            </Button>
            <Button {...args} size="lg">
                Large
            </Button>
        </div>
    )
};

export const States: Story = {
    render: (args) => (
        <div className="flex gap-3 flex-wrap">
            <Button {...args}>
                Normal
            </Button>
            <Button {...args} disabled>
                Disabled
            </Button>
            <Button {...args} isLoading>
                Loading
            </Button>
        </div>
    )
};

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button'
    }
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button'
    }
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline Button'
    }
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Ghost Button'
    }
};
