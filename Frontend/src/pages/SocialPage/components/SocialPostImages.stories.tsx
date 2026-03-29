import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocialPostImages } from './SocialPostImages';

const meta: Meta<typeof SocialPostImages> = {
    title: 'Components/SocialPage/SocialPostImages',
    component: SocialPostImages
};
export default meta;

type Story = StoryObj<typeof SocialPostImages>;

export const SingleImage: Story = {
    args: {
        images: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop'
        ]
    }
};

export const TwoImages: Story = {
    args: {
        images: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop'
        ]
    }
};

export const NoImages: Story = {
    args: {
        images: []
    }
};