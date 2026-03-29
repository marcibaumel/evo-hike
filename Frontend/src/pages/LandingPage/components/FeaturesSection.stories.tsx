import type { Meta, StoryObj } from '@storybook/react-vite';
import { FeaturesSection } from './FeaturesSection';
import '../../../i18n';

const meta: Meta<typeof FeaturesSection> = {
    title: 'Components/LandingPage/FeaturesSection',
    component: FeaturesSection
};
export default meta;

type Story = StoryObj<typeof FeaturesSection>;

export const Default: Story = {};