import type { Meta, StoryObj } from '@storybook/react';
import { ProfileUserInfo } from './ProfileUserInfo';

const meta: Meta<typeof ProfileUserInfo> = {
    title: 'Components/JournalPage/ProfileUserInfo',
    component: ProfileUserInfo,
};
export default meta;

type Story = StoryObj<typeof ProfileUserInfo>;

export const Default: Story = {
    args: {
        name: 'Alex Wanderer',
        level: 'Pathfinder Lvl. 12',
    },
};