import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '../../components/Skeleton';

//TODO: Format story as the Button story
const meta: Meta<typeof Skeleton> = {
    title: 'Components/Common/Skeleton',
    component: Skeleton
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { className: 'h-6 w-48' } };
export const Circle: Story = { args: { className: 'h-12 w-12 rounded-full' } };
export const Card: Story = { args: { className: 'h-32 w-full' } };
export const Text: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    )
};