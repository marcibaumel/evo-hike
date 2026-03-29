import type { Meta, StoryObj } from '@storybook/react-vite';
import { CommunityCard } from './CommunityCard';
import '../../../i18n';

const meta: Meta<typeof CommunityCard> = {
    title: 'Components/LandingPage/CommunityCard',
    component: CommunityCard
};
export default meta;

type Story = StoryObj<typeof CommunityCard>;

export const Default: Story = {};