import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileHeader } from './ProfileHeader';
import '../../../i18n';

const meta: Meta<typeof ProfileHeader> = {
    title: 'Components/JournalPage/ProfileHeader',
    component: ProfileHeader
};
export default meta;

type Story = StoryObj<typeof ProfileHeader>;

export const Default: Story = {
    args: {
        user: {
            name: 'Alex Wanderer',
            level: 'Pathfinder Lvl. 12',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
            stats: {
                hikesCompleted: 42,
                totalDistance: '1248km',
                elevationGain: '8848m'
            }
        }
    }
};