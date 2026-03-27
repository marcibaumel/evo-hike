import type { Meta, StoryObj } from '@storybook/react';
import { SocialPostHeader } from './SocialPostHeader';
import '../../../i18n';

const meta: Meta<typeof SocialPostHeader> = {
    title: 'Components/SocialPage/SocialPostHeader',
    component: SocialPostHeader,
};
export default meta;

type Story = StoryObj<typeof SocialPostHeader>;

export const Default: Story = {
    args: {
        user: {
            name: 'Sarah Jenkins',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
            handle: '@sarah_hikes',
        },
        date: '2 hours ago',
    },
};