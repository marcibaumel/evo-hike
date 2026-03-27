import type { Meta, StoryObj } from '@storybook/react';
import { PhotoGrid } from './PhotoGrid';
import '../../../i18n';

const meta: Meta<typeof PhotoGrid> = {
    title: 'Components/JournalPage/PhotoGrid',
    component: PhotoGrid,
};
export default meta;

type Story = StoryObj<typeof PhotoGrid>;

export const WithPhotos: Story = {
    args: {
        photos: [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1502085671122-2d218cd434e6?q=80&w=1226&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2548&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
        ],
    },
};

export const Empty: Story = {
    args: {
        photos: [],
    },
};