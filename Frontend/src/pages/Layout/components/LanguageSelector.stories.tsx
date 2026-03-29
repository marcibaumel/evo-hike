import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSelector } from './LanguageSelector';
import { LANGUAGE_OPTIONS } from '../../../hooks/useLanguage';
import '../../../i18n';

const meta: Meta<typeof LanguageSelector> = {
    title: 'Components/Layout/LanguageSelector',
    component: LanguageSelector
};
export default meta;

type Story = StoryObj<typeof LanguageSelector>;

export const Closed: Story = {
    args: {
        currentOption: LANGUAGE_OPTIONS[0],
        open: false,
        onClick: () => console.log('clicked')
    }
};

export const Open: Story = {
    args: {
        currentOption: LANGUAGE_OPTIONS[0],
        open: true,
        onClick: () => console.log('clicked')
    }
};