import type { Meta, StoryObj } from '@storybook/react';
import { ProfileAvatar } from './ProfileAvatar';
import '../../../i18n';

const meta: Meta<typeof ProfileAvatar> = {
    title: 'Components/JournalPage/ProfileAvatar',
    component: ProfileAvatar,
};
export default meta;

type Story = StoryObj<typeof ProfileAvatar>;

export const Default: Story = {
    args: {
        name: 'Alex Wanderer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
    },
};