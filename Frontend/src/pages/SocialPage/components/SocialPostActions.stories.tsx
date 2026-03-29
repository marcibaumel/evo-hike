import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocialPostActions } from './SocialPostActions';

const meta: Meta<typeof SocialPostActions> = {
    title: 'Components/SocialPage/SocialPostActions',
    component: SocialPostActions
};
export default meta;

type Story = StoryObj<typeof SocialPostActions>;

export const NotLiked: Story = {
    args: {
        id: 1,
        likes: 124,
        comments: 18,
        isLiked: false,
        onToggleLike: (id) => console.log('Toggled:', id)
    }
};

export const Liked: Story = {
    args: {
        id: 1,
        likes: 125,
        comments: 18,
        isLiked: true,
        onToggleLike: (id) => console.log('Toggled:', id)
    }
};