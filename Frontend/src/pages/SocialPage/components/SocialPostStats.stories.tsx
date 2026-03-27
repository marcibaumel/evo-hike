import type { Meta, StoryObj } from '@storybook/react';
import { SocialPostStats } from './SocialPostStats';

const meta: Meta<typeof SocialPostStats> = {
    title: 'Components/SocialPage/SocialPostStats',
    component: SocialPostStats,
};
export default meta;

type Story = StoryObj<typeof SocialPostStats>;

export const Default: Story = {
    args: {
        location: 'Bükk Plateau, Hungary',
        stats: {
            distance: '12.4 km',
            elevation: '450m',
            time: '4h 20m',
        },
    },
};