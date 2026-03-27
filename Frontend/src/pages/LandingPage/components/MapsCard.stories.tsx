import type { Meta, StoryObj } from '@storybook/react';
import { MapsCard } from './MapsCard';
import '../../../i18n';

const meta: Meta<typeof MapsCard> = {
    title: 'Components/LandingPage/MapsCard',
    component: MapsCard,
};
export default meta;

type Story = StoryObj<typeof MapsCard>;

export const Default: Story = {};