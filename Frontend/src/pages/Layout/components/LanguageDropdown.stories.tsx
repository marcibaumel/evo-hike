import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageDropdown } from './LanguageDropdown';
import { LANGUAGE_OPTIONS } from '../../../hooks/useLanguage';
import '../../../i18n';

const meta: Meta<typeof LanguageDropdown> = {
    title: 'Components/Layout/LanguageDropdown',
    component: LanguageDropdown
};
export default meta;

type Story = StoryObj<typeof LanguageDropdown>;

export const EnglishActive: Story = {
    args: {
        options: LANGUAGE_OPTIONS,
        currentOption: LANGUAGE_OPTIONS[1],
        onSelect: (code) => console.log('Selected:', code)
    }
};

export const HungarianActive: Story = {
    args: {
        options: LANGUAGE_OPTIONS,
        currentOption: LANGUAGE_OPTIONS[0],
        onSelect: (code) => console.log('Selected:', code)
    }
};