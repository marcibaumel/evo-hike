import type { Meta, StoryObj } from '@storybook/react';
import { ProfileStats } from './ProfileStats';
import '../../../i18n';

const meta: Meta<typeof ProfileStats> = {
    title: 'Components/JournalPage/ProfileStats',
    component: ProfileStats,
};
export default meta;

type Story = StoryObj<typeof ProfileStats>;

export const Default: Story = {
    args: {
        hikesCompleted: 42,
        totalDistance: '1,248km',
        elevationGain: '8,848m',
    },
};