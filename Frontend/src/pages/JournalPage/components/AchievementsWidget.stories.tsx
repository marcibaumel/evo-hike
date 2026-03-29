import type { Meta, StoryObj } from '@storybook/react-vite';
import { AchievementsWidget } from './AchievementsWidget';
import '../../../i18n';

const meta: Meta<typeof AchievementsWidget> = {
    title: 'Components/JournalPage/AchievementsWidget',
    component: AchievementsWidget
};
export default meta;

type Story = StoryObj<typeof AchievementsWidget>;

export const Default: Story = {};