import type { Meta, StoryObj } from '@storybook/react';
import LanguageSwitcher from './LanguageSwitcher';
import '../../../i18n';

const meta: Meta<typeof LanguageSwitcher> = {
    title: 'Components/Layout/LanguageSwitcher',
    component: LanguageSwitcher,
};
export default meta;

type Story = StoryObj<typeof LanguageSwitcher>;

export const Default: Story = {};