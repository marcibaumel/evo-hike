import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './HeroSection';
import { MemoryRouter } from 'react-router-dom';
import '../../../i18n';

const meta: Meta<typeof HeroSection> = {
    title: 'Components/LandingPage/HeroSection',
    component: HeroSection,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};