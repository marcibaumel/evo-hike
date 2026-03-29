import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpeditionChecklist } from './ExpeditionChecklist';
import '../../../i18n';

const meta: Meta<typeof ExpeditionChecklist> = {
    title: 'Components/JournalPage/ExpeditionChecklist',
    component: ExpeditionChecklist
};
export default meta;

type Story = StoryObj<typeof ExpeditionChecklist>;

export const Default: Story = {
    args: {
        title: 'Summit Pack',
        subtitle: '2 of 4 items packed',
        items: [
            { id: '1', text: 'Hiking boots', isCompleted: true },
            { id: '2', text: 'Water bottle', isCompleted: true },
            { id: '3', text: 'Trail map', isCompleted: false },
            { id: '4', text: 'First aid kit', isCompleted: false }
        ],
        onUpdate: (items) => console.log('Updated:', items)
    }
};

export const Empty: Story = {
    args: {
        title: 'New Checklist',
        items: [],
        onUpdate: (items) => console.log('Updated:', items)
    }
};