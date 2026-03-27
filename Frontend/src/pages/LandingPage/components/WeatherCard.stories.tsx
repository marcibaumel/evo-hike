import type { Meta, StoryObj } from '@storybook/react';
import { WeatherCard } from './WeatherCard';
import '../../../i18n';

const meta: Meta<typeof WeatherCard> = {
    title: 'Components/LandingPage/WeatherCard',
    component: WeatherCard,
};
export default meta;

type Story = StoryObj<typeof WeatherCard>;

export const Default: Story = {};