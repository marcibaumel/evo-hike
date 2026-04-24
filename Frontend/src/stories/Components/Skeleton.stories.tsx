import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '../../components/Skeleton';

type SkeletonStoryProps = {
    width: 'sm' | 'md' | 'lg' | 'full';
    height: 'sm' | 'md' | 'lg' | 'xl';
    shape: 'rounded' | 'circle' | 'square';
};

const widthMap = {
    sm: 'w-24',
    md: 'w-48',
    lg: 'w-72',
    full: 'w-full'
};

const heightMap = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-12',
    xl: 'h-32'
};

const shapeMap = {
    rounded: 'rounded-md',
    circle: 'rounded-full',
    square: 'rounded-none'
};

const meta: Meta<SkeletonStoryProps> = {
    title: 'Components/Common/Skeleton',
    component: Skeleton,
    argTypes: {
        width: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'full']
        },
        height: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl']
        },
        shape: {
            control: 'select',
            options: ['rounded', 'circle', 'square']
        }
    },
    args: {
        width: 'md',
        height: 'md',
        shape: 'rounded'
    }
};

export default meta;

type Story = StoryObj<SkeletonStoryProps>;

export const Playground: Story = {
    render: ({ width, height, shape }) => {
        const effectiveWidth = shape === 'circle' ? 'md' : width;
        const effectiveHeight = shape === 'circle' ? 'md' : height;

        return (
            <Skeleton
                className={`${widthMap[effectiveWidth]} ${heightMap[effectiveHeight]} ${shapeMap[shape]}`}
            />
        );
    }
};

export const Shapes: Story = {
    render: () => (
        <div className="flex gap-4 items-center flex-wrap">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-32 w-full rounded-none" />
        </div>
    )
};