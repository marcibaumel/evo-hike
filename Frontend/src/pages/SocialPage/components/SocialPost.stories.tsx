import type { Meta, StoryObj } from '@storybook/react';
import { SocialPost } from './SocialPost';
import '../../../i18n';

const meta: Meta<typeof SocialPost> = {
    title: 'Components/SocialPage/SocialPost',
    component: SocialPost,
};
export default meta;

type Story = StoryObj<typeof SocialPost>;

export const Default: Story = {
    args: {
        entry: {
            id: 1,
            user: {
                name: 'Sarah Jenkins',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
                handle: '@sarah_hikes',
            },
            location: 'Bükk Plateau, Hungary',
            date: '2 hours ago',
            content: 'The morning mist over the plateau was absolutely magical today. Found a new path leading up to the limestone formations. 🌲✨',
            images: [
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
            ],
            stats: {
                distance: '12.4 km',
                elevation: '450m',
                time: '4h 20m',
            },
            likes: 124,
            comments: 18,
            isLiked: false,
        },
        onToggleLike: (id) => console.log('Toggled:', id),
    },
};