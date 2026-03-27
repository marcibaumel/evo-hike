import type { Meta, StoryObj } from '@storybook/react';
import { SocialPostContent } from './SocialPostContent';

const meta: Meta<typeof SocialPostContent> = {
    title: 'Components/SocialPage/SocialPostContent',
    component: SocialPostContent,
};
export default meta;

type Story = StoryObj<typeof SocialPostContent>;

export const Default: Story = {
    args: {
        content: 'The morning mist over the plateau was absolutely magical today. Found a new path leading up to the limestone formations. 🌲✨',
    },
};