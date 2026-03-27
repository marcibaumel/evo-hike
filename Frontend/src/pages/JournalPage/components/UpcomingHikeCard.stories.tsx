import type { Meta, StoryObj } from '@storybook/react';
import { UpcomingHikeCard } from './UpcomingHikeCard';
import '../../../i18n';

const meta: Meta<typeof UpcomingHikeCard> = {
    title: 'Components/JournalPage/UpcomingHikeCard',
    component: UpcomingHikeCard,
};
export default meta;

type Story = StoryObj<typeof UpcomingHikeCard>;

export const Hard: Story = {
    args: {
        hike: {
            id: 1,
            title: 'Bükk Peaks Challenge',
            date: 'Oct 12, 2024',
            daysLeft: 3,
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop'
        },
    },
};

export const Moderate: Story = {
    args: {
        hike: {
            id: 2,
            title: 'Lillafüred Waterfall Loop',
            date: 'Oct 20, 2024',
            daysLeft: 11,
            difficulty: 'Moderate',
            image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2070&auto=format&fit=crop'
        },
    },
};